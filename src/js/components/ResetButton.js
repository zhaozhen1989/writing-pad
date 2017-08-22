
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
    this.$el.on('click', 'button', ()=> this.board.__extend.resize())
  }

});

export default ResetButton;

