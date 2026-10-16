const audio = document.querySelector("#music-audio");
const toggleButton = document.querySelector("#music-toggle");
const backButton = document.querySelector("#music-back");
const forwardButton = document.querySelector("#music-forward");
const timeOutput = document.querySelector("#music-time");
const statusOutput = document.querySelector("#music-status");



function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// function for playing music from current state
function updatePlaybackState() {
  const isPlaying = !audio.paused;
  toggleButton.textContent = isPlaying ? "Pause" : "Play";
  toggleButton.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
}


toggleButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
      statusOutput.textContent = "";
    } catch (error) {
      console.error("Could not play the music file.", error);
      statusOutput.textContent = "Music could not be played. Please try again.";
    }
  } else {
    audio.pause();
  }
});

backButton.addEventListener("click", () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

forwardButton.addEventListener("click", () => {
  const targetTime = audio.currentTime + 10;
  audio.currentTime = Number.isFinite(audio.duration)
    ? Math.min(audio.duration, targetTime)
    : targetTime;
});

audio.addEventListener("timeupdate", () => {
  timeOutput.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("loadedmetadata", () => {
  backButton.disabled = false;
  forwardButton.disabled = false;
  timeOutput.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("play", updatePlaybackState);
audio.addEventListener("pause", updatePlaybackState);
audio.addEventListener("error", () => {
  statusOutput.textContent = "The music file could not be loaded.";
});