
import $ from 'jQuery';

let DrawingButton = DrawingBoard.Control.extend({

  name:'drawing',

  _initElement: function(ELEMENT_CLASS_NAME) {
    // this.$el.append(`
    //   <button class="${ELEMENT_CLASS_NAME}" data-mode="pencil">
    //     <i class="fa fa-pencil"></i>
    //   </button>
    // `);
    this.getButtonElement().css('color', this.color);
  },

  _initOpts: function(opts) {
    let {lineWidth, color} = opts;
    if (lineWidth) this.lineWidth = lineWidth;
    if (color) this.color = color;
  },

  initialize: function() {
    let ELEMENT_CLASS_NAME = 'drawing-board-control-customize-drawing-button';

    this._initOpts(this.opts || {});
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

  lineWidth: '2'

});


export default DrawingButton;

