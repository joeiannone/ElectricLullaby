
var i, step, note = 0;
var grid_str = '<div class="grid-container">';

for (i = 0; i < 12*16; i++) {
  
  step = i % 16;
  if(i % 16 == 0 && i != 0) note++;
 
  grid_str += 
    '<div class="grid-item step-'+step+' note-'+note+'">'+
      '<input value="'+note+'" type="checkbox"></input>'+
    '</div>';

}

grid_str += '</div>';

document.getElementById('controller').innerHTML = grid_str;
