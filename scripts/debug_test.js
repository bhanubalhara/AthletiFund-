const fetch = global.fetch || require('node-fetch');
const app = require('../src/server');

(async () => {
  const server = app.listen(0, async () => {
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;
    console.log('Test server listening on', base);

    try {
      const email = `debug+${Date.now()}@example.com`;

      // Register
      let res = await fetch(`${base}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Debug User', email, password: 'password123', role: 'sportsman' })
      });
      console.log('REGISTER', res.status);
      console.log(await res.text());

      // Login
      res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' })
      });
      const loginBody = await res.json();
      console.log('LOGIN', res.status, loginBody.token ? 'token received' : JSON.stringify(loginBody));
      const token = loginBody.token;
      if (!token) throw new Error('No token from login');

      // Create campaign
      res = await fetch(`${base}/api/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: 'Test Campaign', description: 'Debug campaign', targetAmount: 1000 })
      });
      const created = await res.json();
      console.log('CREATE CAMPAIGN', res.status, created._id ? created._id : JSON.stringify(created));
      const campaignId = created._id;

      // Get campaigns
      res = await fetch(`${base}/api/campaigns`);
      const list = await res.json();
      console.log('LIST CAMPAIGNS', res.status, Array.isArray(list) ? `count=${list.length}` : JSON.stringify(list));

      // Update campaign
      res = await fetch(`${base}/api/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: 'Updated Title' })
      });
      const updated = await res.json();
      console.log('UPDATE CAMPAIGN', res.status, updated.title);

      // Delete campaign
      res = await fetch(`${base}/api/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const del = await res.json();
      console.log('DELETE CAMPAIGN', res.status, JSON.stringify(del));

      console.log('All tests completed');
    } catch (err) {
      console.error('TEST ERROR', err);
    } finally {
      server.close(() => {
        console.log('Test server closed');
        process.exit(0);
      });
    }
  });
})();
