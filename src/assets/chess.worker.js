onmessage = function (event) {
  var initdata = JSON.parse(event.data);
  var data = initdata.data;
  var type = initdata.type;
  var com = initdata.com;
  console.log(initdata)
  
  let moveall = com.getMoveGenerator(data, type)
  let maxmoveall, thisval, maxval = 0, newdata1, newdata2, newdata3, newdata4, newdata5, blackmove1, redmove2, blackmove3, redmove4, blackmove5, redmove5;
  for(let i in moveall){
    newdata1 = com.moveStep(data, moveall[i]);
    blackmove1 = com.getMoveGenerator(newdata1, 'black');
    
    for(let j in blackmove1){
      newdata2 = com.moveStep(newdata1, blackmove1[j]);
      redmove2 = com.getMoveGenerator(newdata1, 'red');

      for(let k in redmove2){
        newdata3 = com.moveStep(newdata2, redmove2[k]);
        blackmove3 = com.getMoveGenerator(newdata3, 'black');

        for(let l in blackmove3){
          newdata4 = com.moveStep(newdata3, blackmove3[l]);
          redmove4 = com.getMoveGenerator(newdata4, 'red');

          for(let m in redmove4){
            newdata5 = com.moveStep(newdata4, redmove4[m]);
            blackmove5 = com.getMoveGenerator(newdata5, 'black');
            redmove5 = com.getMoveGenerator(newdata5, 'red');

            thisval = com.getValGennerator(newdata5, 'black', blackmove5, redmove5);
            if(thisval > maxval){
              maxval = thisval;
              maxmoveall = newdata1;
            }
          }
        }
      }
    }
  }

  postMessage(maxmoveall);
}