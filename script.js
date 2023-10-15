// Function to fetch data from the API and populate the table
const getBtn = document.getElementById("get-btn");
const dataArr = [];
let totalProd = 0;

async function fetchData() {
  const paramValue = document.getElementById("paramInput").value;
  fetch(`http://192.168.68.104:5100/products/getSpecificProduct/${paramValue}`) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#apiTable tbody");

      const txtTotal = document.getElementById("displayTotal");

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

function getCurrentDate() {
  const dateTxt = document.getElementById("dateTxt");
  const currentDate = new Date();

  // Get the current year, month, day, etc.
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
  const day = currentDate.getDate();

  dateTxt.textContent = month+'/'+day+'/'+year;
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
