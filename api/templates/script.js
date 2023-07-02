// @ts-check
// track an event by sending a POST request to the /api/event endpoint
var storywise = {
  base: "{{API_BASE_URL}}",
  pageview,
  getSessionId,
};

function pageview() {
  const url = `${storywise.base}/api/event`;

  const sessionId = getSessionId();
  const referrer = document.referrer;

  // construct the request body as a JSON object
  const requestBody = {
    session_id: sessionId,
    path: window.location.pathname,
    referrer: referrer,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    window: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };

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
  let sessionId = localStorage.getItem("storywise_session_id");
  if (!sessionId) {
    sessionId = generateId();
    localStorage.setItem("storywise_session_id", sessionId);
  }
  return sessionId;
}

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

(() => {
  if (window.history.pushState) {
    var originalPushState = window.history["pushState"];
    window.history.pushState = function () {
      originalPushState.apply(this, arguments);
      pageview();
    };
    window.addEventListener("popstate", pageview);
  }
})();
