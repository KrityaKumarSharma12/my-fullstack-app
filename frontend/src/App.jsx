import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', { name, email, password });
      alert('✅ User created!');
      setName(''); setEmail(''); setPassword('');
      fetchUsers();
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/posts', { title, content, authorId: parseInt(authorId) });
      alert('✅ Post created!');
      setTitle(''); setContent(''); setAuthorId('');
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">🚀 Full Stack App</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* User Form */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Add New User</h2>
              <form onSubmit={createUser}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-3" required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-3" required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-3" required />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Create User</button>
              </form>
            </div>

            {/* Post Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
              <form onSubmit={createPost}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-3" required />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-3" rows="3" required />
                <input type="number" placeholder="Author ID" value={authorId} onChange={(e) => setAuthorId(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-3" required />
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">Create Post</button>
              </form>
            </div>
          </div>

          {/* Right Column - Users List */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Users List</h2>
            {users.map((user) => (
              <div key={user.id} className="border-b py-3">
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-gray-600">Email: {user.email}</p>
              </div>
            ))}
            {users.length === 0 && <p className="text-gray-500">No users yet...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;