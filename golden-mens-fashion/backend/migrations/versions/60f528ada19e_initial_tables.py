"""initial tables

Revision ID: 60f528ada19e
Revises: 
Create Date: 2026-06-05 18:13:29.496568

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '60f528ada19e'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # 1. Create Users table first (Dependencies must exist before dependent tables)
    op.create_table('users',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('role', sa.String(length=20), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('user_id'),
    sa.UniqueConstraint('email')
    )

    # 2. Create Products table
    op.create_table('products',
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('stock', sa.Integer(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.Column('image_url', sa.String(length=255), nullable=True),
    sa.Column('is_featured', sa.Boolean(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('product_id')
    )
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_products_category_id'), ['category_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_products_name'), ['name'], unique=False)

    # 3. Create Orders table (Now it can safely reference 'users')
    op.create_table('orders',
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('address', sa.String(length=255), nullable=False),
    sa.Column('phone', sa.String(length=20), nullable=False),
    sa.Column('total', sa.Float(), nullable=False),
    sa.Column('status', sa.String(length=30), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('order_id')
    )
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_orders_status'), ['status'], unique=False)
        batch_op.create_index(batch_op.f('ix_orders_user_id'), ['user_id'], unique=False)

    # 4. Create Order Items
    op.create_table('order_items',
    sa.Column('order_item_id', sa.Integer(), nullable=False),
    sa.Column('order_id', sa.Integer(), nullable=False),
    sa.Column('product_id', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('unit_price', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['order_id'], ['orders.order_id'], ),
    sa.ForeignKeyConstraint(['product_id'], ['products.product_id'], ),
    sa.PrimaryKeyConstraint('order_item_id')
    )
    with op.batch_alter_table('order_items', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_order_items_order_id'), ['order_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_order_items_product_id'), ['product_id'], unique=False)

def downgrade():
    with op.batch_alter_table('order_items', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_order_items_product_id'))
        batch_op.drop_index(batch_op.f('ix_order_items_order_id'))
    op.drop_table('order_items')
    with op.batch_alter_table('orders', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_orders_user_id'))
        batch_op.drop_index(batch_op.f('ix_orders_status'))
    op.drop_table('orders')
    with op.batch_alter_table('products', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_products_name'))
        batch_op.drop_index(batch_op.f('ix_products_category_id'))
    op.drop_table('products')
    op.drop_table('users')