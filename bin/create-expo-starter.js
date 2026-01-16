#!/usr/bin/env node

const { run } = require('../src/index');

run().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
