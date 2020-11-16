module.exports = function(app, db) {
  app.get('/ip', (req, res) => {
    const LOCALHOST_IP = '127.0.0.1';
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    const arr = Object.values(networkInterfaces);

    let ipsArr = arr.reduce((result, arrItem) => {
      result.push(...arrItem.map(arrItem => arrItem.address));
      return result;
    }, []);

    ipsArr = ipsArr.filter(
        ip => /^\d+\.\d+\.\d+\.\d+$/ig.test(ip) && ip !== LOCALHOST_IP);

    const ip = ipsArr.length
        ? ipsArr.join(' или ')
        : null;

    res.send(ip);
  });
};