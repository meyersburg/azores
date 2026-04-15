import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyCM76KF3DsjBt-SNPvOMTS-TdT4AvBA5uE',
  authDomain: 'azores-818ab.firebaseapp.com',
  databaseURL: 'https://azores-818ab-default-rtdb.firebaseio.com',
  projectId: 'azores-818ab',
  storageBucket: 'azores-818ab.firebasestorage.app',
  messagingSenderId: '12762699675',
  appId: '1:12762699675:web:6a6f964fed23368a53b33e',
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
