const express = require('express');
const https = require("https");
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const webpushSetVapidDetail = require('./config/webpush');
const webpush = require('web-push');
const fs = require('fs');

app.use(express.static("public"));

const subscriptions = [];

//app.use(
  //cors({
    //origin: 'http://localhost:3000',
    // origin: '*', // it doesn't work with axios but it works with fetch
    //optionsSuccessStatus: 200, // For legacy browser support
    //methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    //credentials: true,
  //})
//);

console.log(__dirname);

app.use(express.static(path.join(__dirname, '/dist/client')));
app.use(bodyParser.json());


app.post('/subscription', (req, res) => {
	const subscription = req.body;
	console.log(subscription);
	// save in the db
	subscriptions.push(subscription);
	res.status(201).json({ok: "ok"});
})

app.get('/broadcast', async (req, res) => {
	//console.log(webpush);
	const notification = { title: 'Hey, this is a push notification!' };
	
	const notifications = [];
	
	subscriptions.forEach((subscription) => {
      notifications.push(
        webpush.sendNotification(subscription, JSON.stringify(notification))
      );
    });
	
	console.log(notifications);
	
	await Promise.all(notifications);

    res.sendStatus(200);
	
})

webpushSetVapidDetail();

//https.createServer({key: fs.readFileSync("key.pem"),cert: fs.readFileSync("cert.pem"),},app).
app.listen(process.env.PORT || 3001, () => {
  console.log('CORS enabled');
  console.log('Listening on port 3001');
});
