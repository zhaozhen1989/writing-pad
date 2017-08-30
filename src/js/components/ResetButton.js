
import $ from 'jQuery';

let ResetButton = DrawingBoard.Control.extend({

  name:'reset',

  _initElement: function(){
    this.$el.append(`
      <button class="drawing-board-control-reset-button">
        <i class="fa fa-repeat" aria-hidden="true"></i>
      </button>
    `);
  },

  initialize: function(){
    this._initElement();

    if (this.opts.confirmationText) this.confirmationText = this.opts.confirmationText;
    if (this.opts.disabledConfirmation) this.disabledConfirmation = this.opts.disabledConfirmation;

    this.$el.on('click', 'button', ()=>{
      if (this.disabledConfirmation || confirm(this.confirmationText)) {
        this.board.__extend.resize()
      }
    })
  },

  confirmationText:'確定要清除繪圖板?',

  disabledConfirmation:false

});

export default ResetButton;

