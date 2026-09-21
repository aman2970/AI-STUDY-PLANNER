console.log("AI Study Planner JavaScript is working!");

const heading = document.querySelector("h1");

console.log(heading);

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

    fetch("/api/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())

      .then((data) => {
        console.log(data.message);

        if (data.message === "Login successful!") {
          alert("Login successful!");

          window.location.href = "/dashboard";
        } else {
          alert(data.message);

          loginButton.textContent = "Login";

          loginButton.disabled = false;
        }
      })

      .catch((error) => {
        console.error("Error:", error);

        alert("Something went wrong.");

        loginButton.textContent = "Login";

        loginButton.disabled = false;
      });
  });

  const togglePassword = document.querySelector("#toggle-password");

  if (togglePassword) {
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
}

const subjectNameInput = document.querySelector("#subject-name");
const difficultyInput = document.querySelector("#difficulty");
const addSubjectButton = document.querySelector("#add-subject");
const subjectList = document.querySelector("#subject-list");

function createSubjectCard(subject) {
  const subjectItem = document.createElement("div");

  subjectItem.className = "subject-card";

  subjectItem.innerHTML = `
        <div>
            <h3>${subject.name}</h3>
            <span class="difficulty-badge ${subject.difficulty.toLowerCase()}">
                ${subject.difficulty}
            </span>
        </div>

        <div>
    <button type="button" class="edit-subject">
        Edit
    </button>

    <button type="button" class="delete-subject">
        Delete
    </button>
</div>
    `;

  subjectList.appendChild(subjectItem);

  const editButton = subjectItem.querySelector(".edit-subject");

  editButton.addEventListener("click", function () {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = subject.name;

    const difficultySelect = document.createElement("select");

    difficultySelect.innerHTML = `
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
    `;

    difficultySelect.value = subject.difficulty;

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Save";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";

    const editArea = document.createElement("div");

    editArea.appendChild(nameInput);
    editArea.appendChild(difficultySelect);
    editArea.appendChild(saveButton);
    editArea.appendChild(cancelButton);

    subjectItem.innerHTML = "";
    subjectItem.appendChild(editArea);

    saveButton.addEventListener("click", function () {
      const newName = nameInput.value.trim();
      const newDifficulty = difficultySelect.value;

      if (newName === "") {
        alert("Subject name cannot be empty.");
        return;
      }

      const existingSubjects = document.querySelectorAll(".subject-card h3");

      for (const existingSubject of existingSubjects) {
        if (
          existingSubject.textContent.toLowerCase() === newName.toLowerCase()
        ) {
          alert("This subject already exists.");
          return;
        }
      }

      fetch(`/api/subjects/${subject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          difficulty: newDifficulty,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);

          subject.name = newName;
          subject.difficulty = newDifficulty;

          createSubjectCard(subject);
          subjectItem.remove();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Something went wrong.");
        });
    });

    cancelButton.addEventListener("click", function () {
      createSubjectCard(subject);
      subjectItem.remove();
    });
  });

  const deleteButton = subjectItem.querySelector(".delete-subject");

  deleteButton.addEventListener("click", function () {
    fetch(`/api/subjects/${subject.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        subjectItem.remove();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong.");
      });
  });
}

if (addSubjectButton) {
  addSubjectButton.addEventListener("click", function () {
    const subjectName = subjectNameInput.value.trim();
    const difficulty = difficultyInput.value;

    if (subjectName === "") {
      alert("Please enter a subject name.");
      return;
    }

    if (difficulty === "") {
      alert("Please select a difficulty level.");
      return;
    }

    const existingSubjects = document.querySelectorAll(".subject-card h3");

    for (const subject of existingSubjects) {
      if (subject.textContent.toLowerCase() === subjectName.toLowerCase()) {
        alert("This subject has already been added.");
        return;
      }
    }

    fetch("/api/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: subjectName,
        difficulty: difficulty,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        alert("Subject saved successfully!");

        const newSubject = {
          id: data.id,
          name: subjectName,
          difficulty: difficulty,
        };

        createSubjectCard(newSubject);

        subjectNameInput.value = "";
        difficultyInput.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong.");
      });
  });
}

if (subjectList) {
  fetch("/api/subjects")
    .then((response) => response.json())
    .then((subjects) => {
      subjects.forEach((subject) => {
        createSubjectCard(subject);
      });
    })
    .catch((error) => {
      console.error("Error loading subjects:", error);
    });
}

const signupButton = document.querySelector("#signup-button");

if (signupButton) {
  const signupName = document.querySelector("#signup-name");
  const signupEmail = document.querySelector("#signup-email");
  const signupPassword = document.querySelector("#signup-password");

  signupButton.addEventListener("click", function () {
    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    if (name === "") {
      alert("Please enter your name.");
      return;
    }

    if (email === "") {
      alert("Please enter your email.");
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

    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        alert(data.message);

        if (data.message === "Account created successfully!") {
          signupName.value = "";
          signupEmail.value = "";
          signupPassword.value = "";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Something went wrong.");
      });
  });
}
