const serverless = require('serverless-http');
const app = require('../../dist/index.js').default;
module.exports.handler = serverless(app); 