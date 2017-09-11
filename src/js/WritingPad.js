
import es6Promise from 'promise-polyfill';
import $ from 'jQuery';
import * as random from './utils/random';
import * as canvasUtils from './utils/canvasUtils';
import SimpleObserver from './utils/SimpleObserver';
import {CLOSE, START_DRAWING, BOARD_START_DRAWING, BOARD_STOP_DRAWING, STOP_DRAWING, DRAWING, BOARD_DRAWING} from './constants/Event';
import {DATA_HINT_AREA, DATA_WRITING_AREA, DATA_CONTROL_LAYOUT} from './constants/WriteAttribute';
import {LAYOUT_POSITIONS, LEFT_RIGHT} from './constants/ControlsLayout';
import {DEFAULT as BORAD_DEFAULT} from './constants/Board';
import {DEFAULT} from './constants/WritingPad';
import WritingPadHistory from './WritingPadHistory';
import dataURLtoBlob from 'blueimp-canvas-to-blob';
import SimulateControls from './SimulateControls';

let Promise = window.Promise;

if (typeof window.Promise === 'undefined') {
  Promise = es6Promise.Promise;
}

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
    this._initEvents();
    this._bindDelayResize = this._delayResize.bind(this);
  }

  _initEvents() {
    this.board.ev.bind(BOARD_START_DRAWING, (evt)=> this.trigger(START_DRAWING, evt))
    this.board.ev.bind(BOARD_STOP_DRAWING, (evt)=> this.trigger(STOP_DRAWING, evt))
    this.board.ev.bind(BOARD_DRAWING, (evt)=> this.trigger(DRAWING, evt))
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
    let $container = $(container);
    $board.hide();
    $container.append($board);
    this.$el = $board;
    if (opts && opts.canvasWidth) this._setInnerContentWidth(opts.canvasWidth);
  }

  _initLayoutControls(opts) {
    let controlsLayout = opts && opts.controlsLayout ? opts.controlsLayout : null;

    if (LAYOUT_POSITIONS.indexOf(controlsLayout) > -1) {
      let $controls = this.$el.find('.drawing-board-controls');
      let $background = this.$el.find('.controls-background');
      this.$el.attr(DATA_CONTROL_LAYOUT, opts.controlsLayout);

      if (controlsLayout == LEFT_RIGHT) {
        let simulateControls = new SimulateControls(this, $controls, $background);
        this.simulateControls = simulateControls;
        simulateControls.simulate();
      }
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

  _getHintAreaTextElement() {
    return this.$el.find('.hint-area-text');
  }

  _buildContainerElement(id, opts) {
    return $(`
      <div class="writing-pad-container" ${DATA_WRITING_AREA}="${opts.hintAreaText}">
        <div class="hint-area-text">
          ${opts.hintAreaText}
        </div>
        <div class="writing-inner-content">
          <div class="writing-pad-mask">
            <div id='${id}'>
              <div class="controls-background"></div>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  resize(redraw = true) {
    this.stateHistory.save();
    let tmpCanvas;
    let canvasWidth = this.board.canvas.width;
    if (canvasWidth != 0 && redraw) tmpCanvas = canvasUtils.copyCanvas(this.board.canvas);
    this.$el.find(".drawing-board-canvas-wrapper, canvas").width("100%");
    let innerWidth = this._getInnerContentElement().width()
    let width = this.$el.width()
    let maxWidth = Math.max(innerWidth, width)
    this._getInnerContentElement().width(maxWidth)
    this.board.resize({controlHeight:false});
    if (canvasWidth !=0 && redraw) canvasUtils.drawFrom(this.board.canvas, tmpCanvas);
    this.stateHistory.restore();
    if (this.simulateControls) this.simulateControls.resize();
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
    try {
      this.histories[key] = canvasUtils.copyCanvas(this.board.canvas);
    } catch (e) {
      console.warn(e);
      return false;
    }
    return true;
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
         this.resize();
      }
    }, ms);
  }

  getHeight(){
    return this.$el.height();
  }

  extendHeight(height = 300) {
    this.$el.height(this.getHeight() + height)
    this.resize();
    this._resizeHintText();
  }

  resetHeight(height) {
    this.$el.height(height);
    this.resize(false);
    this._resetBoard();
  }

  autosize(auto = true) {
    if(auto) {
      $(window).on('resize', this._bindDelayResize);
    } else {
      $(window).off('resize', this._bindDelayResize);
    }
  }

  _resizeHintText() {
    let height = Math.min(this.$el.height(), $(window).height());
    this._getHintAreaTextElement().height(height - 40);
  }

  openHintWritingArea() {
    return new Promise((resolve, reject)=> {
      let close = ()=> {
        this.closeHintWritingArea();
        resolve();
      };

      let timeId = setTimeout(() =>{
        close();
      }, 3800);
      this.$el.attr(DATA_HINT_AREA, '');
      this._resizeHintText();
      this.$el.one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', (evt)=> {
        close();
        clearTimeout(timeId);
      });
    });
  }

  closeHintWritingArea() {
    this.$el.removeAttr(DATA_HINT_AREA)
  }

}

export default WritingPad;

