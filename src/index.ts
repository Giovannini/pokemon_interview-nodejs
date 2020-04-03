import express from 'express'

import { get, list } from './api/pokemon/routes'
import { get as getStat } from './api/stats/routes'

const port = 8080
const app = express()

app.get('/', (req, res) => {
  res.status(200).send('Hello world!')
})

app.get('/pokemons', list)
app.get('/pokemon/:id', get)
app.get('/pokemon/:id/stats', getStat)

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`)
  console.log('Press CTRL-C to stop\n')
})
