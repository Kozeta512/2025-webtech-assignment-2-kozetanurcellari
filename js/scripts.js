document.addEventListener("DOMContentLoaded", function () {

    let cart = [];

    const addButtons = document.querySelectorAll(".add-to-cart");
    const cartBody = document.getElementById("cart-body");
    const itemsCountSpan = document.getElementById("cart-items-count");
    const subtotalSpan = document.getElementById("cart-subtotal");
    const discountSpan = document.getElementById("cart-discount");
    const taxSpan = document.getElementById("cart-tax");
    const totalSpan = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    const cartSection = document.getElementById("cart-section");
    const checkoutSection = document.getElementById("checkout-section");
    const confirmationSection = document.getElementById("confirmation-section");
    const confirmationDetails = document.getElementById("confirmation-details");

    const form = document.getElementById("checkout-form");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const zip = document.getElementById("zip");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const country = document.getElementById("country");

    addButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);

            let existing = cart.find(item => item.id === id);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ id, name, price, qty: 1 });
            }
            updateCart();
        });
    });


    function updateCart() {
        cartBody.innerHTML = "";

        let itemsCount = 0;
        let subtotal = 0;

        cart.forEach((item, index) => {
            itemsCount += item.qty;
            subtotal += item.qty * item.price;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>€${item.price.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" data-index="${index}" data-change="-1">-</button>
                    <span class="mx-2">${item.qty}</span>
                    <button class="btn btn-sm btn-secondary" data-index="${index}" data-change="1">+</button>
                </td>
                <td>€${(item.qty * item.price).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" data-index="${index}" data-remove="true">X</button>
                </td>
            `;
            cartBody.appendChild(row);
        });

    
        let discount = 0;
        if (itemsCount >= 3) {
            discount = subtotal * 0.10;
        }

    
        const taxedBase = subtotal - discount;
        const tax = taxedBase * 0.10;
        const total = taxedBase + tax;

        itemsCountSpan.textContent = itemsCount;
        subtotalSpan.textContent = subtotal.toFixed(2);
        discountSpan.textContent = discount.toFixed(2);
        taxSpan.textContent = tax.toFixed(2);
        totalSpan.textContent = total.toFixed(2);

        checkoutBtn.disabled = cart.length === 0;
    }

    
    cartBody.addEventListener("click", function (e) {
        const btn = e.target;
        const index = btn.dataset.index;

        if (btn.dataset.change) {
            const change = parseInt(btn.dataset.change);
            cart[index].qty += change;
            if (cart[index].qty <= 0) {
                cart.splice(index, 1);
            }
            updateCart();
        }

        if (btn.dataset.remove) {
            cart.splice(index, 1);
            updateCart();
        }
    });

    
    checkoutBtn.addEventListener("click", function () {
        cartSection.classList.add("d-none");
        checkoutSection.classList.remove("d-none");
        location.hash = "#checkout-section";
    });

    
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let valid = true;

        function required(input) {
            if (input.value.trim() === "") {
                input.classList.add("is-invalid");
                valid = false;
            } else {
                input.classList.remove("is-invalid");
            }
        }

        required(fullName);
        required(address);
        required(city);
        required(country);

        
        if (!email.value.includes("@") || !email.value.includes(".")) {
            email.classList.add("is-invalid");
            valid = false;
        } else {
            email.classList.remove("is-invalid");
        }

        
        if (!/^[0-9]+$/.test(phone.value.trim())) {
            phone.classList.add("is-invalid");
            valid = false;
        } else {
            phone.classList.remove("is-invalid");
        }

        
        if (zip.value.trim() === "" || zip.value.trim().length > 6) {
            zip.classList.add("is-invalid");
            valid = false;
        } else {
            zip.classList.remove("is-invalid");
        }

        if (!valid) return;

    
        checkoutSection.classList.add("d-none");
        confirmationSection.classList.remove("d-none");

        const subtotal = parseFloat(subtotalSpan.textContent);
        const discount = parseFloat(discountSpan.textContent);
        const tax = parseFloat(taxSpan.textContent);
        const total = parseFloat(totalSpan.textContent);

        confirmationDetails.innerHTML = `
            <p><strong>Name:</strong> ${fullName.value}</p>
            <p><strong>Email:</strong> ${email.value}</p>
            <p><strong>Address:</strong> ${address.value}, ${zip.value} ${city.value}, ${country.value}</p>
            <hr>
            <p><strong>Subtotal:</strong> €${subtotal.toFixed(2)}</p>
            <p><strong>Discount:</strong> €${discount.toFixed(2)}</p>
            <p><strong>Tax (10%):</strong> €${tax.toFixed(2)}</p>
            <p class="fw-bold"><strong>Total:</strong> €${total.toFixed(2)}</p>
        `;

        
        cart = [];
        updateCart();
    });

});
