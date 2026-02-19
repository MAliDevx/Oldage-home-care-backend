const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin.model");

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB Connected for seeding...");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log("Admin already exists. Skipping seed.");
      await mongoose.connection.close();
      return;
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword
    });

    console.log("Default admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Password:", process.env.ADMIN_PASSWORD);
    
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("Error seeding admin:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();

