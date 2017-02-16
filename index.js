'use strict';

require('babel-register');

const
  http = require('http'),
  config = require('./server-config.js'),
  app = require('./app.js');

process.title='myserver';
process.on('SIGINT', function() {
  process.exit();
});

if(!module.parent) {
  http
    .createServer(app)
    .listen(config.PORT, config.HOST, function (error) {
      if(error){
        throw error;
      }
      console.log('HTTP Server Started at %s:%s', config.HOST, config.PORT);
    });
}


