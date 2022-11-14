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

window.registerNotification = async () => {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.ready;
  if ("periodicSync" in registration) {
    // Request permission
    const status = await navigator.permissions.query({
      name: "periodic-background-sync",
    });

    if (status.state === "granted") {
      try {
        // Register new sync every 24 hours
        await registration.periodicSync.register("get-latest-news", {
          minInterval: 10 * 1000, // 1 day
        });
        console.log("Periodic background sync registered!");
      } catch (e) {
        console.error(`Periodic background sync failed:\nx${e}`);
      }
    } else {
      console.info("Periodic background sync is not granted.");
    }
  } else {
    console.log("Periodic background sync is not supported.");
  }
};

window.unregisterNotification = async () => {
  navigator.serviceWorker.ready.then((registration) => {
    registration.periodicSync.unregister("get-latest-news");
  });
};

// window.fetchAndCacheLatestNews = async () => {
//   await fetch("/update", {
//     method: "GET",
//     headers: {
//       "content-type": "application/json",
//     },
//   });
// };

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });

  registerNotification();
}
