#!/usr/bin/env node

/**
 * VAPID Key Generator
 *
 * This script generates VAPID (Voluntary Application Server Identification) keys
 * for Web Push notifications. Run this script to generate keys for your .env file.
 *
 * Usage: node scripts/generate-vapid-keys.js
 */

const crypto = require('crypto');

function generateVapidKeys() {
  console.log('\n==============================================');
  console.log('VAPID Key Generator for Web Push Notifications');
  console.log('==============================================\n');

  try {
    // Generate ECDSA key pair
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'der'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'der'
      }
    });

    // Convert to base64url format
    const publicKeyBase64 = publicKey.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const privateKeyBase64 = privateKey.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    console.log('Generated VAPID Keys:\n');
    console.log('Public Key:');
    console.log(publicKeyBase64);
    console.log('\nPrivate Key:');
    console.log(privateKeyBase64);
    console.log('\n==============================================');
    console.log('Add these to your .env file:');
    console.log('==============================================\n');
    console.log(`VAPID_PUBLIC_KEY=${publicKeyBase64}`);
    console.log(`VAPID_PRIVATE_KEY=${privateKeyBase64}`);
    console.log('VAPID_SUBJECT=mailto:support@theunifiedhealth.com');
    console.log('\n==============================================');
    console.log('IMPORTANT: Keep your private key secure!');
    console.log('==============================================\n');
  } catch (error) {
    console.error('Error generating VAPID keys:', error);
    process.exit(1);
  }
}

// Run the generator
generateVapidKeys();
