# eslint-plugin-cypress-intercept-before-visit-check

Custom eslint rule that checks that intercepts occur before a visit

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-cypress-intercept-before-visit-check`:

```sh
npm install eslint-plugin-cypress-intercept-before-visit-check --save-dev
```

## Usage

Add `cypress-intercept-before-visit-check` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "cypress-intercept-before-visit-check"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "cypress-intercept-before-visit-check/cypress-intercept-before-visit": 2
    }
}
```

