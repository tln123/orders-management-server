import express from 'express';
import bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//controllers
const getorders = require('./controllers/getorders');
const getitem = require('./controllers/getitem');
const postorder = require('./controllers/postorder');
const login = require('./controllers/login');

const app = express();


const PAGE_SIZE = 20;

app.use(cors());
app.use(bodyParser.json());
app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

mongoose.connect("mongodb+srv://tester:test1994@cluster0.sm7if.mongodb.net/orders-management?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const productsSchema = {
	id: String,
	name: String,
	image: String,
	price: Number
}

const employeeSchema = {
	name: String,
	username: String,
	password: String,
	fulfilledCount: Number
}

const orderSchema = {
	id: Number, 
	currency: String,
	createdDate: String,
	ItemQuantity: Number,
	items: [{id: String, quantity: Number}],
	customer: {name: String, id: String},
	fulfillmentStatus: String,
	billingInfo: {status: String},
	price: {total: Number, formattedTotalPrice: String}
}

const Product = mongoose.model("Product", productsSchema);
const Employee = mongoose.model("Employee", employeeSchema);
const Order = mongoose.model("Order", orderSchema);


app.get('/api/orders', (req, res) => {getorders.handleGetOrders(PAGE_SIZE, req, res, Order, Product)});
app.get('/api/items/:itemId', (req, res) => {getitem.handleGetItem(req, res, Product);});
app.post('/api/:orderId', (req, res) => {postorder.handlePostOrder(req, res, Order, Employee);});
app.post('/api/employees/login', (req, res) => {login.handleLogin(req, res, bcrypt, Employee);});

const PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log('Listening on port ' + PORT);
