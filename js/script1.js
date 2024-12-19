const script = document.createElement("script");
script.src = "https://www.youtube.com/iframe_api";
script.onload = onYouTubeIframeAPIReady;
document.body.appendChild(script);

document.addEventListener("DOMContentLoaded", () => {
  const loadingPage = document.getElementById("loading-page1");
  const progressBar = document.querySelector(".progress");
  const mainContent = document.querySelector("main");

  if (loadingPage && progressBar) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      progressBar.style.width = `${progress}%`;
      if (progress >= 100) {
        clearInterval(interval);
        loadingPage.style.opacity = "0";
        loadingPage.style.visibility = "hidden";
        loadingPage.style.display = "none";
        mainContent.style.opacity = "1";
        mainContent.style.visibility = "visible";
      }
    }, 100);
  }
});

// IFrame Player API를 비동기적으로 로드합니다.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// API 코드 로드 후 플레이어를 생성합니다.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtubePlayer", {
    // 여기에서 ID를 변경
    height: "360",
    width: "640",
    videoId: "8wkHOhUIYOc", // 표시할 동영상 ID
    events: {
      onReady: onPlayerReady,
    },
  });
}

// 플레이어가 준비되었을 때 호출되는 함수입니다.
function onPlayerReady(event) {
  // 음소거를 해제합니다.
  event.target.unMute();
  // 동영상을 재생합니다.
  event.target.playVideo();
}
