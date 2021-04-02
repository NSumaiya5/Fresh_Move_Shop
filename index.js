const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const cors = require('cors');
 const bodyParser = require('body-parser');
 const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()



const port = process.env.PORT || 4200;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbeah.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
 



 app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
   res.send('Hello World!')
})


 const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 client.connect(err => {
 const productCollection = client.db("move").collection("products");
 const ordersCollection = client.db("move").collection("orders");
 // perform actions on the collection object
  //console.log('connected')

  app.get('/products', (req, res) => {
    productCollection.find()
      .toArray((err, items) => {
        console.log('from database', items)
        res.send(items)
      })
  })

 app.post('/addProduct',(req, res) => {
     const newProduct = req.body;
    console.log('adding new product:',newProduct)
   
          productCollection.insertOne(newProduct)
           .then(result => [
       console.log('inserted count', result.insertedCount),
       res.send(result.insertedCount > 0)
       ])  
        })  
        app.get('/products/:id', (req, res) => {
          const id = ObjectId(req.params.id)
          //console.log(id);
          productCollection.find({ _id: id })
            .toArray((err, products) => {
      console.log(products[0]);
              res.send(products[0])
            })
        })
      app.post('/buyProduct', (req, res) => {
          const newProduct = req.body;
          ordersCollection.insertOne(newProduct)
              .then(result => {
                res.send(result.insertedCount > 0)
              })
        
          })
          
          app.get('/allOrders', (req, res) => {
            ordersCollection.find({ email: req.query.email })
              .toArray((err, orders) => {
                res.send(orders);
              })
          })
          app.delete('/deleteProduct/:id', (req, res) => {
            const id = ObjectId(req.params.id)
            productCollection.deleteOne({ _id: id })
              .then(result => {
                res.send(result.deletedCount > 0)
              })
          })

       });
 app.listen(port)






