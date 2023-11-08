let totalAmt = 0;
document.getElementById("btnExit").addEventListener("click", function () {
  window.location.href = "index.html"
})
async function fetchData(transactionId) {
  await fetch(`${apiUrl}/transaction/getSpecificTransaction/${transactionId}`) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const prodLine = data.transaction_line[0];
      const dateTrans = new Date(data.transaction_header[0].date_trans);

      const year = dateTrans.getFullYear();
      const month = String(dateTrans.getMonth() + 1).padStart(2, "0");
      const day = String(dateTrans.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      console.log("prodLine:", prodLine);
      document.getElementById("transactionNo").textContent =
        data.transaction_header[0].transaction_code;
      document.getElementById("transactionDate").textContent = formattedDate;
      document.getElementById("userId").textContent = padWithLeadingZeros(
        data.transaction_header[0].customer_id,
        5
      );
      // Iterate through the data and create table rows
      var itemsList = document.getElementById("itemsList");
      data.transaction_line.forEach((item) => {
        var itemDiv = document.createElement("div");
        itemDiv.className = "item";
        itemDiv.innerHTML = `
            <span class="description">${item.name_prod}</span>
            <span class="quantity">${item.qty_prod}</span>
            <span class="price">₱${item.price.toFixed(2)}</span>
        `;
        itemsList.appendChild(itemDiv);
        totalAmt += item.price;
      });
      document.getElementById("totalAmount").textContent = totalAmt.toFixed(2);
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
    });
}

function padWithLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, "0");
}

window.addEventListener("load", function () {
  if (!this.localStorage.getItem("transactionId")) {
    window.location.href = "index.html";
  }
  const transactionId = localStorage.getItem("transactionId");
  console.log("transactionId:", transactionId);
  fetchData(transactionId);
});