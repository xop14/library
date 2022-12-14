const libraryDisplay = document.querySelector('.library-display');
const showForm = document.querySelector('#show-form');
const formContainer = document.querySelector('.form-container');
const form = document.querySelector('#add-form');
const formClose = document.querySelector('.form-close');
const formTitle = document.querySelector('.form-title');
const formBtn = document.querySelector('#add');

let myLibrary = [];
let currentBook = {};


// makes it easier to create html elements with text and class
function makeElement(type='div', textContent='', className='') {
    const element = document.createElement(`${type}`);
    element.className = className;
    element.textContent = textContent;
    return element;
}

// create a book object
function Book(title, author, pages, yearPublished, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.yearPublished = yearPublished;
    this.read = read;
}

// add book object to array
function addBookToLibrary(title, author, pages, yearPublished, read) {
    const myBook = new Book(title, author, pages, yearPublished, read);
    myLibrary.push(myBook);
}

// add sample books
addBookToLibrary('Charlie and the Chocolate Factory', 'Roald Dahl', 145, 1964, true);
addBookToLibrary(
    "Harry Potter and the Philosopher's Stone",
    'J.K.Rowling',
    223,
    1997,
    true,
);
addBookToLibrary('Stig of the Dump', 'Clive King', 157, 1963, false);

// create html elements for a book card
function createElements(book) {
    const bookCard = makeElement('div', '', 'book-card');
    const title = makeElement('h2', `${book.title}`);
    const author = makeElement('p', `Author: ${book.author}`);
    const pages = makeElement('p', `Pages: ${book.pages}`);
    const yearPublished = makeElement('p', `Year: ${book.yearPublished}`);
    const read = makeElement('input');
    read.setAttribute('type', 'checkbox');
    read.setAttribute('id', 'read');
    const readLabel = makeElement('label', 'Read?: ');
    readLabel.setAttribute('for', 'read');
    if (book.read === true) {
        read.setAttribute('checked', '');
    }
    read.addEventListener('input', () => {
        if (book.read === true) {
            book.read = false;
        } else {
            book.read = true;
        }
    });

    const removeButton = makeElement('button', 'Remove');
    const editButton = makeElement('button', 'Edit');

    const buttonBlock = makeElement('div', '', 'button-block');
    buttonBlock.appendChild(removeButton);
    buttonBlock.appendChild(editButton);

    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pages);
    bookCard.appendChild(yearPublished);
    bookCard.appendChild(readLabel);
    bookCard.appendChild(read);
    bookCard.appendChild(buttonBlock);
    libraryDisplay.appendChild(bookCard);

    removeButton.addEventListener('click', () => {
        // remove from array
        myLibrary = myLibrary.filter((item) => item !== book);
        // remove card from page
        libraryDisplay.removeChild(bookCard);
    });

    editButton.addEventListener('click', () => {
        // populate form with book data
        form[0].value = book.title;
        form[1].value = book.author;
        form[2].value = book.pages;
        form[3].value = book.yearPublished;
        form[4].checked = book.read;
        form[5].textContent = 'Save'
        // this variable is used when saving the editied book
        currentBook = book;
        // change form title and button
        formTitle.textContent = 'Edit this book'
        formContainer.classList.remove('hidden');
    });
}

// resets form inputs
function clearForm() {
    // need the length - 2 to avoid the button and checkbox
    for (let i = 0; i < form.length - 2; i += 1) {
        form[i].value = '';
    }
    // resets the checkbox
    form[form.length - 2].checked = false;
}

// create html elements  on page for each book
function displayBooks() {
    // eslint-disable-next-line no-restricted-syntax
    for (const book of myLibrary) {
        createElements(book);
    }
}

displayBooks();



formBtn.addEventListener('click', (e) => {
    if (e.target.innerText === 'Add') {
        addBookToLibrary(
            form[0].value,
            form[1].value,
            form[2].value,
            form[3].value,
            form[4].checked,
        );
        createElements(myLibrary[myLibrary.length - 1]);
    } else if (e.target.innerText === 'Save') {
        // find index of the book currently being edited
        index = myLibrary.indexOf(currentBook);
        myLibrary[index].title = form[0].value;
        myLibrary[index].author = form[1].value;
        myLibrary[index].pages = form[2].value;
        myLibrary[index].yearPublished = form[3].value;
        myLibrary[index].read = form[4].checked;
        // remove items and re-build page
        libraryDisplay.innerHTML = '';
        displayBooks();
        
    }
    clearForm();
    formContainer.classList.add('hidden');
});

// show form container popup
showForm.addEventListener('click', () => {
    form[5].textContent = 'Add'
    formTitle.textContent = 'Add a new book'
    formContainer.classList.remove('hidden');
});

formClose.addEventListener('click', () => {
    formContainer.classList.add('hidden');
    clearForm();
});
