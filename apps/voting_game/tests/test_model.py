"""
Not really unit tests. Quick end to end usage pattern test.
"""
import pytest
import os
from uuid import uuid4
from voting_game.model import base, dynamodb


@pytest.fixture(scope='class')
def db():
    db = dynamodb.DynamoDBModel(
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        region_name=os.environ['AWS_REGION'],
        endpoint_url=os.environ['DYNAMODB_ENDPOINT_URL_TESTS']
    )

    try:
        db.create_table_topics()
        db.create_table_votes()
    except Exception:
        pass

    yield db
    # db.delete_table_topics()
    # db.delete_table_votes()


class TestDynamoDBModel(object):
    def test_insert_update_query_topic_votes(self, db):
        topic = base.Topic(title=str(uuid4()))
        r1 = db.insert_topics(topic)
        assert r1['ResponseMetadata']['HTTPStatusCode'] == 200

        choice_1 = base.Choice(description=str(uuid4()))
        choice_2 = base.Choice(description=str(uuid4()))
        choice_3 = base.Choice(description=str(uuid4()))
        topic.choices = [choice_1, choice_2, choice_3]
        topic.is_active = True
        topic.title = str(uuid4())

        r2 = db.update_topics(topic)
        assert (r2['choices'][0]['description']
                == choice_1.description)
        assert (r2['choices'][1]['description']
                == choice_2.description)
        assert r2['is_active'] == topic.is_active
        assert r2['title'] == topic.title

        r3 = db.query_topics(id=topic.id)
        assert (r3['choices'][0]['description']
                == choice_1.description)
        assert (r3['choices'][1]['description']
                == choice_2.description)
        assert r3['is_active'] == topic.is_active
        assert r3['title'] == topic.title

        vote_1 = base.Vote(topic_id=topic.id, choice_id=choice_1.id)
        vote_2 = base.Vote(topic_id=topic.id, choice_id=choice_2.id)
        vote_3 = base.Vote(topic_id=topic.id, choice_id=choice_2.id)

        db.cast_vote(vote_1)
        db.cast_vote(vote_2)
        db.cast_vote(vote_3)

        r4 = db.query_topics(id=topic.id, include_votes=True)
        print(r4)
        assert r4['choices'][2]['votes'] == 0
        assert r4['choices'][1]['votes'] == 2
        assert r4['choices'][0]['votes'] == 0

        db.cast_vote(vote_1)
        r5 = db.query_topics(id=topic.id, include_votes=True)
        print(r5)
        assert r5['choices'][2]['votes'] == 0
        assert r5['choices'][1]['votes'] == 1
        assert r5['choices'][0]['votes'] == 1

        vote_4 = base.Vote(topic_id=topic.id, choice_id=choice_3.id)
        db.cast_vote(vote_4)
        r6 = db.query_topics(id=topic.id, include_votes=True)
        print(r6)
        assert r6['choices'][2]['votes'] == 1

        assert ((r6['choices'][1]['votes'] == 1
                and r6['choices'][0]['votes'] == 0)
                or
                (r6['choices'][1]['votes'] == 0
                 and r6['choices'][0]['votes'] == 1))
