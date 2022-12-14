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
    // makeElement is a custom function defined above
    const bookCard = makeElement('div', '', 'book-card');
    const title = makeElement('h2', `${book.title}`);  

    const bookContent = makeElement('div', '', 'book-content');
    bookContent.innerHTML = `
        <div class="content-title">Author:</div><div>${book.author}</div>
        <div class="content-title">Pages:</div><div>${book.pages}</div>
        <div class="content-title">Published:</div><div>${book.yearPublished}</div>
        <div class="content-title">Read?</div>
    `;

    // read toggle needs to be created separately in order to be able to interact with it
    const readContainer = makeElement('div');
    const read = makeElement('input', '', 'read-checkbox');
    read.setAttribute('type', 'checkbox');
    // check array and set checked status
    if (book.read === true) {
        read.setAttribute('checked', '');
    }
    // set read status in array
    read.addEventListener('input', () => {
        if (book.read === true) {
            book.read = false;
        } else {
            book.read = true;
        }
    });

    readContainer.appendChild(read);
    bookContent.appendChild(readContainer);

    // button section
    const removeButton = makeElement('button', 'Remove');
    const editButton = makeElement('button', 'Edit');
    const buttonBlock = makeElement('div', '', 'button-block');
    buttonBlock.appendChild(removeButton);
    buttonBlock.appendChild(editButton);

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

    // construct card
    bookCard.appendChild(title);
    bookCard.appendChild(bookContent);
    bookCard.appendChild(buttonBlock);
    libraryDisplay.appendChild(bookCard);
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
    // clear current cards
    libraryDisplay.innerHTML = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const book of myLibrary) {
        createElements(book);
    }

    // create a plus button card
    const plusCard = makeElement('div', '+', 'plus-card');
    plusCard.innerHTML = '<svg style="width:50px;height:50px" viewBox="0 0 24 24"><path fill="currentColor" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>';
    plusCard.addEventListener('click', () => {
        clearForm();
        form[5].textContent = 'Add'
        formTitle.textContent = 'Add a new book'
        formContainer.classList.remove('hidden');
    });
    libraryDisplay.appendChild(plusCard);
}

displayBooks();



formBtn.addEventListener('click', (e) => {
    if (e.target.innerText === 'Add' && form.checkValidity()) {
        addBookToLibrary(
            form[0].value,
            form[1].value,
            form[2].value,
            form[3].value,
            form[4].checked,
        );
        clearForm();
        formContainer.classList.add('hidden');
        // re-build page
        displayBooks();
    } else if (e.target.innerText === 'Save' && form.checkValidity()) {
        // find index of the book currently being edited
        const index = myLibrary.indexOf(currentBook);
        myLibrary[index].title = form[0].value;
        myLibrary[index].author = form[1].value;
        myLibrary[index].pages = form[2].value;
        myLibrary[index].yearPublished = form[3].value;
        myLibrary[index].read = form[4].checked;
        // re-build page
        clearForm();
        formContainer.classList.add('hidden');
        displayBooks();
        
    }

});

// show form container popup
showForm.addEventListener('click', () => {
    clearForm();
    form[5].textContent = 'Add'
    formTitle.textContent = 'Add a new book'
    formContainer.classList.remove('hidden');
});

formClose.addEventListener('click', () => {
    formContainer.classList.add('hidden');
    clearForm();
});
