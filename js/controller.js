const app = angular.module('stepScript', []);

app.controller('mainController', function($scope) {

  var sequencer;
  var state = document.getElementById('play-button').classList;
  $scope.waves = ['sawtooth', 'sine', 'triangle', 'square'];
  $scope.steps = ['16', '14', '12', '10'];
  $scope.appTitle = "";
  $scope.appSubTitle = "StepSequencerJS: A polyphonic musical step sequencer.";

  $scope.wave = 'sine';
  $scope.step = $scope.steps[0];
  $scope.tempo = 240;
  $scope.vol = 0.5;
  $scope.displayVol = Math.round($scope.vol*100);
  $scope.detune = 0;
  $scope.displayDetune = $scope.detune;

  var props = {
    tempo: $scope.tempo,
    wave: $scope.wave,
    volume: $scope.vol,
    detune: $scope.detune,
    step: $scope.step
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
