const axios = require('axios');
const fs = require('fs');

const api = axios.create({ baseURL: 'http://localhost:5000/api', timeout: 10000 });

function randomEmail() { return `test_${Date.now()}_${Math.floor(Math.random()*1000)}@example.com`; }

async function runTests() {
  try {
    console.log('--- AUTHENTICATION TESTS ---');
    const email1 = randomEmail();
    const email2 = randomEmail();
    const password = 'StrongP@ssw0rd!';

    // 1. Valid registration (user1)
    let res = await api.post('/auth/register', { name: 'User One', email: email1, password });
    console.log('Register user1:', res.status, res.data.message);
    const token1 = res.data.token;

    // 2. Duplicate registration (same email)
    try {
      await api.post('/auth/register', { name: 'User One Dup', email: email1, password });
    } catch (e) { console.log('Duplicate registration error code:', e.response.status, e.response.data.message); }

    // 3. Valid registration (user2)
    res = await api.post('/auth/register', { name: 'User Two', email: email2, password });
    console.log('Register user2:', res.status);
    const token2 = res.data.token;

    // 4. Valid login (user1)
    res = await api.post('/auth/login', { email: email1, password });
    console.log('Login user1 success:', res.status, res.data.message);
    const loginToken1 = res.data.token;

    // 5. Invalid login (wrong password)
    try { await api.post('/auth/login', { email: email1, password: 'wrong' }); } catch (e) { console.log('Invalid login error:', e.response.status, e.response.data.message); }

    // Set auth headers for further requests
    api.defaults.headers.common['Authorization'] = `Bearer ${loginToken1}`;

    console.log('\n--- POST SYSTEM TESTS ---');
    // 1. Create text post
    res = await api.post('/posts', { text: 'Hello world from alpha test' });
    console.log('Create text post:', res.status);
    const postId = res.data.post._id;

    // 2. Create post with empty content
    try { await api.post('/posts', { text: '' }); } catch (e) { console.log('Empty post error:', e.response.status, e.response.data.message); }

    // 3. Long content post
    const longText = 'L'.repeat(2000);
    res = await api.post('/posts', { text: longText });
    console.log('Long text post created:', res.status);
    const longPostId = res.data.post._id;

    console.log('\n--- FEED TESTING ---');
    res = await api.get('/posts?page=1&limit=2');
    console.log('Feed load status:', res.status, 'posts returned:', res.data.posts.length);
    // Pagination test (page 2)
    res = await api.get('/posts?page=2&limit=2');
    console.log('Feed page 2 status:', res.status, 'posts returned:', res.data.posts.length);

    console.log('\n--- LIKE & COMMENT TESTS ---');
    // Like post
    res = await api.post(`/posts/${postId}/like`);
    console.log('Like post status:', res.status, 'isLiked:', res.data.isLiked);
    // Unlike post
    res = await api.post(`/posts/${postId}/like`);
    console.log('Unlike post status:', res.status, 'isLiked:', res.data.isLiked);
    // Add comment
    try {
      res = await api.post(`/posts/${postId}/comment`, { text: 'Nice post!' });
      console.log('Add comment status:', res.status);
    } catch (e) { console.log('Add comment error:', e.message); }
    // Empty comment
    try { await api.post(`/posts/${postId}/comment`, { text: '' }); } catch (e) { console.log('Empty comment error caught'); }

    console.log('\n--- API PROTECTED ROUTE TEST ---');
    // Access protected route without token
    const noAuth = axios.create({ baseURL: 'http://localhost:5000/api', timeout: 5000 });
    try { await noAuth.get('/posts'); } catch (e) { console.log('Protected without token error:', e.response.status); }
    // With token already set above, should succeed.
    const feed = await api.get('/posts');
    console.log('Protected with token fetch status:', feed.status);

    console.log('\nAll tests completed.');
  } catch (err) {
    console.error('Unexpected error during tests:', err);
  }
}

runTests();
