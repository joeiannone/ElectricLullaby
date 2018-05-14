const app = angular.module('stepScript', []);

app.controller('mainController', function($scope) {
   
  var sequencer; 
  $scope.waves = ['sawtooth', 'sine', 'triangle', 'square'];
  $scope.steps = ['16', '14', '12', '10'];
  $scope.appTitle = "";
  $scope.appSubTitle = "StepSequencerJS: A musical step sequencer built with javascript.";
 
  $scope.wave = 'sine';
  $scope.step = $scope.steps[0];
  $scope.tempo = 240;     
  $scope.vol = 0.5;
  $scope.displayVol = Math.round($scope.vol*100);
  $scope.detune = 0;
  $scope.displayDetune = $scope.detune;
  sequencer = new Sequencer($scope.tempo, $scope.wave, $scope.vol, $scope.detune, $scope.step);
  
  $scope.startStopSequencer = function() {
    var state = angular.element(event.target);
    if (state.attr('class') == 'glyphicon glyphicon-play') { 
      state.removeClass('glyphicon-play');
      state.addClass('glyphicon-pause');
      sequencer.resume();
    } else {
      state.removeClass('glyphicon-pause');
      state.addClass('glyphicon-play');
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
    sequencer.setDetune($scope.detune);
  }
  
  $scope.setSteps = function() {
    sequencer.setSteps($scope.step);
  }

  $scope.clearBoard = function() {
    sequencer.clearBoard();
  }

});
