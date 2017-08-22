
class WritingPadHistory {

  COPY_CTX_TYPES = ['string', 'boolean', 'number']

  constructor(pad) {
    this.pad = pad;
    this.ctxTmp = {};
    this.$actives = $();
  }

  _reset() {
    this.ctxTmp = {};
  }

  _saveCtx() {
    let ctx = this.pad.board.ctx;
    this._reset();

    for(let key in ctx) {
      let value = ctx[key];
      let type = typeof(value);
      if (this.COPY_CTX_TYPES.indexOf(type) > -1 && key.indexOf('webkit') == -1) {
        this.ctxTmp[key] = value;
      }
    }
  }

  _saveControls() {
    this.$actives = this.pad.$el.find('.drawing-board-control .active');
  }

  save() {
    this._saveCtx();
    this._saveControls();
  }

  _restoreCtx() {
    let ctx = this.pad.board.ctx;

    for(let key in this.ctxTmp) {
      ctx[key] = this.ctxTmp[key];
    }

  }

  restore() {
    this._restoreCtx();
    this.$actives.addClass('active');
  }

}

export default WritingPadHistory;

