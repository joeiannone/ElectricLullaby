/**
 * @Author: Joe Iannone
 * @Date:   2018-04-24T09:52:48-04:00
 * @Email:  joseph.m.iannone@gmail.com
 * @Filename: board.js
 * @Last modified time: 2019-11-23T00:53:42-05:00
 */


// define global audio context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();


function Board() {

  // Instantiate SequenceStore
  this.db = new Dexie('ElectricLullaby');
  this.db.version(1).stores({
    sequences: '++id, sequence_matrix, synth_params, title',
    sequence_chains: '++id, sequence_matrix_ids, title'
  });

  // build and insert the markup for sequencer board
  this.build();

  // create click listener for sequencer blocks
  this.sequencerBlockClickListen();

  this.color_mode_value = 'light';
  this.color_mode_display_txt = 'dark mode';
  this.color_mode_btn_class = 'btn-light';

  this.saveSequenceFormModalObj = {
    id: 'save-sequence-form-modal',
    header: '<strong><i class="fas fa-save"></i>&nbsp; Save Sequence</strong>',
    body: "<div id='save-sequence-modal-body'></div>",
    body_id: 'save-sequence-modal-body',
    modal_container_id: 'save-sequence-modal-container',
    button_id: 'save-sequence-modal-btn',
    input_id: 'save-sequence-input',
    error_notification_id: 'save-error-container',
    form_id: 'save-sequence-form',
  };
  $(`#${this.saveSequenceFormModalObj.modal_container_id}`).html(this.getModal(this.saveSequenceFormModalObj));
  $(`#${this.saveSequenceFormModalObj.button_id}`).click(function() { $('#save-sequence-form-modal').modal(); });
  $(`#${this.saveSequenceFormModalObj.body_id}`).html(this.getSaveSequenceForm());

  this.getSequencesFormModalObj = {
    id: 'sequences-form-modal',
    header: '<strong><i class="fas fa-retweet"></i> Sequences</strong>',
    body: "<div id='get-sequences-modal-body'></div>",
    body_id: 'get-sequences-modal-body',
    modal_container_id: 'get-sequences-modal-container',
    button_id: 'get-sequences-btn',
    select_id: 'sequences-select',
    form_id: 'load-sequence-form',
  };
  $(`#${this.getSequencesFormModalObj.modal_container_id}`).html(this.getModal(this.getSequencesFormModalObj));
  $(`#${this.getSequencesFormModalObj.button_id}`).click(function() { $('#sequences-form-modal').modal(); });
  $(`#${this.getSequencesFormModalObj.body_id}`).append(this.getSequencesForm());


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

Board.prototype.loadSavedBlocks = function() {

}

Board.prototype.loadSequences = function(sequence_ids) {
  var sequences_modal_obj = this.getSequencesFormModalObj;
  this.db.sequences.get(Number(sequence_ids[0])).then(function(sequence) {
    console.log(sequences_modal_obj);
    var all_blocks = $(`.board-block`);
    for (i = 0; i < all_blocks.length; i++) {
      if (all_blocks[i].classList.contains('selected'))
        all_blocks[i].classList.remove('selected');
      else if (sequence.sequence_matrix.includes(i))
        all_blocks[i].classList.add('selected');
    }
    console.log(sequence);
  }).catch(function(error) {
    console.log(error);
  }).finally(function() {
    $(`#${sequences_modal_obj.id}`).modal('hide');
  });

}

Board.prototype.getSequencesForm = function() {
  return `
    <form ng-submit='loadSequences(selected_sequences)'>
    <select size='6' multiple name='selected_sequences' class='form-control form-control-sm' ng-model='selected_sequences' id='${this.getSequencesFormModalObj.select_id}'></select>
    <input type='submit' class='btn btn-primary btn-sm' value='Load Sequence(s)'></input>
    <input ng-click='deleteSequences(selected_sequences)' class='btn btn-warning btn-sm' value='Delete Sequence(s)'></input>
    <div class='small'><i>* Select multiple sequences by holding Ctrl/Command to remove or chain sequences together</i></div>
    </form>
  `;
}


Board.prototype.setSequencesForm = function() {
  var sequences_select_id = `#${this.getSequencesFormModalObj.select_id}`;
  $(sequences_select_id).html('');
  this.db.sequences.reverse().each(function(elem, index) {
    $(sequences_select_id).append(`<option value='${elem.id}'>${elem.title}</option>`);
  }).then(function() {
    if ($(sequences_select_id).length == 0) $(sequences_select_id).replaceWith('<div class="text-center">No Saved Sequences</div>');
  });

}


Board.prototype.getSaveSequenceForm = function() {
  return `
  <form class='form-inline' id='${this.saveSequenceFormModalObj.form_id}' ng-submit='saveSequence(save_sequence_title)'>
    <div class='form-group'>
      <!--<label>Title</label>-->
      <input placeholder='Sequence Title' required type='text' name='save_sequence_title' ng-model='save_sequence_title' class='form-control form-control-sm' id='${this.saveSequenceFormModalObj.input_id}'></input>
      <input type='submit' class='btn btn-sm btn-primary' value='Save'></input>
    </div>
    <div id='save-error-container' class='pt-2 modal-error-notification'></div>
  </form>
  `;
}


Board.prototype.saveSequence = function(sequence) {
  var modal_obj = this.saveSequenceFormModalObj;
  this.db.sequences.put(sequence).then(function() {
    $(`#${modal_obj.error_notification_id}`).html('');
    $(`#${modal_obj.input_id}`).val('');
  }).catch(function(error) {
    $(`#${modal_obj.error_notification_id}`).html('Something went wrong :/');
    console.log(error);
  }).finally(function() {
    $(`#${modal_obj.id}`).modal('hide');
    //console.log('save sequence finished');
  });
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
    $('.modal-content').css('background-color', '#333333');
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

// required for chrome
//document.addEventListener("DOMContentLoaded", function(event) {
  //this.addEventListener('click', function() { audioCtx.resume(); });
//});

// instantiate new sequencer board
const board = new Board();
