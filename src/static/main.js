var grid = document.querySelector('.note-grid');
var msnry = new Masonry( grid, {
  percentPosition: true
});

/**
 * TODO:
 * Client side truncation
 * Editable notes
 */


function deleteNote(noteId) {
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteId: noteId })
  }).then((_res) => {
    window.location.href = "/";
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

function noteModal(noteId) {
  let modalElement = document.querySelector("#noteViewModal")
  let modalContent = document.querySelector("#noteViewModalContent")
  let modalDate = document.querySelector("#noteViewDate")
  let noteContent = document.querySelector(`#noteContent${noteId}`)
  // let noteContent_trunc = document.querySelector(`#noteContent-trunc${noteId}`)
  let noteDate = document.querySelector(`#noteDate${noteId}`)
  let deleteNote_btn = document.querySelector("#deleteNote-btn")
  // let updateNote_btn = document.querySelector("#updateNote-btn")
  deleteNote_btn.onclick = function() {
    deleteNote(noteId)
  }
  modalContent.textContent = noteContent.textContent
  modalDate.textContent = noteDate.textContent
  var note_Modal = new bootstrap.Modal(modalElement, {
    backdrop: true
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