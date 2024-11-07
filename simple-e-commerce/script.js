let sliderOne = document.getElementById("slider-1");
let sliderTwo = document.getElementById("slider-2");
let displayValOne = document.getElementById("range1");
let displayValTwo = document.getElementById("range2");
const minGap = 0;

let allProducts = [];

function populateCategories() {
	const categorySelect = document.getElementById("category-select");
	const categories = Array.from(
		new Set(allProducts.map((product) => product.category))
	); // Get unique categories
	categories.forEach((category) => {
		const option = document.createElement("option");
		option.value = category;
		option.innerText = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize first letter
		categorySelect.appendChild(option);
	});
}

// Function to filter products based on the selected category
function filterByCategory() {
	const selectedCategory = document.getElementById("category-select").value;
	let filteredProducts = allProducts;

	if (selectedCategory !== "all") {
		filteredProducts = allProducts.filter(
			(product) => product.category === selectedCategory
		);
	}

	renderProducts(filteredProducts);
}

const fetchedProducts = async () => {
	const loader = document.getElementById("loader");
	const containerElement = document.querySelector(".products");

	loader.style.display = "block";

	try {
		const res = await fetch("https://fakestoreapi.com/products/");
		const data = await res.json();
		allProducts = data;
		renderProducts(allProducts);
		populateCategories();
	} catch (error) {
		console.log(error);
		const errorMessage = document.createElement("p");
		errorMessage.innerHTML = "Error loading product.";
		containerElement.append(errorMessage);
	} finally {
		loader.style.display = "none";
	}
};

const renderProducts = (data) => {
	const containerElement = document.querySelector(".products");
	containerElement.innerHTML = "";

	data.forEach((product) => {
		const divElement = document.createElement("div");
		divElement.classList.add("product-item");

		const imgElement = document.createElement("img");
		imgElement.src = `images/product-${product.id}.png`;
		imgElement.onerror = () => {
			imgElement.src = "images/default.png";
		};

		const pTitle = document.createElement("p");
		pTitle.classList.add("title");
		pTitle.innerHTML = product.title;

		// Apply 100-character limit to the description with ellipsis if it's too long
		const descriptionText =
			product.description.length > 100
				? product.description.substring(0, 100) + "..."
				: product.description;

		const pElement = document.createElement("p");
		pElement.classList.add("description");
		pElement.innerHTML = ` ${descriptionText}`;

		const price = document.createElement("span");
		price.classList.add("price");
		price.innerHTML = "$" + product.price;

		const ratingElement = document.createElement("span");
		ratingElement.classList.add("rating");
		ratingElement.innerHTML = `⭐ ${product.rating.rate} (${product.rating.count})`;

		const bottomInfo = document.createElement("div");
		bottomInfo.classList.add("bottom-info");
		bottomInfo.append(price);
		bottomInfo.append(ratingElement);

		const buttonContainer = document.createElement("div");
		buttonContainer.classList.add("button-container");

		const editButton = document.createElement("button");
		editButton.classList.add("edit-button");
		editButton.innerHTML = "Edit";
		editButton.onclick = () => openEditModal(product);

		const deleteButton = document.createElement("button");
		deleteButton.classList.add("delete-button");
		deleteButton.innerHTML = "Delete";
		deleteButton.onclick = () => deleteProduct(product.id);

		buttonContainer.append(editButton);
		buttonContainer.append(deleteButton);

		divElement.append(
			buttonContainer,
			imgElement,
			pTitle,
			pElement,
			bottomInfo
		);
		containerElement.append(divElement);
	});
};

function filterProducts() {
	const minPrice = parseFloat(sliderOne.value);
	const maxPrice = parseFloat(sliderTwo.value);
	const filteredProducts = allProducts.filter(
		(product) => product.price >= minPrice && product.price <= maxPrice
	);
	renderProducts(filteredProducts);
}

function openEditModal(product) {
	const modal = document.createElement("div");
	modal.classList.add("modal");
	modal.innerHTML = `
		<div class="modal-content">
			<h2>Edit Product</h2>
			<label>Title:  <input class ="modal-title" type="text" id="edit-title" value="${product.title}"></label>
			<label>Description:  <textarea class="modal-textarea" id="edit-description">${product.description}</textarea></label>
			<label>Price:  <input class="modal-price" type="number" id="edit-price" value="${product.price}"></label>
			<label>Image URL:  <input class="modal-image" type="text" id="edit-image" value="images/product-${product.id}.png"></label>
      <br/>
      <div>
			  <button class="save-edit" onclick="saveEdit(${product.id})">Save</button>
			  <button class="cancel-edit" onclick="closeModal()">Cancel</button>
      </div>
		</div>
	`;
	document.body.append(modal);
}

function closeModal() {
	const modal = document.querySelector(".modal");
	if (modal) {
		modal.remove();
	}
}

function saveEdit(productId) {
	const title = document.getElementById("edit-title").value;
	const description = document.getElementById("edit-description").value;
	const price = document.getElementById("edit-price").value;
	const image = document.getElementById("edit-image").value;

	const productIndex = allProducts.findIndex(
		(product) => product.id === productId
	);
	if (productIndex !== -1) {
		allProducts[productIndex] = {
			...allProducts[productIndex],
			title,
			description,
			price: parseFloat(price),
			image,
		};
		renderProducts(allProducts);
		closeModal();
	}
}

function deleteProduct(productId) {
	if (confirm("Are you sure you want to delete this product?")) {
		allProducts = allProducts.filter((product) => product.id !== productId);
		renderProducts(allProducts);
	}
}

sliderOne.addEventListener("input", () => {
	if (parseInt(sliderOne.value) >= parseInt(sliderTwo.value) - minGap) {
		sliderOne.value = parseInt(sliderTwo.value) - minGap;
	}
	displayValOne.textContent = sliderOne.value;
	filterProducts();
});

sliderTwo.addEventListener("input", () => {
	if (parseInt(sliderTwo.value) <= parseInt(sliderOne.value) + minGap) {
		sliderTwo.value = parseInt(sliderOne.value) + minGap;
	}
	displayValTwo.textContent = sliderTwo.value;
	filterProducts();
});

fetchedProducts();

const toggleButton = document.getElementById("toggle-mode");

toggleButton.addEventListener("click", () => {
	document.body.classList.toggle("light-mode");
	document.querySelector("header").classList.toggle("light-mode");
	document.querySelector("main").classList.toggle("light-mode");
	document.querySelectorAll(".product-item").forEach((item) => {
		item.classList.toggle("light-mode");
	});
	document.querySelectorAll(".title").forEach((item) => {
		item.classList.toggle("light-mode");
	});
	document.querySelectorAll(".description").forEach((item) => {
		item.classList.toggle("light-mode");
	});

	document.querySelector("#toggle-mode").classList.toggle("light-mode");

	if (document.body.classList.contains("light-mode")) {
		toggleButton.innerText = "Switch to Dark Mode";
	} else {
		toggleButton.innerText = "Switch to Light Mode";
	}
});

function filterBySearch() {
	const searchInput = document
		.getElementById("search-input")
		.value.toLowerCase(); // Get the search query and convert it to lowercase
	const filteredProducts = allProducts.filter(
		(product) => product.title.toLowerCase().startsWith(searchInput) // Filter based on the product title starting with the search query
	);

	renderProducts(filteredProducts); // Re-render the filtered products
}
