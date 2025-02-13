// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
  authDomain: "mywebform-81b01.firebaseapp.com",
  projectId: "mywebform-81b01",
  storageBucket: "mywebform-81b01.firebasestorage.app",
  messagingSenderId: "284178824887",
  appId: "1:284178824887:web:b34bd1bd101aa67404d732"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form Submission Handler
document.getElementById('save-later-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    // Personal Information
    name: document.getElementById('fname').value,
    age: document.getElementById('myage').value,
    gender: document.getElementById('gender').value,
    permanentAddress: {
      district: document.getElementById('pdist').value,
      municipality: document.getElementById('pgapa').value,
      ward: document.getElementById('pward').value,
      tole: document.getElementById('ptol').value
    },
    // Loan Details
    loanAmount: document.getElementById('tcsh').value,
    interestRate: document.getElementById('Lper').value,
    loanDate: document.getElementById('date1').value,
    // ... add all other form fields similarly
  };

  const userId = document.querySelector('input[name="user_id"]').value;

  try {
    if(userId) {
      await updateDoc(doc(db, "loanApplications", userId), formData);
    } else {
      await addDoc(collection(db, "loanApplications"), formData);
    }
    resetForm();
    loadApplications();
  } catch (error) {
    console.error("Error saving data: ", error);
  }
});

// Read Data
function loadApplications() {
  const query = collection(db, "loanApplications");
  
  onSnapshot(query, (snapshot) => {
    const applicationsList = document.getElementById('applicationsList');
    applicationsList.innerHTML = '';
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const row = `
        <tr>
          <td>${data.name}</td>
          <td>${data.loanAmount}</td>
          <td>${data.loanDate}</td>
          <td>
            <button onclick="editApplication('${doc.id}')">Edit</button>
            <button onclick="deleteApplication('${doc.id}')">Delete</button>
          </td>
        </tr>
      `;
      applicationsList.innerHTML += row;
    });
  });
}

// Edit Application
window.editApplication = async (id) => {
  const docRef = doc(db, "loanApplications", id);
  const docSnap = await getDoc(docRef);
  
  if(docSnap.exists()) {
    const data = docSnap.data();
    
    // Populate form fields
    document.getElementById('fname').value = data.name;
    document.getElementById('myage').value = data.age;
    document.getElementById('gender').value = data.gender;
    // ... populate all other fields
    
    document.querySelector('input[name="user_id"]').value = id;
  }
};

// Delete Application
window.deleteApplication = async (id) => {
  if(confirm('Delete this application?')) {
    await deleteDoc(doc(db, "loanApplications", id));
  }
};

// Reset Form
function resetForm() {
  document.getElementById('save-later-form').reset();
  document.querySelector('input[name="user_id"]').value = '';
}

// Initial Load
loadApplications();

// Initialize Nepali Date Picker
$(document).ready(function() {
  $('#date1').nepaliDatePicker();
  $('#date2').nepaliDatePicker();
  // Initialize other date pickers
});




