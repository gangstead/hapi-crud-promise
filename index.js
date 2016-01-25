'use strict';
const _ = require('lodash');

module.exports = (server, options) => {
  const reallAllPost = options.path.slice(0, options.path.lastIndexOf('/'))

  let baseOpts = _.omit(options, [
    'method',
    'path',
    'handler',
    'crudReadAll',
    'crudCreate',
    'crudRead',
    'crudUpdate',
    'crudDelete'
  ]);

  _.unset(baseOpts, 'config.validate.params');
  _.unset(baseOpts, 'config.validate.payload');
  _.unset(baseOpts, 'config.validate.query');

  if(options.crudReadAll) {
    server.route(_.merge(baseOpts, {
      method: 'GET',
      path: reallAllPost,
      config: {
        validate: {
          query: _.get(options, 'config.validate.query')
        }
      },
      handler: function(req, reply) {
        reply(options.crudReadAll(req));
      }
    }));
  }

  if(options.crudCreate) {
    server.route(_.merge(baseOpts, {
      method: 'POST',
      path: reallAllPost,
      config: {
        validate: {
          payload: _.get(options, 'config.validate.payload')
        }
      },
      handler: function(req, reply) {
        reply(options.crudCreate(req)).code(201);
      }
    }));
  }

  if(options.crudRead) {
    server.route(_.merge(baseOpts, {
      method: 'GET',
      path: options.path,
      config: {
        validate: {
          params: _.get(options, 'config.validate.params')
        }
      },
      handler: function(req, reply) {
        reply(options.crudRead(req));
      }
    }));
  }

  if(options.crudUpdate) {
    server.route(_.merge(baseOpts, {
      method: 'PUT',
      path: options.path,
      config: {
        validate: {
          params: _.get(options, 'config.validate.params'),
          payload: _.get(options, 'config.validate.payload')
        }
      },
      handler: function(req, reply) {
        reply(options.crudUpdate(req));
      }
    }));
  }

  if(options.crudDelete) {
    server.route(_.merge(baseOpts, {
      method: 'DELETE',
      path: options.path,
      config: {
        validate: {
          params: _.get(options, 'config.validate.params')
        }
      },
      handler: function(req, reply) {
        reply(options.crudDelete(req)).code(204);
      }
    }));
  }
}
