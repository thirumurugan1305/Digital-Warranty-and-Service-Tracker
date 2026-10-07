const assert = require('assert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Test Warranty Service logic directly
const { calculateWarrantyExpiry, calculateWarrantyStatus } = require('../services/warrantyService');

async function runMilestone2Tests() {
  console.log('====================================================');
  console.log('   RUNNING MILESTONE 2 AUTOMATED TEST SUITE        ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function test(description, fn) {
    try {
      fn();
      console.log(`  ✅ [PASS] ${description}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${description}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Warranty Expiry Calculation Tests
  test('Warranty Engine: calculates 12-month expiry date correctly', () => {
    const purchase = '2025-01-15';
    const expiry = calculateWarrantyExpiry(purchase, 12);
    assert.strictEqual(expiry.toISOString().slice(0, 10), '2026-01-15');
  });

  test('Warranty Engine: evaluates ACTIVE status for future expiry date', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);
    const result = calculateWarrantyStatus(futureDate, 30);
    assert.strictEqual(result.status, 'ACTIVE');
    assert(result.remainingDays > 30);
  });

  test('Warranty Engine: evaluates EXPIRING SOON status within threshold', () => {
    const soonDate = new Date();
    soonDate.setDate(soonDate.getDate() + 15);
    const result = calculateWarrantyStatus(soonDate, 30);
    assert.strictEqual(result.status, 'EXPIRING SOON');
    assert(result.remainingDays <= 30 && result.remainingDays >= 0);
  });

  test('Warranty Engine: evaluates EXPIRED status for past expiry date', () => {
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 6);
    const result = calculateWarrantyStatus(pastDate, 30);
    assert.strictEqual(result.status, 'EXPIRED');
    assert.strictEqual(result.remainingDays, 0);
  });

  // 2. Password Hashing & Security Tests
  await (async () => {
    try {
      const password = 'SuperSecretPassword123!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      test('Security: bcrypt hashes password securely and verifies match', async () => {
        const isMatch = await bcrypt.compare(password, hash);
        assert.strictEqual(isMatch, true);
      });

      test('Security: bcrypt rejects wrong password', async () => {
        const isMatch = await bcrypt.compare('WrongPassword', hash);
        assert.strictEqual(isMatch, false);
      });
    } catch (err) {
      console.error('Password Security Test Failed:', err);
    }
  })();

  // 3. JWT Token Generation & Verification
  test('Security: JWT token generation and verification', () => {
    const secret = 'test_jwt_secret_key';
    const userId = '65f1a2b3c4d5e6f7a8b9c0d1';
    const token = jwt.sign({ id: userId }, secret, { expiresIn: '1h' });

    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.id, userId);
  });

  test('Security: JWT rejects invalid signature', () => {
    const token = jwt.sign({ id: '123' }, 'secret_a');
    assert.throws(() => {
      jwt.verify(token, 'secret_b');
    });
  });

  console.log('\n----------------------------------------------------');
  console.log(`   TEST SUMMARY: Passed: ${passed} | Failed: ${failed}`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runMilestone2Tests();
