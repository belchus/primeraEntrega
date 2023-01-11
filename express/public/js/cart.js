const cartLink = document.getElementsByClassName('cartLink')
const cartName = document.getElementsByClassName('cartName')
const products = document.getElementsByClassName('products')
const addProducts = document.getElementsByClassName('addProducts')
const addCart = document.getElementsByClassName('addCart')


for (let i=0; i < cartLink.length; i++) {
    cartLink[i].addEventListener('click', () => {
        fetch(`/api/carrito/${cartLink[i].id}/productos`)
            .then(res => res.json())
            .then(cart => {
                const cartProds = cart.productos.map(product => {
                    return `<div class='productDiv'>
                                <div class='productContainer'>
                                    <p>${product.product}</p>
                                    <p>$${product.price}</p>
                                    <p>${product.description}</p>
                                    <p>${product.stock}</p>
                                </div>
                                <div class='thumbnailContainer'>
                                    <img src='${product.thumbnail}' alt='imagen producto' width='50px'>
                                </div>
                                <div class='deleteProductBtn'>
                                    <button class='deleteProduct' id='${product.id}'>Eliminar</button>
                                </div>
                            </div>
                            `
                })
           cartName[0].innerHTML = 
                    `<p>Carrito ${cart.id}</p>
                     <button class='deleteCart'>Eliminar carrito</button>
                    `
                products[0].innerHTML = cartProds.join('') || `<p>Carrito vacío</p>`
                const deleteProductBtn = document.getElementsByClassName('deleteProduct')
                const deleteCartBtn = document.getElementsByClassName('deleteCart')
                deleteProduct(deleteProductBtn, cartLink[i].id)
                deleteCart(deleteCartBtn, cartLink[i].id)
                addProductToCart(cartLink[i].id)
            })
    })
}


const addProductToCart = (cartId) => {
    addProducts[0].innerHTML = `<button id='addProductBtn'>Agregar productos al carrito</button>`
    const addProductBtn = document.getElementById('addProductBtn')
    addProductBtn.addEventListener('click', () => {
        fetch('/api/productos/arrayproductos').then(res => res.json())
            .then(productos => addProduct(productos, cartId))
    })
}


const addProduct = (productos, cartId) => {
    const productCards = productos.map(product => {
        return `<div class='productCard'>
                    <p>${product.product}</p>
                    <div>
                        <p>$${product.price}</p>
                    </div>
                    <div class='thumbContainer'>
                        <img class='thumbnail' src='${product.thumbnail}' alt='imagen producto' width='50px'>
                    </div>
                    <p>${product.description}</p>
                    <div class='stockContainer'>
                    <p>Stock:${selectedProduct.stock}</p>
                    </div>
                    <div class='buyBtnContainer'>
                        <button class='buyBtn' id='${product.id}'>Agregar al carrito</button>
                    </div>
                    <input class='codeInput' type='hidden' value='${product.code}'>
                </div>`
    })
    const newDiv = document.createElement('div')
    newDiv.className = 'cardContainer'
    addProducts[0].appendChild(newDiv)
    const cardContainer = document.getElementsByClassName('cardContainer')
    cardContainer[0].innerHTML = productCards.join('')
    const buyBtn = document.getElementsByClassName('buyBtn')
    buyProduct(buyBtn, productos, cartId)
}



const buyProduct = (buyBtn, productos, cartId) => {
    for (let i=0;i < buyBtn.length;i++) {
        buyBtn[i].addEventListener('click', () => {
            const selectedProduct = productos.find(product => product.id === parseInt(buyBtn[i].id))
            fetch(`/api/carrito/${cartId}/productos/${buyBtn[i].id}`,
                {
                    method: 'POST',
                    body: JSON.stringify(selectedProduct),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                .then(cart => {
                    console.log(cart)
                    const productHTML =
                        `<div class='productDiv'>
                            <div class='productContainer'>
                                <p>Producto:${selectedProduct.product}</p>
                                <p>Precio:$${selectedProduct.price}</p>
                                <p>Descripción:${selectedProduct.description}</p>
                                <p>Stock:${selectedProduct.stock}</p>
                            </div>
                            <div class='thumbnailContainer'>
                                <img class='thumbnail' src='${selectedProduct.thumbnail}' alt='imagen producto' width='50px'>
                            </div>
                            <div class='deleteProductBtnContainer'>
                                <button class='deleteProduct' id='${selectedProduct.id}'>Eliminar</button>
                            </div>
                         </div>`
                    const emptyCart = document.getElementsByClassName('emptyCart')
                    emptyCart[0] === undefined ? false : emptyCart[0].style.display = 'none'
                    products[0].innerHTML += productHTML
                    const deleteProductBtn = document.getElementsByClassName('deleteProduct')
                    deleteProduct(deleteProductBtn, cartId)
                })
        })
    }
}

addCart[0].addEventListener('click', () => {
    fetch('/api/carrito', { method: 'POST' }).then(res => res.json())
        .then(json => {
            console.log('ID nuevo carrito:', json)
            document.location.reload()
        })
})


const deleteCart = (deleteCartBtn, cartId) => {
    deleteCartBtn[0].addEventListener('click', () => {
        fetch(`/api/carrito/${cartId}`, { method: 'DELETE'}).then(res => res.json())
            .then(json => {
                console.log(json)
                document.location.reload()
            })
    })
}


const deleteProduct = (deleteProduct, cartId) => {
    for (let i=0;i < deleteProduct.length;i++) {
        deleteProduct[i].addEventListener('click', () => {
            fetch(`/api/carrito/${cartId}/productos/${deleteProduct[i].id}`, { method: 'DELETE'})
                .then(res => res.json())
                .then(cart => {
                    const cartProds = cart.product.map(product => {
                            return `<div class='productDiv'>
                                        <div class='productContainer'>
                                            <p>Producto:${product.product}</p>
                                            <p>Precio: $${product.price}</p>
                                            <p>Descripción:${product.description}</p>
                                            <p>Stock:${product.stock}</p>
                                        </div>
                                        <div class='thumbnailContainer'>
                                            <img class='thumbnail' src='${product.thumbnail}' alt='imagen producto' width='50px'>
                                        </div>
                                        <div class='deleteProductBtn'>
                                            <button class='deleteProduct' id='${product.id}'>Eliminar</button>
                                        </div>
                                    </div>
                                    `
                    })
                    products[0].innerHTML = cartProds.join('') || `<p class='emptyCart'>Carrito vacío</p>`
                    const deleteProduct = document.getElementsByClassName('deleteProduct')
                    deleteProduct(deleteProduct, cartId)
                })
        })
    }
}