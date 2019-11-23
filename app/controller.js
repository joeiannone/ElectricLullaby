/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: controller.js
 * @Last modified time: 2019-11-22T20:34:22-05:00
 */

const app = angular.module('stepScript', []);

app.controller('mainController', function($scope) {

  $scope.board = board;

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

  $scope.appTitle = "ElectricLullaby";
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

  $scope.key = $scope.keys[0].value;
  $scope.wave = 'sine';
  $scope.step = $scope.steps[0];
  $scope.tempo = 240;
  $scope.displayTempo = 240;
  $scope.gain = 0.35;
  $scope.displayVol = Math.round($scope.gain*100);
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
    volume: $scope.gain,
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
    $scope.displayVol = Math.round($scope.gain*100);
    sequencer.setVol($scope.gain);
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


  $scope.colorMode = function() {
    var colorModes = $scope.board.colorMode();
    $scope.color_mode_value = colorModes.color_mode_value;
    $scope.color_mode_btn_class = colorModes.color_mode_btn_class;
    $scope.color_mode_display_txt = colorModes.color_mode_display_txt;
  }

  $scope.getSequencesModal = function() {
    $scope.board.getSequencesForm();
    $scope.board.setSequencesForm();
  }

  $scope.saveSequence = function(sequence_title) {
    var sequence_params = {
      key: $scope.key,
      wave: $scope.wave,
      steps: $scope.step,
      gain: $scope.gain,
      note_start: $scope.notes_start,
      detune: $scope.detune,
      sustain: $scope.sustain,
    };
    var sequence = {
      title: sequence_title,
      sequence_matrix: sequencer.getSelectedBlocks(),
      sequence_params: sequence_params,
    };
    $scope.board.saveSequence(sequence);
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
