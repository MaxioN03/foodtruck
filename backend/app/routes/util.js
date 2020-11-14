module.exports = function(app, db) {
  app.get('/ip', (req, res) => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    const arr = Object.values(networkInterfaces);
    const ip = arr[0][1].address;

    res.send(ip);
  });
};