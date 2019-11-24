/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: sequencer.js
 * @Last modified time: 2019-11-24T15:29:47-05:00
 */


function Sequencer(props) {

  this.current_step = 0;
  this.interval_val = 60000 / props.tempo;
  this.key = props.key;
  this.wave = props.wave;
  this.vol = props.volume;
  this.detune = props.detune;
  this.sustain = props.sustain;
  this.steps = props.step;
  this.color_mode = 'light';
  this.notes = props.notes;
  this.autoMode = props.autoMode;
  this.notes_in_key = props.notes_in_key;
  this.notes_start = props.notes_start;
  this.freqs = [];
  this.auto_seed = 1;

  if (this.notes_in_key !== null) {
    for (i = this.notes_start; i < this.notes_start+12; i++) this.freqs.push(Number(this.notes_in_key[i].frequency));
  } else {
    this.freqs = [277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88, 523.25];
  }

  this.setKey(this.key);

  this.deactivateSteps();
  this.isPaused = true;
  this.oscillators = [];
  this.oscillators.current = [];
  this.oscillators.previous = [];
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
  this.resetInterval();
}

Sequencer.prototype.setWave = function(wave) {
  this.wave = wave;
}

Sequencer.prototype.mute = function() {
  var j = 0;
  for (j=0; j < this.oscillators['previous'].length; j++) {
    this.oscillators['previous'][j].stop();
  }
}

Sequencer.prototype.setVol = function(vol) {
  this.vol = vol;
}

Sequencer.prototype.setDetune = function(detune) {
  this.detune = detune;
}

Sequencer.prototype.setNoteRange = function(start) {
  this.notes_start = start;
  this.freqs = [];
  for (i = this.notes_start; i < this.notes_start+12; i++)
    this.freqs.push(Number(this.notes_in_key[i].frequency));
  this.updateNoteKeyDisplay();
}

Sequencer.prototype.setKey = function(key) {
  this.key = key;
  this.notes_in_key = this.getNotesByKey(this.key);
  this.setNoteRange(this.notes_start);
}

Sequencer.prototype.getNotesByKey = function(key) {
  var notes_in_key = [];

  if (key == 'chromatic') {
    for (i = 0; i < this.notes.length; i++) {
      if (i > 20) {
        notes_in_key.push(this.notes[i]);
      }
    }
    return notes_in_key;
  }

  var scale_pattern = [2, 2, 1, 2, 2, 2, 1];
  var note_index = 0;
  var key_sign = '';
  var key_note = '';
  if (key.length > 1) {
    key = key.split('');
    key_note = key[0];
    key_sign = key[1];
  } else {
    key_note = key;
  }

  for (i = 0; i < this.notes.length; i++) {
    if (this.notes[i].letter == key_note && this.notes[i].sign == key_sign) {
      notes_in_key.push(this.notes[i]);
      note_index = i;
      break;
    }
  }

  while (typeof(this.notes[note_index]) !== "undefined") {
    for (i = 0; i < scale_pattern.length; i++) {
      note_index += scale_pattern[i];
      if (typeof(this.notes[note_index]) !== "undefined")
        notes_in_key.push(this.notes[note_index]);
    }
  }
  return notes_in_key;
}

Sequencer.prototype.setSustain = function(sustain) {
  this.sustain = sustain;
}

Sequencer.prototype.getBoxes = function() {
  return document.querySelectorAll('.grid-item .board-block');
}


Sequencer.prototype.clearBoard = function() {
  var boxes = this.getBoxes();
  var i;
  for (i=0; i<boxes.length; i++) {
    if (boxes[i].classList.contains('selected')) {
      boxes[i].classList.remove('selected');
      boxes[i].classList.add('unselected');
    }
  }
}

Sequencer.prototype.resetInterval = function() {
  var that = this;
  clearInterval(this.interval);
  this.interval = setInterval(function() {sequenceInterval(that)}, this.interval_val);
}

Sequencer.prototype.getAllSteps = function() {
  return document.getElementById('controller').childNodes[0].childNodes;
}

Sequencer.prototype.getSelectedBlocks = function() {
  var all_blocks = $('.board-block');
  var selected_blocks = [];
  for (i = 0; i < all_blocks.length; i++) {
    if (all_blocks[i].classList.contains('selected'))
      selected_blocks.push(i);
  }
  return selected_blocks;
}

Sequencer.prototype.getActiveStep = function() {
  var stepsList = this.getAllSteps();
  var i = 0;
  for (i=0; i < stepsList.length; i++) {
    if (stepsList[i].classList.contains('active-step')) {
      var stepclass = stepsList[i].classList[1];
      var step = stepclass.split('-')[1];
      return step;
    }
  }
}

Sequencer.prototype.setSteps = function(steps) {
  this.steps = steps;
  this.deactivateSteps();
  if (this.i >= this.steps) {
    this.i = 0;
    this.clearActiveStep();
  }
  //this.resetInterval();
}

Sequencer.prototype.clearActiveStep = function() {
  var stepsList = this.getAllSteps();
  var i = 0;
  for (i=0; i < stepsList.length; i++) {
    if (stepsList[i].classList.contains('active-step'))
      stepsList[i].classList.remove('active-step');
  }
}

Sequencer.prototype.deactivateSteps = function() {
  var stepsList = this.getAllSteps();
  var i;
  for (i=0; i < stepsList.length; i++) {
    var stepclass = stepsList[i].classList[1];
    var step = stepclass.split('-')[1];
    if (step > (this.steps - 1)) {
      var btn = stepsList[i].childNodes[0].childNodes[0];
      btn.classList.add('disabled-block');
    }
    else if (step < (this.steps)) {
      var btn = stepsList[i].childNodes[0].childNodes[0];
      if (btn.classList.contains('disabled-block'))
        btn.classList.remove('disabled-block');
    }
  }
}

Sequencer.prototype.updateNoteKeyDisplay = function() {
  var key_note_containers = document.querySelectorAll('.key-note-container');
  var start = this.notes_start+1;
  for (i=0; i < key_note_containers.length; i++) {
    key_note_containers[i].innerHTML = `${this.notes_in_key[start].letter}${this.notes_in_key[start].sign}${this.notes_in_key[start].sequence_no}`.padEnd(3,' ')
    start++;
  }
}

Sequencer.prototype.changeColorMode = function() {
  //TODO
  return;
}

Sequencer.prototype.randomSelection = function(seed=null) {
  if (seed == null) seed = this.auto_seed;
  var boardBlocks = this.getBoxes();//document.getElementsByClassName('board-block');
  for (i=0;i<boardBlocks.length; i++) {
    boardBlocks[i].classList.remove('selected');
    boardBlocks[i].classList.add('unselected');
  }
  for (i=0;i<boardBlocks.length; i++) {
    var rand = Math.round(Math.random() * (16));
    if (rand % i == seed) {
      boardBlocks[i].classList.remove('unselected');
      boardBlocks[i].classList.add('selected');
    }
  }
}

Sequencer.prototype.autoModeToggle = function() {
  if (!this.autoMode) {
    this.autoMode = true;
    this.randomSelection(this.auto_seed);
    //if (this.isPaused) this.resume();
  } else this.autoMode = false;
}


function sequenceInterval(seq) {

  if (seq.isPaused) return;

  var j, count;

  this.current_step = seq.i;

  // pad display count
  count = seq.i+1;
  if (count < 10) count = '0' + count;
  document.getElementById('counter').innerHTML = count;
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
  else { seq.last_step = 'step-' + (seq.steps - 1); }

  seq.last_col = document.getElementsByClassName(seq.last_step);
  for (j = 0; j < seq.last_col.length; j++) {
    seq.last_col[j].classList.remove('active-step');
  }

  // get all available notes
  seq.current_notes = [];
  for (j = 0; j < seq.current_col.length; j++) {
    seq.current_notes.push(seq.current_col[j].childNodes[0]);
  }

  // now get the ones that are actually selected
  seq.selected_notes = [];
  for (j = 0; j < seq.current_notes.length; j++) {
    if (seq.current_notes[j].childNodes[0].classList.contains('selected'))
      seq.selected_notes.push(seq.current_notes[j].childNodes[0].id);
  }

  // now create an oscillator for each of those
  for (j = 0; j < seq.selected_notes.length; j++) {
    seq.oscillators['current'].push(new Oscillator(seq.freqs[seq.selected_notes[j]], seq.wave, seq.vol, seq.detune, seq.sustain));
  }

  // now play those oscillator objects
  for (j = 0; j < seq.oscillators['current'].length; j++) {
    seq.oscillators['current'][j].play();
  }

  // stop the oscillators from the previous step
  for (j = 0; j < seq.oscillators['previous'].length; j++) {
    seq.oscillators['previous'][j].stop();
  }

  // prepare the current oscillators to be stopped and cleared on next step
  seq.oscillators['previous'] = seq.oscillators['current'];
  seq.oscillators['current'] = [];

  // this clears extra active step bar in case it appears after change
  if ($('.active-step').length > 12) seq.clearActiveStep();

  seq.i++;
  if (seq.i == seq.steps) seq.i = 0;

  if (seq.autoMode && this.current_step == seq.steps-1) {
    seq.auto_seed = Math.round(Math.random() * (seq.steps/2));
    seq.randomSelection(seq.auto_seed);
  }

}
