import express from 'express';
export const adminLogin = express.Router();
import bcrypt from 'bcryptjs'
import { saveAdmin, isLoginCorrect } from '../data/database.js';
import session from 'express-session';

//Login Setup
let loggedin = false;

//Handle form field values from method=post
adminLogin.use(express.urlencoded({ extended: true }));

adminLogin.use(session({
    secret: 'big4storeKey',
    resave: false,
    saveUninitialized: false,
  }));

//Admin Login
adminLogin.get('/', async (request, response) => {
    response.render('auth/admin-login-page', {
        title: 'Admin Login Page'
    });
});

//Admin Register
adminLogin.get('/register-page', async(request, response)=>{
    response.render('auth/admin-register-page', {
        title: 'Register New Admin'
    })
})

//Admin Register Post
adminLogin.post('/register-admin', async (request, response)=>{
    const oAdmin = new Object();

    oAdmin.frst_nm = request.body.frst_nm;
    oAdmin.lst_nm = request.body.lst_nm;
    oAdmin.email = request.body.email;
    oAdmin.password = request.body.password;
    // const { frst_nm, lst_nm, email, password } = request.body;
    const hashedPassword = await bcrypt.hash(oAdmin.password, 10);
  
    oAdmin.password = hashedPassword;
    const results = saveAdmin(oAdmin)
    response.redirect('/admin-login')
})

//Admin Login Post
adminLogin.post('/login-admin-post', async (request, response) => {
    const { email, password } = request.body; 
  
    try {
      const user = await isLoginCorrect(email);
  
      if (user.length > 0) {
        const adminData = user[0];
        const isMatch = await bcrypt.compare(password, adminData.password);
  
        if (isMatch) {
            request.session.loggedIn = true;
          request.session.firstName = adminData.frst_nm;
          request.session.Userid = adminData.id;
          response.redirect('/admin')
        } else {
          response.render('auth/admin-login-page',{title: 'Login Page', error: 'Incorrect username or password. Please try again.'}); 
        }
      } else {
        response.render('auth/admin-login-page',{title: 'Login Page', error: 'User not found. Please create an account.'}); 
      }
    } catch (error) {
      console.error("Error:", error);
      response.status(500).send("Internal Server Error");
    }
  });

  //Logout
adminLogin.get('/logout', async (request, response) => {
    request.session.destroy();
    response.redirect('/')
});