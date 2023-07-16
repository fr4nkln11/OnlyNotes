var grid = document.querySelector('.note-grid');
var msnry = new Masonry( grid, {
  percentPosition: true
});

// /**
//  * TODO:
//  * Client side truncation
//  * Editable notes
//  */


function deleteNote(noteId) {
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteId: noteId })
  }).then((_res) => {
    window.location.href = "/";
  });
}

function editNote(noteId, noteData) {
  fetch("/edit-note", {
    method: "PUT",
    body: JSON.stringify({
      noteId: noteId,
      noteData: noteData
    })
  }).then((_res) => {
    window.location.href = "/"
  });
}

function truncateNote(noteStr) {
  var limit = 250;
  if (noteStr.length > limit) {
    return noteStr.slice(0, limit) + "...";
  } else {
    return noteStr;
  }
}

/**
 * This function controls the behaviour of an active note
 */

function noteModal(noteId) {

  document.querySelector("#deleteNote-btn").addEventListener("click", () => {
    deleteNote(noteId)
  })

  let modalElement = document.querySelector("#noteViewModal")

  let modalContent = document.querySelector("#noteViewModalContent")
  let modalDate = document.querySelector("#noteViewDate")
  let noteContent = document.querySelector(`#noteContent${noteId}`)
  let noteDate = document.querySelector(`#noteDate${noteId}`)

  modalContent.value = noteContent.textContent
  modalDate.textContent = noteDate.textContent

  var note_Modal = new bootstrap.Modal(modalElement, {
    backdrop: true
  })

  // save changes when the modal is dismissed
  modalElement.addEventListener("hidden.bs.modal", () => {
    console.log(modalContent.value)
    editNote(noteId, modalContent.value)
  })

  note_Modal.show()
}

function newNoteModal() {
  let modalElement = document.querySelector("#newNoteModal")
  var new_note_Modal = new bootstrap.Modal(modalElement, {
    backdrop: true
  })
  new_note_Modal.show()
}