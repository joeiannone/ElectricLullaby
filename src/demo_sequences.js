/**
 * @Author: Joe Iannone <josephiannone>
 * @Date:   2019-12-27T10:15:39-05:00
 * @Filename: demo_sequences.js
 * @Last modified by:   josephiannone
 * @Last modified time: 2019-12-27T10:16:11-05:00
 */


/*******************************************************************************
*******************************************************************************/
window.demo_sequences = [
  {
    title: `Katy Song`,
    sequence_matrix: [8, 16, 65, 67, 75, 98, 100, 102, 111, 122, 124, 151, 153, 165, 174, 189],
    sequence_params: {
      detune: 0,
      gain: 0.16,
      key: `d`,
      note_start: 17,
      steps: 16,
      sustain: 3.2,
      tempo: 155,
      wave: `sawtooth`,
    }
  },
  {
    title: `Test`,
    sequence_matrix: [0, 2, 4, 7, 15, 38, 56, 82, 89, 101, 138, 143, 163, 177],
    sequence_params: {
      detune: -23,
      gain: 0.1,
      key: `e`,
      note_start: 25,
      steps: 8,
      sustain: 3.2,
      tempo: 233,
      wave: `sawtooth`,
    }
  },
];
