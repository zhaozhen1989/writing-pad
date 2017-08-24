writing-pad
==============================

## Dependencies

* [drawingboard.js](https://github.com/eHanlin/drawingboard.js.git#v0.4.7)
* font-awesome
* jquery


## Usage

```js
var container = document.querySelector("#container");
var board = writingPad.build(container);
board.show()
board.resize()
```

## API
 
### writingPad.build(element, opts)

Create an instance of writingPad class.

#### element

Append to element container.

#### opts

This is some optional settings.

* **opts.canvasWidth:** Set canvas width. The canvas is able to view width as wide as container when canvas width is wider than container.
* **opts.controlsLayout:** Set control panel's layout.(left or center)
* **opts.useMovingGesture:** Set true if you want to use scale gesture.
* **opts.gridTipText:** Set the tip text of grid's background.
* **opts.hintAreaText:** Set hint that is able to write area.
* **opts.controls:**  The control panel's setup support `Drawing` 、 `Eraser` 、 `Grid` 、 `ExtendVertical` 、 `Close` 、 `Reset` and so on.
> Set `color` or `lineWidth` if you use `Drawing`. (ie `{Drawing:{color:'rgba(0, 0, 255, 1)', lineWidth:'5'}}`).

See [this](https://github.com/eHanlin/drawingboard.js#included-controls) if you want to use `drawingboard.js` controls.

### WritingPad


#### resize()

Resize canvas width.

#### restore()

Draw a image to canvas from web storage.

#### show()

Show a container.

#### hide()

Hide a container.

#### isHidden()

Return true if current container's display is none.

#### toImage()

Get a image of base64.

#### toBlob(type, quality):Promise

Get a blob.

```js
board.toBlob().then(function(blob){
  //do something
});
```

#### saveByKey(key)

Save current canvas to history by key.

#### restoreByKey(key)

Draw a canvas from history's key.

#### clearStorage()

Remove images from storage

#### openGridBg()

Show the grid background.

#### closeGridBg()

Hide the grid background.

#### toggleGridBg()

Show or hide the grid background.

#### getHeight()

Get the container's height.

#### extendHeight(height)

Increase container's height.

* height: Input increasing values.

#### autosize(auto:boolean)

Resize canvas width when `resize` event is triggered by browser.

#### openHintWritingArea()

Open hint that is able to write area.

#### closeHintWritingArea()

Close hint that is able to write area.


