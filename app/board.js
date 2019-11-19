/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: board.js
 * @Last modified time: 2019-11-18T21:52:52-05:00
 */


// define global audio context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();


function Board() {

  // build and insert the markup for sequencer board
  this.build();

  // create click listener for sequencer blocks
  this.sequencerBlockClickListen();

  // add save sequence modal html
  $('#save-sequence-modal-container').html(this.getSaveSequenceForm());
  $(document).on('click', '#save-sequence-btn', function() {
    $('#save-sequnce-modal').modal();
  });

  this.color_mode_value = 'light';
  this.color_mode_display_txt = 'dark mode';
  this.color_mode_btn_class = 'btn-light';

}

Board.prototype.colorMode = function() {

  if (this.color_mode_value === 'light') {
    // now dark mode
    this.color_mode_value = 'dark';
    this.color_mode_display_txt = 'light mode';
    document.body.style.background = '#000000';
    document.body.style.color = '#ffffff';
    //$('.key-note-container').css('color', '#ffffff');
    $('.key-note-container').css('color', '#ffffff');
    $('.modal-content').css('background-color', '#000000');
    $('.modal-header button').css('color', '#ffffff');
    document.getElementById('play-button').style.color = '#ffffff';
    document.getElementById('color-mode-btn').style.background = '#000000';
    document.getElementById('color-mode-btn').style.color = '#ffffff';

  } else {
    // now light mode
    this.color_mode_value = 'light';
    this.color_mode_display_txt = 'dark mode';
    document.body.style.background = '#ffffff';
    document.body.style.color = '#000000';
    //$('.key-note-container').css('color', '#000000');
    $('.key-note-container').css('color', '#000000');
    $('.modal-content').css('background-color', '#ffffff');
    $('.modal-header button').css('color', '#000000');
    document.getElementById('play-button').style.color = '#000000';
    document.getElementById('color-mode-btn').style.background = '#ffffff';
    document.getElementById('color-mode-btn').style.color = '#000000';

  }

  return {
    color_mode_value: this.color_mode_value,
    color_mode_display_txt: this.color_mode_display_txt,
    color_mode_btn_class: this.color_mode_btn_class
  };
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

  $('#controller').html(this.grid_str);
}

Board.prototype.getSelectedBlocks = function() {
  var selected = [];
  $('.board-block').each(function(index, block) {
    if ($(block).hasClass('selected')) selected.push(index);
  });
  return selected;
}

Board.prototype.getModal = function(modalObj) {
  var html = '';
  html += `
    <div class='modal modal fade' id='${modalObj.id}'>
      <div class='modal-dialog'>
        <div class='modal-content'>
          <!-- Modal Header -->
          <div class='modal-header'>
            <div class='modal-title'>${modalObj.header}</div>
            <button type='button' class='close' data-dismiss='modal'>&times;</button>
          </div>
          <!-- Modal body -->
          <div class='modal-body'>${modalObj.body}</div>
        </div>
      </div>
    </div>`;
  return html;
}

Board.prototype.getSaveSequenceForm = function() {
  var body =
  `
  <form id='{{ saveSequenceModal.form_id }}' ng-submit="saveSequence(saveSequenceFormData)">
    <label>Sequence title:</label>
    <input type='text' ng-model='saveSequenceFormData.title' value='' required class='form-control form-control-sm'></input>
    <input type="submit" value="Save" class='btn btn-sm btn-success'></input>
  </form>
  `
  var modalObj = {
    id: 'save-sequnce-modal',
    header: 'Save Sequence State',
    body: body,
  };

  var form = this.getModal(modalObj);
  return form;

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
