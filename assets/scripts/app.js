class Product {
  // This is only a blueprint how a product looks like
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    (this.name = attrName), (this.value = attrValue);
  }
}

class Components {

  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);

    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }

    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Components {

  constructor(renderHookId) {
    super(renderHookId, false);
    this.orderProducts = () => {
      console.log("ordering....");
      console.log(this.items);
    }
    this.render();
  }

  items = [];

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(
      2
    )}</h2>`;
  }

  get totalAmount() {
    let sum = this.items.reduce((prevValue, currItem) => {
      return prevValue + currItem.price;
    }, 0);

    return sum;
  }

  addProduct(product) {
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  render() {
    const cartEl = this.createRootElement("section", "cart");

    cartEl.innerHTML = `
       <h2>Total: \$${0}</h2>
       <button>Order now</button>
    `;
    cartEl.className = "cart";
    const orderButton = cartEl.querySelector("button");
    orderButton.addEventListener("click",this.orderProducts);
    this.totalOutput = cartEl.querySelector("h2");
  }
}

class ProductItem extends Components {

  constructor(product, renderHookId) {
    super(renderHookId, false), 
    (this.product = product);
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement("li", "product-item");

    prodEl.innerHTML = `
       <div>
         <img src='${this.product.imageUrl}' alt='${this.product.title}' >
         <div class='product-item__content'>
             <h2>${this.product.title}</h2>
             <h3>\$${this.product.price}</h3>
             <p>${this.product.description}</p>
             <button>Add to cart</button>
         </div>
       </div>
    `;
    const addCartButton = prodEl.querySelector("button");
    addCartButton.addEventListener("click", this.addToCart.bind(this));
  }
}

class ProductList extends Components {

  #products = [];
  // We can not render or use products from Components
  // It is private now, only accessible from inside the class

  constructor(renderHookId) {
    super(renderHookId, false);
    this.render();
    this.fetchProducts();
  }

  fetchProducts() {
    this.#products = [
      new Product(
        "A wonderfull carpet",
        "https://res.cloudinary.com/greenbuildingsupply/image/upload/f_auto,q_auto,c_pad,h_580,w_580/large/Unique-Carpets-Aerial-Plains-Snowdrift-5221-LG.jpg",
        "sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam.",
        56.95
      ),
      new Product(
        "A wonderfull pillar",
        "https://hotelshop.one/media/00/4b/a6/1705994128/premium_daunekissen_luxe_cozy_2.jpg",
        "sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam.",
        897.99
      ),
    ];
    this.renderProducts();
  }

  renderProducts() {
    for (const prod of this.#products) {
      new ProductItem(prod, "prod-list");
    }
  }

  render() {
    const prodList = this.createRootElement("ul", "product-list", [
      new ElementAttribute("id", "prod-list"),
    ]);

    prodList.id = "prod-list";
    if (this.#products && this.#products.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop {
  constructor() {
    this.render();
  }

  render() {
    this.cart = new ShoppingCart("app");
    new ProductList("app");
  }
}

class App {
  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

App.init();
