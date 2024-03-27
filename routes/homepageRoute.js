import express from 'express'
export const homepageRoute = express.Router();


homepageRoute.get('/', async(request, response)=>{
    response.render('homepage-not-signedin/index', {
        title: 'The Big 4 Store'
    })
})