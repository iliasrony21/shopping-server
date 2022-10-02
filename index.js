const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fzvl6.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
})

async function run () {
  try {
    await client.connect()
    const productsCollection = client.db('Shopping').collection('products')
    app.get('/product', async (req, res) => {
      console.log('query', req.query)
      const page = parseInt(req.query.page)
      const size = parseInt(req.query.size)
      const query = {}
      const cursor = productsCollection.find(query)
      let products
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray()
      } else {
        products = await cursor.toArray()
      }

      res.send(products)
    })
    app.get('/productcount', async (req, res) => {
      const count = await productsCollection.estimatedDocumentCount()
      res.send({ count })
    })
  } finally {
  }
}
run().catch(console.dir)
// client.connect(err => {
//   const collection = client.db('test').collection('devices')
//   console.log('Db is connected guru')
//   // perform actions on the collection object
//   client.close()
// })

app.get('/', (req, res) => {
  res.send('Hello brother...')
})
app.listen(port, () => {
  console.log('listening to the port', port)
})
