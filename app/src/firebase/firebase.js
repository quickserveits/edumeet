import { initializeApp } from 'firebase/app';

const firebaseConfig =
{
    apiKey            : 'AIzaSyBN0Iev0cwn-W1ifRDDOskTh5iTHVtr87A',
    authDomain        : 'meeting-ejtimaa.firebaseapp.com',
    projectId         : 'meeting-ejtimaa',
    storageBucket     : 'meeting-ejtimaa.appspot.com',
    messagingSenderId : '478057864587',
    appId             : '1:478057864587:web:ac4a599f1b04816b88238e',
    measurementId     : 'G-LR82DNDG8P'
};

export const app = initializeApp(firebaseConfig);