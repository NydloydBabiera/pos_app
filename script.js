// Function to fetch data from the API and populate the table
const getBtn = document.getElementById("get-btn");
const checkout = document.getElementById("checkout");
const transactionCode = document.getElementById("transTxt");
const userTxt = document.getElementById("userTxt");
const dateTxt = document.getElementById("dateTxt");
const txtTotal = document.getElementById("displayTotal");
const dataArr = [];
let totalProd = 0;

async function fetchData() {
  const paramValue = document.getElementById("paramInput").value;
  fetch(`${apiUrl}/products/getSpecificProduct/${paramValue}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      }
    }) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#apiTable tbody");



      // Clear existing table rows
      tableBody.innerHTML = "";

      totalProd += data[0].price;
      dataArr.push(data[0]);

      console.log("dataArr:", dataArr);

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
        txtTotal.textContent = totalProd;
      });
    })
    .catch((error) => {
      res.json("Error fetching data:", error);
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
  const currentDate = new Date();

  // Get the current year, month, day, etc.
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
  const day = currentDate.getDate();

  // dateTxt.textContent = month + "/" + day + "/" + year;
  dateTxt.textContent = year + "-" + month + "-" + day;
}

window.addEventListener("load", function () {
  if (!this.localStorage.getItem('userId')) {
    window.location.href = 'index.html';
  }
  const input = document.getElementById("paramInput");
  totalProd = 0;
  getCurrentDate();
  userTxt.textContent = padWithLeadingZeros(this.localStorage.getItem('data'), 6);
  // txtTotal.textContent = '';
  // input.value = '';
});

function padWithLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, "0");
}

// Call the fetchData function to populate the table when the page loads
// window.addEventListener('load', fetchData);
getBtn.addEventListener("click", fetchData);
checkout.addEventListener("click", saveTransaction)