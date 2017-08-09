const serve = require('koa-static')
const Koa = require('koa')
const app = new Koa()
const route = require('koa-path-match')()

const alexaStats = require('alexa-stats')

app.use(require('kcors')())
app.use(serve(`${__dirname}/build`))

const port = process.env.PORT || 3000

app.use(route('/ping').get(ctx => (ctx.body = 'pong')))

app.use(route('/domain/stats').get(async ctx => {
  const {domain} = ctx.request.query
  const data = await alexaStats(domain)

  ctx.status = 200
  ctx.body = data
}))

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
