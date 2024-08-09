let itemContainer = document.querySelector("#item-container");
let listproducts = [];

const fetchProducts = async () => {
  const data = await fetch("./data/product.json");

  if (!data.ok) {
    throw new Error("Products not found");
  }

  const products = await data.json();
  localStorage.setItem("products", JSON.stringify(products));
  createItem(products);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-GB', { minimumFractionDigits: 2, minimumFractionDigits: 2, style: 'currency', currency: 'GBP' }).format(
    price / 100,
  );
}

const sortItems = (selector) => {
  let products = JSON.parse(localStorage.getItem('products'));
  let sort = localStorage.getItem(selector);
  let productAttribute = selector.substring(selector.indexOf("_") + 1);
  let activeSortSelect = "#b" + productAttribute.charAt(0).toUpperCase() + productAttribute.slice(1);
  localStorage.setItem(selector, sort);
  let direction = "";

  products["product_arr"].sort((a, b) => {
    if (sort == 1) {
      if (selector == "sort_savings") {
        if ((a.was_price - a.price) > (b.was_price - b.price)) {
          return -1;
        }
      } else {
        if (a[productAttribute] > b[productAttribute]) {
          return -1;
        }
      }
      direction = "up";
    } else {
      if (selector == "sort_savings") {
        if ((a.was_price - a.price) < (b.was_price - b.price)) {
          return -1;
        }
      } else {
        if (a[productAttribute] < b[productAttribute]) {
          return -1;
        }
      }
      direction = "down";
    }
    return 0;
  });

  if (sort == 1) {
    sort = 0;
  } else {
    sort = 1;
  }

  localStorage.setItem(selector, sort);
  itemContainer.innerHTML = '';
  activeSort(activeSortSelect);
  sortDirection(activeSortSelect, direction);
  createItem(products);
}

// Deprecated to be removed
const sortPrice = () => {
  let products = JSON.parse(localStorage.getItem('products'));
  let sort = localStorage.getItem("sort_price"); // Toggle sort direction
  localStorage.setItem("sort_price", sort);

  let selector = "sort_price";

  products["product_arr"].sort((a, b) => {
    if (sort == 1) {
      if (a['price'] > b['price']) {
        return -1;
      }
    } else {
      if (a['price'] < b['price']) {
        return -1;
      }
    }
    return 0;
  });

  if (sort == 1) {
    sort = 0;
  } else {
    sort = 1;
  }

  localStorage.setItem("sort_price", sort);
  itemContainer.innerHTML = '';
  activeSort("#bPrice");
  createItem(products);
}

// Deprecated to be removed
const sortReview = () => {
  let products = JSON.parse(localStorage.getItem('products'));
  let sort = localStorage.getItem("sort_review"); // Toggle sort direction
  localStorage.setItem("sort_review", sort);
  products["product_arr"].sort((a, b) => {
    if (sort == 1) {
      if (a.reviews > b.reviews) {
        return -1;
      }
    } else {
      if (a.reviews < b.reviews) {
        return -1;
      }
    }
    return 0;
  });

  if (sort == 1) {
    sort = 0;
  } else {
    sort = 1;
  }

  localStorage.setItem("sort_review", sort);
  itemContainer.innerHTML = '';
  activeSort("#bReview");
  createItem(products);
}

// Deprecated to be removed
const sortName = () => {
  let products = JSON.parse(localStorage.getItem('products'));
  let sort = localStorage.getItem("sort_name"); // Toggle sort direction
  localStorage.setItem("sort_name", sort);

  products["product_arr"].sort((a, b) => {
    if (sort == 1) {
      if (a.name > b.name) {
        return -1;
      }
    } else {
      if (a.name < b.name) {
        return -1;
      }
    }
    return 0;
  });

  if (sort == 1) {
    sort = 0;
  } else {
    sort = 1;
  }

  localStorage.setItem("sort_name", sort);
  itemContainer.innerHTML = '';
  activeSort("#bName");
  createItem(products);
}

// Deprecated to be removed
const sortSavings = () => {
  let products = JSON.parse(localStorage.getItem('products'));
  let sort = localStorage.getItem("sort_savings"); // Toggle sort direction
  localStorage.setItem("sort_savings", sort);

  products["product_arr"].sort((a, b) => {
    if (sort == 1) {
      if ((a.was_price - a.price) > (b.was_price - b.price)) {
        return -1;
      }
    } else {
      if ((a.was_price - a.price) < (b.was_price - b.price)) {
        return -1;
      }
    }
    return 0;
  });

  if (sort == 1) {
    sort = 0;
  } else {
    sort = 1;
  }

  localStorage.setItem("sort_savings", sort);
  itemContainer.innerHTML = '';
  activeSort("#bSavings");
  createItem(products);
}

const activeSort = (button) => {
  document.querySelector(button).classList.add("sort-button-active");
  if (button != "#bPrice") document.querySelector("#bPrice").classList.remove("sort-button-active");
  if (button != "#bReviews") document.querySelector("#bReviews").classList.remove("sort-button-active");
  if (button != "#bName") document.querySelector("#bName").classList.remove("sort-button-active");
  if (button != "#bSavings") document.querySelector("#bSavings").classList.remove("sort-button-active");
}

const sortDirection = (selectedButton, direction) => {
  let button = document.querySelector(selectedButton);
  let arrow = document.createElement('i');
  arrow.className = "arrow " + direction;

  let text = button.firstChild;
  let iTag = button.getElementsByTagName('i')[0];

  let buttonsContainer = document.getElementById("item-filters-container");
  let allButtons = buttonsContainer.getElementsByTagName("button")

  for (let i = 0; i < allButtons.length; i++) {
    if (allButtons[i].id != selectedButton.slice(1)) {
      if (allButtons[i].getElementsByTagName('i')[0]) {
        allButtons[i].removeChild(allButtons[i].getElementsByTagName('i')[0]);
      }
    }
  }

  if (iTag) {
    button.innerHTML = '';
    button.appendChild(text);
    button.appendChild(arrow);
  } else {
    button.appendChild(text);
    button.appendChild(arrow);
  }
}

const createItem = (products) => {
  products["product_arr"].forEach(item => {
    let newItem = document.createElement('div');
    let wasPrice = item.was_price ? `Was <span class="">${formatPrice(item.was_price)}</span>` : '';
    let review = item.reviews ? `${item.reviews} Review Score` : '';
    newItem.innerHTML = `
        <div class="item-image-container"><img src="img/${item.img}.jpg" /></div>
        <h3>${item.name}</h3>
        <div class="item-price-container">${formatPrice(item.price)}</div>
        <div class="item-old-price-container">${wasPrice}</div>
        <div class="item-score-container">${review}</div>
        <button class="add-button" onclick="addToBasket('${item.name}')">Add To Basket</button>
      `;

    itemContainer.appendChild(newItem);
  });
}

const addToBasket = (item) => {
  console.log(`${item}, added to basket.`);
}

fetchProducts();