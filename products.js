const modal = document.getElementById("myModal")
const openModalButton = document.getElementById("openModal")
const closeModalButton = document.getElementById("closeModal")
var modalTitle = document.getElementById("modal-title")
let titleModal = ''
const addUser = document.getElementById("addUser")


openModalButton.addEventListener("click", function () {
    document.getElementById("nameProd").value = '';
    document.getElementById("descProd").value = '';
    document.getElementById("sizeProd").value = '';
    document.getElementById("priceProd").value = '';
    modalTitle.textContent = "New Product"
    modal.style.display = "block"
})

closeModalButton.addEventListener("click", function () {
    modal.style.display = "none"
})


async function fetchData() {
    await fetch(`${apiUrl}/products/getAllProduct`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.querySelector("#apiTable tBody");

            data.forEach((item) => {
                const button = document.createElement("button");
                button.textContent = "click me"
                const row = document.createElement("tr");
                row.innerHTML = `
                                        <td>${item.product_id}</td>
                                        <td>${item.name_prod}</td>
                                        <td>${item.description}</td>
                                        <td>${item.prod_size}</td>
                                        <td>${item.price}</td>
                                        <td><button onClick="onEdit(this)">Edit</button> <button>Delete</button></td>
                            `;
                tableBody.appendChild(row);
            })
        }).catch((error) => {
            console.log("Error fetching data:", error);
        })
}


async function addNewProduct(event) {
    event.preventDefault();
    const data = {
        firstName: document.getElementById("nameProd").value,
        middleName: document.getElementById("descProd").value,
        lastName: document.getElementById("sizeProd").value,
        userRole: document.getElementById("priceProd").value,
    }
    await fetch(`${apiUrl}/products/addProduct`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }).then((response) => response.json())
        .then((result) => {
            console.log("");
        }).catch((error) => {
            console.error("Error:", error);
        });
}

window.addEventListener("load", function () {
    fetchData();
    console.log(`${apiUrl}/products/getAllProduct`);
});