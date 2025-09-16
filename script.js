import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWM5P2fz8v_E_9n-91GIHMvIG19QwV86Y",
    authDomain: "crimson-ink-den.firebaseapp.com",
    projectId: "crimson-ink-den",
    storageBucket: "crimson-ink-den.firebasestorage.app",
    messagingSenderId: "186622936412",
    appId: "1:186622936412:web:bdd9e3b48e2e32fdbaed99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle form submission
document.getElementById('storyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value || 'Anonymous';
    const category = document.getElementById('category').value;
    const submissionMessage = document.getElementById('submissionMessage');

    try {
        await addDoc(collection(db, 'posts'), {
            title: title,
            content: content,
            author: author,
            category: category,
            date: new Date().toLocaleString()
        });
        submissionMessage.style.display = 'block';
        submissionMessage.textContent = 'Submission successful! Your work is now live.';
        setTimeout(() => { submissionMessage.style.display = 'none'; }, 3000);
        displayPosts();
        this.reset();
    } catch (error) {
        submissionMessage.style.display = 'block';
        submissionMessage.textContent = 'Error submitting: ' + error.message;
        console.error('Error adding post: ', error);
    }
});

// Display posts
async function displayPosts() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';
    const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
        const post = doc.data();
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <p><em>By ${post.author} | ${post.category} | ${post.date}</em></p>
        `;
        postList.appendChild(postDiv);
    });
}

displayPosts();
