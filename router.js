const Router = require('koa-router');
const BASE_API_URL = `/api/v1/urls`;
const BASE_URL = `/urls`;
const BASE = `http://localhost`;
const router = new Router();

let id = 0;
const URLS = {}
const IDS = {}
const SHORTEN_URLS = []

module.exports = function(port) {

    router
    .get(`${BASE_URL}/:id`, (ctx) => {
        try {
            const id = ctx.params.id;
            const url = URLS[id];
            if(!url) {
                ctx.status = 404;
                ctx.body = 'Not Found';
                ctx.app.emit('error', ctx.body, ctx);
            }
            ctx.status = 301;
            ctx.redirect(url);
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
            ctx.app.emit('error', err, ctx);
        }
    })
    .get(BASE_API_URL, (ctx) => {
        try {
            ctx.body = { urls: SHORTEN_URLS };
            ctx.status = 200;
        } catch (err) {
            console.log(err);
            ctx.status = err.status || 500;
            ctx.body = err.message;
            ctx.app.emit('error', err, ctx);
        }
    })
    .post(BASE_API_URL, (ctx, next) => {
        const urlValidationRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        const url = ctx.request.body.url;
        if (!urlValidationRegex.test(url)) {
            ctx.status = 400;
            ctx.body = 'Invalid URL';
            ctx.app.emit('error', err, ctx);
        } else {      
            const matchedId = IDS[url];
            if (matchedId) {
                ctx.body = { [matchedId]: `${BASE}:${port}${BASE_URL}/${matchedId}`};
            } else {
                id++;
                URLS[id] = url;
                IDS[url] = id;
                ctx.body = { [id]: `${BASE}:${port}${BASE_URL}/${id}`};
            }
            SHORTEN_URLS.push(ctx.body);
            ctx.status = 200;
        }
      })

    return router;
}