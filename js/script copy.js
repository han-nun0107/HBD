// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// 전역 변수 설정
let sections = gsap.utils.toArray(".parallax__item");
let currentIndex = 0;
let isAnimating = false; // 애니메이션 진행 여부 플래그

/* 서비스 워커 업데이트 */
if ("serviceWorker" in navigator) {
  console.log("Service Worker is supported by this browser."); // 브라우저 지원 확인 로그

  if (!localStorage.getItem("serviceWorkerUnregistered")) {
    console.log(
      "Service Worker not unregistered yet. Proceeding with unregistration."
    ); // 초기 상태 확인 로그

    // 서비스 워커 해제
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        if (registrations.length > 0) {
          console.log(
            `Found ${registrations.length} service worker(s). Unregistering them now.`
          ); // 등록된 서비스 워커 개수 로그
          registrations.forEach((registration) => {
            console.log("Unregistering service worker:", registration); // 개별 서비스 워커 로그
            registration.unregister();
          });
        } else {
          console.log("No service workers found."); // 서비스 워커가 없을 때 로그
        }
      })
      .catch((error) => {
        console.error("Error while fetching service workers:", error); // 에러 로그
      });

    // 해제 완료 상태 저장
    localStorage.setItem("serviceWorkerUnregistered", "true");
    console.log(
      "Service Worker unregistration complete. Updating localStorage."
    ); // 상태 저장 로그

    // 캐시 무시 새로고침
    const newUrl =
      window.location.href.split("?")[0] + "?no-cache=" + new Date().getTime();
    console.log("Reloading the page with no-cache URL:", newUrl); // 새로고침 URL 로그
    window.location.href = newUrl;
  } else {
    console.log(
      "Service Worker already unregistered. Skipping unregistration."
    ); // 이미 해제된 경우 로그
  }
} else {
  console.warn("Service Worker is not supported by this browser."); // 브라우저 미지원 경고 로그
}

// 섹션 변경 함수
function changeSection(direction) {
  if (isAnimating) return;

  // 방향에 따른 인덱스 변경
  if (direction === "next" && currentIndex < sections.length - 1) {
    currentIndex++;
  } else if (direction === "prev" && currentIndex > 0) {
    currentIndex--;
  } else {
    return;
  }

  isAnimating = true;

  // 섹션 이동 애니메이션
  gsap.to("#parallax__cont", {
    x: -currentIndex * window.innerWidth,
    duration: 2,
    ease: "power1.inOut",
    onComplete: () => {
      isAnimating = false; // 애니메이션 종료
      animateText(sections[currentIndex]); // 텍스트 애니메이션 실행
    },
  });
}

// 텍스트 애니메이션 함수
function animateText(section) {
  const textElement = section.querySelector("text");
  if (textElement) {
    gsap.fromTo(
      textElement,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }
}

// 휠 이벤트 리스너
window.addEventListener("wheel", (event) => {
  if (event.deltaY > 0) {
    changeSection("next");
  } else if (event.deltaY < 0) {
    changeSection("prev");
  }
});

// 키보드 이벤트 리스너 (스페이스바로 섹션 이동)
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    changeSection("next");
  }
});

// 로딩 화면 처리
document.addEventListener("DOMContentLoaded", () => {
  const loadingPage = document.getElementById("loading-page");
  const progressBar = document.querySelector(".progress");
  if (loadingPage && progressBar) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      progressBar.style.width = `${progress}%`;
      if (progress >= 100) {
        clearInterval(interval);
        loadingPage.style.opacity = "0";
      }
    }, 100);
  }
});

// Smooth Scroll 처리
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("header .nav-links a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        event.preventDefault();
        const targetSection = document.getElementById(href.slice(1));
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 60,
            behavior: "smooth",
          });
        }
      }
    });
  });
});

// IntersectionObserver로 섹션 상태 감지
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const iframe = entry.target.querySelector("iframe");

        if (entry.isIntersecting) {
          console.log(`${entry.target.id} 보임`);
          if (iframe) {
            // 동영상을 0초로 초기화하고 재생
            iframe.contentWindow.postMessage(
              '{"event":"command","func":"seekTo","args":[0, true]}',
              "*"
            );
            iframe.contentWindow.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              "*"
            );
          }
        } else {
          console.log(`${entry.target.id} 벗어남`);
          if (iframe) {
            // 동영상 일시 정지
            iframe.contentWindow.postMessage(
              '{"event":"command","func":"pauseVideo","args":""}',
              "*"
            );
          }
        }
      });
    },
    { threshold: 0.5 } // 뷰포트의 50% 이상 보이면 활성화
  );

  const sections = document.querySelectorAll(".parallax__item");
  sections.forEach((section) => observer.observe(section));
});

// Iframe 및 동영상 토글 처리
document.addEventListener("DOMContentLoaded", () => {
  const masks = document.querySelectorAll("[id^='text-mask-svg']");

  masks.forEach((mask, index) => {
    const sectionNumber = index + 1;
    const iframe = document.querySelector(`#youtubePlayer${sectionNumber}`);
    const textElement = mask.querySelector("text");

    if (iframe && textElement) {
      textElement.style.pointerEvents = "auto";
      textElement.style.cursor = "pointer";

      // 텍스트 클릭 이벤트
      textElement.addEventListener("click", () => {
        console.log(`텍스트 클릭됨: 섹션 ${sectionNumber}`);

        // 모든 iframe 숨기기
        const allIframes = document.querySelectorAll(".video-iframe");
        allIframes.forEach((frame) => {
          frame.classList.add("hidden");
          frame.style.display = "none";
        });

        // 클릭한 iframe 표시
        if (iframe.classList.contains("hidden")) {
          iframe.classList.remove("hidden");
          iframe.style.display = "block";
        }
      });
    } else {
      console.error(
        `iframe 또는 textElement를 찾을 수 없습니다. (섹션: ${sectionNumber})`
      );
    }
  });
});

// Typed.js 애니메이션
document.addEventListener("DOMContentLoaded", () => {
  new Typed(".thx", {
    strings: ["Thanks For Watching", "봐주셔서 감사합니다."],
    typeSpeed: 150,
    backSpeed: 150,
    backDelay: 1000,
    loop: true,
  });
});

/* debug */
document.addEventListener("click", (event) => {
  const clickedElement = event.target;

  // 요소의 ID와 클래스 정보 가져오기
  const elementId = clickedElement.id ? clickedElement.id : "ID 없음";
  const elementClass = clickedElement.className
    ? clickedElement.className
    : "클래스 없음";

  console.log(`클릭된 요소: ${clickedElement.tagName}`);
  console.log(`ID: ${elementId}`);
  console.log(`클래스: ${elementClass}`);

  /* maskSvg1.addEventListener("click", () => {
    const rect = maskSvg1.getBoundingClientRect();
    const sectionRect = section2.getBoundingClientRect();
    console.log(`maskSvg1 좌표: left=${rect.left}, top=${rect.top}`);
    console.log(
      `section2 좌표: left=${sectionRect.left}, top=${sectionRect.top}`
    );
  }); */
});
/* iframe 전체화면 */
document.addEventListener("DOMContentLoaded", () => {
  const sectionCount = 6; // 총 섹션 개수
  const playerInstances = {};

  // YouTube IFrame API 객체 초기화
  function onYouTubeIframeAPIReady() {
    for (let i = 1; i <= sectionCount; i++) {
      const iframeId = `youtubePlayer${i}`;
      const iframeElement = document.getElementById(iframeId);

      if (iframeElement) {
        playerInstances[iframeId] = new YT.Player(iframeId, {
          events: {
            onReady: (event) => {
              console.log(`${iframeId} YouTube Player Ready`);
              // 플레이어 준비 완료 상태 설정
              event.target.readyState = true;
            },
          },
        });
      }
    }
  }

  // YouTube API 로드
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  script.onload = onYouTubeIframeAPIReady;
  document.body.appendChild(script);

  // 각 섹션에 대해 이벤트 리스너 설정
  for (let i = 1; i <= sectionCount; i++) {
    const textMaskSvg = document.getElementById(`text-mask-svg${i}`);
    const youtubePlayer = document.getElementById(`youtubePlayer${i}`);
    const videoBg = document.getElementById(`videoBg${i}`);

    if (!textMaskSvg || !youtubePlayer || !videoBg) {
      console.error(`섹션 ${i}: 요소를 찾을 수 없습니다.`);
      continue;
    }

    // '텍스트 클릭' 시 동영상 표시 및 화질 설정
    textMaskSvg.addEventListener("click", () => {
      youtubePlayer.style.display = "block";
      videoBg.style.display = "block";

      const player = playerInstances[`youtubePlayer${i}`];
      if (player) {
        // 플레이어 준비 여부 확인
        if (player.readyState) {
          player.setPlaybackQuality("hd1080"); // 즉시 화질 설정
          player.playVideo();
          player.getIframe().requestFullscreen();
          player.unMute();
          console.log("화질을 1080p로 설정했습니다.");
        } else {
          console.log("플레이어가 아직 준비되지 않았습니다.");
        }
      }
    });

    // iframe 클릭 시 동영상 숨김
    youtubePlayer.addEventListener("click", () => {
      youtubePlayer.style.display = "none";
      videoBg.style.display = "none";

      const player = playerInstances[`youtubePlayer${i}`];
      if (player) {
      }
    });

    // Escape 키로 동영상 숨김
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePlayer(i);
      }
    });

    // 전체화면 종료 시 동영상 숨김
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        closePlayer(i);
      }
    });

    // 동영상 숨김 함수
    function closePlayer(sectionIndex) {
      if (sectionIndex !== i) return;

      youtubePlayer.style.display = "none";
      videoBg.style.display = "none";

      const player = playerInstances[`youtubePlayer${sectionIndex}`];
      if (player) {
        player.mute();
      }
    }
  }
});
/* --------------------------------------------------------- */
setInterval(() => {
  if (document.querySelectorAll(".ad-showing").length > 0) {
    const video = document.querySelector("video");
    if (video) {
      video.currentTime = video.duration;
    }
  }
}, 500);

document.addEventListener("DOMContentLoaded", () => {
  const masks = document.querySelectorAll("[id^='text-mask-svg']");

  masks.forEach((mask, index) => {
    const sectionNumber = index + 1;
    const iframe = document.querySelector(`#youtubePlayer${sectionNumber}`);
    const textElement = mask.querySelector("text");

    if (iframe && textElement) {
      textElement.style.pointerEvents = "auto";
      textElement.style.cursor = "pointer";

      // 텍스트 클릭 이벤트
      textElement.addEventListener("click", () => {
        console.log(`텍스트 클릭됨: 섹션 ${sectionNumber}`);

        // 모든 iframe 숨기기
        const allIframes = document.querySelectorAll(".video-iframe");
        allIframes.forEach((frame) => {
          frame.classList.remove("active");
          setTimeout(() => {
            frame.style.display = "none";
          }, 500); // 애니메이션 시간과 일치
        });

        // 클릭한 iframe 표시 (슬라이드 효과 시작)
        iframe.style.display = "block";
        setTimeout(() => {
          iframe.classList.add("active");
        }, 10);
      });
    } else {
      console.error(
        `iframe 또는 textElement를 찾을 수 없습니다. (섹션: ${sectionNumber})`
      );
    }
  });
});
/* ------------------ */
function onYouTubeIframeAPIReady() {
  const videoIds = [
    "youtubePlayer1", // 동영상 ID를 여기에 추가
    "youtubePlayer2",
    "youtubePlayer3",
    "youtubePlayer4",
    "youtubePlayer5",
    "youtubePlayer6",
  ];
  const players = [];

  videoIds.forEach((videoId, index) => {
    const playerId = `player${index + 1}`;
    const player = new YT.Player(playerId, {
      height: "390",
      width: "640",
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        cc_load_policy: 0, // 자막 비활성화
      },
      events: {
        onReady: (event) => {
          // 지속적으로 자막 비활성화
          setInterval(() => {
            event.target.setOption("captions", "track", { languageCode: "" });
          }, 1000); // 1초마다 호출
        },
      },
    });

    players.push(player);
  });
}
