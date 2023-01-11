
const { Router: router } = require('express')
const apiProducts = require('../api/app.js')

const routeProducts = new router()

const products = new apiProducts('productos.txt')
const administrador = true

routeProducts.get('/', async (req, res) => {
    const productsList = await products.getAll()
    res.render('index.ejs', {
        misProd: productsList,
        productos: productsList.length
    })
})

routeProducts.get('/:id', async (req, res) =>{
    if (req.params.id === 'arrayproductos') {
        const allProducts = await products.getAll()
        res.json(allProducts)
    } else {
    const productById = [await products.getById(parseInt(req.params.id))]
    productById[0] === null
        ? res.json({ Error:  'Producto no encontrado' })
        : res.json(productById)
    }
})

routeProducts.post('/', async (req, res) =>{
    if (administrador) {
        const savedProduct = await products.save(req.body)
        res.json(savedProduct)
    } else {
        res.json({ error : -1, descripcion: 'Sólo administradores' })
    }
})

routeProducts.put('/:id', async (req, res) =>{
    if (administrador) {
        const updateInfo = req.body
        const productsList = await products.getAll()
        regToUpdate = productsList.findIndex(product => product.id === parseInt(req.params.id))
        if (regToUpdate === -1) {
            return res.send({ Error:  'Producto no encontrado' })
        }
        productsList[regToUpdate] = { ...updateInfo, id: parseInt(req.params.id) }
        await products.saveData(productsList)
        res.json({ ...updateInfo, id: parseInt(req.params.id) })
    } else {
        res.json({ error : -1, descripcion: 'Sólo administradores' })
    }
})


routeProducts.delete('/:id', async (req, res) =>{
    if (administrador) {
        const deletedId = await products.getById(parseInt(req.params.id))
        await products.deleteById(parseInt(req.params.id))
        deletedId === null
            ? res.json( {'Producto con ID': `${parseInt(req.params.id)} no encontrado`} )
            : res.json( {'Producto eliminado': deletedId} )
    } else {
        res.json({ error : -1, descripcion: 'Sólo administradores' })
    }
})

module.exports = routeProducts