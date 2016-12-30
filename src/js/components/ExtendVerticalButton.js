
let ExtendVerticalButton = DrawingBoard.Control.extend({

  name: 'extendVertical',
  
  initialize: function() {
    this.$el.append(`
      <button class="drawing-board-control-extend-vertical-button">
        <i class="fa fa-arrows-v"></i>
      </button>
    `);

    this.$el.on('click', '.drawing-board-control-extend-vertical-button', (e)=>{
        this.board.__extend.extendHeight();
        let $body = $("body");
        $body.animate({
          scrollTop:$body.get(0).scrollHeight
        }, 1500)
        e.preventDefault()
    })
  }
});

export default ExtendVerticalButton;

