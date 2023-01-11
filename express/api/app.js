
const fs = require("fs")

class Contenedor {
  constructor(fileName) {
    this.newFile = fileName
  }

  async saveData(data) {
    try {
      await fs.promises.writeFile(this.newFile, JSON.stringify(data, null, 2))
    } catch (error) {
      console.log("Error", error)
    }
  }

  async save(item) {
    const productsArray = (await this.getAll()) || [];
    try {
      let id = 0;
      productsArray.length === 0
        ? (id = 1)
        : (id = productsArray[productsArray.length - 1].id + 1)
      const newItem = { ...item, timestamp: Date.now(), id: id }
      productsArray.push(newItem)
      await this.saveData(productsArray)
      console.log(`producto ${item.product} ingresado!`)
      return newItem
    } catch (error) {
      console.log("Error", error)
    }
  }

  async getById(id) {
    const productsArray = (await this.getAll()) || [];
    try {
      const productById = productsArray.find((product) => product.id === id)
      return productById || null
    } catch (error) {
      console.log("Error", error)
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

  async deleteById(id) {
    const productsArray = (await this.getAll()) || [];
    try {
      const filteredProducts = productsArray.filter(
        (product) => product.id !== id
      )
      this.saveData(filteredProducts)
    } catch (error) {
      console.log("Error", error)
    }
  }

  async deleteAll() {
    try {
      this.saveData([]);
      console.log("Productos eliminados!");
    } catch (error) {
      console.log("Error, productos no eliminados!", error)
    }
  }
}

module.exports = Contenedor