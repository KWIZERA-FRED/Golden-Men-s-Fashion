"""manual category update

Revision ID: 9c225a030bef
Revises: 
Create Date: 2026-06-17 01:20:44.805997

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9c225a030bef'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add the 'category' column as a String
    op.add_column('products', sa.Column('category', sa.String(length=50), nullable=False))
    # Remove the old 'category_id' column
    op.drop_column('products', 'category_id')

def downgrade():
    # Reverse the changes if needed
    op.add_column('products', sa.Column('category_id', sa.Integer(), nullable=True))
    op.drop_column('products', 'category')