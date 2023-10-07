// script.js
const getBtn = document.getElementById('get-btn');
const paramVal = document.getElementById('parameterInput');
// Function to fetch data from the API
function fetchData() {
    const parameter = paramVal.value;
    console.log('param:',parameter );
    fetch(`http://192.168.254.102:5100/products/getSpecificProduct/${parameter}`)
        .then(response => response.json())
        .then(data => {
            // Call a function to populate the table with the retrieved data
            populateTable(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.querySelector('#data-table tbody');

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Loop through the data and create table rows
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.barcode}</td>
            <td>${item.name_prod}</td>
            <td>${item.price}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Call the fetchData function to fetch and populate the data
// fetchData();
getBtn.addEventListener('click', fetchData);
