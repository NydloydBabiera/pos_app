var btnFilter = document.getElementById("btnFilter");
var displayTotal = document.getElementById("displayTotal");
async function fetchData() {
    await fetch(`${apiUrl}/transaction/getAllTransaction`) // Replace with your API endpoint
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.querySelector("#apiTable tbody");
            let totalVal = 0;
            // Iterate through the data and create table rows
            data.forEach((item) => {

                if (item.transaction_status === "DR")
                    return

                const button = document.createElement("button");
                button.textContent = "Click Me";
                const row = document.createElement("tr");
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
                          `;
                tableBody.appendChild(row);

                totalVal += item.amt_total;

            });
            displayTotal.textContent = totalVal.toFixed(2)
        })
        .catch((error) => {
            console.log("Error fetching data:", error);
        });
}

function filterTable() {
    // Get input elements and filter values
    var startDateInput = document.getElementById("dateFrom");
    var endDateInput = document.getElementById("dateTo");
    var startDate = new Date(startDateInput.value);
    var endDate = new Date(endDateInput.value);
    let totalAmt = 0;
    // Get table and table rows
    var table = document.getElementById("apiTable");
    var rows = table.getElementsByTagName("tr");

    // Loop through all table rows, hide those that don't match the date range
    for (var i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        var dateColumn = rows[i].getElementsByTagName("td")[3]; // Assuming date is in the second column
        var amtColumn = rows[i].getElementsByTagName("td")[4]; // Assuming date is in the second column
        if (dateColumn) {
            var dateValue = new Date(dateColumn.textContent || dateColumn.innerText);
            if (dateValue >= startDate && dateValue <= endDate) {
                rows[i].style.display = "";
                totalAmt += amtColumn.textContent;
            } else {
                rows[i].style.display = "none";
            }

        }
    }
    displayTotal.textContent = totalAmt
    console.log(totalAmt)
}

window.addEventListener("load", function () {
    cashierId = this.localStorage.getItem("userId");
    // if (!this.localStorage.getItem("userId")) {
    //   window.location.href = "index.html";
    // }
    fetchData();
    console.log("cashierId:", cashierId);
});

btnFilter.addEventListener("click", filterTable)