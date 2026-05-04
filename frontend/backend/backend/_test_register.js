const http = require('http');

const data = JSON.stringify({
  name: 'Saikumar Kota',
  email: 'saikumar@alajangi.com',
  password: 'Test1234'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log('RESPONSE:', body);
  });
});

req.on('error', (e) => console.error('ERROR:', e.message));
req.write(data);
req.end();
