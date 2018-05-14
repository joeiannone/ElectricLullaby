
var i, step, note = 0;
var grid_str = '<div class="grid-container">';

for (i = 0; i < 12*16; i++) {
  
  step = i % 16;
  if(i % 16 == 0 && i != 0) note++;
 
  grid_str += 
    '<div class="grid-item step-'+step+' note-'+note+'">'+
      '<a href class="board-block-a"><div id="'+note+'" class="board-block unselected"></div></a>'+
    '</div>';

}

grid_str += '</div>';

document.getElementById('controller').innerHTML = grid_str;

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
