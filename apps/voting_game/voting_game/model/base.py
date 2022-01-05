from uuid import uuid4
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger()


def generate_uuid():
    return str(uuid4())


def utc_timestamp():
    return datetime.utcnow().isoformat()


class Choice(BaseModel):
    id: Optional[str] = Field(default_factory=generate_uuid)
    description: Optional[str] = None
    votes: Optional[int] = None


class Topic(BaseModel):
    id: Optional[str] = Field(default_factory=generate_uuid)
    created: str = Field(default_factory=utc_timestamp)
    last_upd: str = Field(default_factory=utc_timestamp)
    is_active: Optional[bool] = None
    title: str
    choices: Optional[List[Choice]] = None


class Vote(BaseModel):
    id: Optional[str] = Field(default_factory=generate_uuid)
    created: str = Field(default_factory=utc_timestamp)
    topic_id: str
    choice_id: str
