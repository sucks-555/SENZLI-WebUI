require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const env = process.env;
const correctPassword = env.password || 'NoPassword';
const port = env.PORT || 3000;
const exclusion = env.EXCLUSION || '@';
const videoExtensions = ['.mp4', '.mov', '.MP4', '.MOV'];
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.PNG', '.JPG', '.JPEG', '.WEBP', '.GIF'];
let IPAddress;
let dir;

if (config.Access.local) {
  IPAddress = '127.0.0.1';
} else {
  IPAddress = env.WiFi_IPAddress || '127.0.0.1';
}
if (config.dirConditions.samedirectory) {
  dir = path.join(__dirname, '..', env.FOLDER);
} else {
  dir = path.join(env.FOLDER || __dirname);
}

function getFiles(folderPath, extensionFilter, resultArray, genre = '') {
  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    const fullPath = path.join(folderPath, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      if (file !== exclusion && !file.includes('#')) {
        const subfolderGenre = genre ? path.join(genre, file) : file;
        getFiles(fullPath, extensionFilter, resultArray, subfolderGenre);
      }
    } else if (extensionFilter.includes(path.extname(file).toLowerCase()) && !file.includes('#')) {
      const filePath = genre ? path.join(genre, file) : file;
      resultArray.push(filePath);
    }
  });
}

app.get(`/${env.IMAGE}`, (req, res) => {
  const listImage = [];
  getFiles(path.join(dir, env.IMAGE), imageExtensions, listImage);
  res.json(listImage);
});

app.get(`/${env.VIDEO}`, (req, res) => {
  const listVideo = [];
  getFiles(path.join(dir, env.VIDEO), videoExtensions, listVideo);
  res.json(listVideo);
});

app.post('/password', (req, res) => {
  const { password } = req.body;
  if (password === correctPassword) {
    res.status(200).send('OK');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/path', (req, res) => {
  const pathJson = {
    'image': env.IMAGE || 'image',
    'video': env.VIDEO || 'video',
  };
  res.json(pathJson);
});

app.get('/stop', () => {
  process.exit();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(`/${env.IMAGE}`, express.static(path.join(dir, env.IMAGE)));
app.use(`/${env.VIDEO}`, express.static(path.join(dir, env.VIDEO)));

app.listen(port, IPAddress, () => {
  console.log(`Server listening on port ${port}\nhttp://${IPAddress}:${port}`);
});
