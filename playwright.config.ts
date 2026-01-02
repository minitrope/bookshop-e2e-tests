import { defineConfig } from '@playwright/test';
// import dotenv from 'dotenv';

// dotenv.config();

export default defineConfig({
    testDir: './tests',
    timeout: 20_000,
    reporter: [['html', { open: 'never' }]],
    use: {
        baseURL: 'http://localhost:8080',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on'
    }
});
