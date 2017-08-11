import $ from 'jQuery';
import * as random from '../utils/random';
import WritingPad from '../WritingPad';

let build = ( container, opts = {} )=> {
  return new WritingPad(container, opts);
};

export default build;

