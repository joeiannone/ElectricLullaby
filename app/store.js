/**
 * @Author: Joe Iannone <josephiannone>
 * @Date:   2019-11-17T12:53:33-05:00
 * @Filename: store.js
 * @Last modified by:   josephiannone
 * @Last modified time: 2019-11-17T14:47:05-05:00
 */


function SequenceStore(db) {

  this.db = db;

  // Declaritive schema definitions
  this.db.version(1).stores({
    sequences: '++id, sequence_matrix, synth_params, title',
    sequence_chains: '++id, sequence_matrix_ids, title'
  });

}

SequenceStore.prototype.getSequence = function(id) {
  this.db.sequences.get(id, function(sequence) {
    return this.sequence;
  });
}

SequenceStore.prototype.getSequenceChain = function(id) {
  this.db.sequence_chains.get(id).then(function(sequence_chain) {
    return sequence_chain;
  }).catch(function(error) {
    console.log(error);
    return false;
  });
}

SequenceStore.prototype.putSequence = function(sequence) {
  console.log(this.db);
  this.db.sequences.put(sequence).then(function() {
    return true;
  }).catch(function(error) {
    console.log(error);
    return false;
  });
}
