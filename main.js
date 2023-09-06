const hostURL = window.location.href;
let path_json,get_path,MEDIA_TYPES;
let IMAGEList = [];
let VIDEOList = [];
let count_image = 0;
let count_video = 0;
let timer,date;
let ejaculation_count = 0;
let start = {
  time: []
};

const body = document.querySelector('.main');
const img = document.querySelector('#image_place');
const video = document.querySelector('#video_place');
const background = document.querySelector(".background");
const menu = document.querySelector(".menu")
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
    changeMedia("L",MEDIA_TYPES.IMAGE);
  } else {
    changeMedia("R",MEDIA_TYPES.IMAGE);
  }
};

function speed(b) {
  clearInterval(timer);
  timer = setInterval(function () {
    changeMedia('R', MEDIA_TYPES.IMAGE);
  }, b * 1000);
};

function fetchMedia(folder, list, element) {
  return fetch(`/${folder}`)
    .then(response => response.json())
    .then(media => {
      list.push(...media);
      const max = media.length;
      console.log(`[Media] Type='${media}',length='${max}'`, list);
      element.src = `${hostURL}/${folder}/${list[0]}`;
      return max;
    });
};

async function initialize() {
  await fetchMedia(MEDIA_TYPES.IMAGE, IMAGEList, IMAGEPlayer);
  await fetchMedia(MEDIA_TYPES.VIDEO, VIDEOList, VIDEOPlayer);
};

function process_exit() {
  fetch('/stop', {
    method: 'GET',
  })
};

document.addEventListener("DOMContentLoaded", function () {
  let miss_count = 0;
  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", async function () {
    const enteredPassword = document.getElementById("password-input").value;
    const response = await fetch(`/password`);
    const data = await response.json();
    if (enteredPassword === data) {
      passwordcontainer.classList.toggle('display_none')
      get_path = await fetch(`/path`);
      path_json = await get_path.json();
      MEDIA_TYPES = { VIDEO: path_json.video, IMAGE: path_json.image };
      initialize();
    } else {
      miss_count++;
      if (miss_count > 2) {
        process_exit();
        window.location.href = "https://github.com/sucks-555";
      } else {
        alert(`If you make ${3 - miss_count} more mistakes, you will not be able to use the service.`);
      }
    }
  });
});

function changeMedia(direction, media) {
  if (media === MEDIA_TYPES.IMAGE) {
    const length_image = IMAGEList.length;
    count_image = direction === 'L' ? (count_image === 0 ? length_image - 1 : (count_image - 1) % length_image) : (count_image + 1) % length_image;
    IMAGEPlayer.src = `${hostURL}/${MEDIA_TYPES.IMAGE}/${IMAGEList[count_image]}`;
    console.log(`[Image][${count_image}] [${IMAGEList[count_image]}]`);
  } else {
    const length_video = VIDEOList.length;
    count_video = direction === 'L' ? (count_video === 0 ? length_video - 1 : (count_video - 1) % length_video) : (count_video + 1) % length_video;
    VIDEOPlayer.src = `${hostURL}/${MEDIA_TYPES.VIDEO}/${VIDEOList[count_video]}`;
    console.log(`[video][${count_video}] [${VIDEOList[count_video]}]`);
  }
};
function media_splice(Type) {
  if (Type === "img") {
    IMAGEList.splice(count_image, 1);
    changeMedia('L', MEDIA_TYPES.IMAGE);
  } else {
    VIDEOList.splice(count_video, 1);
    changeMedia('L', MEDIA_TYPES.VIDEO);
  }
}
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
  count_video++;
  if (count_video >= VIDEOList.length) {
    count_video = 0;
  }
  VIDEOPlayer.src = `${hostURL}/${MEDIA_TYPES.VIDEO}/${VIDEOList[count_video]}`;
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
function toggleOnlyMode(media) {
  if (media === 'Image') {
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
  background.classList.toggle("remove");
  range.classList.toggle("display_none");
};
