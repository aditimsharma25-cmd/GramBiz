/* =====================================================
   GRAMBIZ - MAIN JAVASCRIPT
   Frontend working prototype
===================================================== */


/* =====================================================
   GLOBAL STATE
===================================================== */

let language = "en";

let selectedRole = "";

let currentUser =
    JSON.parse(localStorage.getItem("grambizCurrentUser")) || null;


/* =====================================================
   STORAGE HELPERS
===================================================== */

function getUsers(){

    return JSON.parse(
        localStorage.getItem("grambizUsers") || "[]"
    );

}


function saveUsers(users){

    localStorage.setItem(
        "grambizUsers",
        JSON.stringify(users)
    );

}


function getProducts(){

    return JSON.parse(
        localStorage.getItem("grambizProducts") || "[]"
    );

}


function saveProducts(products){

    localStorage.setItem(
        "grambizProducts",
        JSON.stringify(products)
    );

}


function getOrders(){

    return JSON.parse(
        localStorage.getItem("grambizOrders") || "[]"
    );

}


function saveOrders(orders){

    localStorage.setItem(
        "grambizOrders",
        JSON.stringify(orders)
    );

}


/* =====================================================
   LANGUAGE
===================================================== */

function toggleLanguage(){

    language =
        language === "en"
        ? "hi"
        : "en";

    document.querySelectorAll("[data-en]")
        .forEach(element => {

            element.textContent =
                element.getAttribute(
                    "data-" + language
                );

        });

    document.getElementById("languageBtn")
        .textContent =
        language === "en"
        ? "हिंदी"
        : "English";

}


/* =====================================================
   AUTH
===================================================== */

function openAuth(){

    document.getElementById("authModal")
        .classList.remove("hidden");

    showRoleScreen();

}


function closeAuth(){

    document.getElementById("authModal")
        .classList.add("hidden");

}


function showRoleScreen(){

    document.getElementById("roleScreen")
        .classList.remove("hidden");

    document.getElementById("loginScreen")
        .classList.add("hidden");

    document.getElementById("registerScreen")
        .classList.add("hidden");

}


function chooseRole(role){

    selectedRole = role;

    showLogin();

}


function showLogin(){

    if(!selectedRole){

        showRoleScreen();

        return;

    }

    document.getElementById("roleScreen")
        .classList.add("hidden");

    document.getElementById("loginScreen")
        .classList.remove("hidden");

    document.getElementById("registerScreen")
        .classList.add("hidden");


    const seller =
        selectedRole === "seller";


    document.getElementById("loginRoleIcon")
        .textContent =
        seller ? "👩‍🌾" : "🛍️";


    document.getElementById("loginTitle")
        .textContent =
        seller
        ? "Seller Login"
        : "Buyer Login";

}


function showRegister(){

    document.getElementById("roleScreen")
        .classList.add("hidden");

    document.getElementById("loginScreen")
        .classList.add("hidden");

    document.getElementById("registerScreen")
        .classList.remove("hidden");


    const seller =
        selectedRole === "seller";


    document.getElementById("registerRoleIcon")
        .textContent =
        seller ? "👩‍🌾" : "🛍️";


    document.getElementById("registerTitle")
        .textContent =
        seller
        ? "Create Seller Account"
        : "Create Buyer Account";


    document.getElementById("sellerFields")
        .classList.toggle(
            "hidden",
            !seller
        );


    document.getElementById("buyerFields")
        .classList.toggle(
            "hidden",
            seller
        );

}


function backToRole(){

    selectedRole = "";

    showRoleScreen();

}


/* =====================================================
   REGISTER
===================================================== */

function register(event){

    event.preventDefault();


    const name =
        document.getElementById("regName")
        .value.trim();

    const mobile =
        document.getElementById("regMobile")
        .value.trim();

    const email =
        document.getElementById("regEmail")
        .value.trim()
        .toLowerCase();

    const password =
        document.getElementById("regPassword")
        .value;

    const confirmPassword =
        document.getElementById("confirmPassword")
        .value;


    if(password !== confirmPassword){

        alert("Passwords do not match.");

        return;

    }


    const users = getUsers();


    const duplicate =
        users.find(
            user =>
            user.email === email ||
            user.mobile === mobile
        );


    if(duplicate){

        alert(
            "An account with this email or mobile already exists."
        );

        return;

    }


    const user = {

        id:
            "U" +
            Date.now(),

        role:
            selectedRole,

        name:
            name,

        mobile:
            mobile,

        email:
            email,

        password:
            password

    };


    if(selectedRole === "seller"){

        user.businessName =
            document.getElementById(
                "businessName"
            ).value.trim();

        user.gstin =
            document.getElementById(
                "gstin"
            ).value.trim();

        user.category =
            document.getElementById(
                "businessCategory"
            ).value;

        user.location =
            document.getElementById(
                "businessLocation"
            ).value.trim();


        if(!user.businessName){

            alert(
                "Please enter your business name."
            );

            return;

        }

    }


    if(selectedRole === "buyer"){

        user.address =
            document.getElementById(
                "buyerAddress"
            ).value.trim();

        user.city =
            document.getElementById(
                "buyerCity"
            ).value.trim();

        user.state =
            document.getElementById(
                "buyerState"
            ).value.trim();

        user.pin =
            document.getElementById(
                "buyerPin"
            ).value.trim();

    }


    users.push(user);

    saveUsers(users);


    currentUser = user;

    localStorage.setItem(
        "grambizCurrentUser",
        JSON.stringify(user)
    );


    closeAuth();

    openCorrectDashboard();

}


/* =====================================================
   LOGIN
===================================================== */

function login(event){

    event.preventDefault();


    const identifier =
        document.getElementById(
            "loginIdentifier"
        ).value.trim()
        .toLowerCase();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    const users = getUsers();


    const user =
        users.find(
            item =>

            (
                item.email === identifier ||
                item.mobile === identifier
            )

            &&

            item.password === password

            &&

            item.role === selectedRole

        );


    if(!user){

        alert(
            "Invalid email/mobile, password or account type."
        );

        return;

    }


    currentUser = user;


    localStorage.setItem(
        "grambizCurrentUser",
        JSON.stringify(user)
    );


    closeAuth();

    openCorrectDashboard();

}


/* =====================================================
   DASHBOARD OPEN
===================================================== */

function openCorrectDashboard(){

    document.getElementById("sellerDashboard")
        .classList.add("hidden");

    document.getElementById("buyerDashboard")
        .classList.add("hidden");


    document.querySelector("body")
        .scrollIntoView();


    if(currentUser.role === "seller"){

        document.getElementById(
            "sellerDashboard"
        ).classList.remove("hidden");

        setupSellerDashboard();

    }else{

        document.getElementById(
            "buyerDashboard"
        ).classList.remove("hidden");

        setupBuyerDashboard();

    }

}


function logout(){

    currentUser = null;

    localStorage.removeItem(
        "grambizCurrentUser"
    );


    document.getElementById(
        "sellerDashboard"
    ).classList.add("hidden");

    document.getElementById(
        "buyerDashboard"
    ).classList.add("hidden");


    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}


/* =====================================================
   SELLER DASHBOARD
===================================================== */

function setupSellerDashboard(){

    document.getElementById(
        "sellerWelcome"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "profileSellerName"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "profileBusinessName"
    ).textContent =
        currentUser.businessName;


    document.getElementById(
        "profileMobile"
    ).textContent =
        currentUser.mobile;


    document.getElementById(
        "profileEmail"
    ).textContent =
        currentUser.email;


    document.getElementById(
        "profileGSTIN"
    ).textContent =
        currentUser.gstin || "Not provided";


    document.getElementById(
        "profileLocation"
    ).textContent =
        currentUser.location || "Not provided";


    updateSellerStats();

    renderSellerProducts();

    renderSellerOrders();

}


function sellerSection(section){

    const sections = [

        "sellerOverview",
        "sellerCatalog",
        "sellerOrders",
        "sellerPayments",
        "sellerLogistics",
        "sellerProfile",
        "sellerSupport"

    ];


    sections.forEach(id => {

        document.getElementById(id)
            .classList.add("hidden");

    });


    const map = {

        overview:
            "sellerOverview",

        catalog:
            "sellerCatalog",

        orders:
            "sellerOrders",

        payments:
            "sellerPayments",

        logistics:
            "sellerLogistics",

        profile:
            "sellerProfile",

        support:
            "sellerSupport"

    };


    document.getElementById(
        map[section]
    ).classList.remove("hidden");


    if(section === "catalog"){

        renderSellerProducts();

    }


    if(section === "orders"){

        renderSellerOrders();

    }

}


/* =====================================================
   SELLER PRODUCT FORM
===================================================== */

let selectedImages = [];


function openProductForm(){

    document.getElementById(
        "productModal"
    ).classList.remove("hidden");

}


function closeProductForm(){

    document.getElementById(
        "productModal"
    ).classList.add("hidden");

    selectedImages = [];

    document.getElementById(
        "imagePreview"
    ).innerHTML = "";

}


/* IMAGE PREVIEW */

document.addEventListener(
    "change",
    function(event){

        if(
            event.target.id !==
            "productImages"
        ){

            return;

        }


        selectedImages = [];


        const files =
            Array.from(
                event.target.files
            );


        if(files.length > 5){

            alert(
                "You can upload maximum 5 images."
            );

            event.target.value = "";

            return;

        }


        const preview =
            document.getElementById(
                "imagePreview"
            );


        preview.innerHTML = "";


        files.forEach(file => {

            const reader =
                new FileReader();


            reader.onload =
                function(e){

                    selectedImages.push(
                        e.target.result
                    );


                    const img =
                        document.createElement(
                            "img"
                        );

                    img.src =
                        e.target.result;

                    preview.appendChild(img);

                };


            reader.readAsDataURL(file);

        });

    }
);


/* ADD PRODUCT */

function addProduct(event){

    event.preventDefault();


    if(
        selectedImages.length === 0
    ){

        alert(
            "Please upload at least one product image."
        );

        return;

    }


    const product = {

        id:
            "P" +
            Date.now(),

        sellerId:
            currentUser.id,

        sellerName:
            currentUser.businessName,

        sellerOwner:
            currentUser.name,

        location:
            currentUser.location || "",

        name:
            document.getElementById(
                "productName"
            ).value.trim(),

        category:
            document.getElementById(
                "productCategory"
            ).value,

        description:
            document.getElementById(
                "productDescription"
            ).value.trim(),

        price:
            Number(
                document.getElementById(
                    "productPrice"
                ).value
            ),

        stock:
            Number(
                document.getElementById(
                    "productStock"
                ).value
            ),

        weight:
            document.getElementById(
                "productWeight"
            ).value.trim(),

        images:
            selectedImages,

        active:
            true,

        createdAt:
            new Date().toISOString()

    };


    const products =
        getProducts();


    products.push(product);

    saveProducts(products);


    closeProductForm();

    document.querySelector(
        "#productModal form"
    ).reset();


    renderProducts();

    renderSellerProducts();

    updateSellerStats();


    alert(
        "✅ Product published successfully!"
    );

}


/* =====================================================
   SELLER PRODUCTS
===================================================== */

function renderSellerProducts(){

    const container =
        document.getElementById(
            "sellerProductList"
        );


    const products =
        getProducts().filter(
            product =>
            product.sellerId === currentUser.id
        );


    if(products.length === 0){

        container.innerHTML = `

            <div class="dash-panel">

                <h3>📦 Your catalog is empty</h3>

                <p>
                    Add your first product to start selling.
                </p>

                <button
                    class="primary-btn"
                    onclick="openProductForm()">

                    + Add Product

                </button>

            </div>

        `;

        return;

    }


    container.innerHTML =
        products.map(product => `

            <div class="seller-product-card">

                <img
                    src="${product.images[0]}"
                    alt="${escapeHTML(product.name)}">

                <div class="seller-product-body">

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>

                    <p>
                        ₹${product.price}
                    </p>

                    <p>
                        Stock: ${product.stock}
                    </p>

                    <p>
                        ${product.active
                            ? "🟢 Published"
                            : "⚪ Hidden"}
                    </p>


                    <div class="seller-product-actions">

                        <button
                            class="hide-btn"
                            onclick="toggleProduct('${product.id}')">

                            ${product.active
                                ? "Hide"
                                : "Publish"}

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteProduct('${product.id}')">

                            Delete

                        </button>

                    </div>

                </div>

            </div>

        `).join("");

}


function toggleProduct(id){

    const products =
        getProducts();


    const product =
        products.find(
            item => item.id === id
        );


    if(!product) return;


    product.active =
        !product.active;


    saveProducts(products);


    renderProducts();

    renderSellerProducts();

}


function deleteProduct(id){

    if(
        !confirm(
            "Delete this product?"
        )
    ){

        return;

    }


    let products =
        getProducts();


    products =
        products.filter(
            product =>
            product.id !== id
        );


    saveProducts(products);


    renderProducts();

    renderSellerProducts();

    updateSellerStats();

}


/* =====================================================
   SELLER STATS
===================================================== */

function updateSellerStats(){

    const products =
        getProducts().filter(
            p =>
            p.sellerId === currentUser.id
        );


    const orders =
        getOrders().filter(
            o =>
            o.sellerId === currentUser.id
        );


    const revenue =
        orders.reduce(
            (sum, order) =>
            sum + order.total,
            0
        );


    document.getElementById(
        "sellerProductCount"
    ).textContent =
        products.length;


    document.getElementById(
        "sellerOrderCount"
    ).textContent =
        orders.length;


    document.getElementById(
        "sellerRevenue"
    ).textContent =
        "₹" + revenue;


    document.getElementById(
        "sellerCustomers"
    ).textContent =
        new Set(
            orders.map(
                order =>
                order.buyerId
            )
        ).size;


    document.getElementById(
        "paymentTotal"
    ).textContent =
        "₹" + revenue;


    document.getElementById(
        "paymentCompleted"
    ).textContent =
        "₹" + revenue;

}


/* =====================================================
   SELLER ORDERS
===================================================== */

function renderSellerOrders(){

    const container =
        document.getElementById(
            "sellerOrdersList"
        );


    const orders =
        getOrders().filter(
            order =>
            order.sellerId === currentUser.id
        );


    if(orders.length === 0){

        container.innerHTML = `

            <div class="dash-panel">

                <h3>📦 No orders yet</h3>

                <p>
                    Your customer orders will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        orders.map(order => `

            <div class="order-card">

                <div>

                    <strong>
                        ${order.id}
                    </strong>

                    <br>

                    <span>
                        Customer:
                        ${escapeHTML(order.buyerName)}
                    </span>

                    <br>

                    <span>
                        ${order.items.length}
                        product(s)
                    </span>

                </div>


                <div>

                    <strong>
                        ₹${order.total}
                    </strong>

                    <br>

                    <span class="order-status">
                        ${order.status}
                    </span>

                </div>

            </div>

        `).join("");

}


/* =====================================================
   BUYER DASHBOARD
===================================================== */

function setupBuyerDashboard(){

    document.getElementById(
        "buyerWelcome"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "buyerProfileName"
    ).textContent =
        currentUser.name;


    document.getElementById(
        "buyerProfileMobile"
    ).textContent =
        currentUser.mobile;


    document.getElementById(
        "buyerProfileEmail"
    ).textContent =
        currentUser.email;


    document.getElementById(
        "buyerProfileAddress"
    ).textContent =

        [
            currentUser.address,
            currentUser.city,
            currentUser.state,
            currentUser.pin

        ]
        .filter(Boolean)
        .join(", ");


    updateBuyerStats();

}


function buyerSection(section){

    const sections = [

        "buyerHome",
        "buyerOrders",
        "buyerCart",
        "buyerProfile",
        "buyerSupport"

    ];


    sections.forEach(id => {

        document.getElementById(id)
            .classList.add("hidden");

    });


    const map = {

        home:"buyerHome",

        orders:"buyerOrders",

        cart:"buyerCart",

        profile:"buyerProfile",

        support:"buyerSupport"

    };


    document.getElementById(
        map[section]
    ).classList.remove("hidden");


    if(section === "orders"){

        renderBuyerOrders();

    }


    if(section === "cart"){

        renderCart();

    }

}


/* =====================================================
   BUYER STATS
===================================================== */

function getCart(){

    return JSON.parse(
        localStorage.getItem(
            "grambizCart_" +
            currentUser.id
        ) || "[]"
    );

}


function saveCart(cart){

    localStorage.setItem(
        "grambizCart_" +
        currentUser.id,
        JSON.stringify(cart)
    );

}


function updateBuyerStats(){

    const cart =
        getCart();


    const orders =
        getOrders().filter(
            order =>
            order.buyerId === currentUser.id
        );


    document.getElementById(
        "buyerCartCount"
    ).textContent =
        cart.length;


    document.getElementById(
        "buyerOrderCount"
    ).textContent =
        orders.length;

}


/* =====================================================
   MARKETPLACE
===================================================== */

function renderProducts(){

    const grid =
        document.getElementById(
            "productGrid"
        );


    const search =
        document.getElementById(
            "searchBox"
        ).value
        .toLowerCase();


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    let products =
        getProducts().filter(
            product =>
            product.active
        );


    products =
        products.filter(
            product => {

                const matchesSearch =

                    product.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.description
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =

                    category === "all"
                    ||
                    product.category === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    if(products.length === 0){

        grid.innerHTML = `

            <div class="dash-panel"
                 style="grid-column:1/-1;text-align:center">

                <h3>
                    🌾 No products found
                </h3>

                <p>
                    Sellers can add products to make them appear here.
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML =
        products.map(product => `

            <div class="product-card">

                <div class="product-image">

                    <img
                        src="${product.images[0]}"
                        alt="${escapeHTML(product.name)}">

                </div>


                <div class="product-info">

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>

                    <div class="product-seller">
                        🏪
                        ${escapeHTML(product.sellerName)}
                    </div>

                    <div class="product-location">
                        📍
                        ${escapeHTML(product.location || "India")}
                    </div>

                    <div class="product-price">
                        ₹${product.price}
                    </div>


                    <div class="product-actions">

                        <button
                            class="view-btn"
                            onclick="viewProduct('${product.id}')">

                            View

                        </button>

                        <button
                            class="cart-btn"
                            onclick="addToCart('${product.id}')">

                            🛒 Add

                        </button>

                    </div>

                </div>

            </div>

        `).join("");

}


/* =====================================================
   PRODUCT DETAILS
===================================================== */

function viewProduct(id){

    const product =
        getProducts().find(
            p => p.id === id
        );


    if(!product) return;


    document.getElementById(
        "productDetailsContent"
    ).innerHTML = `

        <div class="details-layout">

            <img
                class="details-image"
                src="${product.images[0]}"
                alt="${escapeHTML(product.name)}">


            <div class="details-content">

                <h1>
                    ${escapeHTML(product.name)}
                </h1>

                <p>
                    ${escapeHTML(product.category)}
                </p>

                <div class="big-price">
                    ₹${product.price}
                </div>

                <p>
                    ${escapeHTML(product.description)}
                </p>


                <div class="details-seller">

                    <strong>
                        🏪 ${escapeHTML(product.sellerName)}
                    </strong>

                    <br>

                    <small>
                        👤 ${escapeHTML(product.sellerOwner)}
                    </small>

                    <br>

                    <small>
                        📍 ${escapeHTML(product.location || "India")}
                    </small>

                </div>


                <p>
                    📦 Stock:
                    ${product.stock}
                </p>

                <p>
                    ⚖️ Weight:
                    ${escapeHTML(product.weight || "Not specified")}
                </p>


                <br>


                <button
                    class="primary-btn"
                    onclick="addToCart('${product.id}');closeProductDetails()">

                    🛒 Add to Cart

                </button>

            </div>

        </div>

    `;


    document.getElementById(
        "productDetailsModal"
    ).classList.remove("hidden");

}


function closeProductDetails(){

    document.getElementById(
        "productDetailsModal"
    ).classList.add("hidden");

}


/* =====================================================
   CART
===================================================== */

function addToCart(productId){

    if(!currentUser){

        alert(
            "Please login as a Buyer to add products to cart."
        );

        openAuth();

        return;

    }


    if(currentUser.role !== "buyer"){

        alert(
            "Only buyers can add products to cart."
        );

        return;

    }


    const product =
        getProducts().find(
            p => p.id === productId
        );


    if(!product) return;


    const cart =
        getCart();


    const existing =
        cart.find(
            item =>
            item.productId === productId
        );


    if(existing){

        existing.quantity++;

    }else{

        cart.push({

            productId:
                product.id,

            name:
                product.name,

            price:
                product.price,

            sellerId:
                product.sellerId,

            sellerName:
                product.sellerName,

            quantity:
                1

        });

    }


    saveCart(cart);

    updateBuyerStats();


    alert(
        "🛒 Product added to your cart."
    );

}


/* =====================================================
   CART RENDER
===================================================== */

function renderCart(){

    const container =
        document.getElementById(
            "cartList"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    const cart =
        getCart();


    if(cart.length === 0){

        container.innerHTML = `

            <div class="dash-panel">

                <h3>
                    🛒 Your cart is empty
                </h3>

                <p>
                    Explore the marketplace and add products.
                </p>

            </div>

        `;

        totalElement.innerHTML = "";

        return;

    }


    container.innerHTML =
        cart.map(
            (item,index) => `

            <div class="cart-item">

                <div>

                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <br>

                    <span>
                        ₹${item.price}
                        × ${item.quantity}
                    </span>

                </div>


                <div>

                    <strong>
                        ₹${item.price * item.quantity}
                    </strong>

                    <br>

                    <button
                        onclick="removeFromCart(${index})">

                        Remove

                    </button>

                </div>

            </div>

        `
        ).join("");


    const total =
        cart.reduce(
            (sum,item) =>
            sum +
            item.price *
            item.quantity,
            0
        );


    totalElement.innerHTML = `

        Total: ₹${total}

        <br><br>

        <button
            class="primary-btn"
            onclick="checkout()">

            💳 Checkout

        </button>

    `;

}


function removeFromCart(index){

    const cart =
        getCart();


    cart.splice(
        index,
        1
    );


    saveCart(cart);

    updateBuyerStats();

    renderCart();

}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout(){

    const cart =
        getCart();


    if(cart.length === 0){

        alert(
            "Your cart is empty."
        );

        return;

    }


    const orders =
        getOrders();


    const sellerGroups = {};


    cart.forEach(item => {

        if(
            !sellerGroups[item.sellerId]
        ){

            sellerGroups[item.sellerId] = [];

        }

        sellerGroups[item.sellerId]
            .push(item);

    });


    Object.keys(
        sellerGroups
    ).forEach(
        sellerId => {

            const items =
                sellerGroups[sellerId];


            const total =
                items.reduce(
                    (sum,item) =>
                    sum +
                    item.price *
                    item.quantity,
                    0
                );


            orders.push({

                id:
                    "GB" +
                    Math.floor(
                        Math.random() *
                        90000 +
                        10000
                    ),

                buyerId:
                    currentUser.id,

                buyerName:
                    currentUser.name,

                sellerId:
                    sellerId,

                sellerName:
                    items[0].sellerName,

                items:
                    items,

                total:
                    total,

                status:
                    "Order Placed",

                createdAt:
                    new Date().toISOString()

            });

        }
    );


    saveOrders(orders);


    saveCart([]);

    updateBuyerStats();

    alert(
        "🎉 Order placed successfully!"
    );


    buyerSection("orders");

}


/* =====================================================
   BUYER ORDERS
===================================================== */

function renderBuyerOrders(){

    const container =
        document.getElementById(
            "buyerOrdersList"
        );


    const orders =
        getOrders().filter(
            order =>
            order.buyerId === currentUser.id
        );


    if(orders.length === 0){

        container.innerHTML = `

            <div class="dash-panel">

                <h3>
                    📦 No orders yet
                </h3>

                <p>
                    Your orders will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        orders.map(
            order => `

            <div class="order-card">

                <div>

                    <strong>
                        ${order.id}
                    </strong>

                    <br>

                    <span>
                        Seller:
                        ${escapeHTML(order.sellerName)}
                    </span>

                    <br>

                    <span>
                        ${order.items.length}
                        product(s)
                    </span>

                </div>


                <div>

                    <strong>
                        ₹${order.total}
                    </strong>

                    <br>

                    <span class="order-status">
                        🚚 ${order.status}
                    </span>

                </div>

            </div>

        `
        ).join("");

}


/* =====================================================
   SUPPORT
===================================================== */

function submitSupport(){

    const name =
        document.getElementById(
            "supportName"
        ).value.trim();


    const message =
        document.getElementById(
            "supportMessage"
        ).value.trim();


    if(!name || !message){

        alert(
            "Please enter your name and message."
        );

        return;

    }


    alert(
        "✅ Your support request has been submitted."
    );

}


/* =====================================================
   SCROLL
===================================================== */

function scrollToMarketplace(){

    document.getElementById(
        "marketplace"
    ).scrollIntoView({
        behavior:"smooth"
    });

}


/* =====================================================
   SECURITY HELPER FOR DISPLAY
===================================================== */

function escapeHTML(value){

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        renderProducts();


        if(currentUser){

            openCorrectDashboard();

        }

    }
);
