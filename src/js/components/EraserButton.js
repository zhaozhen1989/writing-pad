
import $ from 'jQuery';

let EraserButton = DrawingBoard.Control.extend({

  name:'eraser',

  _initElement: function() {
    this.$el.append(`
      <button class="drawing-board-control-drawingmode-${this.name}-button" data-mode="${this.name}"></button>`
    );
  },

  initialize: function() {
    this._initElement();
    this.$el.on('click', 'button', this.onClick.bind(this));
    this.board.ev.bind('board:mode', this.onChangedMode.bind(this));
  },

  getButtonElement: function (){
    return this.$el.find('button');
  },

  onClick: function(e){
    e.preventDefault();
    let $target = $(e.currentTarget);
    let mode = $target.attr('data-mode');
    this.board.ctx.lineWidth = this.lineWidth;
    this.board.setMode(mode);
    $target.addClass('active');
  },

  onChangedMode: function() {
    this.getButtonElement().removeClass('active');
  },

  lineWidth: '15'

});

export default EraserButton;

