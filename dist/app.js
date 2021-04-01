"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const app = express_1.default();
var expressLayouts = require('express-ejs-layouts');
const port = process.env.PORT || 5000;
//templating middleware
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express_1.default.static('public'));
//routes
app.use('/', require('./routes/index'));
app.use('*', require('./routes/404'));
app.listen(port, () => console.log(`Listening on port ${port}`));
