
const productsForm = document.getElementById('formulario')
const updateBtn = document.getElementsByClassName('updateBtn')
const deleteBtn = document.getElementsByClassName('deleteBtn')


productsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    newProduct = {
        product: productsForm[0].value,
        price: productsForm[1].value,
        stock: productsForm[2].value,
        description: productsForm[3].value,
        code: productsForm[4].value,
        thumbnail: productsForm[5].value
    }
    fetch('/api/productos/',
        {
            method: 'POST',
            body: JSON.stringify(newProduct),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(res => res.json()).then(json => {
        console.log(json)
        document.location.reload()})

    productsForm.reset()
})
for (let i=0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener('click', () => {
        productId = deleteBtn[i].parentElement.parentElement.id
        fetch(`/api/productos/${productId}`,
            {
                method: 'DELETE'
            }
        ).then(res => res.json()).then(json => {
            console.log(json)
            document.location.reload()})
    })
}

for (let i=0; i < updateBtn.length; i++) {
    updateBtn[i].addEventListener('click', () => {
        productId = updateBtn[i].parentElement.parentElement.id
        productToUpdate = {
            product: updateBtn[i].parentElement.parentElement.childNodes[1].value,
            price: updateBtn[i].parentElement.parentElement.childNodes[3].childNodes[3].value,
            stock: updateBtn[i].parentElement.parentElement.childNodes[9].childNodes[3].value,
            description: updateBtn[i].parentElement.parentElement.childNodes[7].value,
            code: updateBtn[i].parentElement.parentElement.childNodes[13].value,
            thumbnail: updateBtn[i].parentElement.parentElement.childNodes[5].childNodes[1].src
        }
        fetch(`/api/productos/${productId}`,
            {
                method: 'PUT',
                body: JSON.stringify(productToUpdate),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => res.json()).then(json => {
            console.log(json)
            document.location.reload()})
    })
}