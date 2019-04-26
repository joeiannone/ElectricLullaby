/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: controller.js
 * @Last modified time: 2019-04-26T13:25:40-04:00
 */


const app = angular.module('stepScript', []);

app.controller('mainController', function($scope) {

  var sequencer;
  var state = document.getElementById('play-button').classList;
  $scope.waves = ['sawtooth', 'sine', 'triangle', 'square'];
  $scope.steps = ['16', '14', '12', '10'];
  $scope.freqs = [277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88, 523.25]
  $scope.appTitle = "";
  $scope.appSubTitle = "StepSequencerJS: A polyphonic musical step sequencer.";

  $scope.wave = 'sine';
  $scope.step = $scope.steps[0];
  $scope.tempo = 240;
  $scope.displayTempo = 240;
  $scope.vol = 0.5;
  $scope.displayVol = Math.round($scope.vol*100);
  $scope.detune = 0;
  $scope.displayDetune = $scope.detune;

  $scope.color_mode_value = 'light';
  $scope.color_mode_btn_class = 'btn-default';
  $scope.color_mode_display_txt = 'dark mode';

  var props = {
    tempo: $scope.tempo,
    wave: $scope.wave,
    volume: $scope.vol,
    detune: $scope.detune,
    step: $scope.step,
    freqs: $scope.freqs
  };

  sequencer = new Sequencer(props);

  $scope.startStopSequencer = function() {
    if (state.contains('glyphicon-play')) {
      state.remove('glyphicon-play');
      state.add('glyphicon-pause');
      sequencer.resume();
    } else {
      state.remove('glyphicon-pause');
      state.add('glyphicon-play');
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
    if ($scope.detune > 0) {
      $scope.displayDetune = "+" + $scope.detune;
    } else {
      $scope.displayDetune = $scope.detune;
    }
    sequencer.setDetune($scope.detune*10);
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
      //$scope.color_mode_btn_class = 'btn-success';
      document.body.style.background = '#000000';
      document.body.style.color = '#ffffff';
      document.getElementById('play-button').style.color = '#ffffff';
      document.getElementById('color-mode-btn').style.background = '#000000';
      document.getElementById('color-mode-btn').style.color = '#ffffff';
      //document.getElementsByClassName('grid-item').style.background = '#ffffff';
      //sequencer.setColorMode('dark');
    } else {
      $scope.color_mode_value = 'light';
      //$scope.color_mode_btn_class = 'btn-default';
      $scope.color_mode_display_txt = 'dark mode';
      document.body.style.background = '#ffffff';
      document.body.style.color = '#000000';
      document.getElementById('play-button').style.color = '#000000';
      document.getElementById('color-mode-btn').style.background = '#ffffff';
      document.getElementById('color-mode-btn').style.color = '#000000';

      //sequencer.setColorMode('light');
    }

  }

  /**
  * natively handle blur and focus to pause sequence
  */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      sequencer.pause();
    } else {
      if (state.contains('glyphicon-pause'))
        sequencer.resume();
    }
  });

});
