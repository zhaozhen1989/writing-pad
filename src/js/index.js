
import $ from 'jQuery';
import css from 'drawingboardCss';
import less from '../less/main.less';
//import fontAwesome from 'font-awesome/css/font-awesome.css';
import * as drawingboard from 'drawingboard';
import CloseButton from './components/CloseButton';
import GridButton from './components/GridButton';
import ExtendVerticalButton from './components/ExtendVerticalButton';
import DrawingButton from './components/DrawingButton';
import EraserButton from './components/EraserButton';
import ResetButton from './components/ResetButton';
import buildWritingPad from './builders/writingPadBuilder';

DrawingBoard.Control.Close = CloseButton;
DrawingBoard.Control.Grid = GridButton;
DrawingBoard.Control.ExtendVertical = ExtendVerticalButton;
DrawingBoard.Control.Drawing = DrawingButton;
DrawingBoard.Control.Eraser = EraserButton;
DrawingBoard.Control.Reset = ResetButton;
    

(function decroateNavigation(){
  let initialize = DrawingBoard.Control.Navigation.prototype.initialize;
  DrawingBoard.Control.Navigation.prototype.initialize = function() {
    initialize.apply(this, arguments);
    //this.$el.find(".drawing-board-control-navigation-reset").html("<i class='fa fa-repeat'/>");
  };
})();

let exportModule = {
  build:buildWritingPad
};

//if (typeof window === 'object') window.writingPad = exportModule;

export default exportModule;
module.exports = exportModule;

