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
  constructor (model, name) {
    this.Model = model;
    this.name = name;
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
        [],
        (req, res) => {
          this.Model.find ({_id: req.params.id}, (err, model) => {
            if (err) return res.status (500).end ();
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
          this.Model.find ({}, (err, models) => {
            if (err) return res.status (500).end ();
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
          this.Model.update ({_id: req.body.id}, {$set: req.body}, {upsert: true}, (err) => {
            if (err) return res.status (500).end ();
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