require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to DB');
  
  // Fix Users
  const users = await User.find({});
  let uCount = 0;
  for (let u of users) {
    if (u.avatar && u.avatar.includes('E:\\')) {
      const parts = u.avatar.split('\\');
      const filename = parts[parts.length - 1];
      u.avatar = `/uploads/${filename}`;
      await u.save();
      uCount++;
    }
  }
  
  // Fix Posts
  const posts = await Post.find({});
  let pCount = 0;
  for (let p of posts) {
    if (p.image && p.image.includes('E:\\')) {
      const parts = p.image.split('\\');
      const filename = parts[parts.length - 1];
      p.image = `/uploads/${filename}`;
      await p.save();
      pCount++;
    }
  }
  
  console.log(`Fixed ${uCount} users and ${pCount} posts.`);
  process.exit(0);
});
