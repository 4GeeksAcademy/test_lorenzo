import os
import inspect
from flask_admin import Admin
from . import models
from .models import db
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme

class PostSpotView(ModelView):
    column_list = ('spot_id', 'name', 'category', 'city', 'latitude', 'longitude')
    column_searchable_list = ['spot_id', 'name']
    column_filters = ['category']
    form_columns = ('name', 'category', 'address', 'description', 'latitude', 'longitude', 'has_water', 'has_waste_dump', 'has_electricity', 'is_sleepable')

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin', theme=Bootstrap4Theme(swatch='cerulean'))

    for name, obj in inspect.getmembers(models):
        if inspect.isclass(obj) and issubclass(obj, db.Model):
            if name == 'Post_spot':
                admin.add_view(PostSpotView(obj, db.session, name="Gestionar Spots"))
            else:
                admin.add_view(ModelView(obj, db.session))