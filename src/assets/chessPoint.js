const getpoint = function (colortype,arr,type) {
  let pointarr = [];

  var filterpoint = (a,b,c,d) => {
    pointarr = pointarr.filter((item)=>{
      return item[0] > a && item[0] < b && item[1] > c && item[1] < d;
    });
  }

  if(type == "general") {
    pointarr = [
      [arr[0] + 1, arr[1]],
      [arr[0] - 1, arr[1]],
      [arr[0], arr[1] + 1],
      [arr[0], arr[1] - 1],
    ]
    if(colortype == 'red'){
      filterpoint(7,11,3,7);
    }else if(colortype == 'black') {
      filterpoint(0,4,3,7)
    }
  }

  if(type == 'bodyguard'){
    pointarr = [
      [arr[0] + 1, arr[1] + 1],
      [arr[0] - 1, arr[1] + 1],
      [arr[0] + 1, arr[1] - 1],
      [arr[0] - 1, arr[1] - 1],
    ]
    if(colortype == 'red'){
      filterpoint(7,11,3,7);
    }else if(colortype == 'black') {
      filterpoint(0,4,3,7);
    }
  }

  if(type == 'primeminister'){
    pointarr = [
      [arr[0] + 2, arr[1] + 2],
      [arr[0] - 2, arr[1] + 2],
      [arr[0] + 2, arr[1] - 2],
      [arr[0] - 2, arr[1] - 2],
    ]
    if(colortype == 'red'){
      filterpoint(5,11,0,10);
    }else if(colortype == 'black') {
      filterpoint(0,6,0,10);
    }
  }

  if(type == 'cavalry'){
    pointarr = [
      [arr[0] + 2, arr[1] + 1],
      [arr[0] + 1, arr[1] + 2],
      [arr[0] - 2, arr[1] + 1],
      [arr[0] - 1, arr[1] + 2],
      [arr[0] + 2, arr[1] - 1],
      [arr[0] + 1, arr[1] - 2],
      [arr[0] - 2, arr[1] - 1],
      [arr[0] - 1, arr[1] - 2],
    ]
    filterpoint(0,11,0,10);
  }

  if(type == 'vehicle' || type == 'runningtroops'){
    for(let i=1; i<11; i++){
      pointarr.push([i,arr[1]]);
    }
    for(let j=1; j<10; j++){
      pointarr.push([arr[0],j]);
    }
    for(let k in pointarr){
      if(pointarr[k][0] == arr[0] && pointarr[k][1] == arr[1]){
        delete pointarr[k];
      }
    }
    pointarr = pointarr.filter((item)=>{
      return item != undefined;
    });
  }

  if(type == 'pawn'){
    if(colortype == 'red'){
      if(arr[0] > 5){
        pointarr = [
          [arr[0] - 1, arr[1]],
        ]
      }else{
        pointarr = [
          [arr[0] - 1, arr[1]],
          [arr[0], arr[1] + 1],
          [arr[0], arr[1] - 1],
        ]
      }
    }else if(colortype == 'black') {
      if(arr[0] < 6){
        pointarr = [
          [arr[0] + 1, arr[1]],
        ]
      }else{
        pointarr = [
          [arr[0] + 1, arr[1]],
          [arr[0], arr[1] + 1],
          [arr[0], arr[1] - 1],
        ]
      }
    }
  }

  return pointarr
}

export default getpoint;