# jigglypuff
Auto-generate rest api over a mongoose model.

## Installation
Install from the git repo
```bash
  npm install --save lincoln-howard-jr/jigglypuff
```

## Usage
Basic Usage:
```js
  // import the es6 rest class
  let REST = require ('jigglypuff');

  // import your mongoose model
  let model = require ('./path/to/my/model')

  // constructor accepts mongoose model and route name
  let controller = new REST (model, 'posts');

  // create all routes
  controller.all ():

  // export a router object
  module.exports = controller.router;
```

Middleware can be added as if it were an express router...
```js
  controller.use (bodyParser.json ());
```

And routes can be selected individually...
```js
  controller.get ();
  controller.post ();
  controller.put ();
  controller.delete ();
  // or, because chainable
  controller.get ().post ().put ().delete ();
```

Created routes are as follows
* GET /:collection
* GET /:collection/:id
* POST /:collection
* PUT /:collection/:id
* DELETE /:collection/:id

Collection requests can include a sort, limit, and queries for any field