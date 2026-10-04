// -----------------------------------
// GET ELEMENTS FROM HTML
// -----------------------------------

const products = document.querySelectorAll(".product");

const cartItems = document.querySelector(".cart-items");

const cartCount = document.querySelector(".cart-count");

const totalAmount = document.querySelector(".total-amount");

const emptyCartMessage = document.querySelector(".empty-cart-message");

const checkoutButton = document.querySelector("#checkout");

// -----------------------------------
// CART STORAGE KEY
// -----------------------------------

// This is the name we will use
// when storing the cart in localStorage.

const CART_STORAGE_KEY = "campusBitesCart";

// -----------------------------------
// LOAD CART FROM LOCAL STORAGE
// -----------------------------------

// Try to get the saved cart from the browser.

const savedCart = localStorage.getItem(CART_STORAGE_KEY);

// If there is a saved cart,
// convert it from JSON back into an array.
//
// If there is no saved cart,
// start with an empty array.

let cart = savedCart ? JSON.parse(savedCart) : [];

// -----------------------------------
// SAVE CART
// -----------------------------------

function saveCart() {
  // localStorage can only store strings.

  // JSON.stringify() converts our
  // JavaScript array into a string.

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// -----------------------------------
// 1. ADD PRODUCTS TO CART
// -----------------------------------

products.forEach((product) => {
  const button = product.querySelector("button");

  button.addEventListener("click", () => {
    // Get product name

    const name = product.querySelector("h3").textContent;

    // Get product price as text

    const priceText = product.querySelector("p").textContent;

    // Convert price from text to number

    const price = Number(priceText.replace("GH₵", "").trim());

    // Check whether this product
    // already exists in the cart.

    const existingProduct = cart.find((item) => item.name === name);

    if (existingProduct) {
      // Product already exists.

      // Increase its quantity.

      existingProduct.quantity++;
    } else {
      // Product does not exist.

      // Add it to the cart.

      cart.push({
        name: name,

        price: price,

        quantity: 1,
      });
    }

    // Save the updated cart
    // to the browser.

    saveCart();

    // Update the screen.

    renderCart();
  });
});

// -----------------------------------
// 2. DISPLAY THE CART
// -----------------------------------

function renderCart() {
  // Remove the old cart items
  // from the screen.

  cartItems.innerHTML = "";

  // Check whether cart is empty.

  if (cart.length === 0) {
    emptyCartMessage.style.display = "block";
  } else {
    emptyCartMessage.style.display = "none";
  }

  // Go through every item in the cart.

  cart.forEach((item, index) => {
    // Create <li>

    const cartItem = document.createElement("li");

    cartItem.classList.add("cart-item");

    // -----------------------------------
    // PRODUCT INFORMATION
    // -----------------------------------

    const productInfo = document.createElement("div");

    productInfo.innerHTML = `

      <strong>${item.name}</strong>

      <p>GH₵${item.price}</p>

    `;

    // -----------------------------------
    // QUANTITY CONTAINER
    // -----------------------------------

    const quantityContainer = document.createElement("div");

    quantityContainer.classList.add("quantity");

    // -----------------------------------
    // DECREASE BUTTON
    // -----------------------------------

    const decreaseButton = document.createElement("button");

    decreaseButton.textContent = "-";

    // -----------------------------------
    // QUANTITY TEXT
    // -----------------------------------

    const quantityText = document.createElement("span");

    quantityText.textContent = item.quantity;

    // -----------------------------------
    // INCREASE BUTTON
    // -----------------------------------

    const increaseButton = document.createElement("button");

    increaseButton.textContent = "+";

    // -----------------------------------
    // REMOVE BUTTON
    // -----------------------------------

    const removeButton = document.createElement("button");

    removeButton.textContent = "Remove";

    // -----------------------------------
    // PUT QUANTITY CONTROLS TOGETHER
    // -----------------------------------

    quantityContainer.appendChild(decreaseButton);

    quantityContainer.appendChild(quantityText);

    quantityContainer.appendChild(increaseButton);

    quantityContainer.appendChild(removeButton);

    // -----------------------------------
    // PUT EVERYTHING INSIDE CART ITEM
    // -----------------------------------

    cartItem.appendChild(productInfo);

    cartItem.appendChild(quantityContainer);

    // -----------------------------------
    // PUT CART ITEM INSIDE <UL>
    // -----------------------------------

    cartItems.appendChild(cartItem);

    // -----------------------------------
    // DECREASE QUANTITY
    // -----------------------------------

    decreaseButton.addEventListener("click", () => {
      item.quantity--;

      // If quantity becomes zero,
      // remove the product.

      if (item.quantity === 0) {
        cart.splice(index, 1);
      }

      // Save the new cart.

      saveCart();

      // Update the screen.

      renderCart();
    });

    // -----------------------------------
    // INCREASE QUANTITY
    // -----------------------------------

    increaseButton.addEventListener("click", () => {
      item.quantity++;

      // Save the new cart.

      saveCart();

      // Update the screen.

      renderCart();
    });

    // -----------------------------------
    // REMOVE PRODUCT
    // -----------------------------------

    removeButton.addEventListener("click", () => {
      cart.splice(index, 1);

      // Save the new cart.

      saveCart();

      // Update the screen.

      renderCart();
    });
  });

  // Update total price.

  calculateTotal();

  // Update cart count.

  updateCartCount();
}

// -----------------------------------
// 3. CALCULATE TOTAL
// -----------------------------------

function calculateTotal() {
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
  });

  totalAmount.textContent = total.toFixed(2);
}

// -----------------------------------
// 4. UPDATE CART COUNT
// -----------------------------------

function updateCartCount() {
  let count = 0;

  cart.forEach((item) => {
    count += item.quantity;
  });

  cartCount.textContent = count;
}

// -----------------------------------
// 5. CREATE RECEIPT
// -----------------------------------

function printReceipt() {
  // Calculate total.

  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Get current date and time.

  const date = new Date();

  const formattedDate = date.toLocaleDateString("en-GH");

  const formattedTime = date.toLocaleTimeString("en-GH");

  // This variable will hold
  // all the rows of the receipt.

  let receiptItems = "";

  // Create one row for each
  // product in the cart.

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

  // Open a new browser window.

  const receiptWindow = window.open("", "_blank", "width=700,height=800");

  // Check whether browser
  // blocked the popup.

  if (!receiptWindow) {
    alert("Please allow pop-ups to print the receipt.");

    return;
  }

  // Put the receipt HTML
  // inside the new window.

  receiptWindow.document.write(`

    <!doctype html>

    <html>

      <head>

        <title>
          Campus Bites Receipt
        </title>


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


          th,
          td {

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

          <p>
            Date: ${formattedDate}
          </p>

          <p>
            Time: ${formattedTime}
          </p>

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

          Total:
          GH₵${total.toFixed(2)}

        </div>


        <div class="thank-you">

          <p>
            Thank you for shopping
            with Campus Bites!
          </p>

          <p>
            Please come again.
          </p>

        </div>


      </body>

    </html>

  `);

  // Finish writing to the new window.

  receiptWindow.document.close();

  // Print after the receipt
  // has loaded.

  receiptWindow.onload = () => {
    receiptWindow.focus();

    receiptWindow.print();
  };

  // When the customer finishes
  // with the print dialog,
  // clear the cart.

  receiptWindow.onafterprint = () => {
    cart = [];

    saveCart();

    renderCart();

    receiptWindow.close();
  };
}

// -----------------------------------
// 6. CHECKOUT
// -----------------------------------

checkoutButton.addEventListener("click", () => {
  // Don't allow checkout
  // when cart is empty.

  if (cart.length === 0) {
    alert("Your cart is empty.");

    return;
  }

  // Generate and print receipt.

  printReceipt();
});

// -----------------------------------
// 7. LOAD CART WHEN PAGE OPENS
// -----------------------------------

// This is very important.
//
// When the page is refreshed,
// cart was loaded from localStorage
// near the beginning of this file.
//
// renderCart() puts that saved
// cart back onto the screen.

renderCart();
