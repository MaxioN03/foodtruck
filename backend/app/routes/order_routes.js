let ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  app.post('/orders', (req, res) => {
    let order = {
      clientName: req.body.clientName,
      products: req.body.products,
      status: req.body.status,
      cost: +req.body.cost,
      createTime: +req.body.createTime,
      comment: req.body.comment
    };

    db.db('foodtruck').collection('orders').insertOne(order)
        .then(response => {
          res.send(response.ops[0]);
        })
        .catch(error => {
          res.send({'error': error});
        });
  });

  app.get('/orders', (req, res) => {
    db.db('foodtruck').collection('orders').find({}).toArray((err, result) => {
      if (err) {
        res.send({'error': 'An error has occurred'});
      } else {
        res.send(JSON.stringify(result));
      }
    });
  });

  app.get('/orders/:id', (req, res) => {
    const id = req.params.id;
    const details = {'_id': new ObjectID(id)};
    db.db('foodtruck').collection('orders').findOne(details, (err, item) => {
      if (err) {
        res.send({'error': 'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });

  app.delete('/orders/:id', (req, res) => {
    const id = req.params.id;
    const details = {'_id': new ObjectID(id)};
    db.db('foodtruck').collection('orders').remove(details, (err, item) => {
      if (err) {
        res.send({'error': 'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });

  app.put('/orders/:id', (req, res) => {
    const id = req.params.id;
    const details = {'_id': new ObjectID(id)};
    let order = {
      clientName: req.body.clientName,
      products: req.body.products,
      status: req.body.status,
      cost: +req.body.cost,
      createTime: +req.body.createTime,
      comment: req.body.comment
    };

    db.db('foodtruck')
        .collection('orders')
        .update(details, order, (err, result) => {
          if (err) {
            res.send({'error': 'An error has occurred'});
          } else {
            res.send(order);
          }
        });
  });
};