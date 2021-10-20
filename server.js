const http = require('http')
const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const data = require('./data')

const hostname = '127.0.0.1'
const port = 3000

const app = express();
const server = http.createServer(app)

// configure the template engine
app.engine('html', es6Renderer) // register the template engine
app.set('views', 'views') // where to look for templates (AKA views)
app.set('view engine', 'html') // which template engine should express use

app.get('/', (req, res) => {
   // views/home.html
  res.render('home', {
    // locals is variables available inside the template
    locals: {
      foods: data,
      title: 'Breakfast Foods'
    },
    // partials is a list of partials to load for use in the template
    partials: {
      head: 'partials/head',
      foot: 'partials/foot'
    }
  })
})

app.get('/:handle', (req, res) => {
  const { handle } = req.params
  const food = data.find((profile) => profile.handle === handle)
  if (!food) {
    res.status(404).send('Could not find that food')
  } else {
    res.render('food-profile', {
      locals: {
        food: food,
        title: `Breakfast Food: ${food.name}`
      },
      partials: {
        head: 'partials/head',
        foot: 'partials/foot'
      }
    })
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`)
})