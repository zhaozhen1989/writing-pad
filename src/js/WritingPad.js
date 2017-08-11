
import $ from 'jQuery';
import * as random from './utils/random';
import SimpleObserver from './utils/SimpleObserver';
import {CLOSE} from './constants/EVENT';

let defaults = {
  autoHistory:false,
  autoStorage:false,
  eraserColor:'transparent',
  background:'',
  controlsPosition:'center',
  gridTipText:'請將格線拖拉至適當位置',
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
};

class WritingPad extends SimpleObserver {

  constructor(container, opts = {}) {
    super();
    let id = `writingPad${random.string()}`;
    this.histories = {};
    this._initDOM(container, id, opts);
    this._initOpts(opts);
    this.board = new DrawingBoard.Board(id, this.opts);
    this.board.__extend = this;
  }

  _initOpts(opts) {
    let instanceOpts = $.extend(true, {}, defaults);
    this.opts = $.extend(instanceOpts, opts);
  }

  _initDOM(container, id, opts) {
    let $board = this._buildContainerElement(id);
    let $container = $(container)
    $board.hide();
    $container.append($board);
    this.$el = $board;
    if (opts && opts.canvasWidth) this._setInnerContentWidth(opts.canvasWidth);
  }

  _getInnerContentElement() {
    return this.$el.find('.writing-inner-content');
  }

  _setInnerContentWidth(width) {
    this._getInnerContentElement().width(width + 2);
  }

  _buildContainerElement(id) {
    return $(`
      <div class="writing-pad-container">
        <div class="writing-inner-content">
          <div class="writing-pad-mask">
            <div id='${id}'></div>
          </div>
        </div>
      </div>
    `);
  }

  resize() {
    this.board.resize({controlHeight:false});
  }

  restore() {
    this.board.restoreWebStorage()
  }

  show() {
    this.$el.show()
  }

  hide() {
    this.$el.hide()
  }

  isHidden() {
    return /none/i.test(this.$el.css( 'display' ))
  }

  toImage() {
    return this.board.getImg()
  }

  saveByKey(key) {
    this.histories[key] = this.board.getImg()
  }

  restoreByKey( key, opts = {clearEmpty:true} ) {
    if (this.histories[key]) {
      this.board.reset();
      this.board.restoreHistory(histories[key]);
      return true;
    } else if (opts && opts.clearEmpty) {
      return this.board.reset();
    }
    return false;
  }

  clearHistory() {
    this.board.clearWebStorage()
  }

  _onClose() {
    this.trigger(CLOSE)
  }

  _getWrapper() {
    return this.$el.find(".drawing-board-canvas-wrapper");
  }

  openGridBg() {
    this._getWrapper().addClass('grid');
  }

  closeGridBg() {
    this._getWrapper().removeClass('grid');
  }

  toggleGridBg() {
    this._getWrapper().toggleClass('grid');
  }

  _delayResize( ms = 100 ) {
    clearTimeout(this._timeId);
    this._timeId = setTimeout(()=>{
      if (!this.isHidden()) {
         let img = board.getImg();
         this.$el.find(".drawing-board-canvas-wrapper, canvas").width("100%");
         this.resize();
         this.restoreHistory(img);
      }
    }, ms);
  }

  getHeight(){
    return this.$el.height();
  }

  extendHeight(height = 300) {
    let img = this.board.getImg()
    this.$el.height(this.getHeight() + height)
    this.resize();
    this.board.reset();
    this.board.restoreHistory(img);
  }

  autosize(auto = true) {
    if(auto) {
      $(window).on('resize', this._delayResize);
    } else {
      $(window).off('resize', this._delayResize);
    }
  }

}

export default WritingPad;

