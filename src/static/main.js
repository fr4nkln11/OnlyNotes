var grid = document.querySelector('.note-grid')
var msnry = new Masonry( grid, {
  percentPosition: true,
  itemSelector: '.note-col',
  columnWidth: '.note-col',
  // horizontalOrder: true
});

// /**
//  * TODO:
//  * Dynamic note adding
//  */

function truncateNote(noteStr) {
  var limit = 250;
  if (noteStr.length > limit) {
    return noteStr.slice(0, limit) + "...";
  } else {
    return noteStr;
  }
}

noteCards = document.querySelectorAll(".note-content")
noteCards.forEach((card_content) => {
  card_content.textContent = truncateNote(card_content.textContent)
  msnry.layout()
});

function addNote(data) {
  fetch("/add-note", {
    method: "POST",
    body: JSON.stringify({data: data})
  }).then((_res) => {
    window.location.replace("/home")
  });
}

function deleteNote(noteId) {
  fetch("/delete-note", {
    method: "DELETE",
    body: JSON.stringify({ noteId: noteId })
  }).then((_res) => {
    let noteColumn = document.querySelector(`#note-col${noteId}`)
    noteColumn.remove()
    msnry.layout()
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
    let noteContent = document.querySelector(`#noteContent${noteId}`)
    noteContent.textContent = noteData
    msnry.layout()
  });
}

/**
 * This function controls the behaviour of an active note
 */

function noteModal(noteId) {

  let isDeleted = false
  
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
  
  document.querySelector("#deleteNote-btn").addEventListener("click", () => {
    deleteNote(noteId)
    isDeleted = true
    note_Modal.hide()
  })

  // save changes when the modal is dismissed
  modalElement.addEventListener("hidden.bs.modal", () => {
    if (isDeleted == false) {
      if ((modalContent.value != noteContent.textContent) && (modalContent.value != "")) {
        editNote(noteId, modalContent.value)
      }
    }
  })

  note_Modal.show()
}

function newNoteModal() {
  let modalElement = document.querySelector("#newNoteModal")
  var new_note_Modal = new bootstrap.Modal(modalElement, {
    backdrop: true
  })

  noteData = document.querySelector("#note")
  submitNoteBtn = document.querySelector("#submitNote")

  modalElement.addEventListener("hidden.bs.modal", () => {
    noteData.value = ""
  })

  submitNoteBtn.addEventListener("click", () => {
    addNote(noteData.value)
  })

  new_note_Modal.show()
}