
const { Router: router } = require('express')
const apiCarts = require('../api/carts.js')

const routeCarts = new router()

const carts = new apiCarts('carts.txt')

routeCarts.get('/:id/productos', async (req, res) => {
    const cart = await carts.getCartById(parseInt(req.params.id))
    res.json(cart)
})

routeCarts.post('/', async (req, res) => {
    const newCart = await carts.save()
    res.json(newCart)
})

routeCarts.post('/:id_cart/productos/:id_prod', async (req, res) => {
    const addProduct = await carts.addProductById(parseInt(req.params.id_cart), parseInt(req.params.id_prod))
    res.json(addProduct)
})

routeCarts.delete('/:id_cart/productos/:id_prod', async (req, res) => {
    const productToDelete = await carts.deleteProductById(parseInt(req.params.id_cart), parseInt(req.params.id_prod))
    res.json(productToDelete)
})

routeCarts.delete('/:id', async (req, res) => {
    const deletedCart = await carts.deleteCartById(parseInt(req.params.id))
    res.json(deletedCart)
})

routeCarts.get('/carritos', async (req, res) => {
    const allCarts = await carts.getAll()
    res.render('./content/carts',
        {
            allCarts: allCarts,
            cartsQty: allCarts.length
        }
    )
})

module.exports = routeCarts