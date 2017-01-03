
import {isTouchEvent} from '../utils/eventUtils';
import $ from 'jQuery';

let GridButton = DrawingBoard.Control.extend({

  name: 'grid',

  initialize:function() {
    this.$el.append(`
      <button class="drawing-board-control-grid-button">
        <i class="fa fa-th"></i>
      </button>
    `);

    this.$el.on('click', '.drawing-board-control-grid-button', $.proxy((e)=>{
        e.preventDefault()
        this.board.__extend.toggleGridBg()
        //this._showDraggingButton()
        this._getDraggingButtonInstance()
        this._setTipTitle(this.board.__extend.defaults.gridTipText);
        if (!this.board.__extend._getWrapper().hasClass('grid')) this._disableMovingBG()
    }, this))
  },


  DRAG_BG_BUTTON:'dragging-bg-button',

  canDragging:false,

  _getEventPoint:function(evt) {
    var result;

    if (evt.pageX == undefined) {
      let originalEvent = evt.originalEvent;
      let changedTouches = originalEvent.changedTouches;
      result = {
        x:changedTouches[0].pageX,
        y:changedTouches[0].pageY
      }
    } else {
      result = {
        x:evt.pageX,
        y:evt.pageY
      };
    }
    return result;
  },

  _initMoveBGEvent:function() {
    let $wrapper = this.board.__extend._getWrapper()
    $wrapper.on('mousedown touchstart', (evt)=>{
      evt.preventDefault();
      this.canDragging = true;
      let evtPoint = this._getEventPoint(evt);
      this.startX = evtPoint.x;
      this.startY = evtPoint.y;
    })
    $wrapper.on('mousemove touchmove', (evt)=>{
      if (this.canDragging) {
        let evtPoint = this._getEventPoint(evt);
        let diffX = evtPoint.x - this.startX;
        let diffY = evtPoint.y - this.startY;
        let bgPoint = this.getBGPoint();
        this.setBGPoint( bgPoint.x + diffX, bgPoint.y + diffY );
        this.startX = evtPoint.x;
        this.startY = evtPoint.y;
        //console.log(diffX, diffY, this.getBGPoint(), evt);
      }
    })
    $wrapper.on('mouseup touchend', (evt)=> this.canDragging = false);
    let $style = this.$style = $("<style id='drawing-bg-move-style'></style>");
    $(document.body).append($style);
  },

  DRAWING_TIP_TITLE:"drawing-tip-title",

  _setTipTitle:function(title){
    let $wrapper = this.board.__extend._getWrapper();
    let $drawingTipTitle = $wrapper.find(`.${this.DRAWING_TIP_TITLE}`);

    if (!$drawingTipTitle.length) {
      $drawingTipTitle = $($.parseHTML(`
        <div class="${this.DRAWING_TIP_TITLE}"></div>
      `))
      $wrapper.append($drawingTipTitle);
    }

    $drawingTipTitle.html(title);
  },

  setBGPoint:function(x, y) {
    this.$style.html(`.drawing-board-canvas-wrapper.grid:after { background-position-x:${x}px; background-position-y:${y}px;}`);
    //wrapper = this.board.__extend._getWrapper()
    //tyle = window.getComputedStyle($wrapper[0], ':after')
    //tyle.setPropertyValue('background-position-x', "#{x}px")
    //tyle.setPropertyValue('background-position-y', "#{y}px")
  },

  getBGPoint:function() {
    let $wrapper = this.board.__extend._getWrapper();
    let style = window.getComputedStyle($wrapper[0], ':after');
    let x = (style.getPropertyValue('background-position-x') || "0").replace(/[%px]/g, "");
    let y = (style.getPropertyValue('background-position-y') || "0").replace(/[%px]/g, "");
    return {
      x:Number(x),
      y:Number(y)
    }
  },

  //_showDraggingButton:function(){
  //  this._getDraggingButtonInstance().show()
  //}

  _disableMovingBG:function() {
    let $wrapper = this.board.__extend._getWrapper();
    $wrapper.removeClass('move-bg');
  },

  _enableMovingBG:function() {
    let $wrapper = this.board.__extend._getWrapper();
    $wrapper.addClass('move-bg');
  },

  _toggleMovingBG:function() {
    let $wrapper = this.board.__extend._getWrapper()
    if (!$wrapper.hasClass('move-bg')) this._enableMovingBG(); else this._disableMovingBG();
  },

  _getDraggingButtonInstance:function() {
    let $wrapper = this.board.__extend._getWrapper();
    let $dragBgButton = $wrapper.find(`.${this.DRAG_BG_BUTTON}`);

    if (!$dragBgButton.length) {
      $dragBgButton = $($.parseHTML(`<button class="${this.DRAG_BG_BUTTON}">
        <i class="fa fa-arrows" aria-hidden="true"></i>
      </button>`))
      $wrapper.append($dragBgButton)
      $dragBgButton.on(`${isTouchEvent? "touchstart": "click"}`, ()=> this._toggleMovingBG());
      this._initMoveBGEvent();
    }

    return $dragBgButton;
  }
});

export default GridButton;

