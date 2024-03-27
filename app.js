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


//Configuartions
const port = 4404;
const app = express();

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
app.use('/', homepageRoute)

//Handle form field values from method=post
app.use(express.urlencoded({ extended: true }));


//Initialize Server 
app.listen(port, () => {
    console.log(`The Server is Running On Port ${port}`);
});