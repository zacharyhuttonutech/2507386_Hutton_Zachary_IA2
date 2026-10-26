// Zachary Hutton ID#2507386
// IA#2: Dynamic Event Registration System ("Coding Conf")
// Course Title: CIT2011 - Web Programming
// Assignment Due Date: Week 9
// Technologies Required: HTML5, CSS3, Native JavaScript (ES6+)
// ticket.js: reads the saved details from localStorage and fills in the ticket

const STORAGE_KEY = "codingConfTicket";
const GITHUB_URL = "https://github.com/";

// returns the saved ticket, or null if there is nothing saved or it is broken
function getTicket() {
  let ticket = null;
  try {
    ticket = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    return null;
  }

  if (ticket && ticket.fullName && ticket.email && ticket.github && ticket.avatar && ticket.ticketNumber) {
    return ticket;
  }
  return null;
}

// textContent is used so the saved text is never run as HTML
function showTicket(ticket) {
  const username = ticket.github.replace("@", "");
  const avatar = document.getElementById("ticket-avatar");

  document.getElementById("congrats-name").textContent = ticket.fullName;
  document.getElementById("congrats-email").textContent = ticket.email;
  document.getElementById("ticket-name").textContent = ticket.fullName;
  document.getElementById("ticket-handle").textContent = ticket.github;
  document.getElementById("ticket-number").textContent = ticket.ticketNumber;
  document.getElementById("ticket-github").href = GITHUB_URL + username;

  avatar.src = ticket.avatar;
  avatar.alt = "Avatar of " + ticket.fullName;
}

const savedTicket = getTicket();

// no ticket saved, so send the visitor back to the home page
if (savedTicket === null) {
  window.location.replace("index.html");
} else {
  showTicket(savedTicket);
}
