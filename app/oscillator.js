/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: oscillator.js
 * @Last modified time: 2019-11-24T21:24:55-05:00
 */


function Oscillator(freq, wave, volume, detune, sustain) {
  this.vol = audioCtx.createGain();
  this.oscillator = audioCtx.createOscillator();
  this.vol.gain.value = volume / 2;
  this.vol.connect(audioCtx.destination);
  if (wave === 'electric lullaby') this.oscillator.setPeriodicWave(this.getCustomWave());
  else this.oscillator.type = wave;
  this.oscillator.detune.value = detune;
  this.sustain = sustain;
  this.oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz
  this.oscillator.connect(this.vol);
}

Oscillator.prototype.play = function() {
  this.oscillator.start();
};

Oscillator.prototype.stop = function() {
  this.mute();
  this.oscillator.stop(audioCtx.currentTime + this.sustain);
};

Oscillator.prototype.mute = function() {
  // This prevents not from making harsh clicking sound
  try {
    this.vol.gain.setTargetAtTime(0, audioCtx.currentTime, this.sustain);
    this.vol.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + this.sustain);
  } catch (error) {
    console.log(error);
    this.vol.gain.value = 0;
  }
};

Oscillator.prototype.getCustomWave = function() {
  var real = new Float32Array([1,1,1,1,1]);
  var imag = new Float32Array(real.length);
  var options = {
    real: real,
    imag: imag,
    disableNormalization: false
  };
  return new PeriodicWave(audioCtx, options);
}
