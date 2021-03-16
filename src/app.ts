import express, { Application, Request, Response } from "express";
import path from 'path';
require('dotenv').config();

const app: Application = express();
var expressLayouts = require('express-ejs-layouts');

const port = process.env.PORT||5000 ;

//templating middleware
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static('public'));
//routes
app.use('/', require('./routes/index.ts'))

// app.get('/', (req:Request, res:Response)=>res.send("Hello!"));

app.listen(port, ()=>console.log(`Listening on port ${port}`))