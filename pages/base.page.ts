import { Page as PlaywrightPage } from '@playwright/test';

export class Page {
    public readonly name : string = "Base Page";
    public readonly path : string = "/";

    protected readonly page: PlaywrightPage;

    constructor(page: PlaywrightPage) {
        this.page = page;
    }

    async goto() : Promise<Page> {
        await this.page.goto(this.path);
        return this;
    }
}