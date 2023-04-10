const doc = document;
const win = window;
const nav = navigator;
const loc = location;
const scr = screen;
const his = history;
const loca = localStorage;
const sess = sessionStorage;
const con = console;
const navu = navigator.userAgent;
const navp = navigator.platform;
const navl = navigator.language;
const navv = navigator.vendor;
class Particle {
    constructor(index, parent) {
      this.index = index;
      this.parent = parent;
      this.minSize = 5;
      this.init();
    }
    init() {
      this.freqVal = this.parent.freqData[this.index] * 0.01;
      this.size =
      this.freqVal * (
      (this.parent.dimensions.x + this.parent.dimensions.y) * 0.5) *
      0.0125 +
      this.minSize;
      this.position = new Vector2(
      Math.random() * this.parent.dimensions.x,
      this.parent.dimensions.y + this.size + Math.random() * 50);
  
      this.velocity = new Vector2(2 - Math.random() * 4, 0);
    }
    update() {
      this.freqVal = this.parent.freqData[this.index] * 0.01;
  
      this.size = this.freqVal * 20 + this.minSize;
  
      this.hue =
      this.index / this.parent.analyser.frequencyBinCount * 360 + 120 + this.parent.tick / 6;
      this.saturation = this.freqVal * 50;
      this.alpha = this.freqVal * 0.3;
  
      this.fill = `hsla(${this.hue}, ${this.saturation}%, 50%, ${this.alpha})`;
      this.lift = Math.pow(this.freqVal, 3);
  
      this.position.subY(this.lift + 0.5);
      this.position.add(this.velocity);
  
      this.checkBounds();
    }
    checkBounds() {
      if (
      this.position.y < -this.size ||
      this.position.x < -this.parent.dimensions.x * 0.15 ||
      this.position.x > this.parent.dimensions.x * 1.15)
      {
        this.init();
      }
    }}
  
  
  class App {
    constructor() {
      this.globalMovement = new Vector2();
      this.initCanvas();
      this.initUI();
      this.initAudio();
      this.btnMakeGoogleHappy = document.querySelector(".make-google-happy-button");
      this.btnMakeGoogleHappy.addEventListener("click", () => {
        this.audioCtx.resume();
        this.loadAudio();
        this.btnMakeGoogleHappy.classList.add("hidden");
      });
      this.populate();
      this.render();
      window.onresize = () => {
        this.resize();
      };
    }
    initCanvas() {
      this.tick = 0;
      this.dark = false;
      this.wave = true;
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.glowLayer = document.getElementById("glow-layer");
      this.glowCtx = this.glowLayer.getContext("2d");
      this.dimensions = {};
      this.resize();
    }
    resize() {
      this.canvas.width = this.glowLayer.width = this.dimensions.x = window.innerWidth;
      this.canvas.height = this.glowLayer.height = this.dimensions.y = window.innerHeight;
    }
    initUI() {
      this.progressBar = document.querySelector("#progress-bar");
      this.controls = {
        wave: document.querySelector("#btn-wave"),
        lights: document.querySelector("#btn-lights"),
        prev: document.querySelector("#btn-prev"),
        next: document.querySelector("#btn-next"),
        play: document.querySelector("#btn-play"),
        volume: document.querySelector("#btn-volume") };
  
      this.controls.wave.onclick = () => {
        let i = this.controls.wave.getElementsByTagName("i")[0];
        if (this.wave) {
          i.classList.add("off");
          this.wave = false;
        } else if (!this.wave) {
          i.classList.remove("off");
          this.wave = true;
        }
      };
      this.controls.lights.onclick = () => {
        let i = this.controls.lights.getElementsByTagName("i")[0];
        if (this.dark) {
          i.classList.remove("off");
          this.background.classList.remove("hidden");
          this.dark = false;
        } else if (!this.dark) {
          i.classList.add("off");
          this.background.classList.add("hidden");
          this.dark = true;
        }
      };
      this.controls.prev.onclick = () => {
        this.currentSong = this.currentSong > 1 ?
        this.currentSong - 1 :
        this.fileNames.length;
        this.loadAudio();
      };
      this.controls.next.onclick = () => {
        this.currentSong = this.currentSong < this.fileNames.length ?
        this.currentSong + 1 :
        1;
        this.loadAudio();
      };
      this.controls.play.onclick = () => {
        let i = this.controls.play.getElementsByTagName("i")[0];
        if (this.playing && this.audioReady) {
          i.classList.remove("fa-pause");
          i.classList.add("fa-play");
          this.playing = false;
          this.audio.pause();
        } else if (!this.playing && this.audioReady) {
          i.classList.remove("fa-play");
          i.classList.add("fa-pause");
          this.playing = true;
          this.audio.play();
        }
      };
      this.controls.volume.onclick = () => {
        let i = this.controls.volume.getElementsByTagName("i")[0];
        this.volume = this.volume > 0 ? this.volume - 0.5 : 1;
        switch (this.volume) {
          case 1:
            i.classList.remove("fa-volume-off");
            i.classList.add("fa-volume-up");
            break;
          case 0.5:
            i.classList.remove("fa-volume-up");
            i.classList.add("fa-volume-down");
            break;
          case 0:
            i.classList.remove("fa-volume-down");
            i.classList.add("fa-volume-off");
            break;
          default:
            break;}
  
        this.gainNode.gain.value = this.volume;
      };
      this.background = document.getElementById("background");
      this.title = document.getElementById("title");
    }
    initAudio() {
      this.currentSong = 1;
      this.volume = 1;
      this.baseURL = "https://res.cloudinary.com/sf-cloudinary/video/upload/v1525440046/";
      this.fileNames = [
      "dmwaltz.mp3",
      "nocturne92.mp3",
      "mozart25.mp3",
      "trista.mp3",
      "waltzflowers.mp3"];
  
      this.songTitles = [
      "Dmitri Shostakovich - Waltz No. 2",
      "Frederic Chopin - Nocturne op. 9 no. 2",
      "Mozart - Symphony no. 25",
      "Heitor Villa-Lobos - Tristorosa",
      "Pyotr Tchaikovsky - Waltz of the Flowers"];
  
  
      this.audio = document.getElementById("audio");
      this.audio.addEventListener("ended", () => {
        this.audio.currentTime = 0;
        this.audio.pause();
        this.currentSong = this.currentSong < this.fileNames.length ?
        this.currentSong + 1 :
        1;
        this.loadAudio();
      });
      this.audio.addEventListener("timeupdate", () => {
        this.progressBar.style = `transform: scaleX(${this.audio.currentTime / this.audio.duration})`;
      });
  
      this.audioCtx = new AudioContext();
  
      this.source = this.audioCtx.createMediaElementSource(this.audio);
      this.gainNode = this.audioCtx.createGain();
  
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.smoothingTimeConstant = 0.92;
      this.analyser.fftSize = 2048;
      this.analyser.minDecibels = -125;
      this.analyser.maxDecibels = -10;
  
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
  
      this.gainNode.gain.value = this.volume;
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    }
    loadAudio() {
      let request = new XMLHttpRequest();
  
      this.audioReady = false;
      this.playing = false;
      this.background.classList.add("loading");
  
      this.controls.prev.classList.add("disabled");
      this.controls.next.classList.add("disabled");
      this.controls.play.classList.add("disabled");
  
      request.open(
      "GET",
      this.baseURL + this.fileNames[this.currentSong - 1],
      true);
  
      request.responseType = "blob";
  
      request.onprogress = () => {
        if (request.response)
        this.playAudio(request.response);
      };
  
      request.send();
    }
    playAudio(data) {
      this.audioReady = true;
      this.playing = true;
  
      this.background.classList.remove("loading");
      this.title.innerHTML = this.songTitles[this.currentSong - 1];
  
      this.controls.prev.classList.remove("disabled");
      this.controls.next.classList.remove("disabled");
      this.controls.play.classList.remove("disabled");
  
      this.controls.play.getElementsByTagName("i")[0].classList.remove("fa-play");
      this.controls.play.getElementsByTagName("i")[0].classList.add("fa-pause");
  
      this.audio.src = window.URL.createObjectURL(data);
      this.audio.play();
    }
    populate() {
      this.particles = [];
      for (let i = 0; i < 625; i++) {
        this.particles.push(new Particle(i, this));
      }
    }
    update() {
      this.ctx.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
      this.ctx.save();
      this.ctx.globalCompositeOperation = "lighten";
      for (let i = this.particles.length - 1; i >= 0; i--) {
        let particle = this.particles[i];
        if (this.freqData[i] > 0) {
          particle.update();
          if (this.wave) particle.position.add(this.globalMovement);
          this.ctx.beginPath();
          this.ctx.fillStyle = particle.fill;
          this.ctx.beginPath();
          this.ctx.arc(
          particle.position.x,
          particle.position.y,
          particle.size,
          0,
          2 * Math.PI);
  
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
      this.ctx.restore();
      this.glowCtx.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
      this.glowCtx.filter = "blur(8px) saturate(150%) brightness(150%)";
      this.glowCtx.drawImage(this.canvas, 0, 0);
    }
    render() {
      this.tick++;
      if (this.wave) this.globalMovement.x = Math.sin(this.tick * 0.01) * 2;
      this.analyser.getByteFrequencyData(this.freqData);
      this.update();
      window.requestAnimationFrame(this.render.bind(this));
    }}
  
  
  window.requestAnimationFrame = (() => {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      });
  
  })();
  
  window.onload = () => {
    let app = new App();
  };