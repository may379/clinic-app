const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    // connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // check if admin already exists
    const exists = await User.findOne({ email: 'admin@clinic.com' });

    if (exists) {
      console.log('❌ Admin already exists');
      process.exit();
    }

    // hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // create admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@clinic.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin created successfully');
    console.log('Email:', admin.email);
    console.log('Password: admin123');

    process.exit();

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();