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



function Sequencer(tempo, wave, vol, detune) {
  
  this.interval_val = 60000 / tempo;
  this.wave = wave;
  this.vol = vol;
  this.detune = detune;
  this.isPaused = true;
  this.oscillators = [];
  this.oscillators['current'] = [];
  this.oscillators['previous'] = [];
  this.i = 0;
    
  var that = this;
  
  this.interval = setInterval(function() {sequenceInterval(that)}, this.interval_val);

}

Sequencer.prototype.pause = function() {
  this.mute();
  this.isPaused = true;
};

Sequencer.prototype.resume = function() {
  this.isPaused = false;
};

Sequencer.prototype.getTempo = function() {
  return this.interval_val;
}

Sequencer.prototype.setTempo = function(bpm) {
  this.interval_val = 60000 / bpm;
  var that = this;
  clearInterval(this.interval);
  this.interval = setInterval(function() {sequenceInterval(that)}, this.interval_val);
}

Sequencer.prototype.setWave = function(wave) {
  this.wave = wave;
}

Sequencer.prototype.mute = function() {
  var j = 0;
  for (j=0; j < this.oscillators['previous'].length; j++) {
    this.oscillators['previous'][j].mute();
  }
}

Sequencer.prototype.setVol = function(vol) {
  this.vol = vol;
}

Sequencer.prototype.setDetune = function(detune) {
  this.detune = detune;
}

Sequencer.prototype.getCheckboxes = function() {
  return document.querySelectorAll('.grid-item input');
}

Sequencer.prototype.clearBoard = function() {
  var checkboxes = this.getCheckboxes();  
  var i;
  for (i=0; i<checkboxes.length; i++) {
    if (checkboxes[i].checked == true) 
      checkboxes[i].checked = false;
  }
  
}

function sequenceInterval(seq) {
    var j;
    seq.freq = [277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88, 523.25];
    
    if (seq.isPaused == false) {
      document.getElementById('counter').innerHTML = seq.i+1;
      /**
      * Set background color of column to indicate which 
      * step in sequence is currently active
      */
      // set class on active step
      seq.current_step = 'step-' + seq.i;
      seq.current_col = document.getElementsByClassName(seq.current_step);

      for (j = 0; j < seq.current_col.length; j++) {
        seq.current_col[j].classList.add('active-step');
      }
      
      // now remove from last (inactive) step   
      if (seq.i > 0) { seq.last_step = 'step-' + (seq.i-1); }
      else { seq.last_step = 'step-' + (15); }
    
      seq.last_col = document.getElementsByClassName(seq.last_step);
      for (j = 0; j < seq.last_col.length; j++) {
        seq.last_col[j].classList.remove('active-step');
      }
    
      // get all available notes
      seq.current_notes = [];
      for(j=0; j < seq.current_col.length; j++) {
        seq.current_notes.push(seq.current_col[j].childNodes[0]);
      } 
  
      // now get the ones that are actually selected
      seq.selected_notes = [];
      for(j=0; j < seq.current_notes.length; j++) {
        if (seq.current_notes[j].checked == true)
          seq.selected_notes.push(seq.current_notes[j].value);
      }
    
      // now create an oscillator for each of those
      for(j=0; j < seq.selected_notes.length; j++) {
        seq.oscillators['current'].push(new Oscillator(seq.freq[seq.selected_notes[j]], seq.wave, seq.vol, seq.detune));
      }
    
      // now play those oscillator objects
      for (j=0; j < seq.oscillators['current'].length; j++) {
        seq.oscillators['current'][j].play();
      } 
  
      // stop the oscillators from the previous step
      for (j=0; j < seq.oscillators['previous'].length; j++) {
        seq.oscillators['previous'][j].stop();
      } 

      // prepare the current oscillators to be stopped and cleared on next step
      seq.oscillators['previous'] = seq.oscillators['current'];
      seq.oscillators['current'] = [];
      
      seq.i++;
      if (seq.i == 16) seq.i = 0;
    }
    
}
