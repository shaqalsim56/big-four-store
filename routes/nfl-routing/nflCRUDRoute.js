import express, { response } from 'express';
export const nflRouter = express.Router();
import { getNFLProducts, getNFLProduct, createNFLProduct, deleteNFLProduct, updateNFLProduct } from '../../data/database.js';
import fileUpload from 'express-fileupload';
import { getRandomHexValue } from '../../utils/utils.js';
import session from 'express-session';
import bodyParser from 'body-parser';

let loggedin = false;

// Configure session middleware
nflRouter.use(session({
    secret: 'hiiiFashionSessionKeynfl', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60000 * 60 }
  }));

  //Upload Configurations
nflRouter.use(
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
nflRouter.use(bodyParser.json());

nflRouter.use(requireLogin);


//Render Products Page 
nflRouter.get('/', async(request, response)=>{
    const view = await getNFLProducts();
    response.render('admin/nfl/view-products', {
        data: view,
        title: 'View NFL Products'
    })
})

nflRouter.get('/add-nfl-product', async(request, response)=>{
    response.render('admin/nfl/add-products', {
        title: 'View & Add New NFL Products'
    })
})

//Create New NFL Product
nflRouter.post('/create-new-nfl', async (req, res)=>{
    const nflObject= new Object();
    const { image } = req.files;
    let vFile = ' ';
    if (image){
        vFile = `${getRandomHexValue(8)}_${image.name}`
    }

    nflObject.league = req.body.league;
    nflObject.team = req.body.team;
    nflObject.gender = req.body.gender;
    nflObject.product_name = req.body.product_name;
    nflObject.product_desc = req.body.product_desc;
    nflObject.img = vFile;
    nflObject.price= req.body.price;
    nflObject.category= req.body.category;

   req.files.image.mv('./uploads/' + vFile);
    const result = await createNFLProduct(nflObject);

    res.redirect('/admin-nfl')
})

//Render View Products Page
nflRouter.get('/view/:id', async (request, response) => {
    const id = request.params.id;
    const view = await getNFLProduct(id);
    response.render('admin/nfl/view-product', {
        data: view,
        title: 'View Product'
    });
});

//Render Update Page
nflRouter.get('/update/:id', async(request, respond)=>{
    const id = request.params.id;
    const view = await getNFLProduct(id);
    respond.render('admin/nfl/update-product',{
        data: view, title: 'Update Product'
    })
})

//Update Product Post
nflRouter.post('/update-nfl', async (req, res)=>{
    const nflObject= new Object();
    const id = req.body.id;
    let vFile = ' ';
    if (req.files){
        vFile = `${getRandomHexValue(8)}_${req.files.image.name}`
    }else{
        const retInfo = await getNFLProduct(id);
       vFile = retInfo.img
   }

    nflObject.id = req.body.id;
    nflObject.league = req.body.league;
    nflObject.team = req.body.team;
    nflObject.gender = req.body.gender;
    nflObject.product_name = req.body.product_name;
    nflObject.product_desc = req.body.product_desc;
    nflObject.img = vFile;
    nflObject.price= req.body.price;
    nflObject.category= req.body.category;

    if(req.files){
        req.files. image.mv('./uploads/' + vFile);
    }
    const result = await updateNFLProduct(nflObject);

    res.redirect('/admin-nfl')
})


//Render Delete Products Page
nflRouter.get('/delete/:id', async (request, response) => {
    const id = request.params.id;
    const view = await getNFLProduct(id);
    response.render('admin/nfl/delete-product', {
        data: view,
        title: 'Delete Product'
    });
});

//Delete Post
nflRouter.post('/delete-nfl', async (req, res)=>{
    const id = req.body.id;
    const result = await deleteNFLProduct(id);

    res.redirect('/admin-nfl')
})