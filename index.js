const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const whitelist = ['https://pet-hero-2023.web.app','https://pet-hero-2023.firebaseapp.com'];
const corsOptions = { origin: whitelist,credentials: true }

app.use(cors(corsOptions));
app.use(cookieParser());
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

const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: 'cookie not found' })
        next()
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: 'not authorized to access' })
        }
        req.user = decoded
        next()
    })
}
async function run() {
    try {
        app.get('/', async (req, res) => {
            await client.db("admin").command({ ping: 1 });
            res.send("Pinged your deployment. You successfully connected to MongoDB!");
        })
        const users = client.db('PetHeroDB').collection('users');
        const pets = client.db('PetHeroDB').collection('pets');
        const campaigns = client.db('PetHeroDB').collection('campaigns');
		
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
		app.post('/jwt', async (req, res) => {
			const user = {email: req.body.email}
			const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '128h' })
			res.cookie('token', token, {
				maxAge: 1000 * 3600 * 128,
				httpOnly: true,
				secure: true,
				sameSite:'none',
				path: "/"
			})
			res.send({ success: true })
		})
		app.post('/jwtcreate', async (req, res) => {
            const _d = req.body;
			const user = {email: _d.email}
			let dbuser = await users.findOne(user)
			if(_d.datafrom==="google"){
				if(dbuser?.image==='' || dbuser?.image === null || dbuser?.image === undefined){
					const userdata = { $set: {email: _d.email, name : _d.name, image: _d.image, datafrom: _d.datafrom} }
					await users.updateOne(user,userdata,{upsert:true})
				}else{
					const userdata = { $set: {email: _d.email, name : _d.name, datafrom: _d.datafrom} }
					await users.updateOne(user,userdata,{upsert:true})
				}
			}else{
				const userdata = { $set: {email: _d.email, name : _d.name, image: _d.image, datafrom: _d.datafrom} }
				await users.updateOne(user,userdata,{upsert:true})
			}
			const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '128h' })
			res.cookie('token', token, {
				maxAge: 1000 * 3600 * 128,
				httpOnly: true,
				secure: true,
				sameSite:'none',
				path: "/"
			})
			res.send({ success: true })
		})

		app.get('/user', verifyToken, async (req, res) => {
			const filter = {email: req.user.email}
			const result = await users.findOne(filter);
			if(result === null){
			  res.send({code: 50, error: "failed to find user"})
			}else{
			  res.send(result)
			}
		})
    } finally {
    }
}
run().catch(console.dir);
app.listen(port, () => {
    console.log(`App listening on port: ${port}`)
})