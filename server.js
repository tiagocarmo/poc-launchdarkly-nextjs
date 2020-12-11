
const express = require('express');
const next = require('next');

const LaunchDarkly = require('ldclient-node');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const ldclient = LaunchDarkly.init(process.env.LD_SDK_KEY);
    const server = express();

    server.use(async (req, res, next) => {
      let user = {
        'key': 'any',
        'country': 'AU',
        'custom': {
          'page': 'index',
          'roles': ['USER_ADMIN', 'BETA_CUSTOMER']
        }
      };
      let allFlags = await ldclient.allFlagsState(user).then(allFlags => {
        req.features = allFlags.allValues();
      });
      return next();
    });

    server.get('/api/features', (req, res) => {
      let user = {
        'key': 'any',
        'country': 'AU',
        'custom': {
          'page': 'index',
          'roles': ['USER_ADMIN', 'BETA_CUSTOMER']
        }
      };
      let allFlags = ldclient.allFlagsState(user).then(allFlags => {
        res.json(allFlags.allValues());
      });
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) {
        throw err;
      }
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
