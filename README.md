End-to-end tests for bookshop
=============================

This is the repository for end-to-end tests of the [bookshop prototype](https://github.com/minitrope/bookshop-prototype/).
The tests are covering the UI flows of the application.

Tech stack:
* Node.js
* Typescript
* Playwright

## Test architecture

### Page Objects

This project follows the Page Object model: every interaction and information probing goes through a dedicated class.
* A general web page is represented by a `Page` subclass.
* A component of a page is sometimes represented by a `Fragment` class.

### Checking the effect of interactions

Playwright does a good job of synchronizing the tests with browser state, when retrieving elements via locators. But this is not enough.
Often there will be situations where interactions will be followed by information probing (counting the number of books being listed for example), but race conditions might get in the way and produce flaky results.

To improve this, every interaction triggered by a method inside a page object should have its effect systematically checked.
For example, when submitting for a keyword in the search field, the method will check if something relevant happened. In this specific case this can be checking we received a response from a request, and fail immediately after a timeout.

## Running the tests

### installing dependencies

```sh
git clone https://github.com/minitrope/bookshop-e2e-tests.git
npm install
npx playwright install
```

### running the tests

```sh
npm run test
```

You can inspect the results with:

```sh
npx playwright show-report
```