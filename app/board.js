/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: board.js
 * @Last modified time: 2019-11-17T18:34:07-05:00
 */


// define global audio context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function Board() {

  // build and insert the markup for sequencer board
  this.build();

  // create click listener for sequencer blocks
  this.sequencerBlockClickListen();

}


Board.prototype.build = function() {
  var i, step, note = 0;
  var key_step = 0;
  var key_note = '';

  this.grid_str = '<div class="grid-container">';

  for (i = 0; i < 12*16; i++) {

    step = i % 16;
    if (i % 16 == 0 && i != 0) {
      note++;
      key_note = '<span class="key-note-container"></span>';
    }
    else if (i === 0) {
      //key_note = '<span class="key-note-container"></span>';
    }
    else {
      key_note = '';
    }

    if (i < 16) key_step = (step+1).toString().padStart(2,'0').padEnd(3, ' ');
    else key_step = "".padEnd(3, ' ');

    this.grid_str += `<div class="grid-item step-${step} note-${note}"><a href class="board-block-a"><div id="${note}" class="board-block unselected">${key_note}${key_step}</div></a></div>`;

  }
  this.grid_str += '</div>';

  //document.getElementById('controller').innerHTML = this.grid_str;
  $('#controller').html(this.grid_str);
}

Board.prototype.getSelectedBlocks = function() {
  var selected = [];
  $('.board-block').each(function(index, block) {
    if ($(block).hasClass('selected')) selected.push(index);
  });
  return selected;
}

Board.prototype.sequencerBlockClickListen = function() {

  var buttons = document.getElementsByClassName('board-block-a');
  for (var i = 0; i < buttons.length; i++) {

    buttons[i].addEventListener('click', function() {
      var div = this.childNodes[0];
      if (!div.classList.contains('disabled-block')) {
        if (div.classList.contains('unselected')) {
          div.classList.remove('unselected');
          div.classList.add('selected');
        } else {
          div.classList.remove('selected');
          div.classList.add('unselected');
        }
      }
    });

  }

}

// required for chrome
//document.addEventListener("DOMContentLoaded", function(event) {
  //this.addEventListener('click', function() { audioCtx.resume(); });
//});

// instantiate new sequencer board
const board = new Board();
