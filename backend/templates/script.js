// @ts-check
// track an event by sending a POST request to the /api/event endpoint
var storywise = {
  app_id: "{{APP_ID}}",
  base: "{{API_BASE_URL}}",
  pageview,
  track,
};

window.storywise = storywise;

function pageview() {
  track("pageview");
}

/**
 *
 * @param {string} eventType
 */
function track(eventType) {
  const url = `${storywise.base}/api/event`;

  const referrer = document.referrer;

  // construct the request body as a JSON object
  const requestBody = {
    app_id: storywise.app_id,
    path: window.location.pathname,
    referrer: referrer,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    window_width: window.innerWidth,
    window_height: window.innerHeight,
    event_type: eventType,
  };

  // capture utm tags if they exist
  const queryStringParameters = new URLSearchParams(window.location.search);
  const utmSource = queryStringParameters.get("utm_source");
  const utmMedium = queryStringParameters.get("utm_medium");
  const utmCampaign = queryStringParameters.get("utm_campaign");
  const utmTerm = queryStringParameters.get("utm_term");
  const utmContent = queryStringParameters.get("utm_content");

  if (utmSource) requestBody["utm_source"] = utmSource;
  if (utmMedium) requestBody["utm_medium"] = utmMedium;
  if (utmCampaign) requestBody["utm_campaign"] = utmCampaign;
  if (utmTerm) requestBody["utm_term"] = utmTerm;
  if (utmContent) requestBody["utm_content"] = utmContent;

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
