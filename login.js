var userId = 0;
const modal = document.getElementById("myModal")
const closeModal = document.getElementById("closeModal");
modalTitle = document.getElementById("modal-title");

closeModal.addEventListener("click", function () {
  modal.style.display = "none"
})

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting
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
          console.log("result:", result.data);
          if (result.data.username === result.data.user_password) {
            modal.style.display = "block"
            modalTitle.textContent = "Set your own password!"

          } else {
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
          }

        } else {
          alert("No user found");
        }
      })
      .catch((error) => {
        alert(error.message)
        // console.error("Error:", error);
      });
  });

document.getElementById("updatePasswordForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const newPassword = document.getElementById("newPassword").value;
  const confPassword = document.getElementById("confirmPassword").value

  if (newPassword != confPassword) {
    alert("Password did not match!")
  }

  const data = {
    userId: localStorage.getItem("userId"),
    newPassword: document.getElementById("confirmPassword").value
  }

  fetch(`${apiUrl}/user/updatePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data)
    }).then((response) => response.json())
    .then((result) => {
      confirm(result.message);
      modal.style.display = "none"
    }).catch((error) => {
      console.log("Error:", error);
    })

})


window.addEventListener("load", function () {
  console.log("apiURL:", apiUrl, "/user/loginUser");
  localStorage.removeItem('userId');
  localStorage.removeItem('transactionId');
});