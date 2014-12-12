var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

/**
* @class
* Object that represents a visible thread row view in a mailbox.
*/
var ThreadRowView = function(threadRowViewDriver){
  EventEmitter.call(this);

  this._threadRowViewDriver = threadRowViewDriver;
  this._threadRowViewDriver.getEventStream().onEnd(this, 'emit', 'unload');
};

ThreadRowView.prototype = Object.create(EventEmitter.prototype);

_.extend(ThreadRowView.prototype, /** @lends ThreadRowView */ {

  /**
   * Adds a label
   */
  addLabel: function(label) {
    this._threadRowViewDriver.addLabel(label);
  },

  /**
   * Adds a button
   */
  addButton: function(buttonDescriptor) {
    this._threadRowViewDriver.addButton(buttonDescriptor);
  },

  /**
   * Adds an attachment icon
   */
  addAttachmentIcon: function(opts) {
    this._threadRowViewDriver.addAttachmentIcon(opts);
  }

  /**
   * Fires when the thread row is no longer visible.
   * @event ThreadRowView#unload
   */

});

module.exports = ThreadRowView;
