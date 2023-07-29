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
  })
}

let modalElement = document.querySelector("#noteViewModal")
var note_Modal = new bootstrap.Modal(modalElement, {
  backdrop: true
})

let isDeleted = false

function editNoteHandler()
{
  let noteId = document.querySelector("#noteViewModal").dataset.noteId
  let noteContent = document.querySelector(`#noteContent${noteId}`)
  let modalContent = document.querySelector("#noteViewModalContent")

  if (isDeleted == false) {
    if ((modalContent.value != noteContent.textContent) && (modalContent.value != "")) {
      editNote(noteId, modalContent.value)
    }
    noteContent.textContent = modalContent.value
    msnry.layout()
  }
}

modalElement.addEventListener("hidden.bs.modal", editNoteHandler)

// Function to handle the delete button click
function deleteNoteHandler()
{
  // Access the note_id from the data attribute of the delete button
  let noteId = document.querySelector("#deleteNote-btn").dataset.noteId
  // console.log(noteId)
  deleteNote(noteId)
  // Add any other logic related to note deletion if needed
  isDeleted = true
  note_Modal.hide()
}

document.querySelector("#deleteNote-btn").addEventListener("click", deleteNoteHandler)

/**
 * This function controls the behaviour of an active note
 */

function noteModal(noteId)
{
  isDeleted = false

  let modalContent = document.querySelector("#noteViewModalContent")
  let modalDate = document.querySelector("#noteViewDate")
  let noteContent = document.querySelector(`#noteContent${noteId}`)
  let noteDate = document.querySelector(`#noteDate${noteId}`)

  modalContent.value = noteContent.textContent
  modalDate.textContent = noteDate.textContent

  document.querySelector("#deleteNote-btn").dataset.noteId = noteId
  document.querySelector("#noteViewModal").dataset.noteId = noteId

  note_Modal.show()
}

let new_note_modalElement = document.querySelector("#newNoteModal")
var new_note_Modal = new bootstrap.Modal(new_note_modalElement, {
    backdrop: true
})

submitNoteBtn = document.querySelector("#submitNote")

submitNoteBtn.addEventListener("click", () => {
  noteData = document.querySelector("#note")
  addNote(noteData.value)
})

function newNoteModal() {
  noteData = document.querySelector("#note")
  noteData.value = ""
  new_note_Modal.show()
}