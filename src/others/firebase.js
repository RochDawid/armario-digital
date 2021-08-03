import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyB3zetIpevojcqh2jchfYO7F2-goMXISlk",
  authDomain: "armario-digital.firebaseapp.com",
  projectId: "armario-digital",
  storageBucket: "armario-digital.appspot.com",
  messagingSenderId: "624651550618",
  appId: "1:624651550618:web:4a62b8c706f57e05158423",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(config);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
