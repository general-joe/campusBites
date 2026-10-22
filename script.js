// -----------------------------------
// 1. GET ELEMENTS FROM HTML
// -----------------------------------

const products = document.querySelectorAll(".product");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const totalAmount = document.querySelector(".total-amount");
const emptyCartMessage = document.querySelector(".empty-cart-message");
const checkoutButton = document.querySelector("#checkout");

// -----------------------------------
// 2. CART STORAGE
// -----------------------------------

const CART_STORAGE_KEY = "campusBitesCart";

const savedCart = localStorage.getItem(CART_STORAGE_KEY);

let cart = savedCart ? JSON.parse(savedCart) : [];

// Save the cart to localStorage.
function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// -----------------------------------
// 3. GET PRODUCT INFORMATION
// -----------------------------------

function getProductDetails(product) {
  const name = product.querySelector("h3").textContent.trim();
  const priceText = product.querySelector("p").textContent;
  const price = Number(priceText.replace("GH₵", "").trim());

  return { name, price };
}

// -----------------------------------
// 4. ADD PRODUCTS TO CART
// -----------------------------------

function addToCart(product) {
  const { name, price } = getProductDetails(product);

  const existingProduct = cart.find((item) => item.name === name);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
}

// Attach click events to the product buttons.
function setupProductButtons() {
  products.forEach((product) => {
    const button = product.querySelector("button");

    button.addEventListener("click", () => {
      addToCart(product);
    });
  });
}

// -----------------------------------
// 5. INCREASE PRODUCT QUANTITY
// -----------------------------------

function increaseQuantity(productName) {
  const item = cart.find((item) => item.name === productName);

  if (!item) return;

  item.quantity++;

  saveCart();
  renderCart();
}

// -----------------------------------
// 6. DECREASE PRODUCT QUANTITY
// -----------------------------------

function decreaseQuantity(productName) {
  const item = cart.find((item) => item.name === productName);

  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {
    removeFromCart(productName);
    return;
  }

  saveCart();
  renderCart();
}

// -----------------------------------
// 7. REMOVE PRODUCT FROM CART
// -----------------------------------

function removeFromCart(productName) {
  cart = cart.filter((item) => item.name !== productName);

  saveCart();
  renderCart();
}

// -----------------------------------
// 8. DISPLAY THE CART
// -----------------------------------

function renderCart() {
  cartItems.innerHTML = "";

  emptyCartMessage.style.display = cart.length === 0 ? "block" : "none";

  cart.forEach((item) => {
    const cartItem = document.createElement("li");
    cartItem.classList.add("cart-item");

    const productInfo = document.createElement("div");

    const productName = document.createElement("strong");
    productName.textContent = item.name;

    const productPrice = document.createElement("p");
    productPrice.textContent = `GH₵${item.price.toFixed(2)}`;

    productInfo.append(productName, productPrice);

    const quantityContainer = document.createElement("div");
    quantityContainer.classList.add("quantity");

    const decreaseButton = document.createElement("button");
    decreaseButton.textContent = "-";
    decreaseButton.setAttribute("aria-label", `Decrease ${item.name} quantity`);

    const quantityText = document.createElement("span");
    quantityText.textContent = item.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", `Increase ${item.name} quantity`);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";

    quantityContainer.append(
      decreaseButton,
      quantityText,
      increaseButton,
      removeButton,
    );

    cartItem.append(productInfo, quantityContainer);
    cartItems.appendChild(cartItem);

    // Connect each button to its own function.
    decreaseButton.addEventListener("click", () => {
      decreaseQuantity(item.name);
    });

    increaseButton.addEventListener("click", () => {
      increaseQuantity(item.name);
    });

    removeButton.addEventListener("click", () => {
      removeFromCart(item.name);
    });
  });

  calculateTotal();
  updateCartCount();
}

// -----------------------------------
// 9. CALCULATE TOTAL PRICE
// -----------------------------------

function calculateTotal() {
  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  totalAmount.textContent = total.toFixed(2);
}

// -----------------------------------
// 10. UPDATE CART COUNT
// -----------------------------------

function updateCartCount() {
  const count = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  cartCount.textContent = count;
}

// -----------------------------------
// 11. CREATE AND PRINT RECEIPT
// -----------------------------------

function printReceipt() {
  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-GH");
  const formattedTime = date.toLocaleTimeString("en-GH");

  let receiptItems = "";

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;

    receiptItems += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>GH₵${item.price.toFixed(2)}</td>
        <td>GH₵${subtotal.toFixed(2)}</td>
      </tr>
    `;
  });

  const receiptWindow = window.open("", "_blank", "width=700,height=800");

  if (!receiptWindow) {
    alert("Please allow pop-ups to print the receipt.");
    return;
  }

  receiptWindow.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Campus Bites Receipt</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 700px;
            margin: 40px auto;
            padding: 20px;
            color: #222;
          }

          .receipt-header {
            text-align: center;
            margin-bottom: 30px;
          }

          .receipt-header h1 {
            margin-bottom: 5px;
          }

          .receipt-header p {
            margin: 4px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
          }

          th, td {
            border-bottom: 1px solid #ddd;
            padding: 12px 8px;
            text-align: left;
          }

          th {
            background: #f5f5f5;
          }

          .total {
            text-align: right;
            font-size: 22px;
            font-weight: bold;
            margin-top: 25px;
          }

          .thank-you {
            text-align: center;
            margin-top: 40px;
          }

          @media print {
            body {
              margin: 0;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt-header">
          <h1>Campus Bites</h1>
          <h2>Sales Receipt</h2>
          <p>Date: ${formattedDate}</p>
          <p>Time: ${formattedTime}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            ${receiptItems}
          </tbody>
        </table>

        <div class="total">
          Total: GH₵${total.toFixed(2)}
        </div>

        <div class="thank-you">
          <p>Thank you for shopping with Campus Bites!</p>
          <p>Please come again.</p>
        </div>
      </body>
    </html>
  `);

  receiptWindow.document.close();

  // Clear the cart only after the customer
  // finishes printing or closes the print dialog.
  receiptWindow.onafterprint = () => {
    cart = [];
    saveCart();
    renderCart();
    receiptWindow.close();
  };

  // Wait until the receipt is ready before printing.
  receiptWindow.onload = () => {
    receiptWindow.focus();
    receiptWindow.print();
  };
}

// -----------------------------------
// 12. CHECKOUT
// -----------------------------------

function handleCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  printReceipt();
}

checkoutButton.addEventListener("click", handleCheckout);

// -----------------------------------
// 13. INITIALIZE THE CART
// -----------------------------------

// Attach product button events.
setupProductButtons();

// Restore the saved cart on the screen.
renderCart();
