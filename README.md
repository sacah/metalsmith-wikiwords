# metalsmith-wikiwords

A metalsmith plugin to find and link WikiWords in metalsmith pages.

## Installation

    $ npm install metalsmith-wikiwords

## Running Tests

First you'll need to make sure the dependancies are installed with

    $ npm install
	
Then you can

	$ npm test
	
## Using WikiWords in Pages

A WikiWord is two or more words joined together and CamelCased. This plugin identifies WikiWords as starting with a capital letter (A-Z), then having any number of capital letters or numbers (A-Z0-9) until a lower case leter (a-z), then any number of lower case or numbers (a-z0-9) until another captial letter (A-Z), then followed by any number of capital or lower case letter or number (a-zA-Z0-9).

So examples would be:
* AmI
* WikiWord
* ThisIs3Words


## CLI Usage

  Install the node modules and then add the `metalsmith-wikiwords` key to your `metalsmith.json` plugins.

```json
{
  "plugins": {
    "metalsmith-wikiwords": { }
  }
}
```

## JavaScript Usage

  Pass the plugin to `Metalsmith.use`, as it outputs links in markdown format, you'll want it to be before your markdown plugin.

```js
var wikiwords = require('metalsmith-wikiwords');
var markdown = require('metalsmith-markdown');

metalsmith
  .use(wikiwords())
  .use(markdown())
  .build();
```

## Contribution

  Pull requests welcome, please make sure you add tests for your code.

## License

  MIT
