import os
import inspect
from flask_admin import Admin
from . import models
from .models import db
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme

class ReportView(ModelView): 
    column_list = ('id', 'user_id', 'spot_id', 'reason', 'created_at')

class PostSpotView(ModelView):
    column_list = ('spot_id', 'user_id', 'name', 'category', 'city')
    column_searchable_list = ['spot_id', 'name']

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin', theme=Bootstrap4Theme(swatch='cerulean'))

    for name, obj in inspect.getmembers(models):
        if inspect.isclass(obj) and issubclass(obj, db.Model):
            if name == 'Report':
                admin.add_view(ReportView(obj, db.session))
            elif name == 'Post_spot':
                admin.add_view(PostSpotView(obj, db.session))
            else:
                admin.add_view(ModelView(obj, db.session))