from flask import Blueprint, render_template, request, flash, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User
from . import db

auth = Blueprint("auth", __name__)


def valid_password(password: str, password2: str) -> bool:
    if password != password2:
        flash("Passwords do not match", category="error")
        return False
    elif len(password) <= 7:
        flash("Passwords must be at least 7 characters", category="error")
        return False
    else:
        return True


def valid_email(email: str) -> bool:
    user = User.query.filter_by(email=email).first()
    if user:
        flash("Email already exists.", category="error")
        return False
    elif "@" not in email:
        flash("Invalid Email", category="error")
        return False
    else:
        return True


def valid_name(name: str) -> bool:
    if len(name) < 2:
        flash("Name cannot be less than 2 characters", category="error")
        return False
    else:
        return True


def validate(email: str, name: str, password: str, password2: str):
    if not valid_email(email):
        return False
    elif not valid_name(name):
        return False
    elif not valid_password(password, password2):
        return False
    else:
        return True


@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                # success
                flash("Logged in succesfully", category="success")
                return redirect(url_for("views.home"))
            else:
                flash("Incorrect password, try again.", category="error")
        else:
            flash("Email does not exist", category="error")

    return render_template("login.html")


@auth.route("/logout")
def logout():
    return "logged out"


@auth.route("/sign-up", methods=["GET", "POST"])
def sign_up():
    if request.method == "POST":
        # get all data
        email = request.form.get("email")
        username = request.form.get("username")
        password = request.form.get("password")
        password_confirm = request.form.get("password2")

        if validate(email, username, password, password_confirm):
            new_user = User(
                email=email,
                username=username,
                password=generate_password_hash(password, method="sha256"),
            )
            db.session.add(new_user)
            db.session.commit()
            flash("User Account Succesfully created!", category="success")
            return redirect(url_for("views.home"))

    return render_template("sign_up.html")
