require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Post = require('./models/Post');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    console.log('Clearing existing data (optional, commenting out to preserve your account)...');
    // await User.deleteMany({});
    // await Post.deleteMany({});

    console.log('Creating 5 dummy users...');

    const usersData = [
      { name: "Elena Rostova", email: "elena@example.com", password: "Password123!", bio: "Digital artist and designer.", avatar: "/uploads/seed_avatar_1.jpg" },
      { name: "Marcus Thorne", email: "marcus@example.com", password: "Password123!", bio: "Music producer & night owl.", avatar: "/uploads/seed_avatar_2.jpg" },
      { name: "Sarah Jenkins", email: "sarah@example.com", password: "Password123!", bio: "Building the future of social.", avatar: "/uploads/seed_avatar_3.jpg" },
      { name: "Alex Mercer", email: "alex@example.com", password: "Password123!", bio: "Fashion & lifestyle.", avatar: "/uploads/seed_avatar_4.jpg" },
      { name: "David Chen", email: "david@example.com", password: "Password123!", bio: "Coffee addict and coder.", avatar: "/uploads/seed_avatar_5.jpg" },
    ];

    const createdUsers = [];
    for (const userData of usersData) {
      // Check if user exists
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData);
      }
      createdUsers.push(user);
    }

    console.log('Users created. Adding connections (followers)...');
    // Make them follow each other
    for (let i = 0; i < createdUsers.length; i++) {
      const currentUser = createdUsers[i];
      for (let j = 0; j < createdUsers.length; j++) {
        if (i !== j) {
          if (!currentUser.following.includes(createdUsers[j]._id)) {
             currentUser.following.push(createdUsers[j]._id);
             createdUsers[j].followers.push(currentUser._id);
          }
        }
      }
      await currentUser.save();
    }
    // Save followers
    for (const user of createdUsers) {
      await user.save();
    }

    console.log('Connections made. Creating posts...');

    const postsData = [
      { author: createdUsers[0]._id, text: "Just finished this new piece! The wisteria glow is unreal. 💜✨", image: "/uploads/seed_post_1.jpg" },
      { author: createdUsers[1]._id, text: "Late night walks in the cyberpunk city. The neon lights here never sleep.", image: "/uploads/seed_post_2.jpg" },
      { author: createdUsers[2]._id, text: "My new workspace setup. Purple mechanical switches for the win! ⌨️", image: "/uploads/seed_post_3.jpg" },
      { author: createdUsers[3]._id, text: "Experimenting with 3D glassmorphism in Blender today. Loving these floating spheres.", image: "/uploads/seed_post_4.jpg" },
      { author: createdUsers[4]._id, text: "Nothing beats a late night latte in a moody cafe. Fueling up for the next coding session ☕", image: "/uploads/seed_post_5.jpg" },
    ];

    for (const post of postsData) {
      await Post.create(post);
    }

    console.log('Seeding completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
