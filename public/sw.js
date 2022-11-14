self.addEventListener("push", (e) => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
  });
});

//-----------------------------------------------------------

const syncAttendees = async () => {
  const response = await fetch("/update", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });

  console.log(response);
  self.registration.showNotification(`There is a new update`);

  // return update({ url: `/update` })
  //   .then(refresh)
  //   .then((attendees) => {
  //     console.log(attendees);
  //     self.registration.showNotification(`There is a new update`);
  //   });
};

// setInterval(syncAttendees, 10000);

self.addEventListener("periodicsync", (event) => {
  console.log("event periodcsync");
  console.log(event);
  if (
    event.tag === "get-latest-news" ||
    event.tag === "test-tag-from-devtools"
  ) {
    console.log("event get latest news");
    event.waitUntil(syncAttendees());
  }
});
