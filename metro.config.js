// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for additional file extensions
  'db', // Example for SQLite databases
  'bin' // Example for binary files
);

module.exports = config;