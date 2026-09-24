const http = require('http');

const data = JSON.stringify({
  title: "Test Task",
  description: "Checking if creation works",
  priority: "low"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/tasks',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let resData = '';
  res.on('data', chunk => resData += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', resData);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();
