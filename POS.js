// import { apiUrl } from "./config.js";
const socket = new WebSocket("ws://192.168.68.106"); //192.168.68.105 - tacurong 192.168.254.103-gensan
const socketAPI = new WebSocket("ws://localhost:3000");
const checkout = document.getElementById("checkout");
const transactionCode = document.getElementById("transTxt");
const getBtn = document.getElementById("get-btn");
// const deleteBtn = document.getElementById("delete-btn");
const userTxt = document.getElementById("userTxt");
const displayTotal = document.getElementById("displayTotal");
const dataArr = [];
let totalProd = 0;
let paramValue = "";
const myList = [];
const checkList = [];
let valExist = false;

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

  // kung empty ang paramValue it means wala siya unod, iremove tanan na ara sa rows
  if (paramValue === "empty") {
    console.log("No product found");
    removeAllRows();
    return;
  }
  if (myList.includes(paramValue)) {
    return;
  }

  console.log("paramValue:", paramValue);
  fetchData(paramValue);
  myList.push(paramValue);
  // checkList.push(paramValue);
});

socket.addEventListener("close", (event) => {
  var status = document.getElementById("status");

  console.log("Connected to ESP 32");
  status.innerHTML += `<p> Status: Connection Close</p>`;
});

// socket for API

// socketAPI.onopen = (event) => {
//   console.log("WebSocket connection opened:", event);
// };

// socketAPI.onmessage = (event) => {
//   console.log("received message");
// };

// socketAPI.onclose = (event) => {
//   if (event.wasClean) {
//     console.log("WebSocket closed cleanly:", event);
//   } else {
//     console.error("WebSocket connection closed unexpectedly:", event);
//   }
// };

// socketAPI.onerror = (error) => {
//   console.error("WebSocket error:", error);
// };

function findMissingValues(arr1, arr2) {
  // Create a Set from the second array for faster lookups
  const set2 = new Set(arr2);

  // Use filter to find values in arr1 that are not in arr2
  const missingValues = arr1.filter((value) => !set2.has(value));

  return missingValues;
}

function fetchData(paramValue) {
  paramValue = document.getElementById("paramInput").value; //uncomment this line if ur not using websocket or testing
  // fetch(`${apiUrl}/products/getSpecificProduct/${paramValue}`, { // uncomment this if using websocket
  fetch(`${apiUrl}/products/getSpecificProduct/${paramValue}`, {
    //uncomment this if using button
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
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
                    <td>${item.product_id}</td>
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

function removeRow() {
  dataValue = document.getElementById("paramInput").value;
  var table = document.getElementById("apiTable");
  // Loop through the rows in the table (skip the header row)
  for (var i = 1; i < table.rows.length; i++) {
    var cellContent = table.rows[i].cells[1].textContent;

    if (cellContent === dataValue) {
      var elementInRow = table.rows[i].cells[1];
      table.deleteRow(i);
      console.log("Element in the row:", elementInRow.textContent);
    }
  }
}

function removeAllRows() {
  var table = document.getElementById("apiTable");

  var rowCount = table.rows.length;

  for (var i = rowCount - 1; i > 0; i--) {
    table.deleteRow(i);
  }

  //zero out the total
  totalProd = 0;
  displayTotal.textContent = totalProd;

  // clear all array contents
  myList.splice(0, myList.length);
  dataArr.splice(0, dataArr.length);
}

async function saveTransaction() {
  const apiTable = document.getElementById("apiTable");
  const rows = apiTable.getElementsByTagName("tr");
  socketAPI.send("POS");

  if (rows.length <= 1) {
    alert("No product/s added");
    return;
  }

  let trans_line = [];
  let trans_header = [];

  trans_header = {
    transaction_code: "",
    date_trans: dateTxt.textContent,
    amt_total: Number(displayTotal.textContent),
    amt_paid: 0,
    payment_type: "",
    customer_id: Number(userTxt.textContent),
    // cashier_id: 0,
    transaction_status: "",
  };
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
    trans_line: trans_line,
  };

  await fetch(`${apiUrl}/transaction/saveTransaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      transactionCode.textContent =
        result.trans_header[0].transaction_status +
        result.trans_header[0].transaction_code;
      confirm("Transaction saved! Please proceed to checkout counters");
      localStorage.setItem(
        "transactionId",
        result.trans_header[0].transaction_id
      );

      window.location.href = "checkout.html";
    })
    .catch((error) => {
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

  dateTxt.textContent = year + "-" + month + "-" + day;
}

window.addEventListener("load", function () {
  console.log("userId:", localStorage.getItem("userId"));
  if (!this.localStorage.getItem("userId")) {
    window.location.href = "index.html";
  }
  getCurrentDate();
  const input = document.getElementById("paramInput");
  totalProd = 0;
  userTxt.textContent = padWithLeadingZeros(
    this.localStorage.getItem("userId"),
    6
  );
  // padWithLeadingZeros(this.localStorage.getItem('userId'), 6);
});

getBtn.addEventListener("click", fetchData);
checkout.addEventListener("click", saveTransaction);
// deleteBtn.addEventListener("click", removeRow);

function padWithLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, "0");
}
