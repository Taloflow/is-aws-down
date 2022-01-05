"""Create schema

Revision ID: 1f93f5096588
Revises: 
Create Date: 2021-12-29 15:13:54.144455

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1f93f5096588'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute('CREATE SCHEMA IF NOT EXISTS cloud_monitor')


def downgrade():
    pass
