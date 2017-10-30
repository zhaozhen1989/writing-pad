
let CloseButton = DrawingBoard.Control.extend({

  name: 'close',
  
  initialize: function() {
    // this.$el.append(`
    //   <button class="drawing-board-control-close-button">
    //     <i class="fa fa-close"></i>
    //   </button>
    // `);

    this.$el.on('click', '.drawing-board-control-close-button', (e)=> {
        this.board.__extend._onClose()
        this.board.__extend.hide()
        e.preventDefault()
    });
  }
});

export default CloseButton;

