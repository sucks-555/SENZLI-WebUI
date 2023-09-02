require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const ENV = process.env
const port = ENV.PORT;
const exclusion = ENV.EXCLUSION
const video = `/${ENV.VIDEO}`;
const Image = `/${ENV.IMAGE}`;
let count = 0;
let IPAddress;
let dir;

const videoExtensions = ['.mp4','.mov','.MP4','.MOV']
const imageExtensions = ['.png','.jpg','.jpeg','.webp','.gif','.PNG','.JPG','.JPEG','.WEBP','.GIF'];

if (config.Access.local) {
  IPAddress = '127.0.0.1';
} else {
  IPAddress = ENV.WiFi_IPAddress;
}
if (config.dirConditions.samedirectory) {
  dir = path.join(__dirname, '..', ENV.FOLDER);
} else {
  dir = path.join(ENV.FOLDER);
}
console.log('Directory:', dir);
console.log('IPAddress:', IPAddress);

function getFiles(folderPath, extensionFilter, resultArray, genre) {
  const files = fs.readdirSync(folderPath);

  files.forEach(file => {
    const fullPath = path.join(folderPath, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      if (file !== exclusion && file.indexOf('#') === -1) {
        const subfolderGenre = genre ? path.join(genre, file) : file;
        getFiles(fullPath, extensionFilter, resultArray, subfolderGenre);
      }
    } else if (extensionFilter.includes(path.extname(file).toLowerCase()) && !file.includes('#')) {
      const filePath = genre ? path.join(genre, file) : file;
      resultArray.push(filePath);
    }
  });
};
function AccessCount(IP, Agent) {
  count ++;
  const result = {
    UserAgent: Agent,
    IPAddress: IP,
    Total_Access: count,
  };
  return result;
};
function print(Type, list) {
  list.forEach(item => console.log(`[${Type}] ${item}`));
};
app.get(Image, (req, res) => {
  const list_Image = [];
  getFiles(path.join(dir,Image),imageExtensions,list_Image);
  res.json(list_Image);
  print('Image',list_Image);
});
app.get(video, (req, res) => {
  const list_video = [];
  getFiles(path.join(dir,video),videoExtensions,list_video);
  res.json(list_video);
  print('video',list_video);
  const accessInfo = AccessCount(req.ip, req.get('User-Agent'));
  console.log(accessInfo);
});
app.get('/password', (req, res) => {
  const password = ENV.password;
  res.json(password);
});
app.get('/stop', (req, res) => {
  process.exit();
});
app.use(express.static(path.join(__dirname, '')));
app.listen(port, IPAddress, () => {
  console.log(`Server listening on port ${port}\nhttp://${IPAddress}:${port}`);
});
