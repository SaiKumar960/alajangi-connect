// Simple in-memory database for testing purposes when MongoDB is unavailable
class MemoryStore {
  constructor() {
    this.users = [];
    this.posts = [];
    this.comments = [];
    this.tokens = new Map();
  }

  async findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  async findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  async createUser(userData) {
    const user = { 
      ...userData, 
      _id: 'mem_u_' + Math.random().toString(36).substr(2, 9),
      followers: [],
      following: [],
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async createPost(postData) {
    const post = {
      ...postData,
      _id: 'mem_p_' + Math.random().toString(36).substr(2, 9),
      likes: [],
      createdAt: new Date()
    };
    this.posts.push(post);
    return post;
  }

  async getFeed(page = 1, limit = 10) {
    const sorted = [...this.posts].sort((a, b) => b.createdAt - a.createdAt);
    const start = (page - 1) * limit;
    return sorted.slice(start, start + limit);
  }

  async addComment(commentData) {
    const comment = {
      ...commentData,
      _id: 'mem_c_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    this.comments.push(comment);
    return comment;
  }

  async toggleLike(postId, userId) {
    const post = this.posts.find(p => p._id === postId);
    if (!post) return null;
    
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
      return { isLiked: true, count: post.likes.length };
    } else {
      post.likes.splice(index, 1);
      return { isLiked: false, count: post.likes.length };
    }
  }

  async searchUsers(query) {
    const regex = new RegExp(query, 'i');
    return this.users.filter(u => regex.test(u.name)).slice(0, 10);
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
