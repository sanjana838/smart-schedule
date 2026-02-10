// firebase.js
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

// Request permission
Notification.requestPermission().then(permission=>{
  if(permission==="granted"){
    getToken(messaging,{vapidKey:"BGg_stOEz_FiOpN1C70mWUiZCqZHu6_oUUBKJyVq2u-iJCt_406cmTLr9Lk8GngABeZEUVwybdorttNtSWTSBLQ"})
      .then(token=>{
        console.log("FCM Token:", token);
        fetch("/register-token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token})});
      })
      .catch(err=>console.log("FCM Error:",err));
  }
});

// Foreground messages
onMessage(messaging, payload=>{
  alert(payload.notification.title+"\n"+payload.notification.body);
});
