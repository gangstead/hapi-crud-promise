hapi-crud-promise
=================
[![NPM](https://nodei.co/npm/hap-crud-promise.png?downloads=true&&downloadRank=true&stars=true)](https://nodei.co/npm/comder/) [![NPM](https://nodei.co/npm-dl/hap-crud-promise.png?months=3&height=3)](https://nodei.co/npm/comder/)

<!-- toc -->
- [Basics](#basics)
- [Simple Usage](#simple-usage)
- [Contributing](#contributing)
 - [Pull Request Checklist](#pull-request-checklist)
- [FAQ](#faq)

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
PUT    /api/things/{thingId}
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

### FAQ
#### Isn't this like [hapi-crud](https://www.npmjs.com/package/hapi-crud)?
Yeah, but with [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)! And active.  And the Github repo is still live.
#### Can't I just create a bunch of routes manually?
CRUD routes are repetitive. Write less code and go outside.
