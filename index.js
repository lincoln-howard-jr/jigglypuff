// import express router
let express = require ('express');
// function to make an args array for this.router.<method>.apply
let toArgs = (path, middlewares, endpoint) => {
  return [path].concat (middlewares.concat ([endpoint]));
}
// Create REST class for quickly adding all CRUD routes to an app
class REST {
  // Constructor
  // Takes model file in ../models/ directory
  // Takes name of route (plural)
  constructor (model, name, id) {
    this.Model = model;
    this.name = name;
    this.id = id || '_id';
    this.middlewares = [];
    this.router = express.Router ();
  }
  // add a middleware function to this router
  use (fn) {
    this.middlewares.push (fn);
    return this;
  }
  // add get methods to this router
  get () {
    // get collection
    this.router.get.apply (
      this.router,
      toArgs (
        `/${this.name}/:id`,
        this.middlewares,
        (req, res) => {
          let q = {};
          q [this.id] = req.params.id;
          this.Model.findOne (q, (err, model) => {
            if (err) return res.status (500).json (err);
            if (!model) return res.status (404).end ();
            res.status (200).json (model);
          });
        }
      )
    );
    // get collection
    this.router.get.apply (
      this.router,
      toArgs (
        `/${this.name}`,
        this.middlewares,
        (req, res) => {
          // feed this to mongoose later
          let obj = {};
          // loop over schema keys
          Object.keys (this.Model.schema.obj).forEach ((k) => {
            // add queries if needed
            if (req.query [k])
              obj [k] = req.query [k];
          });
          // create the mongoose query
          let query = this.Model.find (obj);
          // if sorting
          if (req.query.sort) {
            let sort = {};
            sort [req.query.sort] = -1;
            query = query.sort (sort);
          }
          // if limiting
          if (req.query.limit) {
            query = query.limit (parseInt (req.query.limit));
          }
          // if limiting
          if (req.query.skip) {
            query = query.skip (parseInt (req.query.skip));
          }
          // callback
          query.exec ((err, models) => {
            if (err) return res.status (500).json (err);
            res.status (200).json (models);
          });
        }
      )
    );
    return this;
  }
  // add post method to this router
  post () {
    // post new record in the db
    this.router.post.apply (
      this.router,
      toArgs (
        `/${this.name}`,
        this.middlewares,
        (req, res) => {
          let model = new this.Model (req.body);
          model.save ((err) => {
            if (err) return res.status (500).json (err);
            res.status (201).json (model);
          });
        }
      )
    );
    return this;
  }
  // add put method to this router
  put () {
    // post new record in the db
    this.router.put.apply (
      this.router,
      toArgs (
        `/${this.name}`,
        this.middlewares,
        (req, res) => {
          let q = {};
          query [this.id] = req.params.id;
          this.Model.update (q, {$set: req.body}, {upsert: true}, (err) => {
            if (err) return res.status (500).json (err);
            res.status (201).end ();
          });
        }
      )
    );
    return this;
  }
  // add delete method to this router
  delete () {
    this.router.delete.apply (
      this.router,
      toArgs (
        `/${this.name}/:id`,
        this.middlewares,
        (req, res) => {
          this.Model.remove ({_id: req.params.id}, (err) => {
            if (err) return res.status (500).end ();
            res.status (200).end ();
          });
        }
      )
    );
    return this;
  }
  // add all methods to this router
  all () {
    this.get ();
    this.post ();
    this.put ();
    this.delete ();
    return this;
  }
}

module.exports = REST;