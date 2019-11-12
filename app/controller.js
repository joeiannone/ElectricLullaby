/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: controller.js
 * @Last modified time: 2019-05-25T20:56:18-04:00
 */


const app = angular.module('stepScript', []);

app.controller('mainController', function($scope) {

  var sequencer;
  var state = document.getElementById('play-button').classList;
  var containerState = document.getElementById('controller-container').classList;

  if (typeof(notes) !== 'undefined') {
    $scope.notes_start = 49;
    $scope.notes_end = 61;
    var notes_init_range = notes.slice($scope.notes_start, $scope.notes_end);
    $scope.freqs = [];
    for (i = $scope.notes_start; i < $scope.notes_end; i++) $scope.freqs.push(Number(notes[i].frequency));
  } else {
    $scope.freqs = [277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88, 523.25];
  }

  $scope.logoPath = './icon.png';
  $scope.waves = ['sawtooth', 'sine', 'triangle', 'square'];
  $scope.steps = ['16', '14', '12', '10'];
  $scope.appTitle = "StepSequencerJS";
  $scope.appSubTitle = "";

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

  $scope.color_mode_value = 'light';
  $scope.color_mode_btn_class = 'btn-light';
  $scope.color_mode_display_txt = 'dark mode';

  if (containerState.contains('hide')) {
    containerState.remove('hide');
    containerState.add('animate-display');
  }

  var props = {
    tempo: $scope.tempo,
    wave: $scope.wave,
    volume: $scope.vol,
    detune: $scope.detune,
    sustain: $scope.sustain,
    step: $scope.step,
    freqs: $scope.freqs
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

  $scope.setSteps = function() {
    sequencer.setSteps($scope.step);
  }

  $scope.clearBoard = function() {
    sequencer.clearBoard();
  }


  $scope.colorMode = function() {

    if ($scope.color_mode_value === 'light') {
      
      $scope.color_mode_value = 'dark';
      $scope.color_mode_display_txt = 'light mode';
      document.body.style.background = '#000000';
      document.body.style.color = '#ffffff';
      document.getElementById('play-button').style.color = '#ffffff';
      document.getElementById('color-mode-btn').style.background = '#000000';
      document.getElementById('color-mode-btn').style.color = '#ffffff';

    } else {

      $scope.color_mode_value = 'light';
      $scope.color_mode_display_txt = 'dark mode';
      document.body.style.background = '#ffffff';
      document.body.style.color = '#000000';
      document.getElementById('play-button').style.color = '#000000';
      document.getElementById('color-mode-btn').style.background = '#ffffff';
      document.getElementById('color-mode-btn').style.color = '#000000';

    }

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
