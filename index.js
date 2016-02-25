'use strict';
const _ = require('lodash');

module.exports = (server, options) => {
  const readAllPost = options.path.slice(0, options.path.lastIndexOf('/'));

  const baseOpts = _.omit(_.cloneDeep(options), [
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

  if (options.crudReadAll) {
    const readAll = _.merge(_.cloneDeep(baseOpts), {
      method: 'GET',
      path: readAllPost,
      config: {
        validate: {
          query: _.get(options, 'config.validate.query')
        }
      },
      handler: function(req, reply) {
        reply(options.crudReadAll(req));
      }
    });
    server.route(readAll);
  }

  if (options.crudCreate) {
    const create = _.merge(_.cloneDeep(baseOpts), {
      method: 'POST',
      path: readAllPost,
      config: {
        validate: {
          payload: _.get(options, 'config.validate.payload')
        }
      },
      handler: function(req, reply) {
        reply(options.crudCreate(req)).code(201);
      }
    });
    server.route(create);
  }

  if (options.crudRead) {
    const read = _.merge(_.cloneDeep(baseOpts), {
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
    });
    server.route(read);
  }

  if (options.crudUpdate) {
    const update = _.merge(_.cloneDeep(baseOpts), {
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
    });
    server.route(update);
  }

  if (options.crudDelete) {
    const del = _.merge(_.cloneDeep(baseOpts), {
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
    });
    server.route(del);
  }
};
