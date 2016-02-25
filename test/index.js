'use strict';

const B = require('bluebird');
const chai = require('chai');
const createServer = require('./helpers/create_server');
const expect = chai.expect;
const hapiCrudPromise = require('../index');
const inject = require('./helpers/inject');
const Joi = require('joi');

describe('hapi-crud-promise', () => {
  it('should export a function', () => {
    expect(hapiCrudPromise).to.be.a.Function;
  });

  let server;
  beforeEach(() => {
    server = createServer();
  });

  describe('with basic usage', () => {
    beforeEach(() => {
      hapiCrudPromise(server, {
        path: '/api/things/{thingId}',
        config: {
          validate: {
            query: {
              limit: Joi.string().optional()
            },
            params: {
              thingId: Joi.string().required()
            },
            payload: Joi.object({
              name: Joi.string().required()
            })
          }
        },
        crudRead(req) {
          return B.resolve({
            id: 1,
            name: req.params.thingId
          });
        },
        crudReadAll(req) {
          return B.resolve({
            things: [
              { id: 1, name: 'thingamajig' },
              { id: 2, name: 'thingamabob' }
            ],
            meta: { total: req.query.limit }
          });
        },
        crudUpdate(req) {
          return B.resolve({
            id: 1,
            name: req.payload.name
          });
        },
        crudCreate(req) {
          return B.resolve({
            id: 1,
            name: req.payload.name
          });
        },
        crudDelete(req) {
          return B.resolve(req.params.thingId);
        }
      });
    });

    const thingId = 1;

    it('should create 5 routes', () => {
      const routes = server.table()[0].table;
      expect(routes).to.have.deep.property('length', 5);
    });

    it('should create a GET all route', () => {
      return inject(server, {
        method: 'GET',
        url: {
          pathname: '/api/things'
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 200);
      });
    });

    it('should create a POST route', () => {
      return inject(server, {
        method: 'POST',
        url: {
          pathname: '/api/things'
        },
        payload: {
          name: 'thingamapost'
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 201);
      });
    });

    it('should create a GET route', () => {
      return inject(server, {
        method: 'GET',
        url: {
          pathname: `/api/things/${thingId}`
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 200);
      });
    });

    it('should create an UPDATE route', () => {
      return inject(server, {
        method: 'PUT',
        url: {
          pathname: `/api/things/${thingId}`
        },
        payload: {
          name: 'thingamaput'
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 200);
      });
    });

    it('should create a DELETE route', () => {
      return inject(server, {
        method: 'DELETE',
        url: {
          pathname: `/api/things/${thingId}`
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 204);
      });
    });
  });

  it('should pass along other options to server', () => {
    server.register(require('hapi-auth-basic'));
    server.auth.strategy('simple', 'basic', { validateFunc: () => true });
    hapiCrudPromise(server, {
      path: '/api/things/{thingId}',
      config: {
        auth: 'simple',
        validate: {
          headers: {
            accept: Joi.string().default('swg')
          },
          query: {
            thingId: Joi.string().required()
          },
          params: {
            thingId: Joi.string().required()
          },
          payload: Joi.object({
            name: Joi.string().required()
          })
        }
      },
      crudRead(req) {
        return B.resolve({
          id: 1,
          name: req.params.thingId
        });
      },
      crudReadAll(req) {
        return B.resolve({
          things: [
            { id: 1, name: 'thingamajig' },
            { id: 2, name: 'thingamabob' }
          ],
          meta: { total: req.query.limit }
        });
      },
      crudUpdate(req) {
        return B.resolve({
          id: 1,
          name: req.payload.name
        });
      },
      crudCreate(req) {
        return B.resolve({
          id: 1,
          name: req.payload.name
        });
      },
      crudDelete(req) {
        return B.resolve(req.params.thingId);
      }
    });

    const aRoute = server.table()[0].table[0];
    expect(aRoute).to.have.deep.property('settings.auth.strategies[0]', 'simple');
    expect(aRoute).to.have.deep.property('settings.validate.headers');
  });

  describe('should only create routes for handlers provided', () => {
    it('part 1, just read & create', () => {
      hapiCrudPromise(server, {
        path: '/api/things/{thingId}',
        config: {
          validate: {
            params: {
              thingId: Joi.string().required()
            },
            payload: Joi.object({
              name: Joi.string().required()
            })
          }
        },
        crudRead(req) {
          return B.resolve({
            id: 1,
            name: req.params.thingId
          });
        },
        crudCreate(req) {
          return B.resolve({
            id: 1,
            name: req.payload.name
          });
        }
      });

      const routes = server.table()[0].table;
      expect(routes).to.have.deep.property('length', 2);
    });

    it('part 2 just readall, update and delete', () => {
      hapiCrudPromise(server, {
        path: '/api/things/{thingId}',
        config: {
          validate: {
            query: {
              thingId: Joi.string().required()
            },
            params: {
              thingId: Joi.string().required()
            },
            payload: Joi.object({
              name: Joi.string().required()
            })
          }
        },
        crudReadAll(req) {
          return B.resolve({
            things: [
              { id: 1, name: 'thingamajig' },
              { id: 2, name: 'thingamabob' }
            ],
            meta: { total: req.query.limit }
          });
        },
        crudUpdate(req) {
          return B.resolve({
            id: 1,
            name: req.payload.name
          });
        },
        crudDelete(req) {
          return B.resolve(req.params.thingId);
        }
      });

      const routes = server.table()[0].table;
      expect(routes).to.have.deep.property('length', 3);
    });
  });

  describe('with multiple path params', () => {
    beforeEach(() => {
      hapiCrudPromise(server, {
        path: '/api/users/{userId}/things/{thingId}',
        config: {
          validate: {
            query: {
              limit: Joi.string().optional()
            },
            params: {
              userId: Joi.number().integer().positive().required(),
              thingId: Joi.string().required()
            },
            payload: Joi.object({
              name: Joi.string().required()
            })
          }
        },
        crudRead(req) {
          return B.resolve({
            id: 1,
            name: req.params.thingId
          });
        },
        crudReadAll(req) {
          return B.resolve({
            things: [
              { id: 1, name: 'thingamajig' },
              { id: 2, name: 'thingamabob' }
            ],
            meta: { total: req.query.limit }
          });
        },
        crudUpdate(req) {
          return B.resolve({
            id: 1,
            name: req.payload.name
          });
        },
        crudCreate(req) {
          return B.resolve({
            id: 1,
            name: req.payload.name
          });
        },
        crudDelete(req) {
          return B.resolve(req.params.thingId);
        }
      });
    });

    const thingId = 1;

    it('should create 5 routes', () => {
      const routes = server.table()[0].table;
      expect(routes).to.have.deep.property('length', 5);
    });

    it('should create a GET all route', () => {
      return inject(server, {
        method: 'GET',
        url: {
          pathname: '/api/users/123/things'
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 200);
      });
    });

    it('should create a GET all route that has the earlier path parameter validation', () => {
      return inject(server, {
        method: 'GET',
        url: {
          pathname: '/api/users/abc/things'
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 400);
      });
    });

    it('should create a POST route', () => {
      return inject(server, {
        method: 'POST',
        url: {
          pathname: '/api/users/123/things'
        },
        payload: {
          name: 'thingamapost'
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 201);
      });
    });

    it('should create a POST route that has the earlier path parameter validation', () => {
      return inject(server, {
        method: 'POST',
        url: {
          pathname: '/api/users/abc/things'
        },
        payload: {
          name: 'thingamapost'
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 400);
      });
    });

    it('should create a GET route', () => {
      return inject(server, {
        method: 'GET',
        url: {
          pathname: `/api/users/123/things/${thingId}`
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 200);
      });
    });

    it('should create a GET route that has the earlier path parameter validation', () => {
      return inject(server, {
        method: 'GET',
        url: {
          pathname: `/api/users/abc/things/${thingId}`
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 400);
      });
    });

    it('should create an UPDATE route', () => {
      return inject(server, {
        method: 'PUT',
        url: {
          pathname: `/api/users/123/things/${thingId}`
        },
        payload: {
          name: 'thingamaput'
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 200);
      });
    });

    it('should create an UPDATE route that has the earlier path parameter validation', () => {
      return inject(server, {
        method: 'PUT',
        url: {
          pathname: `/api/users/abc/things/${thingId}`
        },
        payload: {
          name: 'thingamaput'
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 400);
      });
    });

    it('should create a DELETE route', () => {
      return inject(server, {
        method: 'DELETE',
        url: {
          pathname: `/api/users/123/things/${thingId}`
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 204);
      });
    });

    it('should create a DELETE route that has the earlier path parameter validation', () => {
      return inject(server, {
        method: 'DELETE',
        url: {
          pathname: `/api/users/abc/things/${thingId}`
        }
      }).then((resp) => {
        expect(resp).to.have.property('statusCode', 400);
      });
    });
  });
});
