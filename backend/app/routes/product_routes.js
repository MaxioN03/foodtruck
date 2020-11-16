let ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.post('/products', (req, res) => {
    const product = {name: req.body.name, category: req.body.category, cost: +req.body.cost, available: req.body.available};

    db.db('foodtruck').collection('products').insertOne(product)
        .then(response => {
          res.send(response.ops[0]);
        })
        .catch(error => {
          res.send({'error': error});
        });
  });

  app.get('/products', (req, res) => {
    db.db('foodtruck').collection('products').find({}).toArray((err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(JSON.stringify(result));
      }
    });
  });

  app.get('/products/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.db('foodtruck').collection('products').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });

  app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.db('foodtruck').collection('products').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });

  app.put ('/products/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const product = {name: req.body.name, category: req.body.category, cost: +req.body.cost, available: req.body.available};

    db.db('foodtruck').collection('products').update(details, product, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(product);
      }
    });
  });
};