'use strict';

const Hapi = require('hapi');

module.exports = function(debug) {
  const serverOptions = {
    app: {
      version: require('../../package.json').version,
      name: require('../../package.json').name,
      stack: 'test'
    }
  };

  if (debug) {
    serverOptions.debug = { log: [ 'error' ], request: [ 'error' ] };
  }

  const server = new Hapi.Server(serverOptions);

  server.connection({ host: '127.0.0.1' });

  return server;
};
