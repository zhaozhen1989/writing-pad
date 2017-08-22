
import $ from 'jQuery';
import * as random from './utils/random';
import SimpleObserver from './utils/SimpleObserver';
import {CLOSE} from './constants/Event';
import {HINT_AREA, DATA_WRITING_AREA} from './constants/WriteAttribute';
import {LEFT} from './constants/ControlsLayout';
import {DEFAULT as BORAD_DEFAULT} from './constants/Board';
import {DEFAULT} from './constants/WritingPad';
import WritingPadHistory from './WritingPadHistory';


class WritingPad extends SimpleObserver {

  constructor(container, opts = {}) {
    super();
    let id = `writingPad${random.string()}`;
    this.histories = {};
    this.stateHistory = new WritingPadHistory(this);
    this._initOpts(opts);
    this._initDOM(container, id, this.opts);
    this.board = new DrawingBoard.Board(id, this.boardOpts);
    this.board.__extend = this;
    this._initLayoutControls(this.opts);
  }

  _initOpts(opts) {
    this.opts = $.extend(DEFAULT, opts);
    this._initBoardOpts(opts);
  }

  _initBoardOpts(opts) {
    let boardOpts = $.extend(true, {}, BORAD_DEFAULT);
    if (opts.controls) boardOpts.controls = controls;
    if (opts.gridTipText) boardOpts.gridTipText = gridTipText;
    if (opts.useMovingGesture) boardOpts.useMovingGesture = opts.useMovingGesture;
    this.boardOpts = boardOpts;
  }

  _initDOM(container, id, opts) {
    let $board = this._buildContainerElement(id, opts);
    let $container = $(container)
    $board.hide();
    $container.append($board);
    this.$el = $board;
    if (opts && opts.canvasWidth) this._setInnerContentWidth(opts.canvasWidth);
  }

  _initLayoutControls(opts) {
    if (opts && opts.controlsLayout === LEFT) this.$el.find('.drawing-board-controls').addClass(LEFT);
    this._setFirstControlToDefault();
  }

  _setFirstControlToDefault() {
    this.$el.find(".drawing-board-control:first button").click();
  }

  _getInnerContentElement() {
    return this.$el.find('.writing-inner-content');
  }

  _setInnerContentWidth(width) {
    this._getInnerContentElement().width(width + 2);
  }

  _buildContainerElement(id, opts) {
    return $(`
      <div class="writing-pad-container" ${DATA_WRITING_AREA}="${opts.hintAreaText}">
        <div class="writing-inner-content">
          <div class="writing-pad-mask">
            <div id='${id}'></div>
          </div>
        </div>
      </div>
    `);
  }

  resize() {
    this.stateHistory.save();
    this.board.resize({controlHeight:false});
    this.stateHistory.restore();
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

  _resetBoard() {
    this.stateHistory.save();
    this.board.reset({color:false, size:false});
    this.stateHistory.restore();
  }

  restoreByKey( key, opts = {clearEmpty:true} ) {
    if (this.histories[key]) {
      this._resetBoard();
      this.board.restoreHistory(this.histories[key]);
      return true;
    } else if (opts && opts.clearEmpty) {
      return this._resetBoard();
    }
    return false;
  }

  clearStorage() {
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
    this._resetBoard();
    this.board.restoreHistory(img);
  }

  autosize(auto = true) {
    if(auto) {
      $(window).on('resize', this._delayResize);
    } else {
      $(window).off('resize', this._delayResize);
    }
  }

  openHintWritingArea() {
    return new Promise((resolve, reject)=> {
      this.$el.attr(HINT_AREA, '')
      this.$el.on('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', (evt)=> {
        this.closeHintWritingArea();
        resolve();
      });
    });
  }

  closeHintWritingArea() {
    this.$el.removeAttr(HINT_AREA)
  }

}

export default WritingPad;

