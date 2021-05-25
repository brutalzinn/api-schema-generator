const { Router } = require('express');
const { name, version } = require('../../package.json');


const routesBase = require('./v1/base');
const routesV1Search = require('./v1/extra/search');




module.exports = (app) => {

  app.get('/', (req, res, next) => {
    res.send({ name, version });
  });

  const routesV1 = Router();

  routesV1Search(routesV1);
  routesBase(routesV1);


  app.use('/v1', routesV1);



}
