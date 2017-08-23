

export function copyCanvas(canvas) {
  let newCanvas = document.createElement('canvas');
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  let newCtx = newCanvas.getContext('2d');
  newCtx.drawImage(canvas, 0, 0); 
  return newCanvas;
};

export function drawFrom(canvas, from) {
  let ctx = canvas.getContext('2d');
  ctx.drawImage(from, 0, 0);
};

