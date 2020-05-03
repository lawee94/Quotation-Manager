import app from 'firebase/app'; 
import  'firebase/auth';
import  'firebase/database';

const config = { 
    apiKey: "AIzaSyA56OKhQOiizkheTcC7UvAnxBHQb9aWBNc",
    authDomain: "quotationmanager.firebaseapp.com",
    databaseURL: "https://quotationmanager.firebaseio.com",
    projectId: "quotationmanager",
    storageBucket: "quotationmanager.appspot.com",
    messagingSenderId: "226334966569",
    appId: "1:226334966569:web:09256791cc56db980bed38",
    measurementId: "G-XM5JEJ29GK"
};


const Firebase = app.initializeApp(config);

export default Firebase



// import  firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/database';

//   let config = {
//     apiKey: "AIzaSyA56OKhQOiizkheTcC7UvAnxBHQb9aWBNc",
//     authDomain: "quotationmanager.firebaseapp.com",
//     databaseURL: "https://quotationmanager.firebaseio.com",
//     projectId: "quotationmanager",
//     storageBucket: "quotationmanager.appspot.com",
//     messagingSenderId: "226334966569",
//     appId: "1:226334966569:web:09256791cc56db980bed38",
//     measurementId: "G-XM5JEJ29GK"
//   };

// firebase.initializeApp(config);

// export const auth = firebase.auth()
// export const db = firebase.database()
// export default firebase;
