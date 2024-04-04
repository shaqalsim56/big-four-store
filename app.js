//Import NPM Packages
import express from 'express'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import morgan from 'morgan'
import session from 'express-session'
import bodyParser from 'body-parser'
import  cookie from 'cookie-parser'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Import Routes
import { homepageRoute } from './routes/homepageRoute.js'
import { adminLogin } from './routes/adminLogin.js'
import { adminRouter } from './routes/adminHomeRoute.js'
import { nflRouter } from './routes/nfl-routing/nflCRUDRoute.js'
import { nbaRouter } from './routes/nba-routing/nbaCRUDRoute.js'


//Configuartions
const port = 4404;
const app = express();

//Session Middleware
app.use(session({
    secret: 'hiiiFashion Store',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      maxAge: 60000 * 60 }
  }));
  
  app.use(cookie());

//Setup View Engine
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

//Body Parsing
app.use(bodyParser.json({limit: '1kb'}));
app.use(bodyParser.urlencoded({extended:true, limit: '1kb'}));

//Endpoint Analytics
app.use(morgan('dev'));

//Static Folders For Images
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'));

//Middleware Routing
app.use('/', homepageRoute);
app.use('/admin-login', adminLogin)
app.use('/admin', adminRouter)
app.use('/admin-nfl', nflRouter)
app.use('/admin-nba', nbaRouter)

//Handle form field values from method=post
app.use(express.urlencoded({ extended: true }));


//Initialize Server 
app.listen(port, () => {
    console.log(`The Server is Running On Port ${port}`);
});