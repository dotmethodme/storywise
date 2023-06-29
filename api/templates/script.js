const API_BASE_URL = "{{API_BASE_URL}}";

// track an event by sending a POST request to the /api/event endpoint
function registerPageview() {
  // construct the URL for the API endpoint
  const url = `${API_BASE_URL}/api/event`;

  const sessionId = getSessionId();
  const referrer = document.referrer;

  // construct the request body as a JSON object
  const requestBody = {
    session_id: sessionId,
    path: window.location.pathname,
    referrer: referrer,
  };

  // send a POST request to the API endpoint with the request body as JSON
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    })
    .catch((error) => {
      console.error("Error event:", error);
    });
}

function getSessionId() {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = generateId();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

(() => {
  setTimeout(() => {
    registerPageview();
  }, 100);
})();
