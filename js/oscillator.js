const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function Oscillator(freq, wave, volume, detune) {
  this.vol = audioCtx.createGain();
  this.oscillator = audioCtx.createOscillator();
  this.vol.gain.value = volume / 2;
  this.vol.connect(audioCtx.destination);
  this.oscillator.type = wave;
  this.oscillator.detune.value = detune;
  this.oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
  this.oscillator.connect(this.vol);
}

Oscillator.prototype.play = function() {
  this.oscillator.start();
};

Oscillator.prototype.stop = function() {
  this.mute();
  this.oscillator.stop(0);
};

Oscillator.prototype.mute = function() {
  this.vol.gain.value = 0;
};
