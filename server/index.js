
require('dotenv').config()
const PORT=process.env.PORT
const uri = process.env.URI
const express = require('express')
const cors = require('cors')
const {MongoClient} = require('mongodb');
const authRoutes = require('./routes/authRoutes');



//const uri=  ''
const app = express()
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
  res.json("AA")
})

// app.post('/signup',(req,res)=>{
//
// })

app.get('/users',async (req,res)=>{
  const client = new MongoClient(uri);
  try{
    await client.connect()
    const database=  client.db('app-data');
    const usersCollection = database.collection('users');
    const users=await usersCollection.find().toArray();
    res.send(users);
  }finally {

    await client.close();
  }
})

app.use(authRoutes);
app.listen(PORT, ()=>console.log("Server running"));