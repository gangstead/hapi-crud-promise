'use strict';

module.exports = (server, options) => {
  const reallAllPost = options.path.slice(0, options.path.lastIndexOf('/'))

  server.route({
    method: 'GET',
    path: reallAllPost,
    config: {
      validate: {
        query: options.config.validate.query
      }
    },
    handler: function(req, reply) {
      reply(options.crudReadAll(req));
    }
  });

  server.route({
    method: 'POST',
    path: reallAllPost,
    config: {
      validate: {
        payload: options.config.validate.payload
      }
    },
    handler: function(req, reply) {
      reply(options.crudCreate(req)).code(201);
    }
  });

  server.route({
    method: 'GET',
    path: options.path,
    config: {
      validate: {
        params: options.config.validate.params
      }
    },
    handler: function(req, reply) {
      reply(options.crudRead(req));
    }
  });

  server.route({
    method: 'PUT',
    path: options.path,
    config: {
      validate: {
        params: options.config.validate.params
      }
    },
    handler: function(req, reply) {
      reply(options.crudUpdate(req));
    }
  });

  server.route({
    method: 'DELETE',
    path: options.path,
    config: {
      validate: {
        params: options.config.validate.params
      }
    },
    handler: function(req, reply) {
      reply(options.crudDelete(req)).code(204);
    }
  });
}
