// import { apiUrl } from "./config.js";
const socket = new WebSocket("ws://192.168.68.100"); //192.168.68.105 - tacurong 192.168.254.103-gensan

const getBtn = document.getElementById("get-btn");

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
  status.innerHTML += `<p> Status: Connected to ESP 32</p>`;
});

function fetchData(paramValue) {
  // paramValue = document.getElementById("paramInput").value; //uncomment this line if ur not using websocket or testing
  fetch(`${apiUrl}/products/getSpecificProduct/${paramValue}`) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#apiTable tbody");
      const displayTotal = document.getElementById("displayTotal");
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
  getCurrentDate();
  const input = document.getElementById("paramInput");
  totalProd = 0;
});

getBtn.addEventListener("click", fetchData);
