var editingBook = false;
var editingBookId; // Empty for now

$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  console.log('Listeners added.');
  // Function called when the submit button is clicked
  $('#submitBtn').on('click', function(){
    console.log('Submit button clicked.');
    var book = {};
    book.author = $('#author').val();
    book.title = $('#title').val();

    if(editingBook) {
      book.id = editingBookId;
      updateBook(book);
    } else {
      addBook(book);
    }
  });

  // Function called when delete button is clicked
  $('#bookShelf').on('click', '.deleteBtn', function(){
    // We attached the bookid as data on our button
    var bookId = $(this).data('bookid');
    console.log($(this));
    console.log('Delete book with id of', bookId);
    deleteBook(bookId);
  });

  // Function called when edit button is clicked
  $('#bookShelf').on('click', '.editBtn', function(){
    // Set editng to true, used when we submit the form
    editingBook = true;
    // We attached the entire book object as data to our table row
    // $(this).parent() is the <td>
    // $(this).parent().parent() is the <tr> that we attached our data to
    var selectedBook = $(this).parent().parent().data('book');
    console.log(selectedBook);
    editingBookId = selectedBook.id;

    // Set the form values to the thing we're editing
    $('#author').val(selectedBook.author);
    $('#title').val(selectedBook.title);
  });
}

// CREATE a.k.a. POST a.k.a. INSERT
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    success: function(response) {
      console.log('Response from server.');
      refreshBooks();
    }
  });
}

// READ a.k.a. GET a.k.a. SELECT
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books',
    success: function(response) {
      console.log(response);
      appendToDom(response.books);
    }
  });
}

// UPDATE a.k.a. POST
function updateBook(bookToUpdate) {

  // YOUR AJAX CODE HERE

}

// DELETE
function deleteBook(bookId) {
  // When using URL params, your url would be...
  // '/books/' + bookId

  // YOUR AJAX CODE HERE

}

// Append array of books to the DOM
function appendToDom(books) {
  // Remove books that currently exist in the table
  $('#bookShelf').empty();
  for(var i = 0; i < books.length; i += 1) {
    var book = books[i];
    // For each book, append a new row to our table
    $tr = $('<tr></tr>');
    $tr.data('book', book);
    $tr.append('<td>' + book.id + '</td>');
    $tr.append('<td>' + book.title + '</td>');
    $tr.append('<td>' + book.author + '</td>');
    $tr.append('<td><button class="editBtn">Edit</button></td>');
    $tr.append('<td><button class="deleteBtn" data-bookid="' + book.id + '">Delete</button></td>');
    $('#bookShelf').append($tr);
  }
}