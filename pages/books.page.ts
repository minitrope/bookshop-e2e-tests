import {Locator, test} from "@playwright/test";

import step from "@decorators/step.decorator";
import Page from "@pages/base.page";

export enum SortBy {
    Title = 'title',
    Price = 'price'
}

export enum Category {
    Fiction = 'FICTION',
    NonFiction = 'NON_FICTION'
}

export class BooksPage extends Page {

    readonly name: string = 'Books';
    readonly path: string = '/books';
    readonly booksLocator = this.page.getByTestId('book-item');
    readonly searchInput = this.page.getByTestId('search-input');
    readonly searchSubmit = this.page.getByTestId('search-submit');
    readonly sortDropdown = this.page.getByTestId('sort-by');
    readonly categoryDropdown = this.page.getByTestId('category-filter');
    readonly minPriceInput = this.page.getByTestId('min-price-input');
    readonly maxPriceInput = this.page.getByTestId('max-price-input');
    readonly filterSubmit = this.page.getByTestId('filter-submit');

    @step('Get the books in the page')
    public async getBooks(): Promise<BookFragment[]> {
        const books = await this.booksLocator.all()
        return books.map(book => new BookFragment(book));
    }

    async search(query: string) : Promise<void> {
        return test.step(`Searching for "${query}"`, async () => {

            await this.searchInput.fill(query);

            await this.searchSubmit.click();
            try {
                await this.page.waitForResponse(() => true, {timeout: 3000});
            } catch (err) {
                throw new Error(
                    `Clicking search button didn't trigger a response.`
                );
            }
        });
    }

    public async sort(sortBy: SortBy) {
        const hasBooks = await this.booksLocator.count() > 0;

        await this.sortDropdown.selectOption(sortBy);
        try {
            await this.page.waitForResponse(() => true, {timeout: 3000});
        } catch (err) {
            throw new Error(
                `Sorting by ${sortBy} didn't trigger a response.`
            );
        }

        if (hasBooks) {
            await this.booksLocator.first().waitFor();
        }
    }

    async filterByCategory(category: Category) {
        const hasBooks = await this.booksLocator.count() > 0;

        await this.categoryDropdown.selectOption(category);
        try {
            await this.page.waitForResponse(() => true, {timeout: 3000});
        } catch (err) {
            throw new Error(
                `Filtering by ${category} didn't trigger a response.`
            );
        }

        if (hasBooks) {
            await this.booksLocator.first().waitFor();
        }
    }

    async filterByPrice(params: {min?: number, max?: number}) {
        if (params.min !== undefined) {
            await this.minPriceInput.fill(params.min.toString());
        }
        if (params.max !== undefined) {
            await this.maxPriceInput.fill(params.max.toString());
        }
        await this.filterSubmit.click();
    }

    async resetFilters() {
        await this.minPriceInput.clear();
        await this.maxPriceInput.clear();
    }
}

export class BookFragment {
    private root : Locator;
    public get title() : Promise<string> {
        return this.root.getByTestId('book-title').innerText();
    }

    public get price() : Promise<number> {
        return this.root.getByTestId('book-price').innerText()
            .then(price => parseFloat(price));
    }

    constructor(root : Locator) {
        this.root = root;
    }
}