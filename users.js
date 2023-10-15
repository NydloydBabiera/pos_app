// Get references to the modal and buttons
const modal = document.getElementById("myModal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
const addUser = document.getElementById("addUser");

async function fetchData() {
  await fetch(`http://192.168.68.103:5100/user/getAllUsers`) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#apiTable tbody");

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
                              <td><button onclick="onEdit(this)">Edit</button><button>Delete</button></td>
                              
                          `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
    });
}
//Edit the data
function onEdit(td) {
  alert("Edit data");
}

async function addNewUser(event) {
  event.preventDefault();
  const data = {
    firstName: document.getElementById("fName").value,
    middleName: document.getElementById("mName").value,
    lastName: document.getElementById("mName").value,
    userRole: document.getElementById("userRole").value,
  };
  await fetch(`http://192.168.68.103:5100/user/addUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      fetchData();
      console.log("result:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to open the modal
function openModal() {
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

// Event listeners for opening and closing the modal
openModalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);
// addUser.addEventListener("click", addNewUser);
document.getElementById("addUserForm").addEventListener("submit",addNewUser);

window.addEventListener("load", function () {
  fetchData();
});
