"""Add medecin_id to predictions table

Revision ID: 9313c07c1a73
Revises: 
Create Date: 2025-06-13 16:29:45.333671

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '9313c07c1a73'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('reset_codes', schema=None) as batch_op:
        batch_op.drop_index('idx_reset_codes_code')
        batch_op.drop_index('idx_reset_codes_email', mysql_length={'email': 250})

    op.drop_table('reset_codes')
    op.drop_table('avis')
    with op.batch_alter_table('medecins', schema=None) as batch_op:
        batch_op.alter_column('grade',
               existing_type=mysql.VARCHAR(length=100),
               type_=sa.String(length=50),
               existing_nullable=True)
        batch_op.drop_column('date_creation')
        batch_op.drop_column('departement_id')
        batch_op.drop_column('mot_de_passe')

    with op.batch_alter_table('patients', schema=None) as batch_op:
        batch_op.alter_column('sexe',
               existing_type=mysql.ENUM('Homme', 'Femme'),
               type_=sa.String(length=10),
               existing_nullable=True,
               existing_server_default=sa.text("'Homme'"))
        batch_op.alter_column('date_creation',
               existing_type=mysql.TIMESTAMP(),
               type_=sa.DateTime(),
               existing_nullable=True,
               existing_server_default=sa.text('CURRENT_TIMESTAMP'))

    with op.batch_alter_table('predictions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('medecin_id', sa.Integer(), nullable=False))
        batch_op.alter_column('prediction',
               existing_type=mysql.VARCHAR(length=50),
               type_=sa.String(length=255),
               existing_nullable=False)
        batch_op.alter_column('date_prediction',
               existing_type=mysql.TIMESTAMP(),
               type_=sa.DateTime(),
               nullable=False,
               existing_server_default=sa.text('CURRENT_TIMESTAMP'))
        batch_op.create_foreign_key(None, 'medecins', ['medecin_id'], ['id'])
        batch_op.create_foreign_key(None, 'patients', ['patient_id'], ['id'])
        batch_op.create_foreign_key(None, 'departement', ['departement_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('predictions', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('date_prediction',
               existing_type=sa.DateTime(),
               type_=mysql.TIMESTAMP(),
               nullable=True,
               existing_server_default=sa.text('CURRENT_TIMESTAMP'))
        batch_op.alter_column('prediction',
               existing_type=sa.String(length=255),
               type_=mysql.VARCHAR(length=50),
               existing_nullable=False)
        batch_op.drop_column('medecin_id')

    with op.batch_alter_table('patients', schema=None) as batch_op:
        batch_op.alter_column('date_creation',
               existing_type=sa.DateTime(),
               type_=mysql.TIMESTAMP(),
               existing_nullable=True,
               existing_server_default=sa.text('CURRENT_TIMESTAMP'))
        batch_op.alter_column('sexe',
               existing_type=sa.String(length=10),
               type_=mysql.ENUM('Homme', 'Femme'),
               existing_nullable=True,
               existing_server_default=sa.text("'Homme'"))

    with op.batch_alter_table('medecins', schema=None) as batch_op:
        batch_op.add_column(sa.Column('mot_de_passe', mysql.VARCHAR(length=255), nullable=False))
        batch_op.add_column(sa.Column('departement_id', mysql.INTEGER(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('date_creation', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True))
        batch_op.alter_column('grade',
               existing_type=sa.String(length=50),
               type_=mysql.VARCHAR(length=100),
               existing_nullable=True)

    op.create_table('avis',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('medecin_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('patient_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('note', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('commentaire', mysql.TEXT(), nullable=True),
    sa.Column('date_avis', mysql.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='MyISAM'
    )
    op.create_table('reset_codes',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('email', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('code', mysql.VARCHAR(length=6), nullable=False),
    sa.Column('expires_at', mysql.DATETIME(), nullable=False),
    sa.Column('created_at', mysql.DATETIME(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='MyISAM'
    )
    with op.batch_alter_table('reset_codes', schema=None) as batch_op:
        batch_op.create_index('idx_reset_codes_email', ['email'], unique=False, mysql_length={'email': 250})
        batch_op.create_index('idx_reset_codes_code', ['code'], unique=False)

    # ### end Alembic commands ###
