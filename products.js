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
                modal.style.display = "none"
            })
        }).catch((error) => {
            console.log("Error fetching data:", error);
        })
}


async function addNewProduct(event) {
    event.preventDefault();
    const data = {
        productName: document.getElementById("nameProd").value,
        productDesc: document.getElementById("descProd").value,
        size: document.getElementById("sizeProd").value,
        price: document.getElementById("priceProd").value,
    }
    await fetch(`${apiUrl}/products/addProduct`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
        .then((result) => {
            newRow(result[0])
        }).catch((error) => {
            console.error("Error:", error);
        });
}

function newRow(result) {
    const tableBody = document.querySelector("#apiTable tBody");
    const row = document.createElement("tr");
    row.innerHTML = `
                                        <td>${result.product_id}</td>
                                        <td>${result.name_prod}</td>
                                        <td>${result.description}</td>
                                        <td>${result.prod_size}</td>
                                        <td>${result.price}</td>
                                        <td><button onClick="onEdit(this)">Edit</button> <button>Delete</button></td>
                            `;
    tableBody.appendChild(row);
}

// Function to clear the table rowsz
function clearTable() {
    const table = document.getElementById("apiTable");
    const tbody = table.querySelector("tbody");

    // Remove all rows from the tbody
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

document.getElementById("addProductForm").addEventListener("submit", addNewProduct);

window.addEventListener("load", function () {
    fetchData();
});