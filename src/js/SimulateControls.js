
//let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || setTimeout;
let requestAnimationFrame = setTimeout;
//let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || clearTimeout;
let cancelAnimationFrame = clearTimeout;

class SimulateControls {

  constructor(pad, $controls, $background) {
    this.pad = pad;
    this.board = pad.board;
    this._unbindEventFunctions = [];
    this.$controls = $controls;
    this.$background = $background;
    this._initElement($controls, $background);
  }

  _initElement($controls, $background) {
    this.$el = $controls.clone();
    this.$el.insertAfter($controls);
    this.$el.addClass('right clone');
    this.$elBackground = $background.clone();
    this.$elBackground.insertAfter($background);
    this.$elBackground.addClass('right');
    this.$el.css('position', 'absolute');
  }

  simulate() {
    let $buttons = this.$controls.find('button');
    let $selfButtons = this.$el.find('button');
    this._unbindAll();
    $buttons.each((index, el)=>{
      this._linkElement($selfButtons.eq(index), $(el));
    });
    let requestId = null;
    let refresh = ()=> {
      let right = this.board.$el.width() - this.pad.$el.width();
      this.$el.offset({top:$(window).scrollTop()}); 
      this.$el.css('right', `${right}px`);
      this.$elBackground.css('right', `${right}px`);
      requestId = null;
    };

    let refreshPosition = ()=> {
      if (requestId == null) requestId = requestAnimationFrame(refresh);
    };

    $(window).on('resize', refreshPosition);
    $(window).on('scroll', refreshPosition);
    this._unbindEventFunctions.push(()=> $(window).off('resize', refreshPosition));
    this._unbindEventFunctions.push(()=> $(window).off('scroll', refreshPosition));
    refreshPosition();
  }

  _unbindAll() {
    while(this._unbindEventFunctions.length) {
      let unbind = this._unbindEventFunctions.pop();
      unbind();
    }
  }

  _syncStyle($el, $target) {
    $el.attr('class', $target.attr('class'));
  }

  _bindMutationObserver($el, $target) {
    let observer = new MutationObserver((mutations)=> {
      mutations.forEach((mutation)=> {
        if (mutation.attributeName === "class") {
          this._syncStyle($el, $target);
        }
      });
    });

    observer.observe($target[0], {
      attributes:true
    });
    this._unbindEventFunctions.push(()=> observer.disconnect());
  }

  _linkElement($el, $target) {
    let clickTarget = ()=>{
      $target.click();
    };
    $el.on('click', clickTarget);
    this._bindMutationObserver($el, $target);
    this._unbindEventFunctions.push(()=> $el.off('click', clickTarget));
  }

}


export default SimulateControls;

