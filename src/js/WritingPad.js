
import $ from 'jQuery';
import * as random from './utils/random';
import * as canvasUtils from './utils/canvasUtils';
import SimpleObserver from './utils/SimpleObserver';
import {CLOSE} from './constants/Event';
import {HINT_AREA, DATA_WRITING_AREA, DATA_CONTROL_LAYOUT} from './constants/WriteAttribute';
import {LEFT} from './constants/ControlsLayout';
import {DEFAULT as BORAD_DEFAULT} from './constants/Board';
import {DEFAULT} from './constants/WritingPad';
import WritingPadHistory from './WritingPadHistory';
import dataURLtoBlob from 'blueimp-canvas-to-blob';


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
    if (opts && opts.controlsLayout === LEFT) {
      this.$el.attr(DATA_CONTROL_LAYOUT, LEFT);
    }
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

  /*restore() {
    this.board.restoreWebStorage()
  }*/

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

  toBlob(type, quality) {
    return new Promise((resolve, reject)=>{
      let canvas = this.board.canvas;
      canvas.toBlob(resolve, type, quality);
    });
  }

  saveByKey(key) {
    //this.histories[key] = this.board.getImg()
    this.histories[key] = canvasUtils.copyCanvas(this.board.canvas);
  }

  containKey(key) {
    return !!this.histories[key];
  }

  deleteKey(key) {
    delete this.histories[key];
  }

  _resetBoard() {
    //this.stateHistory.save();
    //this.board.reset({color:false, size:false});
    //this.board.resetBackground();
    this.board.clear();
    //this.stateHistory.restore();
  }

  restoreByKey( key, {clearEmpty = true, useHistoryHeight = false} = {}) {
    if (this.containKey(key)) {
      let historyCanvas = this.histories[key];

      this._resetBoard();

      if (useHistoryHeight) this.resetHeight(historyCanvas.height);

      canvasUtils.drawFrom(this.board.canvas, historyCanvas);
      //this.board.restoreHistory(this.histories[key]);
      return true;
    } else if (clearEmpty) {
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
    let originalCanvas = canvasUtils.copyCanvas(this.board.canvas);
    this.$el.height(this.getHeight() + height)
    this.resize();
    this._resetBoard();
    canvasUtils.drawFrom(this.board.canvas, originalCanvas);
  }

  resetHeight(height) {
    let originalCanvas = canvasUtils.copyCanvas(this.board.canvas);
    this.$el.height(height);
    this.resize();
    this._resetBoard();
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
      this.$el.one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', (evt)=> {
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

