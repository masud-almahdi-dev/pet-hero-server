const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        app.get('/', async (req, res) => {
            await client.db("admin").command({ ping: 1 });
            res.send("Pinged your deployment. You successfully connected to MongoDB!");
        })
        app.get('/allusers',async(req,res)=>{
        })
        app.get('/allpets',async(req,res)=>{
        })
        app.get('/alldonations',async(req,res)=>{
        })
        app.get('/myaddedpets',async(req,res)=>{
        })
        app.get('/mydonations',async(req,res)=>{
        })
        app.get('/adoptionrequests',async(req,res)=>{
        })
        app.get('/addapet',async(req,res)=>{
        })
        app.get('/addadonation',async(req,res)=>{
        })
        app.get('/updatepet',async(req,res)=>{
        })
        app.get('/updatedonation',async(req,res)=>{
        })
        app.get('/deletedonation',async(req,res)=>{
        })
        app.get('/deletepet',async(req,res)=>{
        })
        app.get('/deleteuser',async(req,res)=>{
        })
        app.get('/makeadmin',async(req,res)=>{
        })
        app.get('/petdetails/:id',async(req,res)=>{
        })
        app.get('/donationdetails/:id',async(req,res)=>{
        })
        app.get('/userdetails/:id',async(req,res)=>{
        })
    } finally {
    }
}
run().catch(console.dir);
app.listen(port, () => {
    console.log(`App listening on port: ${port}`)
})