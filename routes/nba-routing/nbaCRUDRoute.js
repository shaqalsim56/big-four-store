import express, { response } from 'express';
export const nbaRouter = express.Router();
import { getNBAProducts, getNBAProduct, createNBAProduct, deleteNBAProduct, updateNBAProduct, getNBAProductsByCategory, getNBAProductsByTeam } from '../../data/database.js';
import fileUpload from 'express-fileupload';
import { getRandomHexValue } from '../../utils/utils.js';
import session from 'express-session';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { resultsPerPage } from '../../app.js';

let loggedin = false;

// Configure session middleware
nbaRouter.use(session({
    secret: 'hiiiFashionSessionKeynba', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60000 * 60 }
  }));

  //Upload Configurations
nbaRouter.use(
    fileUpload({
        limits: {
            fileSize: 10 * 1024 * 1024 ,  //-----10 * 1024 * 1024 = 10mb --------//
        },
        abortOnLimit: true,
    })
)

    // Middleware to check if the user is logged in
const requireLogin = (request, response, next) => {
    if (request.session && request.session.loggedIn) {
        next(); 
    } else {
        response.redirect('/admin-login'); 
    }
};

// Add body-parser middleware
nbaRouter.use(bodyParser.json());

nbaRouter.use(requireLogin);


//Render Products Page 
nbaRouter.get('/', async(request, response)=>{
    const category = request.params.category;
    const view = await getNBAProducts();
    const numberOfResults = view.length;
    const numberOfPages = Math.ceil(numberOfResults / resultsPerPage);
    let page = request.query.page ? Number(request.query.page) : 1;

        //Redirecting If Page Number is Too Much
        if(page > numberOfPages){
            response.redirect('/admin-nba?page = ' +encodeURIComponent(numberOfPages));
        }else if(page < 1){
            response.redirect('/admin-nba?page='+encodeURIComponent('1'));
        }
         //Establish SQL Limit Starting Number
    const startingLimit = (page - 1) * resultsPerPage;
    const sql = `SELECT * FROM nba_products LIMIT ${startingLimit}, ${resultsPerPage}`;

    try {
        // Create a connection
        const connection = await mysql.createConnection({   
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE });
      
        // Execute the query with placeholders
        const [view] = await connection.query(sql, [startingLimit, resultsPerPage]);
      
        // Process the result here
      
        let iterator = (page - 5) < 1 ? 1 : page - 5;
        let endingLink = (iterator + 3) <= numberOfPages ? (iterator + 3) : page +
         (numberOfPages - page);

         if(endingLink < (page + 4)){
            iterator -= (page + 4) - numberOfPages;
         }

    response.render('admin/nba/view-products', {
        data: view,
        title: 'View NBA Products',
        page, iterator, endingLink, numberOfPages, category
    })
            // Close the connection
            await connection.end();
        } catch (error) {
          console.error('Error executing query:', error);
        }
})

nbaRouter.get('/category/:category', async (request, response) => {
    const category = request.params.category;
    const page = request.query.page ? Number(request.query.page) : 1;
    const resultsPerPage = 10; 

    // Retrieve products based on the category
    const products = await getNBAProductsByCategory(category);

    // Pagination
    const numberOfResults = products.length;
    const numberOfPages = Math.ceil(numberOfResults / resultsPerPage);

    // Calculate iterator and endingLink for pagination
    let iterator = Math.max(1, page - 5);
    let endingLink = Math.min(iterator + 3, numberOfPages);

    // Adjust iterator if endingLink exceeds numberOfPages
    if (endingLink < page + 4) {
        iterator -= (page + 4) - numberOfPages;
    }

    // Slice products based on pagination parameters
    const startingIndex = (page - 1) * resultsPerPage;
    const paginatedProducts = products.slice(startingIndex, startingIndex + resultsPerPage);

    // Render the view with filtered products and pagination parameters
    response.render('admin/nba/view-products', {
        data: paginatedProducts,
        title: `View NBA Products - ${category} Category`,
        page,
        iterator,
        endingLink,
        numberOfPages,
        category
    });
});

// Filter by Team
nbaRouter.get('/team/:team', async (request, response) => {
    const team = request.params.team;
    const category = request.params.category;
    const page = request.query.page ? Number(request.query.page) : 1;
    const resultsPerPage = 10;

    // Retrieve products based on the team
    const products = await getNBAProductsByTeam(team);

    // Pagination
    const numberOfResults = products.length;
    const numberOfPages = Math.ceil(numberOfResults / resultsPerPage);

    // Calculate iterator and endingLink for pagination
    let iterator = Math.max(1, page - 5);
    let endingLink = Math.min(iterator + 3, numberOfPages);

    // Adjust iterator if endingLink exceeds numberOfPages
    if (endingLink < page + 4) {
        iterator -= (page + 4) - numberOfPages;
    }

    // Slice products based on pagination parameters
    const startingIndex = (page - 1) * resultsPerPage;
    const paginatedProducts = products.slice(startingIndex, startingIndex + resultsPerPage);

    // Render the view with filtered products and pagination parameters
    response.render('admin/nba/view-products', {
        data: paginatedProducts,
        title: `View NBA Products - ${team} Team`,
        page,
        iterator,
        endingLink,
        numberOfPages,
        team,
        category
    });
});





nbaRouter.get('/add-nba-product', async(request, response)=>{
    response.render('admin/nba/add-products', {
        title: 'View & Add New NBA Products'
    })
})

//Create New nba Product
nbaRouter.post('/create-new-nba', async (req, res)=>{
    const nbaObject= new Object();
    const { image } = req.files;
    let vFile = ' ';
    if (image){
        vFile = `${getRandomHexValue(8)}_${image.name}`
    }

    nbaObject.league = req.body.league;
    nbaObject.team = req.body.team;
    nbaObject.gender = req.body.gender;
    nbaObject.product_name = req.body.product_name;
    nbaObject.product_desc = req.body.product_desc;
    nbaObject.img = vFile;
    nbaObject.price= req.body.price;
    nbaObject.category= req.body.category;

   req.files.image.mv('./uploads/' + vFile);
    const result = await createNBAProduct(nbaObject);

    res.redirect('/admin-nba')
})

//Render View Products Page
nbaRouter.get('/view/:id', async (request, response) => {
    const id = request.params.id;
    const view = await getNBAProduct(id);
    response.render('admin/nba/view-product', {
        data: view,
        title: 'View Product'
    });
});

//Render Update Page
nbaRouter.get('/update/:id', async(request, respond)=>{
    const id = request.params.id;
    const view = await getNBAProduct(id);
    respond.render('admin/nba/update-product',{
        data: view, title: 'Update Product'
    })
})

//Update Product Post
nbaRouter.post('/update-nba', async (req, res)=>{
    const nbaObject= new Object();
    const id = req.body.id;
    let vFile = ' ';
    if (req.files){
        vFile = `${getRandomHexValue(8)}_${req.files.image.name}`
    }else{
        const retInfo = await getNBAProduct(id);
       vFile = retInfo.img
   }

    nbaObject.id = req.body.id;
    nbaObject.league = req.body.league;
    nbaObject.team = req.body.team;
    nbaObject.gender = req.body.gender;
    nbaObject.product_name = req.body.product_name;
    nbaObject.product_desc = req.body.product_desc;
    nbaObject.img = vFile;
    nbaObject.price= req.body.price;
    nbaObject.category= req.body.category;

    if(req.files){
        req.files. image.mv('./uploads/' + vFile);
    }
    const result = await updateNBAProduct(nbaObject);

    res.redirect('/admin-nba')
})


//Render Delete Products Page
nbaRouter.get('/delete/:id', async (request, response) => {
    const id = request.params.id;
    const view = await getNBAProduct(id);
    response.render('admin/nba/delete-product', {
        data: view,
        title: 'Delete Product'
    });
});

//Delete Post
nbaRouter.post('/delete-nba', async (req, res)=>{
    const id = req.body.id;
    const result = await deleteNBAProduct(id);

    res.redirect('/admin-nba')
})