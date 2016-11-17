var MusicPlayer = function(model) {
  this.init = function() {
    var resizeVideo = function(){
      if(document.getElementsByClassName('post-preview')[1].clientWidth < 540) {
        document.getElementById('video').style.width = document.getElementsByClassName('post-preview')[1].clientWidth + 'px';
        document.getElementById('video').style.height = (document.getElementsByClassName('post-preview')[1].clientWidth / 2) + 'px';
      }
    };
    window.onresize = resizeVideo;
    window.onload = resizeVideo;
    // Set model
    this.model = model;
    // Initialize elements
    this.model.progressBar.height = 25;
    this.model.progressBar.width = 340;
    this.model.volumeBar.height = 25;
    this.model.volumeBar.width = 24;
    this.volumeBar();
    // Click events
    this.model.playButton.onclick = this.playAudio.bind(this);
    this.model.rewindButton.onclick = this.rewindAudio.bind(this);
    this.model.forwardButton.onclick = this.forwardAudio.bind(this);
    this.model.stopButton.onclick = this.stopAudio.bind(this);
    this.model.volumeOff.onclick = this.volumeOff.bind(this);
    this.model.volumeDown.onclick = this.volumeDown.bind(this);
    this.model.volumeUp.onclick = this.volumeUp.bind(this);
    this.model.progressBar.onclick = this.clickTime.bind(this);
    // Time & Volume
    this.model.audioElement.ontimeupdate = this.progressBar.bind(this);
    this.model.audioElement.onvolumechange = this.volumeBar.bind(this);
  };
  this.model = null;
  // Plays the audio file
  this.playAudio = function() {
    // Tests the paused attribute and set state
    if (this.model.audioElement.paused) {
      this.model.audioElement.play();
      this.model.playButton.children[0].className = 'glyphicon glyphicon-pause';
    } else {
      this.model.audioElement.pause();
      this.model.playButton.children[0].className = 'glyphicon glyphicon-play';
    }
  };
  // Rewinds the audio file by 30 seconds
  this.rewindAudio = function() {
    this.model.audioElement.currentTime -= 30.0;
  };
  // Fast forwards the audio file by 30 seconds
  this.forwardAudio = function() {
    this.model.audioElement.currentTime += 30.0;
  };
  // Stops the audio file
  this.stopAudio = function() {
    this.model.audioElement.pause();
    this.model.audioElement.currentTime = 0;
    this.model.playButton.children[0].className = 'glyphicon glyphicon-play';
  };
  this.volumeOff = function() {
    this.model.audioElement.volume = 0;
  };
  this.volumeDown = function() {
    if(this.model.audioElement.volume > .001)
      this.model.audioElement.volume -= .1;
  };
  this.volumeUp = function() {
    if(this.model.audioElement.volume < .999)
      this.model.audioElement.volume += .1;
  };
  this.clickTime = function(e) {
    // Get the latest windows event if it isn't set
    e = e || window.event;
    // Calculate the current time based on position of mouse cursor in canvas box
    this.model.audioElement.currentTime = this.model.audioElement.duration * (e.offsetX / this.model.progressBar.clientWidth);
  };
  this.progressBar = function() {
    // Get current time in seconds
    var elapsedTime = Math.round(this.model.audioElement.currentTime);
    // Update the progress bar
    if (this.model.progressBar.getContext) {
      var ctx = this.model.progressBar.getContext('2d');
      // Clear canvas before painting
      ctx.clearRect(0, 0, this.model.progressBar.clientWidth, this.model.progressBar.clientHeight);
      ctx.fillStyle = 'rgb(73,155,234)';
      var fWidth = (elapsedTime / this.model.audioElement.duration) * (this.model.progressBar.clientWidth);
      if (fWidth > 0) {
        ctx.fillRect(0, 0, fWidth, this.model.progressBar.clientHeight);
      }
    }
  };
  this.volumeBar = function() {
    var volume = this.model.audioElement.volume;
    // Update the volume bar
    if (this.model.volumeBar.getContext) {
      var ctx = this.model.volumeBar.getContext('2d');
      ctx.clearRect(0, 0, this.model.volumeBar.clientWidth, this.model.volumeBar.clientHeight);
      ctx.fillStyle = 'rgb(73,155,234)';
      var fHeight = this.model.volumeBar.clientHeight - volume * this.model.volumeBar.clientHeight;
      ctx.fillRect(0, fHeight, this.model.volumeBar.clientWidth, this.model.volumeBar.clientHeight - fHeight);
    }
  };
};

var MusicPlayerView = {
  audioElement: document.getElementById('myaudio'),
  progressBar: document.getElementById('progress-bar'),
  volumeBar: document.getElementById('volume-bar'),
  audioURL: document.getElementById('audiofile'),
  playButton: document.getElementById('play'),
  stopButton: document.getElementById('stop'),
  rewindButton: document.getElementById('rewind'),
  forwardButton: document.getElementById('forward'),
  volumeOff: document.getElementById('volume-off'),
  volumeDown: document.getElementById('volume-down'),
  volumeUp: document.getElementById('volume-up')
};

// Check for audio element support
if (window.HTMLAudioElement) {
  var MP = new MusicPlayer(MusicPlayerView);
  MP.init();
}
