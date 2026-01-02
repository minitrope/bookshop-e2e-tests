import { test, expect } from '@playwright/test';
import {BooksPage} from "pages/books.page";
import {goto} from 'utils/navigation';

test('There are books being listed', async ({ page }) => {
    const booksPage : BooksPage = await goto(new BooksPage(page));
    const books : number = await booksPage.getNumberOfBooks();

    expect(books).toBeGreaterThan(0);
});

test('Searching a word return some books', async ({ page }) => {
    const booksPage : BooksPage = await goto(new BooksPage(page));
    await booksPage.search("economics");

    const books : number = await booksPage.getNumberOfBooks();

    expect(books).toBeGreaterThan(0);

})

test('Searching a non-existing word returns no books', async ({ page }) => {
    const booksPage : BooksPage = await goto(new BooksPage(page));
    await booksPage.search("a-book-that-doesnt-exist");

    const books : Book[] = await booksPage.getBooks();

    expect(books.length).toEqual(0);
})

test('Books can be sorted by title', async ({ page }) => {
    const booksPage : BooksPage = await goto(new BooksPage(page));

    const books : Book[] = await booksPage.getBooks();

    expect(books.length).toBeGreaterThan(0);
    books.reduce((previous, current) => {
        expect.soft(previous.title).toBeLessThanOrEqual(current.title);
    }, books[0].title);
})