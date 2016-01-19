hapi-crud-promise
=================
<!-- toc -->
- [Basics](#basics)
- [Simple Usage](#simpleusage)
- [Contributing](#contributing)
 - [Pull Request Checklist](#pullrequestchecklist)

<!-- tocstop -->

### Basics
Reduce repetitive route setup for basic CRUD apps.

Provide one route and a 5 handlers:
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

### Simple Usage
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
      query: { // validation only applied to GET (all)
        limit: Joi.number().optional()
      }
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

### Contributing
Contributors wanted.  If you are looking for a way to help out browse the [Help Wanted](https://github.com/gangstead/hapi-crud-promise/labels/help%20wanted) issues and find one that looks good to you. If you have an idea to make hap-crud-promise better submit a pull request.
#### Pull Request Checklist
Checklist for submitting a pull request:
- [ ] `npm run test` - Unit tests must pass
- [ ] New unit tests
- [ ] `npm run test-cov` - Code coverage cannot go down
- [ ] `npm run lint` - New code must have no linter errors
- [ ] Your pull request must pass CI (when available)
