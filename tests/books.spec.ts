import { test, expect } from '@playwright/test';
import {BooksPage, BookFragment, SortBy, Category} from "pages/books.page";
import {goto} from 'utils/navigation';

test('There are books being listed', async ({ page }) => {
    const booksPage : BooksPage = await goto(new BooksPage(page));
    const books : BookFragment[] = await booksPage.getBooks();

    expect(books.length).toBeGreaterThan(0);
});

test('Searching a word returns some books', async ({ page }) => {
    const booksPage : BooksPage = await goto(new BooksPage(page));
    await booksPage.search("economics");

    const books : BookFragment[] = await booksPage.getBooks();

    expect(books.length).toBeGreaterThan(0);

});

test('Searching a non-existing word returns no books', async ({ page }) => {
    const booksPage : BooksPage = await goto(new BooksPage(page));
    await booksPage.search("a-book-that-doesnt-exist");

    const books : BookFragment[] = await booksPage.getBooks();

    expect(books.length).toEqual(0);
});

test('Books can be sorted by title', async ({ page }) => {
    const booksPage : BooksPage = await goto(new BooksPage(page));
    await booksPage.sort(SortBy.Title);

    const books : BookFragment[] = await booksPage.getBooks();

    expect(books.length).toBeGreaterThan(0);

    let previousTitle: string = await books[0].title;
    for (const book of books.slice(1)) {
        const newTitle : string = await book.title;
        const message = `"${previousTitle}" is before "${newTitle}"`
        expect(previousTitle <= newTitle, message).toBe(true);
        previousTitle = newTitle;
    }
});

test('Books can be sorted by price', async ({ page }) => {
    const booksPage : BooksPage = await goto(new BooksPage(page));
    await booksPage.sort(SortBy.Price);

    const books : BookFragment[] = await booksPage.getBooks();

    expect(books.length).toBeGreaterThan(0);

    let previousPrice: number = await books[0].price;
    for (const book of books.slice(1)) {
        const newPrice : number = await book.price;
        expect(previousPrice).toBeLessThanOrEqual(newPrice);
        previousPrice = newPrice;
    }
});

test('Books can be filtered by category', async ({ page }) => {
    const booksPage : BooksPage = await goto(new BooksPage(page));
    const previousBookCount : number = (await booksPage.getBooks()).length;

    await booksPage.filterByCategory(Category.Fiction);

    const books : BookFragment[] = await booksPage.getBooks();

    expect(books.length).toBeGreaterThan(0);
    expect(books.length).toBeLessThan(previousBookCount);
});

test('Books can be filtered with a minimum price', async ({ page }) => {
    const minPrice = 20;
    const booksPage : BooksPage = await goto(new BooksPage(page));
    await booksPage.filterByPrice({min: minPrice});

    const books : BookFragment[] = await booksPage.getBooks();

    expect(books.length).toBeGreaterThan(0);

    for (const book of books) {
        expect(await book.price).toBeGreaterThanOrEqual(minPrice);
    }
});

test('Books can be filtered with a maximum price', async ({ page }) => {
    const maxPrice = 20;
    const booksPage : BooksPage = await goto(new BooksPage(page));
    await booksPage.filterByPrice({max: maxPrice});

    const books : BookFragment[] = await booksPage.getBooks();

    expect(books.length).toBeGreaterThan(0);

    for (const book of books) {
        expect(await book.price).toBeLessThanOrEqual(maxPrice);
    }
});

test('Books can be filtered with a price range', async ({ page }) => {
    const minPrice = 20;
    const maxPrice = 22;
    const booksPage : BooksPage = await goto(new BooksPage(page));
    await booksPage.filterByPrice({min: minPrice, max: maxPrice});

    const books : BookFragment[] = await booksPage.getBooks();

    expect(books.length).toBeGreaterThan(0);

    for (const book of books) {
        expect(await book.price).toBeGreaterThanOrEqual(minPrice);
        expect(await book.price).toBeLessThanOrEqual(maxPrice);
    }
});

test('Minimum and maximum prices can return no book', async ({ page }) => {
    const maxPrice = 0;
    const minPrice = 100;
    const booksPage : BooksPage = await goto(new BooksPage(page));

    await booksPage.filterByPrice({min: minPrice});

    let books : BookFragment[] = await booksPage.getBooks();
    expect.soft(books.length).toEqual(0);

    await booksPage.resetFilters();

    await booksPage.filterByPrice({max: maxPrice});

    books = await booksPage.getBooks();
    expect.soft(books.length).toEqual(0);
})

