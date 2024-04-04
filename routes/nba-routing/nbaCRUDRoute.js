import express, { response } from 'express';
export const nbaRouter = express.Router();
import { getNBAProducts, getNBAProduct, createNBAProduct, deleteNBAProduct, updateNBAProduct } from '../../data/database.js';
import fileUpload from 'express-fileupload';
import { getRandomHexValue } from '../../utils/utils.js';
import session from 'express-session';
import bodyParser from 'body-parser';

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
    const view = await getNBAProducts();
    response.render('admin/nba/view-products', {
        data: view,
        title: 'View NBA Products'
    })
})

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