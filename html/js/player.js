// Get all audio controls elements
const audioControls = document.querySelectorAll('.audio-controls');

// Loop through each audio control element
audioControls.forEach(control => {
  // Get the audio element
  const audio = control.querySelector('audio');

  // Get the play/pause button
  const playButton = control.querySelector('.play');

  // Get the seek slider
  const seekSlider = control.querySelector('.seek-slider');

  // Get the volume slider
  const volumeSlider = control.querySelector('.volume-slider');

  // Update the seek slider as the audio plays
  audio.addEventListener('timeupdate', function() {
    const percentage = (audio.currentTime / audio.duration) * 100;
    seekSlider.value = percentage;
  });

  // Play/pause the audio when play button is clicked
  playButton.addEventListener('click', function() {
    if (audio.paused) {
      audio.play();
      playButton.classList.replace('play', 'pause');
    } else {
      audio.pause();
      playButton.classList.replace('pause', 'play');
    }
  });

  // Update the current time of the audio when seek slider is moved
  seekSlider.addEventListener('input', function() {
    const time = (audio.duration / 100) * seekSlider.value;
    audio.currentTime = time;
  });

  // Update the volume of the audio when volume slider is moved
  volumeSlider.addEventListener('input', function() {
    audio.volume = volumeSlider.value / 100;
  });
});
