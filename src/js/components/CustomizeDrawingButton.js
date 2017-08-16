
import $ from 'jQuery';

let CustomizeDrawingButton = DrawingBoard.Control.extend({

  name:'customizeDrawing',

  _initElement: function(ELEMENT_CLASS_NAME) {
    this.$el.append(`
      <button class="${ELEMENT_CLASS_NAME}" data-mode="pencil">
        <i class="fa fa-pencil"></i>
      </button>
    `);
    this.getButtonElement().css('color', this.color);
  },

  initialize: function() {
    let ELEMENT_CLASS_NAME = 'drawing-board-control-customize-drawing-button';

    this._initElement(ELEMENT_CLASS_NAME);
    this.$el.on('click', `.${ELEMENT_CLASS_NAME}`, this.onClick.bind(this));
    this.board.ev.bind('board:mode', this.onChangedMode.bind(this));
  },

  getButtonElement: function (){
    return this.$el.find('button');
  },

  onClick: function(e) {
    e.preventDefault();
    let $target = $(e.currentTarget);
    let mode = $target.attr('data-mode');
    this.board.ctx.lineWidth = this.lineWidth;
    this.board.setColor(this.color);
    this.board.setMode(mode);
    $target.addClass('active');
  },

  onChangedMode: function() {
    this.getButtonElement().removeClass('active');
  },

  color:'rgba(0, 0, 0, 1)',

  lineWidth: '3'

});


export default CustomizeDrawingButton;

