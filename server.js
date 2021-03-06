
const express = require('express');
const next = require('next');

const LaunchDarkly = require('ldclient-node');

const sdk_key = '<SDK_ID>';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const user = {
  'firstName': 'First',
  'lastName': 'Last',
  'key': 'mail@provider.com'
};

app
  .prepare()
  .then(() => {
    const ldclient = LaunchDarkly.init(sdk_key);
    const server = express();

    server.use(async (req, res, next) => {
      let allFlags = await ldclient.allFlagsState(user).then(allFlags => {
        req.features = allFlags.allValues();
      });
      return next();
    });

    server.get('/api/features', (req, res) => {
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
