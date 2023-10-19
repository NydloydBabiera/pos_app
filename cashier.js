// Get references to the modal and buttons
const modal = document.getElementById("myModal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
var modalTitle = document.getElementById("modal-title");
let titleModal = '';
const addUser = document.getElementById("addUser");
var selectedId = 0;

async function fetchData() {
    await fetch(`http://localhost:5100/transaction/getAllTransaction`) // Replace with your API endpoint
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.querySelector("#apiTable tbody");

            // Iterate through the data and create table rows
            data.forEach((item) => {
                const button = document.createElement("button");
                button.textContent = "Click Me";
                const row = document.createElement("tr");
                row.innerHTML = `
                              <td>${item.transaction_id}</td>
                              <td>${item.transaction_code}</td>
                              <td>${item.date_trans}</td>
                              <td>${item.amt_total}</td>
                              <td><button onClick="onEdit(this)">PAY</button>
                              
                          `;
                tableBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.log("Error fetching data:", error);
        });
}

// // Edit the data
// function onEdit(td) {
//   modalTitle.textContent = "Update Details"
//   modal.style.display = "block";
//   selectedRow = td.parentElement.parentElement;
//   selectedId = selectedRow.cells[0].innerHTML;
//   const fullName = selectedRow.cells[1].innerHTML.split(' ');
//   document.getElementById("fName").value = fullName[0];
//   document.getElementById("mName").value = fullName[1];
//   document.getElementById("lName").value = fullName[2];
//   document.getElementById("userRole").value = selectedRow.cells[3].innerHTML;
//   // openModal();
//   console.log("userRole:",selectedRow.cells[3].innerHTML);
// }

// async function addNewUser(event) {
//   event.preventDefault();
//   const data = {
//     firstName: document.getElementById("fName").value,
//     middleName: document.getElementById("mName").value,
//     lastName: document.getElementById("lName").value,
//     userRole: document.getElementById("userRole").value,
//   };
//   await fetch(`${apiUrl}/user/addUser`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       fetchData();
//       console.log("result:", result);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// // Function to open the modal

// // Function to close the modal
// function closeModal() {
//   modal.style.display = "none";
// }

// // Event listeners for opening and closing the modal
// openModalButton.addEventListener("click", function(){
//   document.getElementById("fName").value = '';
//   document.getElementById("mName").value = '';
//   document.getElementById("lName").value = '';
//   modalTitle.textContent = "New User"
//   modal.style.display = "block";
// } );
// closeModalButton.addEventListener("click", closeModal);
// // addUser.addEventListener("click", addNewUser);
// document.getElementById("addUserForm").addEventListener("submit", addNewUser);
window.addEventListener("load", function () {
    fetchData();
});