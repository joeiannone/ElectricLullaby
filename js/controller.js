const app = angular.module('stepScript', []);

app.controller('mainController', function($scope) {
   
  var sequencer; 
  $scope.waves = ['sawtooth', 'sine', 'triangle', 'square'];
  $scope.appTitle = "";
	$scope.appSubTitle = "StepSequencerJS: A musical step sequencer built with javascript.";
 
  $scope.wave = 'sine';
  $scope.tempo = 240;     
  $scope.vol = 0.5;
  $scope.displayVol = Math.round($scope.vol*100);
  $scope.detune = 0;
  $scope.displayDetune = $scope.detune;
  sequencer = new Sequencer($scope.tempo, $scope.wave, $scope.vol, $scope.detune);
  
  $scope.startStopSequencer = function() {
    var state = angular.element(event.target);
    if (state.attr('class') == 'fas fa-play') { 
      state.removeClass('fa-play');
      state.addClass('fa-pause');
      sequencer.resume();
    } else {
      state.removeClass('fa-pause');
      state.addClass('fa-play');
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
  
  $scope.clearBoard = function() {
    sequencer.clearBoard();
  }

});
