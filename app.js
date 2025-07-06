require('dotenv').config();

const { urlencoded } = require('express');
const express = require('express');
const expressLayouts=require('express-ejs-layouts');
const methodOverride=require('method-override');
const connectDB=require('./server/config/db');
const session=require('express-session');
const passport=require('passport');
const MongoStore=require('connect-mongo');
const { Cookie } = require('express-session');



const app=express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors({
    origin: 'https://notes-rlz8.onrender.com', // Replace with your actual frontend URL
    credentials: true, // Required if you're using cookies or sessions
}));




app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({ mongoUrl:process.env.mongodb_uri}),
    // cookie:{maxAge:new Date(Date.now()+(3600000))}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));

//connect to database
connectDB();


//static files
app.use(express.static('public'));

//templating engine
app.use(expressLayouts);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

//routes
app.use('/',require('./server/routes/auth'));
app.use('/',require('./server/routes/index'));
app.use('/',require('./server/routes/dashboard'));

//handle 404
app.get('*',function(req,res){
    res.status(404).render('404');
})

app.get('/',function(req,res){
    const locals={
        title:'nodejs notes',
        description: 'Free Nodejs App'
    }
    res.render('index',locals);
});

app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})