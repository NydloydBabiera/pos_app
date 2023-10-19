// Function to fetch data from the API and populate the table
const getBtn = document.getElementById("get-btn");
const checkout = document.getElementById("checkout");
const transTxt = document.getElementById("transtxt");
const transtxt = document.getElementById("userTxt");
const dateTxt = document.getElementById("dateTxt");
const txtTotal = document.getElementById("displayTotal");
const dataArr = [];
let totalProd = 0;

async function fetchData() {
  const paramValue = document.getElementById("paramInput").value;
  fetch(`${apiUrl}/products/getSpecificProduct/${paramValue}`) // Replace with your API endpoint
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
  const data = [];
  const trans_line = []
  const trans_header = []
  
    trans_header = {
      transaction_code: transTxt.textContent,
      date_trans: dateTxt.textContent,
      amt_total: txtTotal.textContent,
      amt_paid: 0,
      payment_type: "",
      customer_id: 2,
      cashier_id: "",
      transaction_status: "",
    }
  

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

  data.push(trans_line);

  console.log("data:",data);
  // data = {
  //   trans_header: {
  //     transaction_code: "",
  //     date_trans: "2023-10-18",
  //     amt_total: 100,
  //     amt_paid: 0,
  //     payment_type: "",
  //     customer_id: 2,
  //     cashier_id: 4,
  //     transaction_status: "",
  //   },
  //   trans_line: [
  //     {
  //       product_id: 1,
  //       qty_prod: 3,
  //       amt_total_lines: 102.24,
  //     },
  //     {
  //       product_id: 2,
  //       qty_prod: 2,
  //       amt_total_lines: 57.15,
  //     },
  //   ],
  // };
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
  const input = document.getElementById("paramInput");
  totalProd = 0;
  getCurrentDate();
  // txtTotal.textContent = '';
  // input.value = '';
});

// Call the fetchData function to populate the table when the page loads
// window.addEventListener('load', fetchData);
getBtn.addEventListener("click", fetchData);
checkout.addEventListener("click",saveTransaction)