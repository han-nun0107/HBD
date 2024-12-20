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
