const http = require('http');

function request(method, path, data) {
  return new Promise((resolve) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = http.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
    });
    req.write(body);
    req.end();
  });
}

function authRequest(method, path, data, token) {
  return new Promise((resolve) => {
    const body = JSON.stringify(data || {});
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${token}`
      }
    };
    const req = http.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
    });
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('\n--- Test 1: Access tasks WITHOUT token (should be 401) ---');
  const noAuth = await authRequest('GET', '/api/tasks', {}, '');
  console.log('Status:', noAuth.status, '|', noAuth.body.message);

  console.log('\n--- Test 2: Register a new user ---');
  const reg = await request('POST', '/api/auth/register', { email: 'test@portfolio.com', password: 'test123' });
  console.log('Status:', reg.status, '|', reg.body.message || reg.body.error);
  const token = reg.body.token;

  console.log('\n--- Test 3: Login with those credentials ---');
  const login = await request('POST', '/api/auth/login', { email: 'test@portfolio.com', password: 'test123' });
  console.log('Status:', login.status, '|', login.body.message);
  const loginToken = login.body.token;

  console.log('\n--- Test 4: Create a task WITH token ---');
  const create = await authRequest('POST', '/api/tasks', { title: 'Practical 7 Auth Test', description: 'JWT working!', priority: 'High' }, loginToken);
  console.log('Status:', create.status, '|', create.body.message || create.body.error);
  if (create.body.data) console.log('Task ID:', create.body.data._id);

  console.log('\n--- Test 5: Get /api/auth/me ---');
  const me = await authRequest('GET', '/api/auth/me', {}, loginToken);
  console.log('Status:', me.status, '| User:', me.body.data?.email);

  console.log('\n✅ All tests done!\n');
}

main().catch(console.error);
