var userId = 0;

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // const username = document.getElementById("username").value;
    // const password = document.getElementById("password").value; 
    //json format data
    const data = {
      userName: document.getElementById("username").value,
      userPassword: document.getElementById("password").value,
    };

    console.log("data:", data);
    fetch(`${apiUrl}/user/loginUser`, {
        method: "POST", //GET (retrieving data), POST (create or add data), PUT(update existing data), DELETE(delete existing data)
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          "Access-Control-Allow-Origin": '*', //security, 
          // Add any other headers as needed
        },
        body: JSON.stringify(data), // Convert the data to JSON format
      })
      .then((response) => response.json()) // Parse the response as JSON
      .then((result) => {
        localStorage.setItem('userId', result.data.user_id);
        // window.location.href = 'POS.html';
        if (result.status == 1) {
          
          switch (result.data.user_role) {
            case "CUSTOMER":
              window.location.href = "POS.html";
              break;
            case "ADMIN":
              window.location.href = "admin.html";
              break;
              case "CASHIER":
              window.location.href = "cashier.html";
              break;
            default:
              break;
          }
        } else {
          alert("No user found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

window.addEventListener("load", function () {
  console.log("apiURL:", apiUrl, "/user/loginUser");
  localStorage.removeItem('userId');
});