const socket = io();
const productsContainer = document.querySelector('.container');
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const thumbnail = document.getElementById('thumbnail');
const code = document.getElementById('code');
const stock = document.getElementById('stock');
const productStatus = document.getElementById('status');
const category = document.getElementById('category');
const btnSubmit = document.getElementById('submit');
const btnDelete = document.getElementById('deleteBtn');
const deleteInput = document.getElementById('productID');



btnSubmit.addEventListener('click', () => {
    const product = {
        title: title.value,
        price: price.value,
        description: description.value,
        thumbnail: thumbnail.value,
        code: code.value,
        stock: stock.value,
        productStatus: productStatus.value,
        category: category.value,
    }

    // Validamos que vengan los campos necesarios para crear el producto
    if (product.title && product.price && product.description && product.code && product.stock && product.productStatus && product.category) {
        socket.emit('newProduct', product);

        Toastify({
            text: "Product added successfully!",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "bottom",
            position: "left",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b049, #128442)",
            },
        }).showToast();

        title.value = '';
        price.value = '';
        thumbnail.value = '';
        code.value = '';
        stock.value = '';
        category.value = '';
        description.value = '';
    }
});

btnDelete.addEventListener('click', () => {
    if (!deleteInput.value) return;

    socket.emit('deleteProduct', deleteInput.value);

    Toastify({
        text: "Product deleted successfully!",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #e1960b, #d15c08)",
        },
    }).showToast();

    deleteInput.value = '';
})

socket.on('products', (products) => {
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('card');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');

        const img = document.createElement('img');

        // Validamos que sea una URL funcional para que no tire error
        if (isValidURL(product.thumbnail)) {
            img.src = product.thumbnail;
        } else {
            img.src = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";
        }

        img.alt = product.title;

        const textContainer = document.createElement('div');
        const title = document.createElement('h3');
        title.innerText = product.title;

        const price = document.createElement('h2');
        price.innerText = `$${product.price}`;

        const description = document.createElement('p');
        description.innerText = product.description;

        const stock = document.createElement('p');
        stock.classList.add('stock');
        stock.innerText = `Stock: ${product.stock}`;

        textContainer.appendChild(title);
        textContainer.appendChild(price);
        textContainer.appendChild(description);
        textContainer.appendChild(stock);

        card.appendChild(imgContainer);
        card.appendChild(textContainer);
        imgContainer.appendChild(img);

        productsContainer.append(card);
    });
});

// Función para checar la URL ya que da error si no es válida
function isValidURL(urlString) {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
}