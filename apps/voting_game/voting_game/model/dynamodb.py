from collections import Counter
from boto3.dynamodb.conditions import Key
from voting_game.model import base
from voting_game.model.ddl import ddl
import logging
import boto3
import random


logger = logging.getLogger()


class DynamoDBModel(object):
    def __init__(self, region_name=None, endpoint_url=None, **kwargs):
        extra_args = {}
        if endpoint_url:
            extra_args['endpoint_url'] = endpoint_url

        self.db = boto3.resource(
            'dynamodb',
            region_name=region_name,
            **extra_args
        )

    def create_table_topics(self):
        return self.db.create_table(**ddl.topics)

    def delete_table_topics(self):
        return self.db.Table('topics').delete()

    def delete_table_votes(self):
        return self.db.Table('votes').delete()

    def create_table_votes(self):
        return self.db.create_table(**ddl.votes)

    def insert_topics(self, topic: base.Topic):
        table = self.db.Table('topics')
        return table.put_item(Item=topic.dict())

    def update_topics(self, topic: base.Topic):
        topic = topic.dict()
        table = self.db.Table('topics')
        return table.update_item(
            Key={'id': topic['id']},
            UpdateExpression='set is_active=:a, title=:t, choices=:c',
            ExpressionAttributeValues={':a': topic.get('is_active', False),
                                       ':t': topic.get('title'),
                                       ':c': topic.get('choices')},
            ReturnValues="UPDATED_NEW"
        ).get('Attributes')

    def scan_table(self, table_name):
        table = self.db.Table(table_name)
        response = table.scan()
        items = response['Items']

        while 'LastEvaluatedKey' in response:
            response = table.scan(
                ExclusiveStartKey=response['LastEvaluatedKey']
            )
            items.extend(response.get('Items', []))

        return items

    def votes_by_topic(self, topic_id, return_all_pages=True):
        """
        Get votes for a topic.

        return_all_pages: if False, return only the first page. This helps
        speed up the query. Useful as we our index is on descending timestamp
        and we consider only latest 100 votes for voting games.
        """
        table = self.db.Table('votes')
        response = table.query(
            IndexName='GroupByTopicOrderByCreated',
            Select='SPECIFIC_ATTRIBUTES',
            ScanIndexForward=False,
            KeyConditionExpression=Key('topic_id').eq(topic_id),
            ProjectionExpression='id,choice_id,created'
        )
        items = response.get('Items', [])

        if not return_all_pages:
            return items

        while 'LastEvaluatedKey' in response:
            response = table.query(
                IndexName='GroupByTopicOrderByCreated',
                Select='SPECIFIC_ATTRIBUTES',
                ScanIndexForward=False,
                KeyConditionExpression=Key('topic_id').eq(topic_id),
                ProjectionExpression='id,choice_id,created',
                ExclusiveStartKey=response['LastEvaluatedKey']
            )
            items.extend(response.get('Items', []))

        return items

    def tally_votes(self, topic_votes):
        """
        Parameters
        ----------
        topic_votes: votes records for a topic_id as ad

        Returns
        -------
        Vote percentages for each choice_id as a dict with choice_id as keys.
        """
        votes = [v.get('choice_id') for v in topic_votes][:100]
        counts = Counter(votes)
        return dict(counts)

    def select_loser(self, current_tally, new_vote: base.Vote):
        """
        a=50, b=30, c=20

        assume new_vote is for a. So a gets 1 vote.
        a = a + 1

        Now to keep UI/game interesting deduct one vote from others based on
        probability.

        p_b = b / b + c = 0.6
        p_c = c / b + c = 0.4

        random_num = rand(0, 1)

        if random_num between 0.0 and 0.6, b loses a vote.
                              0.6 and 1.0 c loses a vote

        Or simply randomly select from a list of 30 b-s and 20 c-s

        Parameters
        ----------
        current_tally: a dict with choice_ids as keys and vote counts as values
        new_vote: base.Vote

        Returns
        -------
        losing choice id
        """
        winner = new_vote.choice_id

        losers = []
        for choice_id, count in current_tally.items():
            if choice_id != winner:
                losers.extend([choice_id for x in range(count)])

        try:
            loser = random.choice(losers)
        except IndexError:
            # other votes are 0, so losers list is empty.
            loser = None

        return loser

    def cast_vote(self, vote: base.Vote):
        """
        cast vote using game logic.

        adds a vote to winner
        deducts a vote from loser.

        Returns a tuple: (inserted_vote, deleted_vote)
        """
        votes = self.votes_by_topic(vote.topic_id, return_all_pages=False)
        votes_tally = self.tally_votes(votes)
        loser = self.select_loser(votes_tally, vote)

        inserted = self.insert_votes(vote)
        deleted = None

        if not loser:
            return inserted, deleted

        for x in votes[:100]:
            if x['choice_id'] == loser:
                self.delete_votes(id=x['id'])
                break

        return inserted, deleted

    def query_topics(self, id=None, include_votes=False):
        """
        include_votes: embed votes for each topic. This will use naive
        N+1 query here to get votes for each record in topics. Set to
        False by default to avoid expensive N+1 queries.
        """
        def _append_votes(topic):
            votes = self.votes_by_topic(topic['id'], return_all_pages=False)
            vote_count = self.tally_votes(votes)
            for choice in topic['choices']:
                choice['votes'] = vote_count.get(choice['id'], 0)

        table = self.db.Table('topics')

        if id:
            topics = table.get_item(Key={'id': id},
                                    ConsistentRead=True)['Item']
        else:
            topics = self.scan_table('topics')

        if not topics or (not include_votes):
            return topics

        if isinstance(topics, dict):
            _append_votes(topics)
            return topics

        for topic in topics:
            _append_votes(topic)
        return topics

    def insert_votes(self, vote: base.Vote):
        table = self.db.Table('votes')
        return table.put_item(Item=vote.dict())

    def query_votes(self, id=None, topic_id=None):
        """
        Get votes in votes table.
            * querying by topic_id is limited to first page of results. 1MB.
            * results are sorted in descending order of created.

        Parameters
        ----------
        id: vote id
        topic_id: topic id.

        Returns
        -------
        vote as a dict or list of vote dicts.
        """
        table = self.db.Table('votes')

        if id:
            return table.get_item(Key={'id': id},
                                  ConsistentRead=True)['Item']

        return self.votes_by_topic(topic_id)

    def delete_votes(self, id=None):
        """
        Delete a vote by id. Used by health check API to delete the vote it
        posted to prevent votes table growing very large.
        """
        table = self.db.Table('votes')
        return table.delete_item(Key={'id': id})
