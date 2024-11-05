document.addEventListener("DOMContentLoaded", () => {
	const container = document.querySelector(".product-container");
	let allProducts = []; // Global variable to hold the fetched products

	const createSkeletonCard = () => {
		const card = document.createElement("div");
		card.classList.add("card", "card--skeleton");
		card.innerHTML = `
            <div class="img-cont" style="height: 200px; background: #ccc; margin-bottom: 1rem;"></div>
            <div class="title" style="height: 2rem; background: #ccc; margin-bottom: 0.5rem;"></div>
            <div class="description" style="height: 1.5rem; background: #ccc; margin-bottom: 0.5rem;"></div>
        `;
		return card;
	};

	const createCard = (product) => {
		const card = document.createElement("div");
		card.classList.add("card");
		card.innerHTML = `
            <img class="lazy" src="${product.image}" alt="${product.title}" 
            style="width: 100%; height: 200px; object-fit: contain; border-radius: 5px; margin-bottom: 1rem;">
            <h3>${product.title}</h3>
            <p class="desc-text">${product.description.substring(0, 100)}...</p>
            <span class="price">${product.price} $</span>
        `;
		return card;
	};

	const fetchProducts = async () => {
		const response = await fetch("https://fakestoreapi.com/products");
		const products = await response.json();
		allProducts = products; // Store the products globally for filtering

		// Create and append skeletons first
		products.forEach(() => {
			const skeleton = createSkeletonCard();
			container.appendChild(skeleton);
		});

		-setTimeout(() => {
			displayProducts(allProducts);
		}, 1000);
	};

	const displayProducts = (products) => {
		container.innerHTML = ""; // Clear existing content
		products.forEach((product) => {
			const card = createCard(product);
			container.appendChild(card);
		});

		new LazyLoad({
			elements_selector: ".lazy",
		});
	};

	// Slider filtering logic
	let sliderOne = document.getElementById("slider-1");
	let sliderTwo = document.getElementById("slider-2");
	let displayValOne = document.getElementById("range1");
	let displayValTwo = document.getElementById("range2");
	const minGap = 0; // Minimum gap between slider values

	function filterProducts() {
		const minPrice = parseFloat(sliderOne.value);
		const maxPrice = parseFloat(sliderTwo.value);
		const filteredProducts = allProducts.filter(
			(product) => product.price >= minPrice && product.price <= maxPrice
		);
		displayProducts(filteredProducts);
	}

	// Event listener for sliderOne
	sliderOne.addEventListener("input", () => {
		if (parseInt(sliderOne.value) >= parseInt(sliderTwo.value) - minGap) {
			sliderOne.value = parseInt(sliderTwo.value) - minGap; // Prevent overlap
		}
		displayValOne.textContent = sliderOne.value;
		filterProducts();
	});

	// Event listener for sliderTwo
	sliderTwo.addEventListener("input", () => {
		if (parseInt(sliderTwo.value) <= parseInt(sliderOne.value) + minGap) {
			sliderTwo.value = parseInt(sliderOne.value) + minGap; // Prevent overlap
		}
		displayValTwo.textContent = sliderTwo.value;
		filterProducts();
	});

	fetchProducts();
});
