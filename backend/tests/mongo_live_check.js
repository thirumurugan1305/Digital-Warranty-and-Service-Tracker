const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const ServiceRecord = require('../models/ServiceRecord');
const { calculateWarrantyExpiry } = require('../services/warrantyService');
const bcrypt = require('bcryptjs');

async function checkLiveMongo() {
  console.log('====================================================');
  console.log('    MILESTONE 5: LIVE MONGODB INTEGRATION TEST     ');
  console.log('====================================================\n');

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/warranty_tracker';
  console.log(`Connecting to Mongo at: ${mongoURI}`);

  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to live MongoDB daemon successfully!\n');

    // Perform live CRUD test
    const timestamp = Date.now();
    const testEmail = `mongo_verifier_${timestamp}@example.com`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('TestPass123!', salt);

    // 1. User Creation in DB
    console.log('1. Creating test user document in MongoDB...');
    const userDoc = await User.create({
      name: 'Mongo Integration User',
      email: testEmail,
      password: hashedPassword,
    });
    console.log('   ✅ User document created in DB with _id:', userDoc._id.toString());

    // 2. Product Creation in DB
    console.log('2. Creating product document in MongoDB...');
    const expiry = calculateWarrantyExpiry('2025-01-01', 12);
    const productDoc = await Product.create({
      userId: userDoc._id,
      name: 'DB Test Laptop',
      brand: 'Dell',
      category: 'Electronics',
      purchaseDate: new Date('2025-01-01'),
      warrantyPeriod: 12,
      warrantyExpiry: expiry,
    });
    console.log('   ✅ Product document created in DB with _id:', productDoc._id.toString());

    // 3. Service Record Creation in DB
    console.log('3. Creating service record document in MongoDB...');
    const serviceDoc = await ServiceRecord.create({
      userId: userDoc._id,
      productId: productDoc._id,
      serviceDate: new Date('2025-06-01'),
      issue: 'Battery checkup',
      serviceCenter: 'Dell Authorized Service',
      cost: 50,
      status: 'Completed',
    });
    console.log('   ✅ Service record document created in DB with _id:', serviceDoc._id.toString());

    // 4. Querying documents back
    console.log('4. Querying saved documents back from MongoDB...');
    const foundUser = await User.findById(userDoc._id);
    const foundProducts = await Product.find({ userId: userDoc._id });
    const foundServices = await ServiceRecord.find({ userId: userDoc._id });

    console.log('   ✅ Found User:', foundUser.email);
    console.log('   ✅ Found Products count:', foundProducts.length);
    console.log('   ✅ Found Services count:', foundServices.length);

    // 5. Cleanup
    console.log('5. Cleaning up temporary MongoDB documents...');
    await ServiceRecord.deleteOne({ _id: serviceDoc._id });
    await Product.deleteOne({ _id: productDoc._id });
    await User.deleteOne({ _id: userDoc._id });
    console.log('   ✅ Cleaned up temporary test documents.');

    console.log('\n====================================================');
    console.log('   LIVE MONGODB INTEGRATION TEST RESULT: PASSED 100%');
    console.log('====================================================');
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.log('\n----------------------------------------------------');
    console.log('❌ LIVE MONGODB INTEGRATION STATUS: OFFLINE');
    console.log(`   Connection Error: ${err.message}`);
    console.log('   Note: Local MongoDB daemon is currently not running on this machine.');
    console.log('   To start MongoDB: run "net start MongoDB" or "mongod" in command prompt.');
    console.log('----------------------------------------------------\n');
    return false;
  }
}

checkLiveMongo();
