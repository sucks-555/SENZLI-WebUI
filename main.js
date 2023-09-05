const hostURL = window.location.href;
const MEDIA_TYPES = { VIDEO: 'video', IMAGE: 'image' };
const FOLDER_PATHS = { VIDEO: '/video', IMAGE: '/image' };

let lengthIMAGE,lengthVIDEO;
let IMAGEList = [];
let VIDEOList = [];
let CountIMAGE = 0;
let CountVIDEO = 0;
let timer,date;
let ejaculation_count = 0;
let miss_count = 0;
let start = {
  time: []
};

const body = document.querySelector('.main');
const img = document.querySelector('#image_place');
const video = document.querySelector('#video_place');
const background = document.querySelector(".background");
const menu = document.querySelector(".menu")
const bottom = document.querySelector(".bottom");
const clock = document.getElementById("clock");
const range = document.getElementById("range");
const passwordcontainer = document.querySelector(".password-container");

const VIDEOPlayer = document.getElementById('video_place');
const IMAGEPlayer = document.getElementById('image_place');
const InputIMAGE = document.querySelector('.image_input');
const InputVIDEO = document.querySelector('.video_input');

window.onload = function () {
  start.time = Date.now();
  let Access = new Date();
  const date_str = `[${Access.getHours()}時${Access.getMinutes()}分${Access.getSeconds()}秒]`;
  document.querySelector('.nowtime').textContent = `${date_str}`;
  date = date_str;
  console.log(date_str);
  const input = document.getElementById('range');
  input.addEventListener('change', () => {
    console.log(`speed ${input.value}`);
    speed(input.value);
  });
};
window.onmousewheel = function(event) {
  if (event.wheelDelta > 0) {
    changeMedia("L","image");
  } else {
    changeMedia("R","image");
  }
};

function speed(b) {
  clearInterval(timer);
  timer = setInterval(function () {
    changeMedia('R', MEDIA_TYPES.IMAGE);
  }, b * 1000);
};

function fetchMedia(type, folder, list, element) {
  return fetch(`/${type}`)
    .then(response => response.json())
    .then(media => {
      list.push(...media);
      const max = media.length;
      console.log(`[Media] Type='${type}',length='${max}'`, list);
      element.src = `${hostURL}${folder}/${media[0]}`;
      return max;
    });
};

async function initialize() {
  lengthIMAGE = await fetchMedia(MEDIA_TYPES.IMAGE, FOLDER_PATHS.IMAGE, IMAGEList, IMAGEPlayer);
  lengthVIDEO = await fetchMedia(MEDIA_TYPES.VIDEO, FOLDER_PATHS.VIDEO, VIDEOList, VIDEOPlayer);
};

function process_exit() {
  fetch('/stop', {
    method: 'GET',
  })
};

document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", async function () {
    const enteredPassword = document.getElementById("password-input").value;
    const response = await fetch(`/password`);
    const data = await response.json();
    if (enteredPassword === data) {
      passwordcontainer.classList.toggle('display_none')
      initialize();
    } else {
      miss_count++;
      if (miss_count > 2) {
        process_exit();
        window.location.href = "https://www.google.com/";
      } else {
        alert(`If you make ${3 - miss_count} more mistakes, you will not be able to use the service.`);
      }
    }
  });
});

function changeMedia(direction, type) {
  if (type === MEDIA_TYPES.IMAGE) {
    const ImageLength = IMAGEList.length;
    CountIMAGE = direction === 'L' ? (CountIMAGE === 0 ? ImageLength - 1 : (CountIMAGE - 1) % ImageLength) : (CountIMAGE + 1) % ImageLength;
    IMAGEPlayer.src = `${hostURL}${FOLDER_PATHS.IMAGE}/${IMAGEList[CountIMAGE]}`;
    console.log(`[Image][${CountIMAGE}] [${IMAGEList[CountIMAGE]}]`);
  } else {
    const videoLength = VIDEOList.length;
    CountVIDEO = direction === 'L' ? (CountVIDEO === 0 ? videoLength - 1 : (CountVIDEO - 1) % videoLength) : (CountVIDEO + 1) % videoLength;
    VIDEOPlayer.src = `${hostURL}${FOLDER_PATHS.VIDEO}/${VIDEOList[CountVIDEO]}`;
    console.log(`[video][${CountVIDEO}] [${VIDEOList[CountVIDEO]}]`);
  }
};
function handleImageInput(i) {
  const key = i.key;
  changeMedia(key === 'ArrowRight' || key === 'w' ? 'R' : 'L', MEDIA_TYPES.IMAGE);
};
function handleVideoInput(v) {
  const key = v.key;
  changeMedia(key === 'ArrowRight' || key === 'w' ? 'R' : 'L', MEDIA_TYPES.VIDEO);
};
function ejacu_count() {
  ejaculation_count ++;
  document.querySelector('.ejaculation-count').textContent = `${ejaculation_count}`;
  ejaculation();
};
function ejaculation() {
  let now = new Date();
  let date_now = Date.now();
  let date_now_str = `[${now.getHours()}時${now.getMinutes()}分${now.getSeconds()}秒]`;
  let result = Math.ceil((date_now - start.time) / 1000);
  let hours = Math.floor(result / 3600);
  let minutes = Math.floor((result % 3600) / 60);
  let seconds = result % 60;
  let till_str = `${hours}時間${minutes}分${seconds}秒`; // 時間、分、秒を表示する形式に変更
  const ejacu_str = `${date_now_str} [TILL ${till_str}]`;
  document.querySelector(".ejaculation").textContent = ejacu_str;
  document.querySelector('.nowtime').textContent = `${date}`;
  start.time = date_now;
  date = date_now_str;
};
InputIMAGE.addEventListener('keydown', handleImageInput);
InputVIDEO.addEventListener('keydown', handleVideoInput);

VIDEOPlayer.addEventListener('ended', () => {
  CountVIDEO++;
  if (CountVIDEO >= VIDEOList.length) {
    CountVIDEO = 0;
  }
  VIDEOPlayer.src = `${hostURL}${FOLDER_PATHS.VIDEO}/${VIDEOList[CountVIDEO]}`;
});
function playVideo() {
  if (VIDEOPlayer.paused) {
    VIDEOPlayer.play();
  }
};
function pauseVideo() {
  if (!VIDEOPlayer.paused) {
    VIDEOPlayer.pause();
  }
};
function toggleOnlyMode(type) {
  if (type === 'Image') {
    img.classList.toggle('only_mode');
    video.classList.toggle('display_none');
  } else {
    video.classList.toggle('only_mode');
    img.classList.toggle('display_none');
  }
};
function togglePlayPause() {
  if (VIDEOPlayer.paused) {
    playVideo();
  } else {
    pauseVideo();
  }
};
function togglePictureInPicture() {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else {
    VIDEOPlayer.requestPictureInPicture();
  }
};
function toggleDarkMode() {
  body.classList.toggle('dark');
  const isDarkMode = body.classList.contains('dark');
  localStorage.setItem('darkMode', isDarkMode);
};
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
  toggleDarkMode();
};
function menu_toggle() {
  menu.classList.toggle("open");
};
function footer_remove() {
  clock.classList.toggle("display_none");
  bottom.classList.toggle("display_none");
  background.classList.toggle("remove");
  range.classList.toggle("display_none");
};
