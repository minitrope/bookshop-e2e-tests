import {Page} from 'pages/base.page';
import {test} from "@playwright/test";

export async function goto<T extends Page>(page: T): Promise<T> {
    await test.step(`Navigating to the ${page.name} page (${page.path})`, async () => {
        await page.goto();
    });
    return page
}