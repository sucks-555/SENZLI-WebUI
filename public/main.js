let
  getData,get_path,
  MEDIA_TYPE,
  choice_list=[],IMAGEList=[],VIDEOList=[],
  count_image = 0, count_video = 0,
  timer,
  permit = true;
const
  main = document.querySelector(".main"),
  img = document.querySelector("#image_place"),
  video = document.querySelector("#video_place"),
  background = document.querySelector(".background"),
  menu = document.querySelector(".menu"),
  range = document.getElementById("range"),
  passwordcontainer = document.querySelector(".password-container"),
  VIDEOPlayer = document.getElementById("video_place"),
  IMAGEPlayer = document.getElementById("image_place"),
  InputIMAGE = document.querySelector(".image_input"),
  InputVIDEO = document.querySelector(".video_input"),
  savedDarkMode = localStorage.getItem('darkMode'),
  input = document.getElementById('range');

window.onload = function () {
  load();
  input.addEventListener('change', () => {
    speed(input.value);
  });
  if (savedDarkMode === 'true') {
    toggleDarkMode();
  };
};

window.onmousewheel = function(event) {
  if (event.wheelDelta > 0) {
    changeMedia("L", MEDIA_TYPE.IMAGE);
  } else {
    changeMedia("R", MEDIA_TYPE.IMAGE);
  }
};

function speed(b) {
  clearInterval(timer);
  timer = setInterval(function () {
    changeMedia('R', MEDIA_TYPE.IMAGE);
  }, b * 1000);
  if (b == 10 && timer) {
    timer && clearInterval(timer);
  }
};

function fetchMedia(folder, list, element) {
  return fetch(`/${folder}`)
    .then(response => response.json())
    .then(media => {
      list.push(...media);
      const max = media.length;
      element.src = `/${folder}/${list[0]}`;
      return max;
    });
};

async function initialize() {
  await fetchMedia(MEDIA_TYPE.IMAGE, IMAGEList, IMAGEPlayer);
  await fetchMedia(MEDIA_TYPE.VIDEO, VIDEOList, VIDEOPlayer);
};

document.addEventListener("DOMContentLoaded", function () {
  let miss_count = 0;
  const submitButton = document.getElementById("submit-button");
  const passwordInput = document.getElementById("password-input");

  submitButton.addEventListener("click", async function () {
    const enteredPassword = passwordInput.value;
    try {
      const response = await fetch('/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: enteredPassword })
      });
      if (response.ok) {
        passwordcontainer.classList.toggle('display_none');
        get_path = await fetch("/path");
        getData = await get_path.json();
        MEDIA_TYPE = {
          VIDEO: getData.video,
          IMAGE: getData.image
        };
        initialize();
      } else {
        miss_count++;
        if (miss_count >= 2) {
          process_exit();
        }
      }
    } catch (e) {
      console.error(`error ${e.message}`);
    }
  });
});

function process_exit() {
  location.href = 'http://' + location.host;
  fetch('/stop', {
    method: 'GET',
  })
};

function load() {
  fetch('/load', {
    method: 'GET',
  })
};

function changeMedia(direction, media) {
  if (media === MEDIA_TYPE.IMAGE) {
    const length_image = IMAGEList.length;
    count_image = direction === 'L' ? (count_image === 0 ? length_image - 1 : (count_image - 1) % length_image) : (count_image + 1) % length_image;
    IMAGEPlayer.src = `/${MEDIA_TYPE.IMAGE}/${IMAGEList[count_image]}`;
  } else {
    const length_video = VIDEOList.length;
    count_video = direction === 'L' ? (count_video === 0 ? length_video - 1 : (count_video - 1) % length_video) : (count_video + 1) % length_video;
    VIDEOPlayer.src = `/${MEDIA_TYPE.VIDEO}/${VIDEOList[count_video]}`;
  }
};

let prevImageList = [...IMAGEList];
let prevVideoList = [...VIDEOList];
let prevCountImage = count_image;
let prevCountVideo = count_video;

function media_splice(Type) {
  if (Type === "img" && IMAGEList.length > count_image) {
    prevImageList = [...IMAGEList];
    prevCountImage = count_image;
    IMAGEList.splice(count_image, 1);
    changeMedia('L', MEDIA_TYPE.IMAGE);
  } else if (Type === "video" && VIDEOList.length > count_video) {
    prevVideoList = [...VIDEOList];
    prevCountVideo = count_video;
    VIDEOList.splice(count_video, 1);
    changeMedia('L', MEDIA_TYPE.VIDEO);
  }
}

function undoMediaDeletion(Type) {
  if (Type === "image") {
    IMAGEList = [...prevImageList];
    count_image = prevCountImage;
    changeMedia('L', MEDIA_TYPE.IMAGE);
  } else if (Type === "video") {
    VIDEOList = [...prevVideoList];
    count_video = prevCountVideo;
    changeMedia('L', MEDIA_TYPE.VIDEO);
  }
}

function choice() {
  choice_list.push(IMAGEList[count_image]);
}
function choice_Save() {
  IMAGEList = choice_list;
}
function handleImageInput(k) {
  changeMedia(k.key === 'ArrowRight' || k.key === 'w' ? 'R' : 'L', MEDIA_TYPE.IMAGE);
};

function handleVideoInput(k) {
  changeMedia(k.key === 'ArrowRight' || k.key === 'w' ? 'R' : 'L', MEDIA_TYPE.VIDEO);
};

InputIMAGE.addEventListener('keydown', handleImageInput);
InputVIDEO.addEventListener('keydown', handleVideoInput);
VIDEOPlayer.addEventListener('ended', () => {
  count_video++;
  if (count_video >= VIDEOList.length) {
    count_video = 0;
  }
  VIDEOPlayer.src = `/${MEDIA_TYPE.VIDEO}/${VIDEOList[count_video]}`;
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
  if (media === 'image') {
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
  main.classList.toggle('dark');
  const isDarkMode = main.classList.contains('dark');
  localStorage.setItem('darkMode', isDarkMode);
};
function menu_toggle() {
  menu.classList.toggle("open");
};
function footer_remove() {
  background.classList.toggle("remove");
  range.classList.toggle("display_none");
};
function keydown(event) {
  if (event.key === "A" && permit) {
    togglePictureInPicture();
  } else if (event.key === "R") {
    permit = !permit;
  }
}

window.addEventListener('keydown', keydown);
window.addEventListener('beforeunload', () => {
  window.removeEventListener('keydown', keydown);
});
