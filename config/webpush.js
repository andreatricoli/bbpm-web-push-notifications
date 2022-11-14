const webpush = require('web-push');

const publicVapidKey = 'BB3uVb7lRpcN_XW_sjUTCeZKPn6r7r5xSgg1LtxvLKZVsjvWt2gvucW60XAnIiOLWG8FDLCdCLNKfg5xu2_3IbA';
const privateVapidKey = 'IZYO1SZt41ZnlQmdgZj2r0JX-lR4rrDtC9b6UyiQWF8';

module.exports = function setVapidDetail() {
  webpush.setVapidDetails(
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey,
  );
};