import express from 'express'
export const adminRouter = express.Router();
import fileUpload from 'express-fileupload';
import session from 'express-session';
import bodyParser from 'body-parser';

// Configure session middleware
adminRouter.use(session({
    secret: 'big4storeKey', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60000 * 60 }
  }));

    // Middleware to check if the user is logged in
const requireLogin = (request, response, next) => {
    if (request.session && request.session.loggedIn) {
        next(); 
    } else {
        response.redirect('/admin-login'); 
    }
};

// Add body-parser middleware
adminRouter.use(bodyParser.json());

adminRouter.use(requireLogin);

//Render Admin Dashboard
adminRouter.get('/', async (request, response) => {
    const firstName = request.session.firstName
    response.render('admin/admin-landing', {
        title: 'Admin Landing Page',
        firstName: firstName
    })
});