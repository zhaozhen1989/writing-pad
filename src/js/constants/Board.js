
export const DEFAULT = { 
  autoHistory:false,
  autoStorage:false,
  eraserColor:'transparent',
  background:'',
  controlsPosition:'center',
  controls:[
/*    {
      Size:{
        type: 'dropdown'
      }
    },
    {
      DrawingMode:{
        filler: false
      }
    },
    {
      Navigation:{
        back: false,
        forward: false
      }
    },*/
    'Drawing',
    {   
      Drawing:{
        color:'rgba(0, 0, 255, 1)'
      }   
    },  
    {   
      Eraser:{
        lineWidth: '30'
      }   
    },  
    {   
      Navigation:{
        back: false,
        forward: false
      }   
    },  
    "ExtendVertical",
    "Grid",
    "Close"
  ]
};

