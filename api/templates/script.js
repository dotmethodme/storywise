// @ts-check
// track an event by sending a POST request to the /api/event endpoint
var storywise = {
  appId: "{{APP_ID}}",
  base: "{{API_BASE_URL}}",
  pageview,
};

function pageview() {
  const url = `${storywise.base}/api/event?app_id=${storywise.appId}`;

  const referrer = document.referrer;

  // construct the request body as a JSON object
  const requestBody = {
    path: window.location.pathname,
    referrer: referrer,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    window_width: window.innerWidth,
    window_height: window.innerHeight,
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

(() => {
  if (window.history.pushState) {
    var originalPushState = window.history["pushState"];
    window.history.pushState = function () {
      originalPushState.apply(this, arguments);
      pageview();
    };
    window.addEventListener("popstate", pageview);
  }
  pageview();
})();
