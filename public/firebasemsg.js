importScripts("https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBVXB838N5Ef7kmJLr_mwompKAVOuy0VrU",
  authDomain: "smartshedule-f093f.firebaseapp.com",
  projectId: "smartshedule-f093f",
  messagingSenderId: "307887771018",
  appId: "1:307887771018:web:0d1ddb19f6f3db85ad4c73"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/icon.png" // optional
    }
  );
});
