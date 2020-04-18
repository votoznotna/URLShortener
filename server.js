const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const koaStatic = require('koa-static');
const getPort = require('get-port');

async function runServer() {
    const port = await getPort({ port: 9900 });
    router = require('./router')(port);

    const app = new Koa();
    app
    .use(koaStatic(path.join(__dirname, '.', 'client')))
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods());

    app.listen(port);

    console.log(`server started at http://localhost:${port}/`);
}

runServer().catch(console.error);