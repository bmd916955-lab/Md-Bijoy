const http = require('http');
const admin = require('firebase-admin');

// Firebase Admin initialization with your database URL
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://friends-agro-incubator-pro-default-rtdb.firebaseio.com"
});

const db = admin.database();

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  try {
    // Example test fetch to prioritize fast data source connection
    const snapshot = await db.ref('/').once('value');
    res.end('Friends Agro Server is Live with Firebase Connected!\n');
  } catch (error) {
    res.end('Friends Agro Server is Live (Firebase warning/fallback)!\n');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Friends Agro MQTT Application is running successfully on port ${PORT}`);
});
