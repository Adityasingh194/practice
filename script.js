


document.addEventListener("DOMContentLoaded", function () {
    console.log("Website loaded successfully!");

    const adminUsername = "admin";  // Change this if needed
    const adminPassword = "1234";   // Change this if needed

    const loginForm = document.getElementById("adminLoginForm");
    const errorMessage = document.getElementById("errorMessage");
    const logoutBtn = document.getElementById("logoutBtn");
    const reviewForm = document.getElementById("reviewForm");
    const reviewList = document.getElementById("reviewList");

    const BACKEND_URL = "https://backend-dzfe.onrender.com";  // Update this with your Render backend URL

    // Handle Admin Login
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const enteredUsername = document.getElementById("username").value;
            const enteredPassword = document.getElementById("password").value;

            if (enteredUsername === adminUsername && enteredPassword === adminPassword) {
                localStorage.setItem("isAdmin", "true"); // Store authentication state
                window.location.href = "admin.html";  // Redirect to admin page
            } else {
                errorMessage.textContent = "Invalid username or password!";
            }
        });
    }

    // Restrict access to admin.html
    if (window.location.pathname.includes("admin.html")) {
        const isAdmin = localStorage.getItem("isAdmin");
        if (isAdmin !== "true") {
            alert("Access Denied! Please log in.");
            window.location.href = "admin-login.html";  // Redirect to login page
        } else {
            fetchReviews(); // Load reviews
        }
    }

    // Handle Admin Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("isAdmin"); // Remove authentication state
            window.location.href = "admin-login.html"; // Redirect to login page
        });
    }

    // Handle Review Submission
    if (reviewForm) {
        reviewForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const eventName = document.getElementById("event").value;
            const reviewText = document.getElementById("review").value;
            const review = {
                name: name,
                event: eventName,
                reviewText: reviewText,
                date: new Date().toLocaleString()
            };

            // Send review to backend
            fetch(`${BACKEND_URL}/submit-review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(review)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                reviewForm.reset();
            })
            .catch(error => {
                console.error("Error:", error);
            });
        });
    }

    // Fetch and display reviews in admin panel
    function fetchReviews() {
        fetch(`${BACKEND_URL}/get-reviews`)
            .then(response => response.json())
            .then(data => {
                reviewList.innerHTML = "";
                data.forEach(review => {
                    const li = document.createElement("li");
                    li.textContent = `${review.date} - ${review.name} reviewed ${review.event}: "${review.reviewText}"`;
                    reviewList.appendChild(li);
                });
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
            });
    }
});
