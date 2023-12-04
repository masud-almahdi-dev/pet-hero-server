const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const whitelist = ['https://pet-hero-2023.web.app','https://pet-hero-2023.firebaseapp.com','http://localhost:5173'];
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
function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
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
        const categories = client.db('PetHeroDB').collection('categories');
		app.get('/categories',async(req,res)=>{
            const cursor = categories.find();
            let result = await cursor.toArray();
            res.send(result)
        })
        app.get('/allusers',async(req,res)=>{
        })
        app.get('/pets',async(req,res)=>{
            if(isEmpty(req.query)){
                const cursor = pets.find();
                let result = await cursor.toArray();
                res.send(result)
            }else{
                const filter = {category: req.query.category}
                const cursor = pets.find(filter);
                let result = await cursor.toArray();
                res.send(result)
            }
        })
        app.get('/pet/:id',async(req,res)=>{
            const filter = {_id: new ObjectId(req.params.id)}
			let result = await pets.findOne(filter);
			if(result === null){
			  res.send({code: 50, error: "No pet with this ID"})
			}else{
			  res.send(result)
			}
        })
        app.get('/campaign/:id',async(req,res)=>{
            const filter = {_id: new ObjectId(req.params.id)}
			let result = await campaigns.findOne(filter);
			if(result === null){
			  res.send({code: 50, error: "No donation campaign with this ID"})
			}else{
			  res.send(result)
			}
        })
        app.get('/donations',async(req,res)=>{
            const cursor = campaigns.find();
            let result = await cursor.toArray();
            res.send(result)
        })
        app.get('/myaddedpets',verifyToken,async(req,res)=>{
            const filter = {submitBy: req.user.email}
            const cursor = pets.find(filter);
            let result = await cursor.toArray();
            res.send(result)
        })
        app.get('/mydonations',async(req,res)=>{
        })
        app.get('/adoptionrequests',async(req,res)=>{
        })
        app.post('/addapet',verifyToken, async(req,res)=>{
            let pet = req.body
            const today = new Date();
            const date = today.toLocaleDateString('en-GB').split('/').join('-');
            pet.submitBy = req.user.email
            pet.submitDate = date
            let result = await pets.insertOne(pet);
            res.send(result)
        })
        app.post('/addacampaign',verifyToken,async(req,res)=>{
            let campaign = req.body
            const today = new Date();
            const date = today.toLocaleDateString('en-GB').split('/').join('-');
            campaign.submitBy = req.user.email
            campaign.submitDate = date
            campaign.amount = "0"
            let result = await campaigns.insertOne(campaign);
            res.send(result)
        })
        app.post('/updatepet/:id',verifyToken,async(req,res)=>{
            const filter = {_id: new ObjectId(req.params.id)}
            let pet = req.body
			const updated = {$set:pet}
            let result = await pets.updateOne(filter,updated,{upsert:true});
            res.send(result)
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