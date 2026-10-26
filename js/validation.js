// Zachary Hutton ID#2507386
// IA#2: Dynamic Event Registration System ("Coding Conf")
// Course Title: CIT2011 - Web Programming
// Assignment Due Date: Week 9
// Technologies Required: HTML5, CSS3, Native JavaScript (ES6+)
// validation.js: checks the form on login.html, saves the ticket and goes to ticket.html

const STORAGE_KEY = "codingConfTicket";
const NAME_PATTERN = /\S/; // at least one character that is not a space
const MAX_FILE_SIZE = 500 * 1024; // 500KB
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const GITHUB_PATTERN = /^@[A-Za-z0-9-]{1,39}$/;

const form = document.getElementById("ticket-form");
const nameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const githubInput = document.getElementById("github");
const avatarInput = document.getElementById("avatar");
const avatarPreview = document.getElementById("avatar-preview");
const formError = document.getElementById("form-error");

// the photo as text (data URL) so it can go in localStorage
let avatarData = "";

// shows a message under a field, an empty message clears it
function showError(id, message) {
  document.getElementById(id + "-error").textContent = message;
  return message === "";
}

// full name: required and not just spaces
function checkName() {
  if (!NAME_PATTERN.test(nameInput.value)) {
    return showError("full-name", "Please enter your full name.");
  }
  return showError("full-name", "");
}

// email: must look like user@domain.com
function checkEmail() {
  const email = emailInput.value.trim();
  if (email === "") {
    return showError("email", "Please enter your email address.");
  }
  if (!EMAIL_PATTERN.test(email)) {
    return showError("email", "Please enter a valid email address, for example user@domain.com.");
  }
  return showError("email", "");
}

// GitHub: must start with @
function checkGithub() {
  const github = githubInput.value.trim();
  if (github === "") {
    return showError("github", "Please enter your GitHub username.");
  }
  if (!GITHUB_PATTERN.test(github)) {
    return showError("github", "Your GitHub username must start with @ and only use letters, numbers and hyphens.");
  }
  return showError("github", "");
}

// avatar: must be a JPG or PNG under 500KB
function checkAvatar() {
  const file = avatarInput.files[0];
  if (!file) {
    return showError("avatar", "Please upload your avatar.");
  }
  if (file.type !== "image/jpeg" && file.type !== "image/png") {
    return showError("avatar", "Please upload a JPG or PNG image.");
  }
  if (file.size > MAX_FILE_SIZE) {
    return showError("avatar", "File too large. Please upload a photo under 500KB.");
  }
  return showError("avatar", "");
}

// reads the chosen photo and shows a preview
function handleAvatar() {
  avatarData = "";
  avatarPreview.classList.remove("show");

  if (!checkAvatar()) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", function () {
    avatarData = reader.result;
    avatarPreview.src = avatarData;
    avatarPreview.alt = "Preview of your avatar";
    avatarPreview.classList.add("show");
  });
  reader.readAsDataURL(avatarInput.files[0]);
}

// random ticket number like #01609
function makeTicketNumber() {
  return "#0" + Math.floor(1000 + Math.random() * 9000);
}

function handleSubmit(event) {
  event.preventDefault();
  formError.textContent = "";

  const avatarOk = checkAvatar();
  const nameOk = checkName();
  const emailOk = checkEmail();
  const githubOk = checkGithub();

  if (!avatarOk || !nameOk || !emailOk || !githubOk) {
    // move the cursor to the first field with a problem
    const firstError = form.querySelector(".error:not(:empty)");
    firstError.parentElement.querySelector("input").focus();
    return;
  }

  if (avatarData === "") {
    formError.textContent = "Your photo is still loading, please try again.";
    return;
  }

  const ticket = {
    fullName: nameInput.value.trim(),
    email: emailInput.value.trim(),
    github: githubInput.value.trim(),
    avatar: avatarData,
    ticketNumber: makeTicketNumber()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ticket));
  } catch (error) {
    formError.textContent = "Your ticket could not be saved. Please try a smaller photo.";
    return;
  }

  window.location.href = "ticket.html";
}

// check each field again while the user types
nameInput.addEventListener("input", checkName);
emailInput.addEventListener("input", checkEmail);
githubInput.addEventListener("input", checkGithub);
avatarInput.addEventListener("change", handleAvatar);
form.addEventListener("submit", handleSubmit);
