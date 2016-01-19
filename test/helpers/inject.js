'use strict';

module.exports = (server, options) => {
  return new Promise((resolve) => {
    server.inject(options, (res) => {
      resolve({
        statusCode: res.statusCode,
        result: res.result
      });
    });
  });
};
