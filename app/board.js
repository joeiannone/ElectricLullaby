/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: board.js
 * @Last modified time: 2019-04-26T10:15:48-04:00
 */


var i, step, note = 0;
var key_step = 0;
var grid_str = '<div class="grid-container">';

for (i = 0; i < 12*16; i++) {

  step = i % 16;
  if (i % 16 == 0 && i != 0) note++;

  if (i < 16) key_step = (step+1).toString().padStart(2,'0');
  else key_step = "&nbsp;";

  /*
  grid_str +=
    '<div class="grid-item step-'+step+' note-'+note+'">'+
      '<a href class="board-block-a"><div id="'+note+'" class="board-block unselected"></div></a>'+
    '</div>';
  */
  grid_str += `<div class="grid-item step-${step} note-${note}"><a href class="board-block-a"><div id="${note}" class="board-block unselected">${key_step}</div></a></div>`;

}
grid_str += '</div>';

/*
var step_key_html = '';
var step = 0;
for (i = 0; i < 16; i++) {
    step = i+1;
    step_key_html += `<div class='step-key-item'><a><div class='step-key-block'>${step}</div></a></div>`;
}
*/


document.getElementById('controller').innerHTML = grid_str;
//document.getElementById('step-key-container').innerHTML = step_key_html;

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
