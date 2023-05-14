const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const pool = require("./db")

const app = express();
const wss = new WebSocket.Server({ port:8080 });   

app.use(express.json());
app.use(cors());

async function getNextToken() {
  const { rows } = await pool.query(
    'SELECT token FROM patients ORDER BY token DESC LIMIT 1;'
  );
  const lastToken = rows.length ? rows[0].token : 'T-100';
  const nextNumber = parseInt(lastToken.slice(2)) + 1;
  const nextToken = `T-${nextNumber.toString().padStart(3, '0')}`;
  return nextToken;
}

app.get('/patients', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM patients ORDER BY token;');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/patients', async (req, res) => {
  const { name, phone } = req.body;
  const token = await getNextToken();
  try {
    await pool.query(
      'INSERT INTO patients (name, phone, token) VALUES ($1, $2, $3);',
      [name, phone, token]
    );
    res.sendStatus(201);
    broadcast(token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.put('/patients/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const token = req.body.token;
  try {
    await pool.query('UPDATE patients SET token = $1 WHERE id = $2;', [
      token,
      id,
    ]);
    res.sendStatus(200);
    broadcast(token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/current-token', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT token FROM patients WHERE active = true;'
    );
    const token = rows.length ? rows[0].token : null;
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



function broadcast(token) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ token }));
    }
  });
}

app .listen(5000, () => {
  console.log('Server listening on port 5000');
});
