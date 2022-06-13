require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { mongoClient } = require('./mongo');
const { route } = require('express/lib/application');
const { Router } = require('express');
const req = require('express/lib/request');

const app = express();

//schema

const sch={
    name:String,
    price:Number,
    image:String,
    measurement:String,
    category:String,
    stock:Number,
    id:String
}
const monmodel=mongo.model("NEWCOL",sch);

app.get('/', async (req,res) => {
    const db = await mongoClient();
    if (!db) res.status(500).send('Systems Unavailable');
  
    //const { data } = await axios.get('https://goweather.herokuapp.com/weather/california');
    let products=[]
    await db.collection('products').find().forEach(product =>products.push(product))
    .then(()=>{
        res.status(200).json(products)
    })
    .catch(()=>{
        res.status(500).json(({error:'error'}))
  });
  
    return res.send();
  });

app.post("/post", async(req,res)=>{
    console.log("inside post function");


    const data=new monmodel({
        name:req.body.name,
        price:req.body.price,
        image:req.body.image,
        measurement:req.body.measurement,
        category:req.body.category,
        stock:req.body.stock,
        id:req.body.id
    })
})

//put
app.put("/update/:id",async(req,res)=>{
    let upname=req.body.name;
    let upprice=req.body.price;
    let upimage=req.body.image;
    let upmeasurement=req.body.measurement;
    let upcategory=req.body.category;
    let upstock=req.body.stock;
    let upid=req.params.id;

    monmodel.findOneAndUpdate({id:upid},{$set:{name:upname,image:upimage,measurement:upmeasurement,category:upcategory,stock:upstock,price:upprice}},{new:true},(err,data)=>{
        if(data==null){
            res.send("nothing found")
        }else{
            res.send(data)
        }
    })



})


app.listen(3000);