const Router = require('@koa/router');


const router = new Router();

require('./analyze').register(router);

module.exports = router.routes();
