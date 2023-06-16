import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

let page = 1;
let matches = books;

// Abstraction: Render book elements
function renderBookElements(books) {
    const fragment = document.createDocumentFragment();

    for (const { author, id, image, title } of books) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);

        element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;

        fragment.appendChild(element);
    }

    return fragment;
}

// Abstraction: Filter books
function filterBooks(filters) {
    const result = [];

    for (const book of books) {
        let genreMatch = filters.genre === 'any';

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) {
                genreMatch = true;
            }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
            (filters.author === 'any' || book.author === filters.author) &&
            genreMatch
        ) {
            result.push(book);
        }
    }

    return result;
}

// Abstraction: Update book list
function updateBookList() {
    const startIndex = (page - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    const booksToShow = matches.slice(startIndex, endIndex);
    const bookElements = renderBookElements(booksToShow);

    document.querySelector('[data-list-items]').innerHTML = '';
    document.querySelector('[data-list-items]').appendChild(bookElements);

    document.querySelector('[data-list-button]').disabled = matches.length - endIndex > 0;

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - endIndex) > 0 ? (matches.length - endIndex) : 0})</span>
    `;
}

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    matches = filterBooks(filters);
    page = 1;
    updateBookList();
});

document.querySelector('[data-list-button]').addEventListener('click', () => {
    page += 1;
    updateBookList();
});

// Initial rendering
updateBookList();