let timer = document.querySelector('[test-elem="timer"]');

let startBtn = document.querySelector('[popup-element="popup-close"]');

if (timer) {
  let backTimerUrl = timer.getAttribute("back-timer-url");

  function getServerTimestamp() {
    return fetch(backTimerUrl)
      .then((response) => response.text())
      .then((timestamp) => {
        timer.setAttribute("cur-time", timestamp);
        countdownTimer();
      });
  }

  function countdownTimer() {
    let curServerTime = timer.getAttribute("cur-time");
    let currentDate = new Date(+curServerTime);
    let diff = endDate - currentDate;

    if (diff <= 0) {
      clearInterval(timerId);

      document.dispatchEvent(new Event("ticketTimeout"));
    }

    printCountdown(diff);

    timer.setAttribute("cur-time", parseInt(curServerTime) + 1);
  }

  function printCountdown(diff) {
    let minutes = diff > 0 ? Math.floor(diff / 60) % 60 : 0;
    let seconds = diff > 0 ? Math.floor(diff) % 60 : 0;

    let formatMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formatSeconds = seconds < 10 ? "0" + seconds : seconds;

    elemMinutes.innerHTML = formatMinutes;
    elemSeconds.innerHTML = formatSeconds;
  }
  let elemMinutes = timer.querySelector('[test-elem="minutes"]');
  let elemSeconds = timer.querySelector('[test-elem="seconds"]');

  let endTimestamp;
  let endDate;

  let timerId = null;

  //клик по кнопке попапа и старт таймера после получения данныз с бэка

  startBtn.onclick = () => {
    getServerTimestamp();
    const interval = setInterval(() => {
      endTimestamp = +timer.getAttribute("cur-time") + 1200;
      if (endTimestamp > 1200) {
        endDate = new Date(endTimestamp);
        setInterval(getServerTimestamp, 10000);
        timerId = setInterval(countdownTimer, 1000);
        clearInterval(interval);
      }
    }, 100);
  };
}
