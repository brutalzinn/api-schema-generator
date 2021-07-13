const { Router } = require('express');
const { name, version } = require('../../package.json');


const routesBase = require('./v1/base');
const routesV1Search = require('./v1/extra/search');
const routesV1BaseExtra = require('./v1/extra/base_extra');




module.exports = async (app) => {

  app.get('/', (req, res, next) => {
    res.send({ name, version });
  });

  const routesV1 = Router();

  await routesV1Search(routesV1);
 await routesBase(routesV1);
 app.use('/v1', routesV1);
 const routesV2 = Router();

 await routesV1BaseExtra(routesV2)
  app.use('/v2', routesV2);



}
