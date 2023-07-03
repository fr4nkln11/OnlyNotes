from flask import Blueprint, redirect, render_template, request, flash, jsonify, url_for
from flask_login import current_user, login_required
from .models import Note
from . import db
import json

views = Blueprint("views", __name__)


def validNote(note):
    if note != "":
        flash("Note added succesfully!", category="success")
        return True
    else:
        flash("Note cannot be empty", category="error")
        return False


@views.route("/")
def welcome():
    if current_user.is_authenticated:
        return redirect(url_for("views.home"))
    return render_template("welcome.html", user=current_user)


@views.route("/home", methods=["GET", "POST"])
@login_required
def home():
    if request.method == "POST":
        note = request.form.get("note")

        if validNote(note):
            new_note = Note(data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()

    return render_template("home.html", user=current_user)


@views.route("/delete-note", methods=["POST"])
def delete_note():
    note = json.loads(request.data)
    noteId = note["noteId"]
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()

    return jsonify({})
