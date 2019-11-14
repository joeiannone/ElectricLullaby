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

  $scope.notes = null;
  $scope.notes_start = 0;
  $scope.displayRange = '';

  if (typeof(notes) !== 'undefined') {
    $scope.notes = notes;
    $scope.notes_start = 49;
    $scope.displayRange = $scope.notes_start;
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
    notes: $scope.notes,
    notes_start: $scope.notes_start,
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
    var boardBlocks = document.getElementsByClassName('board-block');
    for (i=0;i<boardBlocks.length; i++) {
      boardBlocks[i].classList.remove('selected');
      boardBlocks[i].classList.add('unselected');
    }
    for (i=0;i<boardBlocks.length; i++) {
      var rand = Math.round(Math.random() * 16);
      if (i % rand == 6) {
        boardBlocks[i].classList.remove('unselected');
        boardBlocks[i].classList.add('selected');
      }
    }
  }


  $scope.colorMode = function() {

    if ($scope.color_mode_value === 'light') {
      // now dark mode
      $scope.color_mode_value = 'dark';
      $scope.color_mode_display_txt = 'light mode';
      document.body.style.background = '#000000';
      document.body.style.color = '#ffffff';
      $('.key-note-container').css('color', '#ffffff');
      document.getElementById('play-button').style.color = '#ffffff';
      document.getElementById('color-mode-btn').style.background = '#000000';
      document.getElementById('color-mode-btn').style.color = '#ffffff';

    } else {
      // now light mode
      $scope.color_mode_value = 'light';
      $scope.color_mode_display_txt = 'dark mode';
      document.body.style.background = '#ffffff';
      document.body.style.color = '#000000';
      $('.key-note-container').css('color', '#000000');
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
