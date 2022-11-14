self.addEventListener("push", (e) => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
  });
});

//-----------------------------------------------------------

self.addEventListener("periodicsync", (event) => {
  console.log("event periodcsync");
  console.log(event);
  if (event.tag === "get-latest-news") {
    console.log("event get latest news");
    event.waitUntil(syncAttendees());
  }
});
