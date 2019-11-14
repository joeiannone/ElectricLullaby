/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: board.js
 * @Last modified time: 2019-04-26T10:15:48-04:00
 */


function Board() {

  var i, step, note = 0;
  var key_step = 0;
  var key_note = '';

  this.grid_str = '<div class="grid-container">';

  for (i = 0; i < 12*16; i++) {

    step = i % 16;
    if (i % 16 == 0 && i != 0) {
      note++;
      key_note = '<span class="key-note-container"></span>';
    } else {
      key_note = '&nbsp;&nbsp;&nbsp;';
    }

    if (i < 16) key_step = (step+1).toString().padStart(2,'0').padEnd(3, ' ');
    else key_step = "";

    this.grid_str += `<div class="grid-item step-${step} note-${note}"><a href class="board-block-a"><div id="${note}" class="board-block unselected">${key_step} ${key_note}</div></a></div>`;

  }
  this.grid_str += '</div>';

  document.getElementById('controller').innerHTML = this.grid_str;

  this.clickListen();

}

Board.prototype.clickListen = function() {

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

};


const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/* required for chrome */
document.addEventListener("DOMContentLoaded", function(event) {
  this.addEventListener('click', function() { audioCtx.resume(); });
});


const board = new Board();
