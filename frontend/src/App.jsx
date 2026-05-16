import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function App() {
  // State Management
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'posts'
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState('');

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, postsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users'),
        axios.get('http://localhost:5000/api/posts')
      ]);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      showNotification('Error fetching data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Fetch Data on Load
  useEffect(() => {
    const loadData = async () => {
      await fetchAllData();
    };

    loadData();
  }, [fetchAllData]);

  // Create User
  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', { name, email, password });
      showNotification('✅ User created successfully!', 'success');
      setName(''); setEmail(''); setPassword('');
      setShowUserForm(false);
      fetchAllData();
    } catch (error) {
      showNotification('❌ Error: ' + error.response?.data?.error || error.message, 'error');
    }
  };

  // Create Post
  const createPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/posts', { 
        title, 
        content, 
        authorId: parseInt(authorId) 
      });
      showNotification('✅ Post created successfully!', 'success');
      setTitle(''); setContent(''); setAuthorId('');
      setShowPostForm(false);
      fetchAllData();
    } catch (error) {
      showNotification('❌ Error: ' + error.response?.data?.error || error.message, 'error');
    }
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Loading Spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading awesome content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 animate-slide-in rounded-lg shadow-2xl p-4 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white max-w-md`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? '✅' : '❌'}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in">
            🚀 Full Stack Showcase
          </h1>
          <p className="text-xl text-gray-200 mb-6 animate-slide-up">
            Modern CRUD Application with React, Node.js & PostgreSQL
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-blue-500 rounded-full text-white text-sm font-semibold shadow-lg">⚛️ React</span>
            <span className="px-4 py-2 bg-green-500 rounded-full text-white text-sm font-semibold shadow-lg">🟢 Node.js</span>
            <span className="px-4 py-2 bg-indigo-500 rounded-full text-white text-sm font-semibold shadow-lg">🐘 PostgreSQL</span>
            <span className="px-4 py-2 bg-pink-500 rounded-full text-white text-sm font-semibold shadow-lg">🎨 Tailwind CSS</span>
            <span className="px-4 py-2 bg-purple-500 rounded-full text-white text-sm font-semibold shadow-lg">📦 Prisma</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Total Users</p>
                <p className="text-4xl font-bold text-gray-800">{users.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <span className="text-3xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Total Posts</p>
                <p className="text-4xl font-bold text-gray-800">{posts.length}</p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <span className="text-3xl">📝</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold">Engagement</p>
                <p className="text-4xl font-bold text-gray-800">
                  {users.reduce((acc, user) => acc + (user.posts?.length || 0), 0)}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <span className="text-3xl">💬</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'users' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            👥 Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'posts' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            📝 Posts ({posts.length})
          </button>
        </div>

        {/* Users Section */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            {/* Add User Button */}
            <div className="text-center mb-8">
              <button
                onClick={() => setShowUserForm(!showUserForm)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {showUserForm ? '− Cancel' : '+ Add New User'}
              </button>
            </div>

            {/* User Form Modal */}
            {showUserForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 max-w-2xl mx-auto animate-slide-down">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New User</h2>
                <form onSubmit={createUser} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Vikash Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="vikash@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-[1.02]"
                  >
                    🚀 Create User
                  </button>
                </form>
              </div>
            )}

            {/* Users Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">User ID: #{user.id}</p>
                        <p className="text-xs text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{user.name}</h3>
                    <p className="text-gray-600 mb-3">{user.email}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        📝 {user.posts?.length || 0} posts
                      </span>
                      <span className="text-blue-500 text-sm font-semibold">View Profile →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {users.length === 0 && (
              <div className="text-center text-white py-12">
                <p className="text-xl">No users yet. Create your first user! 🚀</p>
              </div>
            )}
          </div>
        )}

        {/* Posts Section */}
        {activeTab === 'posts' && (
          <div className="animate-fade-in">
            {/* Add Post Button */}
            <div className="text-center mb-8">
              <button
                onClick={() => setShowPostForm(!showPostForm)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {showPostForm ? '− Cancel' : '+ Write New Post'}
              </button>
            </div>

            {/* Post Form Modal */}
            {showPostForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 max-w-2xl mx-auto animate-slide-down">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New Post</h2>
                <form onSubmit={createPost} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Post Title</label>
                    <input
                      type="text"
                      placeholder="Enter title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Content</label>
                    <textarea
                      placeholder="Write your post content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows="5"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Author ID</label>
                    <select
                      value={authorId}
                      onChange={(e) => setAuthorId(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      required
                    >
                      <option value="">Select an author</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} (ID: {user.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-[1.02]"
                  >
                    ✍️ Publish Post
                  </button>
                </form>
              </div>
            )}

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                        {getUserName(post.authorId).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{getUserName(post.authorId)}</p>
                        <p className="text-xs text-gray-500">Author ID: {post.authorId}</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Posted on {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center text-white py-12">
                <p className="text-xl">No posts yet. Create your first post! 📝</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black/20 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-300">
          <p className="mb-2">🚀 Built with React, Node.js, PostgreSQL & Prisma</p>
          <p className="text-sm">© 2024 Full Stack Showcase | All code is open source</p>
        </div>
      </footer>

      {/* Animations CSS - Add to index.css */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-down {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-in {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default App;