require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const env = process.env;
const correctPassword = env.password || 'qwerty';
const port = env.PORT || 3000;
const exclusion = env.EXCLUSION || '@';
const videoExtensions = ['.mp4', '.mov', '.MP4', '.MOV'];
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.PNG', '.JPG', '.JPEG', '.WEBP', '.GIF'];
const localhost = '127.0.0.1';
const IP = config.local ? localhost : env.IPv4 ?? localhost;
const dir = config.samedirectory ? path.join(__dirname, '..', env.FOLDER) : path.join(env.FOLDER || __dirname);
let isAuthenticated = false;
let authenticatedIP = null;

async function getFilesAsync(folderPath, extensionFilter, resultArray, genre = '') {
  const files = await fs.promises.readdir(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const stats = await fs.promises.stat(fullPath);
    if (stats.isDirectory()) {
      if (!file.includes(exclusion) && !file.includes('#')) {
        const subfolderGenre = genre ? path.join(genre, file) : file;
        await getFilesAsync(fullPath, extensionFilter, resultArray, subfolderGenre);
      }
    } else if (extensionFilter.includes(path.extname(file).toLowerCase()) && !file.includes('#')) {
      const filePath = genre ? path.join(genre, file) : file;
      resultArray.push(filePath);
    }
  }
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(`/${env.IMAGE}`, express.static(path.join(dir, env.IMAGE)));
app.use(`/${env.VIDEO}`, express.static(path.join(dir, env.VIDEO)));
app.use(['/path', `/${env.IMAGE}`, `/${env.VIDEO}`], (req, res, next) => {
  const clientIP = req.ip;
  isAuthenticated && clientIP === authenticatedIP ? next() : res.status(401).send('Unauthorized');
});

app.post('/password', (req, res) => {
  const { password } = req.body;
  if (password === correctPassword) {
    isAuthenticated = true;
    authenticatedIP = req.ip;
    res.status(200).send('OK');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/path', async (_, res) => {
  const pathJson = {
    'image': env.IMAGE || 'image',
    'video': env.VIDEO || 'video',
  };
  res.json(pathJson);
});

app.get(`/${env.IMAGE}`, async (_, res) => {
  const listImage = [];
  await getFilesAsync(path.join(dir, env.IMAGE), imageExtensions, listImage);
  res.json(listImage);
});
app.get(`/${env.VIDEO}`, async (_, res) => {
  const listVideo = [];
  await getFilesAsync(path.join(dir, env.VIDEO), videoExtensions, listVideo);
  res.json(listVideo);
});

app.get('/stop', () => {
  process.exit();
});

app.listen(port, IP, () => {
  console.log(`http://${IP}:${port}`);
});
