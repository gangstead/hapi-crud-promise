hapi-crud-promise
=================

Reduce repetitive route setup for basic CRUD apps.

Simply define one route:
```
/api/things/{thingId}
```

And get 5 routes added to your server:
```
GET    /api/things
POST   /api/things
GET    /api/things/{thingId}
UPDATE /api/things/{thingId}
DELETE /api/things/{thingId}
```

### Basic Usage
```js
const Hapi = require('hapi');
const Joi = require('joi');
const hapiCrudPromise = require('../index');

const server = new Hapi.Server();
server.connection({ host: '127.0.0.1' });

hapiCrudPromise(server, {
  path: '/api/things/{thingId}',
  config: {
    validate: {
      params: { // validation only applied to GET (one), DELETE, and UPDATE routes
        thingId: Joi.string().required()
      },
      payload: Joi.object({ // validation only applied to POST route
        name: Joi.string().required()
      })
    }
  },
  crudRead(req) {
    return /* a promise */
  },
  crudReadAll(req) {
    return /* a promise */
  },
  crudUpdate(req) {
    return /* a promise */
  },
  crudCreate(req) {
    return /* a promise */
  },
  crudDelete(req) {
    return /* a promise */
  }
});
```
