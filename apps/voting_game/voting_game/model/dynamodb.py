from collections import Counter
from boto3.dynamodb.conditions import Key
from voting_game.model import base
from voting_game.model.ddl import ddl
import logging
import boto3


logger = logging.getLogger()


class DynamoDBModel(object):
    def __init__(self, aws_access_key_id=None, aws_secret_access_key=None,
                 region_name=None, endpoint_url=None):
        extra_args = {}
        if endpoint_url:
            extra_args['endpoint_url'] = endpoint_url

        self.db = boto3.resource(
            'dynamodb',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
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

    def votes_by_topic(self, topic_id):
        """
        Get votes for a topic.
        """
        table = self.db.Table('votes')
        response = table.query(
            IndexName='GroupByTopicOrderByCreated',
            Select='SPECIFIC_ATTRIBUTES',
            ScanIndexForward=False,
            KeyConditionExpression=Key('topic_id').eq(topic_id),
            ProjectionExpression='choice_id,created'
        )
        items = response.get('Items', [])

        while 'LastEvaluatedKey' in response:
            response = table.query(
                IndexName='GroupByTopicOrderByCreated',
                Select='SPECIFIC_ATTRIBUTES',
                ScanIndexForward=False,
                KeyConditionExpression=Key('topic_id').eq(topic_id),
                ProjectionExpression='choice_id,created',
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
        votes = [v.get('choice_id') for v in topic_votes]
        counts = Counter(votes)
        # here max() is used to avoid zero by error.
        vote_percents = {k: (v/max(sum(counts.values()), 1)) * 100
                         for k, v in dict(counts).items()}
        return vote_percents

    def query_topics(self, id=None, include_votes=False):
        """
        include_votes: embed votes for each topic. This will use naive
        N+1 query here to get votes for each record in topics. Set to
        False by default to avoid expensive N+1 queries.
        """
        def _append_votes(topic):
            votes = self.votes_by_topic(topic['id'])
            votes_percent = self.tally_votes(votes)
            for choice in topic['choices']:
                choice['votes'] = round(votes_percent.get(choice['id'], 0))

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
