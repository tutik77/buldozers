const API_URL = 'http://localhost:8000/products';

document.getElementById('add-product-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const newProduct = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        info: document.getElementById('product-info').value,
        image_path: document.getElementById('product-image-url').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        if (response.ok) {
            loadProducts(); // Перезагружаем список продуктов
        }
    } catch (error) {
        console.error("Ошибка при добавлении продукта:", error);
    }
});

async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Не удалось загрузить продукты");
        const products = await response.json();

        const productList = document.getElementById('product-list');
        productList.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image_path}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.info}</p>
                <p>Цена: ${product.price}₽</p>
                <button onclick="deleteProduct(${product.id})">Удалить</button>
            </div>
        `).join('');
    } catch (error) {
        console.error(error);
    }
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            loadProducts(); // Перезагружаем список продуктов после удаления
        }
    } catch (error) {
        console.error("Ошибка при удалении продукта:", error);
    }
}

async function loadSupportRequests() {
    try {
        const response = await fetch('http://localhost:8000/support');
        if (!response.ok) throw new Error("Не удалось загрузить обращения");
        
        const supportRequests = await response.json();
        const supportList = document.getElementById('support-list');
        supportList.innerHTML = supportRequests.map(request => `
            <div class="support-card">
                <h3>${request.name}</h3>
                <p><strong>Email:</strong> ${request.email}</p>
                <p>${request.message}</p>
                <button onclick="deleteSupportRequest(${request.id})">Удалить</button>
            </div>
        `).join('');
    } catch (error) {
        console.error(error);
    }
}

async function deleteSupportRequest(id) {
    try {
        const response = await fetch(`http://localhost:8000/support/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadSupportRequests(); // Перезагрузка списка обращений
        } else {
            alert("Ошибка при удалении обращения.");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Загружаем обращения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadSupportRequests();
});
