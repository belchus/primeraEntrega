
const fs = require("fs")
const apiProducts = require('./app.js')
const products = new apiProducts('products.txt')

class Cart {
  constructor(fileName) {
    this.newFile = fileName
  }

  async saveData(data) {
    try {
      await fs.promises.writeFile(this.newFile, JSON.stringify(data, null, 2))
    } catch (error) {
        console.log("error!", error)
    }
  }

  async save() {
   
    const cartsArray = (await this.getAll()) || []
    try {
      let id = 0
      cartsArray.length === 0
        ? (id = 1)
        : (id = cartsArray[cartsArray.length - 1].id + 1)
      const newItem = { timestamp: Date.now(), id: id, productos: [] }
      cartsArray.push(newItem)
      await this.saveData(cartsArray)
      console.log(`Carrito  ${id} guardado`)
      return { id }
    } catch (error) {
        console.log("error", error)
    }
  }

  async getCartById(id) {
    const cartsArray = (await this.getAll()) || []
    try {
      const cartById = cartsArray.find((cart) => cart.id === id)
      return cartById || null
    } catch (error) {
        console.log("Error", error)
    }
  }

  async getAll() {
    try {
      const content = await fs.promises.readFile(this.newFile)
      const contentArray = JSON.parse(content)
      return contentArray
    } catch (error) {
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
            return `Producto ${productId} no existe`
        }
    } catch (error) {
        console.log('Error, ', error)
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
            return `Producto  ${productId} no existe `
        }
    } catch (error) {
        console.log('Error, ', error)
    }
  }
 
  async deleteCartById(id) {
    try {
      const cartsArray = (await this.getAll()) || []
      const cartToUpdate = cartsArray.findIndex(cart => cart.id === id)
      if (cartToUpdate !== -1) {
        const filteredCarts = cartsArray.filter(cart => cart.id !== id)
        this.saveData(filteredCarts)
        return `Carrito  ${id} eliminado`
      } else {
          return `Carrito  ${id} no existe`
      } 
    } catch (erorr) {
        console.log("Error, ", error)
    }
  }
}

module.exports = Cart