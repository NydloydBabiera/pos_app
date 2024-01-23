// Get references to the modal and buttons
const modal = document.getElementById("myModal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
var modalTitle = document.getElementById("modal-title");
let titleModal = "";
const addUser = document.getElementById("addUser");
var selectedId = 0;
var isAdd = true;

async function fetchData() {
  await fetch(`${apiUrl}/user/getAllUsers`) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#apiTable tbody");
      while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
      }
      // Iterate through the data and create table rows
      data.forEach((item) => {
        const button = document.createElement("button");
        button.textContent = "Click Me";
        const row = document.createElement("tr");
        row.innerHTML = `
                              <td>${item.user_id}</td>
                              <td>${item.full_name}</td>
                              <td>${item.username}</td>
                              <td>${item.user_role}</td>
                              <td><button onClick="onEdit(this)">Edit</button> <button onClick="onDelete(this)">Delete</button></td>
                              
                          `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
    });
}

function onDelete(td) {
  selectedRow = td.parentElement.parentElement;
  const fullName = selectedRow.cells[1].innerHTML.split(" ");
  const userId = selectedRow.cells[0].innerHTML;
  var result = window.confirm(`Are you sure you want to delete ${fullName}?`);
  if (result) {
    doDeleteUser(userId);
  } else {
    alert("You clicked Cancel!");
    // Add your logic for Cancel button here, if needed
  }
}

async function doDeleteUser(userId) {
  const deleteUrl = `${apiUrl}/user/deleteUser/${userId}`;

  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch(deleteUrl, requestOptions) // Replace with your API endpoint
    .then((response) => {
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      console.log("response", response);
      return response.json(); // If the server sends JSON back
    })
    .then((data) => {
      if (data.errorMsg) {
        alert(data.errorMsg);
      } else {
        alert("Deleted successfully!");

        fetchData();
      }

      // console.log("DELETE successful:", data);
      // Handle the response data here
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle errors here
    });
}

// Edit the data
function onEdit(td) {
  addUser.value = "EDIT USER"
  isAdd = false;
  modalTitle.textContent = "Update Details";
  modal.style.display = "block";
  selectedRow = td.parentElement.parentElement;
  selectedId = selectedRow.cells[0].innerHTML;
  const fullName = selectedRow.cells[1].innerHTML.split(" ");
  document.getElementById("fName").value = fullName[0];
  document.getElementById("mName").value = fullName[1];
  document.getElementById("lName").value = fullName[2];
  document.getElementById("userRole").value = selectedRow.cells[3].innerHTML;
  console.log("userRole:", selectedRow.cells[3].innerHTML, "isAdd:",isAdd);
}

async function addNewUser(event) {
  event.preventDefault();
  const data = {
    isAdd: isAdd,
    firstName: document.getElementById("fName").value,
    middleName: document.getElementById("mName").value,
    lastName: document.getElementById("lName").value,
    userRole: document.getElementById("userRole").value,
    userId: selectedId
  };
  await fetch(`${apiUrl}/user/addUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      // newRow(result[0]);
      
      modal.style.display = "none";
      fetchData() ;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function newRow(result) {
  const tableBody = document.querySelector("#apiTable tBody");
  const row = document.createElement("tr");
  row.innerHTML = `
  <td>${result.user_id}</td>
  <td>${result.full_name}</td>
  <td>${result.username}</td>
  <td>${result.user_role}</td>
  <td><button onClick="onEdit(this)">Edit</button> <button>Delete</button></td>
  
`;
  tableBody.appendChild(row);
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

// Event listeners for opening and closing the modal
openModalButton.addEventListener("click", function () {
  document.getElementById("fName").value = "";
  document.getElementById("mName").value = "";
  document.getElementById("lName").value = "";
  modalTitle.textContent = "New User";
  addUser.value = "ADD USER"
  modal.style.display = "block";
});
closeModalButton.addEventListener("click", closeModal);
// addUser.addEventListener("click", addNewUser);
document.getElementById("addUserForm").addEventListener("submit", addNewUser);
window.addEventListener("load", function () {
  fetchData();
});
