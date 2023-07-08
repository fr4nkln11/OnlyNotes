function deleteNote(noteId) {
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteId: noteId })
  }).then((_res) => {
    window.location.href = "/";
  });
}

function noteModal(noteId) {
  let modalElement = document.querySelector("#noteViewModal")
  let modalContent = document.querySelector("#noteViewModalContent")
  let modalDate = document.querySelector("#noteViewDate")
  let noteContent = document.querySelector(`#noteContent${noteId}`)
  let noteDate = document.querySelector(`#noteDate${noteId}`)
  let deleteNote_btn = document.querySelector("#deleteNote-btn")
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