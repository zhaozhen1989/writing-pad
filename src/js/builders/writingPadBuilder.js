import $ from 'jQuery';
import * as random from '../utils/random';

let build = ( container )=> {
  let id = `writingPad${random.string()}`;
  let $board = $(`
    <div class="writing-pad-container">
      <div id='${id}'></div>
    </div>
  `);
  $board.hide();
  let $container = $(container).append($board);
  let histories = {};
  let timeId;
  let board = new DrawingBoard.Board(id,{
    autoHistory:false,
    autoStorage:false,
    eraserColor:"transparent",
    background:"",
    controlsPosition:"center",
    controls:[
      {
        Size:{
          type: 'dropdown'
        }
      },
      {
        DrawingMode:{
          filler: false
        }
      },
      {
        Navigation:{
          back: false,
          forward: false
        }
      },
      "ExtendVertical",
      "Grid",
      "Close"
    ]
  });

  board.__extend = {
    _events:{},
    resize:()=> {board.resize() },
    restore:()=> {board.restoreWebStorage()},
    show:()=> {$board.show()},
    hide:()=> {$board.hide()},
    isHidden:()=> {return /none/i.test($board.css( 'display' ))},
    toImage:()=> {return board.getImg()},
    saveByKey:( key )=> {histories[key] = board.getImg()},
    restoreByKey:( key, opts = {clearEmpty:true} )=>{
      if (histories[key]) {
        board.reset();
        board.restoreHistory(histories[key]);
        return true;
      } else if (opts && opts.clearEmpty) {
        return board.reset();
      }
      return false;
    },

    clearHistory:()=> {board.clearWebStorage()},

    _onClose:function() {
      if (this._events['hide'])
        for( func of this._events['hide'] ) func();
    },

    listen:function( name, fn ) {
      let events = this._events[name] ? this._events[name] : this._events[name] = [];
      events.push(fn);
    },

    removeListener:function(name) {
      this._events[name] = [];
    },

    _getWrapper:function(){ return $board.find(".drawing-board-canvas-wrapper");},
    openGridBg:function() {this._getWrapper().addClass('grid');},
    closeGridBg:function(){this._getWrapper().removeClass('grid');},
    toggleGridBg:function(){this._getWrapper().toggleClass('grid');},

    _delayResize:function( ms = 100 ){
      clearTimeout(timeId);
      timeId = setTimeout(()=>{
        if (!board.__extend.isHidden()) {
           let img = board.getImg();
           $board.find(".drawing-board-canvas-wrapper, canvas").width("100%");
           board.__extend.resize();
           board.restoreHistory(img);
        }
      }, ms);
    },

    getHeight:function(){return $board.height();},

    extendHeight:function(height = 300) {
      let img = board.getImg()
      $board.height(this.getHeight() + height)
      this.resize();
      board.reset();
      board.restoreHistory(img);
    },

    autosize:function(auto = true) {
      if(auto) {
        $(window).on('resize', this._delayResize);
      } else {
        $(window).off('resize', this._delayResize);
      }
    }
  };

  board.__extend.extendHeight(48);
  return board.__extend;
};

export default build;

