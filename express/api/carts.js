
const fs = require("fs")
const apiProducts = require('./app.js')
const products = new apiProducts('products.txt')

class Cart {
  constructor(fileName) {
    this.newFile = fileName
  }

  // método adicional para guardar datos
  async saveData(data) {
    try {
      await fs.promises.writeFile(this.newFile, JSON.stringify(data, null, 2))
    } catch (err) {
        console.log("error escritura en archivo!", err)
    }
  }

  async save() {
    // Traer todos los carritos usando el método getAll.
    // Si es undefined porque no existe el archivo asigna un array vacío a través
    // del operador || para que length no de error
    const cartsArray = (await this.getAll()) || []
    try {
      let id = 0
      cartsArray.length === 0
        ? (id = 1)
        : (id = cartsArray[cartsArray.length - 1].id + 1)
      const newItem = { timestamp: Date.now(), id: id, productos: [] }
      cartsArray.push(newItem)
      await this.saveData(cartsArray)
      console.log(`Carrito con id ${id} guardado ok!`)
      return { id }
    } catch (err) {
        console.log("error escritura en archivo!", err)
    }
  }

  async getCartById(id) {
    const cartsArray = (await this.getAll()) || []
    try {
      const cartById = cartsArray.find((cart) => cart.id === id)
      return cartById || null
    } catch (err) {
        console.log("Error, ", err)
    }
  }

  async getAll() {
    try {
      const content = await fs.promises.readFile(this.newFile)
      const contentArray = JSON.parse(content)
      return contentArray
    } catch (err) {
        console.log("Archivo vacío")
        return 0
    }
  }

  async addProductById(cartId, productId) {
    try{
        const foundProduct = await products.getById(productId)
        if (foundProduct !== null) {
            const cartsArray = (await this.getAll()) || []
            const cartToUpdate = cartsArray.findIndex(cart => cart.id === cartId)
            cartsArray[cartToUpdate].productos.push(foundProduct)
            await this.saveData(cartsArray)
            return cartsArray[cartToUpdate]
        } else {
            return `Producto con id ${productId} no existe`
        }
    } catch (err) {
        console.log('Error, ', err)
    }
  }

  async deleteProductById(cartId, productId) {
    try{
        const cartsArray = await this.getAll() || []
        const cartToUpdate = cartsArray.findIndex(cart => cart.id === cartId)
        const productToDelete = cartsArray[cartToUpdate].productos.findIndex(product => product.id === productId)
        if ( productToDelete !== -1) {
          cartsArray[cartToUpdate].productos.splice(productToDelete, 1)
          await this.saveData(cartsArray)
          return cartsArray[cartToUpdate]
        } else {
            return `Producto con id ${productId} no existe en carrito`
        }
    } catch (err) {
        console.log('Error, ', err)
    }
  }
 
  async deleteCartById(id) {
    try {
      const cartsArray = (await this.getAll()) || []
      const cartToUpdate = cartsArray.findIndex(cart => cart.id === id)
      if (cartToUpdate !== -1) {
        const filteredCarts = cartsArray.filter(cart => cart.id !== id)
        this.saveData(filteredCarts)
        return `Carrito con id ${id} borrado`
      } else {
          return `Carrito con id ${id} no existe`
      } 
    } catch (err) {
        console.log("Error, ", err)
    }
  }
}

module.exports = Cart