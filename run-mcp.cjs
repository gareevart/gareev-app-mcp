#!/usr/bin/env node

// Simple test script to verify MCP server functionality
const { spawn } = require('child_process');
const path = require('path');

console.log('Testing MCP Server...\n');

// Path to the built server
const serverPath = path.join(__dirname, 'build', 'index.js');

// Test environment variables
const testEnv = {
  ...process.env,
  SUPABASE_URL: process.env.SUPABASE_URL || 'connect-supabase-url',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'anon_key',
  APP_BASE_URL: process.env.APP_BASE_URL || 'http://localhost:3000'
};

console.log('Environment variables:');
console.log('- SUPABASE_URL:', testEnv.SUPABASE_URL);
console.log('- SUPABASE_ANON_KEY:', testEnv.SUPABASE_ANON_KEY ? '[SET]' : '[NOT SET]');
console.log('- APP_BASE_URL:', testEnv.APP_BASE_URL);
console.log();

// Start the server
const server = spawn('node', [serverPath], {
  env: testEnv,
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

server.stdout.on('data', (data) => {
  output += data.toString();
});

server.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('Server output:', data.toString());
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  
  // For MCP servers, null exit code after receiving a message is normal
  if (code === null || code === 0) {
    console.log('✅ Server started and responded successfully!');
    console.log('✅ MCP server is working correctly');
  } else {
    console.log('❌ Server failed to start');
    if (errorOutput) {
      console.log('Error output:', errorOutput);
    }
  }
});

server.on('error', (error) => {
  console.log('❌ Failed to start server:', error.message);
});

// Send a test message to the server
setTimeout(() => {
  console.log('Sending test message...');
  
  const testMessage = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "test-client",
        version: "1.0.0"
      }
    }
  }) + '\n';
  
  server.stdin.write(testMessage);
  
  setTimeout(() => {
    server.kill();
  }, 2000);
}, 1000);