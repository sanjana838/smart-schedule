<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVXB838N5Ef7kmJLr_mwompKAVOuy0VrU",
  authDomain: "smartshedule-f093f.firebaseapp.com",
  projectId: "smartshedule-f093f",
  storageBucket: "smartshedule-f093f.firebasestorage.app",
  messagingSenderId: "307887771018",
  appId: "1:307887771018:web:0d1ddb19f6f3db85ad4c73"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Ask permission
Notification.requestPermission().then(permission => {
  if (permission === "granted") {
    getToken(messaging, {
      vapidKey: "PASTE_YOUR_VAPID_KEY_HERE"
    }).then(token => {
      console.log("FCM Token:", token);
      // save this token in DB (for user notifications)
    });
  }
});

// Receive messages when app is open
onMessage(messaging, payload => {
  alert(payload.notification.title + "\n" + payload.notification.body);
});
</script>
