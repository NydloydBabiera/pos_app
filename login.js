document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting

   // const username = document.getElementById("username").value;
    // const password = document.getElementById("password").value; 
    const data = {
      userName: document.getElementById("username").value,
      userPassword: document.getElementById("password").value,
    };

    console.log("data:",data);
    fetch(`${apiUrl}/user/loginUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          // Add any other headers as needed
        },
        body: JSON.stringify(data), // Convert the data to JSON format
      })
      .then((response) => response.json()) // Parse the response as JSON
      .then((result) => {
        console.log("Response from the API:");
        if (result.status == 1) {
          switch (result.data.user_role) {
            case "CUSTOMER":
              window.location.href = "POS.html";
              break;
            case "ADMIN":
              window.location.href = "admin.html";
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
    console.log("apiURL:", apiUrl,"/user/loginUser");
  });