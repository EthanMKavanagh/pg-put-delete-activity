$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $( document ).on( 'click', '.deleteBtn', onDelete );
  $( document ).on( 'click', '.readBtn', onMarkAsRead );
}

function onMarkAsRead(){
  let bookId = $( this ).data( 'id' );
  $.ajax( {
    method: 'PUT',
    url: `/books/${ bookId }`,
    data: {
      status: 'Read'
    }
  } ).then( function( response ) {
    console.log( 'response in PUT:', response );
    refreshBooks();
  } ).catch( function( err ) {
    console.log( 'error in PUT:', err );
    alert( 'error!' );
  } ); // end ajax PUT
} // end onMarkAsRead

function onDelete(){
  let bookId = $( this ).data( 'id' );
  $.ajax( {
    method: 'DELETE',
    url: `/books/${ bookId }`,
  } ).then( function( response ) {
    console.log( 'deleted book. response:', response );
    refreshBooks();
  } ).catch( function( err ) {
    console.log( 'error in ajax DELETE:', err );
    alert( 'ERROR' );
  } ); // end ajax DELETE
} // end DELETE

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $('<tr></tr>');
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`)
    $tr.append(`<button class="deleteBtn" data-id="${ book.id }">Delete</button>`);
    $tr.append(`<button class="readBtn" data-id="${ book.id }">Mark As Read</button>`);
    $('#bookShelf').append($tr);
  }
}
