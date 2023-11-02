// Get references to the modal and buttons
const modal = document.getElementById("myModal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.getElementById("closeModal");
var modalTitle = document.getElementById("modal-title");
let titleModal = "";
const addUser = document.getElementById("addUser");
var selectedId = 0;
let transactionId = 0;
const socketCashier = new WebSocket("ws://localhost:3000");

socketCashier.addEventListener("message", (event) => {
  console.log("new data:", event.data.transaction_id);
  // console.log("received message");
  //  socketCashier.send("cashier",5000);
});

socketCashier.onopen = (event) => {
  console.log("WebsocketCashier connection opened:", event);
  socketCashier.send("cashier");
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
function onEdit(button) {
  var table = document.getElementById("apiTable");
  // Get the parent row of the button (the <tr> element)
  const row = button.closest("tr");

  // Get the cell containing the price (2nd cell, index 1)
  transactionId = row.cells[0].textContent;
  const transactionCode = row.cells[1].textContent;


  if (confirm(`Process transaction ${transactionCode}?`)) {
    console.log("yes");
    processTransaction();
    return;
  }
}
// add modal para sa pagdawat sa payment
async function processTransaction() {
  await fetch(`${apiUrl}/transaction/processTransaction/${transactionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((response) => response.json())
    .then((result) => {
      alert(result.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

window.addEventListener("load", function () {
  if (!this.localStorage.getItem("userId")) {
    window.location.href = "index.html";
  }
  fetchData();
  console.log("");
});
