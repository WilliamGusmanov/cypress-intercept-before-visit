# eslint-plugin-no-visit-before-intercepts

Custom eslint rule that checks that no intercepts occur after a visit


Limitations: 
Currently does not handle linting cypress code defined in functions.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-no-visit-before-intercepts`:

```sh
npm install eslint-plugin-no-visit-before-intercepts --save-dev
```

## Usage

Add `no-visit-before-intercepts` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "no-visit-before-intercepts"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "no-visit-before-intercepts/no-visit-before-intercepts": 2
    }
}
```

