var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./database/db')
const dotenv = require('dotenv');
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var productRouter = require('./routes/product');
var cartRouter = require('./routes/cart');


const crypto = require('crypto');

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

console.log(generateSecretKey());


var app = express();

app.use(cors());

// Or for more specific control
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);

module.exports = app;
