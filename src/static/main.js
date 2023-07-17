var grid = document.querySelector('.note-grid')
var msnry = new Masonry( grid, {
  percentPosition: true,
  itemSelector: '.note-col',
  columnWidth: '.note-col',
  // horizontalOrder: true
});

// /**
//  * TODO:
//  * Client side truncation
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

function deleteNote(noteId) {
  fetch("/delete-note", {
    method: "POST",
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
        console.log(modalContent.value)
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
  new_note_Modal.show()
}