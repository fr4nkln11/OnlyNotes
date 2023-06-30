from flask import Blueprint, render_template, request, flash
from flask_login import current_user, login_required
from .models import Note
from . import db

views = Blueprint("views", __name__)


def validNote(note):
    if note != "":
        flash("Note added succesfully!", category="success")
        return True
    else:
        flash("Note cannot be empty", category="error")
        return False


@views.route("/", methods=["GET", "POST"])
@login_required
def home():
    if request.method == "POST":
        note = request.form.get("note")

        if validNote(note):
            new_note = Note(data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()

    return render_template("home.html", user=current_user)
