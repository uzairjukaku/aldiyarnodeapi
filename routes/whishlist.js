// const  = require('../models/products')
const express = require('express');
const routes = new express.Router();
routes.get('/', (req, res) => {
    res.send('wishlist');
});
routes.post('/', (req, res) => {
    res.send('wishlist');
});
routes.put('/:id', (req, res) => {
    res.send('put methode');
});
routes.delete('/:id', (req, res) => {
    res.send('wishlist');
});


module.exports = routes;
