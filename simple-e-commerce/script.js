let sliderOne = document.getElementById("slider-1");
let sliderTwo = document.getElementById("slider-2");
let displayValOne = document.getElementById("range1");
let displayValTwo = document.getElementById("range2");
const minGap = 0;

let allProducts = [];

const fetchedProducts = async () => {
  const loader = document.getElementById("loader");
  const containerElement = document.querySelector(".products");

  loader.style.display = "block";

  try {
    const res = await fetch("https://fakestoreapi.com/products/");
    const data = await res.json();
    allProducts = data;
    renderProducts(allProducts);
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

  data.forEach((product, index) => {
    const divElement = document.createElement("div");
    divElement.classList.add("product-item");

    const imgElement = document.createElement("img");
    imgElement.src = `images/product-${index + 1}.png`;
    imgElement.onerror = () => {
      imgElement.src = "images/default.png";
    };

    const pTitle = document.createElement("p");
    pTitle.classList.add("title");
    pTitle.innerHTML = product.title;

    const pElement = document.createElement("p");
    pElement.classList.add("description");
    pElement.innerHTML = "description: " + product.description;

    const price = document.createElement("span");
    price.classList.add("price");
    price.innerHTML = "$" + product.price;

    const ratingElement = document.createElement("span");
    ratingElement.classList.add("rating");
    ratingElement.innerHTML = `⭐ ${product.rating.rate}(${product.rating.count})`;

    const bottomInfo = document.createElement("div");
    bottomInfo.classList.add("bottom-info");
    bottomInfo.append(price);
    bottomInfo.append(ratingElement);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerHTML = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = "Delete";

    buttonContainer.append(editButton);
    buttonContainer.append(deleteButton);

    divElement.append(buttonContainer);
    divElement.append(imgElement);
    divElement.append(pTitle);
    divElement.append(pElement);
    divElement.append(bottomInfo);

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
  document.querySelector("#toggle-mode").classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    toggleButton.innerText = "Switch to Dark Mode";
  } else {
    toggleButton.innerText = "Switch to Light Mode";
  }
});
