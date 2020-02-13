const express = require('express')
const cors = require('cors')
const routes = require('./routes')

const app = express()

const port = 3001

app.use(cors())
//app.use(cors({ origin: 'http://localhost:3000' }))

app.use(express.static('src/public'))

// to all responses in JSON format
app.use(express.json())

app.use(routes)

app.listen(port, () => console.log(`Listening at ${port}`))