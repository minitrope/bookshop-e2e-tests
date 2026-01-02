import {Locator, test} from "@playwright/test";

import {Page} from "@pages/base.page";
import step from "@decorators/step.decorator";

export class BooksPage extends Page {
    readonly name: string = 'Books';
    readonly path: string = '/books';
    readonly booksLocator = this.page.getByTestId('book-item');
    readonly searchInput = this.page.getByTestId('search-input');
    readonly searchSubmit = this.page.getByTestId('search-submit');

    @step('Get the number of books in the page')
    public async getNumberOfBooks(): Promise<number> {
        return await this.booksLocator.count();
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
}