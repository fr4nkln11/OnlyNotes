from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os

db = SQLAlchemy()
DB_URI = os.environ["DATABASE_URI"]


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "randomshit"
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_URI
    db.init_app(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views)
    app.register_blueprint(auth)

    from .models import User, Note

    with app.app_context():
        db.create_all()

    login_manager = LoginManager()
    login_manager.login_view = "auth.login"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id: int):
        return User.query.get(int(id))

    return app
