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


@views.route("/home")
@login_required
def home():
    return render_template("home.html", user=current_user)

@views.post("/add-note")
def add_note():
    note = json.loads(request.data)

    if validNote(note):
        new_note = Note(data=note["data"], user_id=current_user.id)
        db.session.add(new_note)
        db.session.commit()
    
    return jsonify({})


@views.delete("/delete-note")
def delete_note():
    note = json.loads(request.data)
    noteId = note["noteId"]
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()

    return jsonify({})

@views.put("/edit-note")
def edit_note():
    note_payload = json.loads(request.data)
    noteId = note_payload["noteId"]
    noteData = note_payload["noteData"]
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            note.data = noteData
            db.session.commit()
            print("note modified")
    
    return jsonify({})