const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;


// now check db user
// console.log('DB USER', process.env.DB_USER)


//middleware & jwt
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true //that means set cookie
}))

app.use(express.json())
app.use(cookieParser())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1vlp1px.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


//own create middleware
const logger = async(req, res, next) => {
  console.log('called', req.host, req.originalUrl)
  next();
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const serviceCollection = client.db('carEngineer').collection('services')
    const bookingCollection = client.db('carEngineer').collection('bookings')


    //AUTH RELATED API
    app.post('/jwt', logger, async(req, res) => {
      const userPayload = req.body;
      console.log(userPayload)
      const token = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
      console.log(token)

      res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
      })
      .send({success: true});
    })


    //SERVICE RELATED API

    app.get('/services', logger, async(req, res) => {
        const cursor = serviceCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })

    //specific one find 
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}

      const options = {
        projection: {title: 1, price: 1, service_id: 1, img: 1},
      };

      const result = await serviceCollection.findOne(query, options);
      res.send(result);
    })


    // ------------------------------------ BOOKINGS --------------------------------------------------------------------
    // read not all not specific one means some data
    app.get('/bookings', logger, async(req, res) => {
      console.log(req.query.email)
      console.log('tok tok tok cookies', req.cookies.token)

      // need specific data
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result)
    })



    app.post('/bookings', async(req, res) => {
      const booking = req.body;
      console.log(booking)
      const result = await bookingCollection.insertOne(booking);
      res.send(result)
    })

    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
  })

  //update
  app.patch('/bookings/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const updateBooking = req.body;
    console.log(updateBooking)
    
    const updateDoc = {
      $set: {
        status: updateBooking.status
      }
    }
    const result = await bookingCollection.updateOne(filter, updateDoc);
    res.send(result)
    
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('window port is running ...')
})

app.listen(port, ()=> {
    console.log(`console is port is running on ${port}`)
})


