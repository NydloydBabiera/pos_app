// import { apiUrl } from "./config.js";
const socket = new WebSocket("ws://192.168.68.100"); //192.168.68.105 - tacurong 192.168.254.103-gensan
const checkout = document.getElementById("checkout");
const transactionCode = document.getElementById("transTxt");
const getBtn = document.getElementById("get-btn");
const userTxt = document.getElementById("userTxt");
const displayTotal = document.getElementById("displayTotal");
const dataArr = [];
let totalProd = 0;
let paramValue = "";
const myList = [];

//socket for esp32 camera
socket.addEventListener("open", (event) => {
  var status = document.getElementById("status");

  // status.innerHTML += `<p> Status: Connected to ESP 32!</p>`;
  console.log("Connected to ESP 32");
});

// socket.onerror = function (event) {
//   console.error('WebSocket connection error:', event);
// };

socket.addEventListener("message", (event) => {
  const outputDiv = document.getElementById("output");
  paramValue = event.data;

  if (myList.includes(paramValue)) {
    return;
  }

  console.log(paramValue);
  fetchData(paramValue);
  myList.push(paramValue);
});

socket.addEventListener("close", (event) => {
  var status = document.getElementById("status");

  console.log("Connected to ESP 32");
  status.innerHTML += `<p> Status: Connection Close</p>`;
});

function fetchData(paramValue) {
  paramValue = document.getElementById("paramInput").value; //uncomment this line if ur not using websocket or testing
  // fetch(`${apiUrl}/products/getSpecificProduct/${paramValue}`, { // uncomment this if using websocket
  fetch(`${apiUrl}/products/getSpecificProduct/${paramValue}`, { //uncomment this if using button
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      }
    }) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#apiTable tbody");
      //   do nothing if API return nothing
      if (data.length == 0) {
        return;
      }
      // Clear existing table rows
      tableBody.innerHTML = "";

      totalProd += data[0].price;
      dataArr.push(data[0]);

      console.log("dataArr:", totalProd);

      // Iterate through the data and create table rows
      dataArr.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${item.barcode}</td>
                    <td>${item.name_prod}</td>
                    <td>${item.description}</td>
                    <td>${item.prod_size}</td>
                    <td>${item.price}</td>
                `;
        tableBody.appendChild(row);
        displayTotal.textContent = totalProd;
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

async function saveTransaction() {
  const apiTable = document.getElementById("apiTable");
  const rows = apiTable.getElementsByTagName("tr");
  console.log("row count:", rows.length);

  if (rows.length <= 1) {
    alert("No product/s added");
    return;
  }

  let trans_line = []
  let trans_header = []

  trans_header = {
    transaction_code: "",
    date_trans: dateTxt.textContent,
    amt_total: Number(txtTotal.textContent),
    amt_paid: 0,
    payment_type: "",
    customer_id: Number(userTxt.textContent),
    // cashier_id: 0,
    transaction_status: "",
  }
  // add trans_header to main json

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");

    const product_id = cells[0].textContent;
    const qty_prod = 1;
    const amt_total_lines = cells[4].textContent;

    trans_line.push({
      product_id: product_id,
      qty_prod: qty_prod,
      amt_total_lines: amt_total_lines,
    });
  }
  // add trans_line to main json

  const data = {
    trans_header: trans_header,
    trans_line: trans_line
  }

  console.log("data:", data);

  await fetch(`${apiUrl}/transaction/saveTransaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": '*',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json())
    .then((result) => {
      transactionCode.textContent = result.trans_header[0].transaction_status + result.trans_header[0].transaction_code;
      confirm("Transaction saved! Please proceed to checkout counters")
    }).catch((error) => {
      console.error("Error:", error);
    });
}


function getCurrentDate() {
  const dateTxt = document.getElementById("dateTxt");
  const currentDate = new Date();

  // Get the current year, month, day, etc.
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
  const day = currentDate.getDate();

  dateTxt.textContent = month + "/" + day + "/" + year;
}

window.addEventListener("load", function () {
  if (!this.localStorage.getItem('userId')) {
    window.location.href = 'index.html';
  }
  getCurrentDate();
  const input = document.getElementById("paramInput");
  totalProd = 0;
  userTxt.textContent = padWithLeadingZeros(this.localStorage.getItem('data'), 6);
});

getBtn.addEventListener("click", fetchData);