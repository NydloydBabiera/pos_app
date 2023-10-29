// Get references to the modal and buttons
const modal = document.getElementById("myModal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
var modalTitle = document.getElementById("modal-title");
let titleModal = "";
const addUser = document.getElementById("addUser");
var selectedId = 0;

const socketCashier = new WebSocket("ws://localhost:3000");

socketCashier.addEventListener("message", (event) => {
  console.log("new data:", event.data.transaction_id);
// console.log("received message");
  //  socketCashier.send("cashier",5000);
});

socketCashier.onopen = (event) => {
  console.log("WebsocketCashier connection opened:", event);
  socketCashier.send("cashier")
  // socketCashier.send("cashier", 5000);
};

socketCashier.onmessage = (event) => {
  console.log("received CASHIER");
  const message = event.data;
  // appendMessage(message);
};

socketCashier.onclose = (event) => {
  if (event.wasClean) {
    console.log("WebsocketCashier closed cleanly:", event);
  } else {
    console.error("WebsocketCashier connection closed unexpectedly:", event);
  }
};

socketCashier.onerror = (error) => {
  console.error("WebsocketCashier error:", error);
};



function appendMessage(message) {
  const item = document.createElement("li");
  item.textContent = message;
  messagesList.appendChild(item);
}

async function fetchData() {
  await fetch(`${apiUrl}/transaction/getAllTransaction`) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#apiTable tbody");

      // Iterate through the data and create table rows
      data.forEach((item) => {
        const button = document.createElement("button");
        button.textContent = "Click Me";
        const row = document.createElement("tr");
        // const dateTrans = item.date_trans.toLocaleString('en-US', {
        //     dateStyle: 'full',
        //     timeStyle: 'short'
        // })
        const dateTrans = new Date(item.date_trans);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        const formattedDate = dateTrans.toLocaleDateString("en-US", options);

        row.innerHTML = `
                              <td>${item.transaction_id}</td>
                              <td>${item.transaction_code}</td>
                              <td>${item.transaction_status}</td>
                              <td>${formattedDate}</td>
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
  if (!this.localStorage.getItem("userId")) {
    window.location.href = "index.html";
  }
  fetchData();
});
