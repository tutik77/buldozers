const API_URL = 'http://localhost:8000/products';


async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to load products");
        const products = await response.json();
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image_path}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.info}</p>
                <p>Price: ${product.price}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error(error);
    }
}


document.getElementById('product-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const info = document.getElementById('info').value;
    const image_url = document.getElementById('image_path').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, info, image_path })
        });
        if (!response.ok) throw new Error("Failed to add product");
        alert("Product added successfully!");
        loadProducts();
    } catch (error) {
        console.error(error);
    }
});

async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Failed to delete product");
        alert("Product deleted successfully!");
        loadProducts();
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('support-btn').addEventListener('click', () => {
    const supportFormContainer = document.getElementById('support-form-container');
    supportFormContainer.style.display = supportFormContainer.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('support-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const question = {
        name: document.getElementById('support-name').value,
        email: document.getElementById('support-email').value,
        message: document.getElementById('support-message').value
    };

    try {
        const response = await fetch('http://localhost:8000/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(question)
        });
        if (response.ok) {
            alert("Ваш запрос отправлен в поддержку!");
            document.getElementById('support-form').reset();
            document.getElementById('support-form-container').style.display = 'none';
        } else {
            alert("Ошибка при отправке запроса.");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});