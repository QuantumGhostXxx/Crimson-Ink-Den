// Initialize Firebase (replace with your config from Firebase console)
const firebaseConfig = {
    // Your Firebase config object here, e.g.:
    // apiKey: "your-api-key",
    // authDomain: "your-project-id.firebaseapp.com",
    // projectId: "your-project-id",
    // etc.
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Handle form submission
document.getElementById('storyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const author = document.getElementById('author').value || 'Anonymous';
    const category = document.getElementById('category').value;

    // Save to Firestore
    db.collection('posts').add({
        title: title,
        content: content,
        author: author,
        category: category,
        date: new Date().toLocaleString()
    }).then(() => {
        displayPosts();
        this.reset();
    }).catch(error => {
        console.error('Error adding post: ', error);
    });
});

// Display posts from Firestore
function displayPosts() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';
    db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
        snapshot.forEach(doc => {
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
    }).catch(error => {
        console.error('Error fetching posts: ', error);
    });
}

// Load posts on page load
displayPosts();
