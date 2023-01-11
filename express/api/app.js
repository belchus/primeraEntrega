
const fs = require("fs")

class Contenedor {
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

  async save(item) {
    // Traer todos los productos usando el método getAll.
    // Si es undefined porque no existe el archivo asigna un array vacío a través
    // del operador || para que length no de error
    const productsArray = (await this.getAll()) || [];
    try {
      let id = 0;
      productsArray.length === 0
        ? (id = 1)
        : (id = productsArray[productsArray.length - 1].id + 1)
      const newItem = { ...item, timestamp: Date.now(), id: id }
      productsArray.push(newItem)
      await this.saveData(productsArray)
      console.log(`producto ${item.product} ingresado ok!`)
      return newItem
    } catch (err) {
      console.log("error escritura en archivo!", err)
    }
  }

  async getById(id) {
    const productsArray = (await this.getAll()) || [];
    try {
      const productById = productsArray.find((product) => product.id === id)
      return productById || null
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

  async deleteById(id) {
    const productsArray = (await this.getAll()) || [];
    try {
      const filteredProducts = productsArray.filter(
        (product) => product.id !== id
      )
      this.saveData(filteredProducts)
    } catch (err) {
      console.log("Error, ", err)
    }
  }

  async deleteAll() {
    try {
      this.saveData([]);
      console.log("Productos eliminados!");
    } catch (err) {
      console.log("Error, productos no eliminados!", err)
    }
  }
}

module.exports = Contenedor