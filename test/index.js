'use strict';

const B = require('bluebird');
const chai = require('chai');
const createServer = require('./helpers/create_server');
const expect = chai.expect;
const hapiCrudPromise = require('../index');
const Hapi = require('hapi');
const inject = require('./helpers/inject');
const Joi = require('joi');

describe('hapi-crud-promise', () => {
  it('should export a function', () => {
    expect(hapiCrudPromise).to.be.a.Function;
  });

  const server = createServer();

  hapiCrudPromise(server, {
    path: '/api/things/{thingId}',
    config: {
      validate: {
        query: {
          // thingId: Joi.string().required()
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
        name: 'thingamajig'
      });
    },
    crudReadAll(req) {
      return B.resolve({
        things: [
          { id: 1, name: 'thingamajig' },
          { id: 2, name: 'thingamabob' }
        ]
      });
    },
    crudUpdate(req) {
      return B.resolve({
        id: 1,
        name: 'thinger'
      });
    },
    crudCreate(req) {
      return B.resolve({
        id: 1,
        name: 'thingamajig'
      });
    },
    crudDelete(req) {
      return B.resolve();
    }
  });

  const thingId = 1;

  it('should create a GET all route', () => {
    return inject(server, {
      method: 'GET',
      url: {
        pathname: `/api/things`,
      }
    }).then((resp) => {
      expect(resp).to.have.property('statusCode', 200);
    });
  });

  it('should create a POST route', () => {
    return inject(server, {
      method: 'POST',
      url: {
        pathname: `/api/things`,
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
        pathname: `/api/things/${thingId}`,
      }
    }).then((resp) => {
      expect(resp).to.have.property('statusCode', 200);
    });
  });

  it('should create an UPDATE route', () => {
    return inject(server, {
      method: 'PUT',
      url: {
        pathname: `/api/things/${thingId}`,
      }
    }).then((resp) => {
      expect(resp).to.have.property('statusCode', 200);
    });
  });

  it('should create a DELETE route', () => {
    return inject(server, {
      method: 'DELETE',
      url: {
        pathname: `/api/things/${thingId}`,
      }
    }).then((resp) => {
      expect(resp).to.have.property('statusCode', 204);
    });
  });
});
