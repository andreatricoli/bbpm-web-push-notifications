const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const webpushSetVapidDetail = require("./config/webpush");
const webpush = require("web-push");

app.use(express.static("public"));

const subscriptions = [];

app.use(bodyParser.json());

app.post("/subscription", (req, res) => {
  const subscription = req.body;
  if (
    !subscriptions.find(
      (subscriptionSaved) => subscriptionSaved.enpoint === subscription.enpoint
    )
  ) {
    subscriptions.push(subscription);
    res.status(201).json({ status: "subscribed" });
  } else {
    res.status(201).json({ status: "already subscribed" });
  }
});

app.get("/broadcast", async (req, res) => {
  const notification = { title: "Hey, this is a push notification!" };
  const notifications = [];
  for (const subscription of subscriptions) {
    notifications.push(
      await webpush.sendNotification(subscription, JSON.stringify(notification))
    );
  }

  res.sendStatus(200);
});

webpushSetVapidDetail();

//-----------------------------------

app.get("/update", (req, res) => {
  res.send({
    update: true,
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Listening on port 3001");
});
