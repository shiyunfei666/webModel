<template>
  <div id="manMachineChess">
    <div class="chess-container">
      <div v-for="(v, i) in initData" :key="i">
        <div 
        v-for="(v2, i2) in v" 
        :key="i2"
        class="defaultbtn"
        :class="(isType(v2) == 'r' ? 'red' : (isType(v2) == 'b' ? 'black' : '')) + (((activeChess.from[0] == i && activeChess.from[1] == i2) ? ' active' : ''))"
        @click.stop="takeChess(v2,i,i2)">
        {{getName(v2)}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import com from '../assets/chess.js';
export default {
  name: 'manMachineChess',
  data () {
    return {
      initData: com.initData,
      type: 'red',
      activeChess: {
        short: -1,
        from: [-1,-1]
      },//当前激活棋子
      worker: null,
    }
  },
  methods: {
    isType: com.isType,
    getName: com.getName,
    takeChess(v2,i,i2) {
      if(this.type == 'red' && com.isRed(v2) || this.type == 'black' && com.isBlack(v2)){
        this.activeChess = {
          short: v2,
          from: [i,i2]
        }
        return
      }else{
        //无激活棋子，不变
        if(this.activeChess.stort == -1) return
        let moveall = com.getMoveGenerator(this.initData, this.type);
        for(let b in moveall){
          if(moveall[b].to[0] == i && moveall[b].to[1] == i2 && moveall[b].from[0] == this.activeChess.from[0] && moveall[b].from[1] == this.activeChess.from[1]){
            this.activeChess.to = [i,i2];
            this.initData = com.moveStep(this.initData, moveall[b]);
            this.type = this.type == 'red' ? 'black' : 'red';
            if(this.type == 'black'){
              setTimeout(() => {
                this.initData = this.nextStep(this.initData, 1, this.type);
                this.type = 'red';
              },50)
            }
            this.$set(this, 'activeChess', {short: -1, from: [-1, -1]});
            break;
          }
        }
      }
    },
    nextStep(data, num = 1, type = 'black'){
      console.time('计时')
      let moveAll = com.getMoveGenerator(data, type), thisVal = -99999, maxVal = -99999, newData, maxValData, otherType = (type == 'red' ? 'black' : 'red');
      for(let i = moveAll.length; i--;){
        newData = com.moveStep(data, moveAll[i]);
        const thisTypeMove = com.getMoveGenerator(newData, type);
        const otherTypeMove = com.getMoveGenerator(newData, otherType);
        thisVal = com.getChessValue(newData, otherType, thisTypeMove, otherTypeMove);
        console.log('stepChess1: ', thisVal)
        if(thisVal < -9000){
          continue
        }

        if (maxVal < thisVal) {
          maxVal = thisVal;
          maxValData = newData;
        }

        let nextData = newData;
        if (num) {
          const { data, maxVal: thisVal } = this.stepChess(nextData, num, otherType)
          nextData = data;
          if (maxVal < thisVal) {
            maxVal = thisVal;
            maxValData = newData;
          }
        }
      }
      console.timeEnd('计时')
      return maxValData
    },
    stepChess(data, num = 1, type = 'red'){
      let moveAll = com.getMoveGenerator(data, type), thisVal = -99999, maxVal = -99999, newData, otherType = (type == 'red' ? 'black' : 'red'), maxValData;
      for(let i = moveAll.length; i--;){
        newData = com.moveStep(data, moveAll[i]);
        const thisTypeMove = com.getMoveGenerator(newData, type);
        const otherTypeMove = com.getMoveGenerator(newData, otherType);
        thisVal = com.getChessValue(newData, otherType, thisTypeMove, otherTypeMove);
        // console.log('stepChess outer: ', thisVal)
        if(thisVal < -9000){
          continue
        }

        for(let j in otherTypeMove) {
          const newOtherData = com.moveStep(newData, otherTypeMove[j]);
          const thisTypeMove2 = com.getMoveGenerator(newOtherData, otherType);
          const otherTypeMove2 = com.getMoveGenerator(newOtherData, type);
          thisVal = com.getChessValue(newData, type, thisTypeMove2, otherTypeMove2);
          // console.log('stepChess inner: ', thisVal)
          if(thisVal < -9000){
            continue
          }
          if (maxVal < thisVal) {
            maxVal = thisVal
            maxValData = newOtherData
          }
        }
      }

      return {
        data: maxValData,
        maxVal: maxVal
      }
    }
  }
}
</script>

<style scoped>
*{
  box-sizing: border-box;
}
#manMachineChess *{
  user-select: none;
}
#manMachineChess{
  padding: 1px;
}

.chess-container {
  width: 450px;
  height: 550px;
  background: url('../../static/img/chess.jpg') no-repeat;
  background-size: 100% 100%;
  margin: 20px auto;
  position: relative;
}

.chess-container > div {
  width: 120%;
  height: 53.5px;
  position: relative;
  border-radius: unset;
  top: -14px;
  left: -17px;
  margin-bottom: 4.5px;
}

.chess-container > div > div {
  float: left;
  width: 53.5px;
  height: 53.5px;
  line-height: 53.5px;
  text-align: center;
  font-size: 30px;
  border-radius: 999px;
  user-select: none;
  overflow: unset;
  translate: all 0.5s;
  z-index: 2;
  margin-right: 0.6px;
}

.chess-container .defaultbtn{
  background: rgba(255,255,255,0);
  transform: scale(1.1, 1.1);
  z-index: 1;
}
.chess-container .black {
  background: black;
  color: #ffffff;
}
.chess-container .red{
  background: red;
  color: #ffffff;
}
.chess-container .active{
  transform: scale(1.1, 1.1);
  box-shadow: 0 0 4px 2px #999999;
}

.chess-container > div > div >.defaultbtn{
  background: rgba(0,0,0,0.0);
  z-index: 1;
}

.chess-container > div > div > .black {
  background: black;
  color: #ffffff;
}
.chess-container > div > div > .red{
  background: red;
  color: #ffffff;
}
.chess-container > div > div > .active{
  transform: scale(1.1, 1.1);
  box-shadow: 0 0 4px 2px #999999;
}
</style>