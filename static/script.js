console.log("AI Study Planner JavaScript is working!");

const heading = document.querySelector("h1");

console.log(heading);

// ====================
// LOGIN FUNCTIONALITY
// ====================

const loginButton = document.querySelector("#login-button");

if (loginButton) {
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");

  loginButton.addEventListener("click", function () {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (email === "" || password === "") {
      alert("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    loginButton.textContent = "Logging in...";
    loginButton.disabled = true;
  });

  const togglePassword = document.querySelector("#toggle-password");

  togglePassword.addEventListener("click", function () {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.textContent = "Hide Password";
    } else {
      passwordInput.type = "password";
      togglePassword.textContent = "Show Password";
    }
  });
}

// ====================
// SUBJECT FUNCTIONALITY
// ====================

const subjectNameInput = document.querySelector("#subject-name");
const difficultyInput = document.querySelector("#difficulty");
const addSubjectButton = document.querySelector("#add-subject");
const subjectList = document.querySelector("#subject-list");

if (addSubjectButton) {
  addSubjectButton.addEventListener("click", function () {
    const subjectName = subjectNameInput.value.trim();
    const difficulty = difficultyInput.value;

    // Check subject name
    if (subjectName === "") {
      alert("Please enter a subject name.");
      return;
    }

    // Check difficulty
    if (difficulty === "") {
      alert("Please select a difficulty level.");
      return;
    }

    // Check duplicate subject
    const existingSubjects = document.querySelectorAll(".subject-card h3");

    for (const subject of existingSubjects) {
      if (subject.textContent.toLowerCase() === subjectName.toLowerCase()) {
        alert("This subject has already been added.");
        return;
      }
    }

    // Create subject card
    const subjectItem = document.createElement("div");

    subjectItem.className = "subject-card";

    subjectItem.innerHTML = `
            <div>
                <h3>${subjectName}</h3>

                <span class="difficulty-badge ${difficulty.toLowerCase()}">
                    ${difficulty}
                </span>
            </div>

            <button type="button" class="delete-subject">
                Delete
            </button>
        `;

    // Add card to page
    subjectList.appendChild(subjectItem);

    // Delete subject
    const deleteButton = subjectItem.querySelector(".delete-subject");

    deleteButton.addEventListener("click", function () {
      subjectItem.remove();
    });

    // Clear form
    subjectNameInput.value = "";
    difficultyInput.value = "";
  });
}
