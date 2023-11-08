const users = document.getElementById("users")
const products = document.getElementById("products")
const logOut = document.getElementById("Logout")

users.addEventListener("click", function () {
    window.location.href = "user.html";
})
products.addEventListener("click", function () {
    window.location.href = "products.html";
})
logOut.addEventListener("click", function () {
    window.location.href = "index.html";
})

window.addEventListener("load", function () {
    if (!this.localStorage.getItem("userId")) {
        window.location.href = "index.html";
    }
})