/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: controller.js
 * @Last modified time: 2019-11-18T21:47:48-05:00
 */

const app = angular.module('stepScript', []);

app.controller('mainController', function($scope) {

  $scope.board = board;

  // Instantiate SequenceStore
  $scope.db = new Dexie('StepSequencerJS');
  $scope.db.version(1).stores({
    sequences: '++id, sequence_matrix, synth_params, title',
    sequence_chains: '++id, sequence_matrix_ids, title'
  });

  // User interactive variable initiation
  var sequencer;
  var state = document.getElementById('play-button').classList;
  var containerState = document.getElementById('controller-container').classList;

  $scope.notes = null;
  $scope.notes_start = 0;
  $scope.displayRange = '';

  if (typeof(notes) !== 'undefined') {
    $scope.notes = notes;
    $scope.notes_start = 23;
    $scope.displayRange = $scope.notes_start;
  }

  $scope.notes_in_key = $scope.notes;

  $scope.appTitle = "Electric Lullaby";
  $scope.appSubTitle = "";
  $scope.logoPath = './icon.png';
  $scope.keys = [
    {display: 'Cmaj / Amin', value: 'c'},
    {display: 'C#maj / A#min', value: 'c#'},
    {display: 'Dmaj / Bmin', value: 'd'},
    {display: 'D#maj / Cmin', value: 'd#'},
    {display: 'Emaj / C#min', value: 'e'},
    {display: 'Fmaj / Dmin', value: 'f'},
    {display: 'F#maj / D#min', value: 'f#'},
    {display: 'Gmaj / Emin', value: 'g'},
    {display: 'G#maj / Fmin', value: 'g#'},
    {display: 'Amaj / F#min', value: 'a'},
    {display: 'A#maj / Gmin', value: 'a#'},
    {display: 'Bmaj / G#min', value: 'b'},
    {display: 'Chromatic', value: 'chromatic'}
  ];
  $scope.waves = ['sawtooth', 'sine', 'triangle', 'square'];
  $scope.steps = ['16', '14', '12', '10'];

  $scope.saveSequenceModal = {
    form_id: 'save-sequence-form',
  };

  $scope.key = $scope.keys[0].value;
  $scope.wave = 'sine';
  $scope.step = $scope.steps[0];
  $scope.tempo = 240;
  $scope.displayTempo = 240;
  $scope.vol = 0.35;
  $scope.displayVol = Math.round($scope.vol*100);
  $scope.detune = 0;
  $scope.displayDetune = $scope.detune;
  $scope.sustain = 2;
  $scope.displaySustain = '2s';
  $scope.autoMode = false;

  $scope.color_mode_value = $scope.board.color_mode_value;
  $scope.color_mode_btn_class = $scope.board.color_mode_btn_class;
  $scope.color_mode_display_txt = $scope.board.color_mode_display_txt;

  if (containerState.contains('hide')) {
    containerState.remove('hide');
    containerState.add('animate-display');
  }

  var props = {
    tempo: $scope.tempo,
    key: $scope.key,
    wave: $scope.wave,
    volume: $scope.vol,
    detune: $scope.detune,
    sustain: $scope.sustain,
    step: $scope.step,
    notes: $scope.notes,
    notes_in_key: $scope.notes_in_key,
    notes_start: $scope.notes_start,
    autoMode: $scope.autoMode,
  };

  sequencer = new Sequencer(props);

  $scope.startStopSequencer = function() {
    if (state.contains('fa-play')) {
      state.remove('fa-play');
      state.add('fa-pause');
      sequencer.resume();
    } else {
      state.remove('fa-pause');
      state.add('fa-play');
      sequencer.pause();
    }
  }

  $scope.setTempo = function() {
    $scope.displayTempo = $scope.tempo;
    sequencer.setTempo($scope.tempo);
  }

  $scope.setKey = function() {
    sequencer.setKey($scope.key);
  }

  $scope.setWave = function() {
    sequencer.setWave($scope.wave);
  }

  $scope.setVol = function() {
    $scope.displayVol = Math.round($scope.vol*100);
    sequencer.setVol($scope.vol);
  }

  $scope.setDetune = function() {
    if ($scope.detune > 0) $scope.displayDetune = "+" + $scope.detune;
    else $scope.displayDetune = $scope.detune;

    sequencer.setDetune($scope.detune*10);
  }

  $scope.setSustain = function() {
    $scope.displaySustain = $scope.sustain+'s';
    sequencer.setSustain($scope.sustain);
  }

  $scope.setRange = function() {
    if (typeof($scope.notes_start) == 'undefined') return;
    $scope.displayRange = $scope.notes_start;
    sequencer.setNoteRange($scope.notes_start);
  }

  $scope.setSteps = function() {
    sequencer.setSteps($scope.step);
  }

  $scope.clearBoard = function() {
    sequencer.clearBoard();
  }

  $scope.randomSelection = function() {
    sequencer.randomSelection();
  }

  $scope.autoModeToggle = function() {
    if (!$scope.autoMode) {
      $scope.autoMode = true;
    } else {
      $scope.autoMode = false;
    }
    sequencer.autoModeToggle();
  }

  $scope.saveSequence = function() {
    // create sequence object

    var sequence = {
      title: $scope.saveSequenceFormData.title,
      synth_params: {key: $scope.key, wave: $scope.wave, detune: $scope.detune, sustain: $scope.sustain, step: $scope.step},
      sequence_matrix: $scope.board.getSelectedBlocks(),
    }
    // insert sequence to database
    if ($scope.db.sequences.put(sequence))
      angular.element(`#${$scope.saveSequenceModal.id}`).modal('hide');
    else
      $scope.saveSequenceModal.form_notification = 'Something went wrong :/';
  }

  $scope.getSequencesForm = function() {
    $scope.db.sequences.each(function(sequence) {
      console.log(sequence);
    });
  }


  $scope.colorMode = function() {
    var colorModes = $scope.board.colorMode();
    $scope.color_mode_value = colorModes.color_mode_value;
    $scope.color_mode_btn_class = colorModes.color_mode_btn_class;
    $scope.color_mode_display_txt = colorModes.color_mode_display_txt;
  }


  /*****************************************************************************
  * handle blur and focus to pause sequence
  */

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      sequencer.pause();
    } else {
      if (state.contains('fa-pause'))
        sequencer.resume();
    }
  });

});
