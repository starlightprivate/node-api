require('newrelic');
import express from 'express';
import fs from 'fs';
import morgan from 'morgan';
import logger from './api/common/log';
import bodyParser from 'body-parser';
import config from 'config3';
import expressPromiseRouter from 'express-promise-router';
import https from 'https';
import forceSSL from 'express-force-ssl';
import helmet from 'helmet';
import csp from 'helmet-csp';
import raven from 'raven';
import redis from './config/redis';
import csvimport from './config/import';
import {routes} from './config/routes/v1.0';
//import './config/seed'

const app = express();

console.log("Currently Running On : " , process.env.NODE_ENV);

app.use(raven.middleware.express.requestHandler('https://547e29c8a3854f969ff5912c76f34ef0:62c29411c70e46df81438b09d05526b0@sentry.io/106191'));


app.set('forceSSLOptions', {
  enable301Redirects: true,
  trustXFPHeader: false,
  httpsPort: 4443,
  sslRequiredMessage: 'SSL Required.'
});
app.use(forceSSL);

app.use(helmet());
app.use(helmet.referrerPolicy());

app.use(csp({
  directives: {
    defaultSrc: ["'self' , 'tacticalmastery.com'"]
  }
}));

var oneDayInSeconds = 86400;
app.use(helmet.hpkp({
  maxAge: oneDayInSeconds,
  sha256s: ['AbCdEfSeTyLBvTjEOhGD1627853=', 'ZyXwYuBdQsPIUVxNGRDAKGgxhJVu456=']
}));

app.use(helmet.noCache());

app.set('superSecret', config.LOCALTABLE_SECRET);
app.use('/api', morgan('combined', {stream: logger.asStream('info')}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(function (req, res, next) {
  res.set(`X-Powered-By`, `TacticalMastery`);
  next();
});

function logResponseBody(req, res, next) {
  var oldWrite = res.write,
    oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(new Buffer(chunk));

    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk)
      chunks.push(new Buffer(chunk));

    var body = Buffer.concat(chunks).toString('utf8');
    logger.info(body);

    oldEnd.apply(res, arguments);
  };

  next();
}

app.use(logResponseBody);

// route with appropriate version prefix
Object.keys(routes).forEach(r => {
  const router = expressPromiseRouter();
  // pass promise route to route assigner
  routes[r](router);
  // '/' + v1_0 -> v1.0, prefix for routing middleware
  app.use(`/api/${r.replace('_', '.')}`, router);
});

app.use(raven.middleware.express.errorHandler('https://547e29c8a3854f969ff5912c76f34ef0:62c29411c70e46df81438b09d05526b0@sentry.io/106191'));

app.use(function (err, req, res, next) {
  if (err) {
    console.log(err);
    if (typeof err.status != "undefined")   res.status(err.status);
    res.error(err.message || err);
  }
});

var https_port = (process.env.HTTPS_PORT || 4443);

var options = {
  //new location of evssl certs
  cert: fs.readFileSync('/etc/nginx/ssl/tacticalmastery_cf.crt'),
  key: fs.readFileSync('/etc/nginx/ssl/tacticalmastery_cf.key'),
  requestCert: true
  //,rejectUnauthorized: true
};

https.createServer(options,app).listen(https_port);
console.log("HTTPS Server Started at port : " + https_port);

