const publicVapidKey =
  "BB3uVb7lRpcN_XW_sjUTCeZKPn6r7r5xSgg1LtxvLKZVsjvWt2gvucW60XAnIiOLWG8FDLCdCLNKfg5xu2_3IbA";

// Copied from the web-push documentation
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });
}

window.subscribe = async () => {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  await fetch("/subscription", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json",
    },
  });
};

window.broadcast = async () => {
  await fetch("/broadcast", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
};

//-------------------------------------------------------------------------

async function registerPeriodicNewsCheck() {
  const registration = await navigator.serviceWorker.ready;
  try {
    await registration.periodicSync.register("get-latest-news", {
      minInterval: 30 * 1000,
    });
  } catch {
    console.log("Periodic Sync could not be registered!");
  }
}

async function unregisterPeriodicNewsCheck() {
  navigator.serviceWorker.ready.then((registration) => {
    registration.periodicSync.unregister("get-latest-news");
  });
}

// window.fetchAndCacheLatestNews = async () => {
//   await fetch("/update", {
//     method: "GET",
//     headers: {
//       "content-type": "application/json",
//     },
//   });
// };

function syncAttendees() {
  return update({ url: `/update` })
    .then(refresh)
    .then((attendees) => {
      console.log(attendees);
      self.registration.showNotification(`There is a new update`);
    });
}
