
class SimpleObserver {

  constructor() {
    this._events = {};
  }

  on(name, fn) {
    let events = this._events[name] ? this._events[name] : this._events[name] = []; 
    events.push(fn);
  }

  off(name, fn) {
    if (arguments.length == 1) {
      this._events[name] = [];
    } else if (arguments.length > 1) {
      let eventFns = this._events[name];
      let index = eventFns.indexOf(fn);
      index > -1 && events.splice(index, 1);
    }
  }

  trigger(name) {
    let eventFns = this._events[name];
    if (eventFns) {
      let parameters = Array.prototype.slice.call(arguments,1);
      for (var i in eventFns) {
        eventFns[i].apply(this, parameters)
      }
    }
  }

}

export default SimpleObserver;

