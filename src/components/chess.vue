<template>
  <div id="chess">
    <div class="containertop">
      <button @click="toback">上一步</button>
      <button @click="tonext">下一步</button>
    </div>
    <div class="chess-container">
      <div 
      v-for="(item,index) in defaultbtn" 
      class="defaultbtn"
      :key="index+'c'"
      @click.stop="clickdefultbtn(item)"
      :style="{
        top: (item[0]-1) * 55 - 20 + 'px',
        left: (item[1]-1) * 55 - 20 + 'px'
      }"></div>
      <div 
      class="black" 
      v-for="(item,index) in black" 
      :key="index+'black'"
      @click="toactive('black',index)"
      :class="{active: item.active && item.active == 'active'}"
      :style="{
        top: (item.place[0]-1) * 55 - 20 + 'px',
        left: (item.place[1]-1) * 55 - 20 + 'px'
      }">
        {{item.name}}
      </div>
      <div 
      class="red" 
      v-for="(item,index) in red" 
      :key="index+'red'"
      @click="toactive('red',index)"
      :class="{active: item.active && item.active == 'active'}"
      :style="{
        top: (item.place[0]-1) * 55 - 20 + 'px',
        left: (item.place[1]-1) * 55 - 20 + 'px'
      }">
        {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
import getpoint from '@/assets/chessPoint.js';
export default {
  name: "chess",
  data() {
    return {
      history: [],     //全部历史记录
      historyindex: 0, //历史记录光标
      thisindex: [],   //当前记录
      black: [
        {
          type: 'general',
          name: '帅',
          place: [1,5]
        },{
          type: 'bodyguard',
          name: '士',
          place: [1,4],
        },{
          type: 'bodyguard',
          name: '士',
          place: [1,6],
        },{
          type: 'primeminister',
          name: '象',
          place: [1,7],
        },{
          type: 'primeminister',
          name: '象',
          place: [1,3],
        },{
          type: 'cavalry',
          name: '马',
          place: [1,2],
        },{
          type: 'cavalry',
          name: '马',
          place: [1,8],
        },{
          type: 'vehicle',
          name: '车',
          place: [1,1],
        },{
          type: 'vehicle',
          name: '车',
          place: [1,9],
        },{
          type: 'runningtroops',
          name: '炮',
          place: [3,2],
        },{
          type: 'runningtroops',
          name: '炮',
          place: [3,8],
        },{
          type: 'pawn',
          name: '卒',
          place: [4,1],
        },{
          type: 'pawn',
          name: '卒',
          place: [4,3],
        },{
          type: 'pawn',
          name: '卒',
          place: [4,5],
        },{
          type: 'pawn',
          name: '卒',
          place: [4,7],
        },{
          type: 'pawn',
          name: '卒',
          place: [4,9],
        }
      ],
      red: [
        {
          type: 'general',
          name: '将',
          place: [10,5]
        },{
          type: 'bodyguard',
          name: '士',
          place: [10,4],
        },{
          type: 'bodyguard',
          name: '士',
          place: [10,6],
        },{
          type: 'primeminister',
          name: '相',
          place: [10,7],
        },{
          type: 'primeminister',
          name: '相',
          place: [10,3],
        },{
          type: 'cavalry',
          name: '马',
          place: [10,2],
        },{
          type: 'cavalry',
          name: '马',
          place: [10,8],
        },{
          type: 'vehicle',
          name: '车',
          place: [10,1],
        },{
          type: 'vehicle',
          name: '车',
          place: [10,9],
        },{
          type: 'runningtroops',
          name: '炮',
          place: [8,2],
        },{
          type: 'runningtroops',
          name: '炮',
          place: [8,8],
        },{
          type: 'pawn',
          name: '卒',
          place: [7,1],
        },{
          type: 'pawn',
          name: '卒',
          place: [7,3],
        },{
          type: 'pawn',
          name: '卒',
          place: [7,5],
        },{
          type: 'pawn',
          name: '卒',
          place: [7,7],
        },{
          type: 'pawn',
          name: '卒',
          place: [7,9],
        }
      ],                //红色方棋子
      defaultbtn: [],   //所有棋格
      activetype: 'red',//当前应走方
      activearr: [],    //当前激活棋子
      activearrindex: '',//当前激活棋子在棋堆的key
    }
  },
  methods: {
    toback() {
      this.historyindex = this.historyindex < 1 ? 0 : this.historyindex - 1;
      this.thisindex = JSON.parse(JSON.stringify(this.historyindex == -1 ? this.history[0] : this.history[this.historyindex]))
      this.red = this.thisindex[0];
      this.black = this.thisindex[1];
      this.activetype = this.activetype == 'red' ? 'black' : 'red';
      this.activearr= [];
      this.activearrindex= '';
    },
    tonext() {
      this.historyindex = this.historyindex == this.history.length - 1 ? this.history.length - 1 : this.historyindex + 1;
      this.thisindex = JSON.parse(JSON.stringify(this.historyindex == -1 ? this.history[0] : this.history[this.historyindex]));
      this.red = this.thisindex[0];
      this.black = this.thisindex[1];
      this.activetype = this.activetype == 'red' ? 'black' : 'red';
      this.activearr= [];
      this.activearrindex= '';
    },
    commomtohistory() {
      var self = this;
      self.thisindex = JSON.parse(JSON.stringify([this.red,this.black]));
      if(self.history.length - self.historyindex > 1){
        self.history[self.historyindex + 1] = JSON.parse(JSON.stringify(self.thisindex));
        for(let i in self.history){
          if(i > self.historyindex + 2){
            delete self.history[i];
          }
        }
        self.history.length = self.historyindex + 2;
        self.historyindex = self.historyindex + 1;
      }else{
        self.history.push(JSON.parse(JSON.stringify(self.thisindex)));
        self.historyindex = self.history.length - 1;
      }
    },
    setactive(type,index){
      for(let i in this[type]){
        this.$set(this[type][i], 'active', 'null')
      }
      this.$set(this[type][index], "active", "active");
      this.activearr = this[type][index].place;
      for(let i=0; i<document.getElementsByClassName('defaultbtn').length;i++){
        document.getElementsByClassName('defaultbtn')[i].style.zIndex = '3';
      }
    },
    toactive(type,index) {
      if(this.activetype == type){
        this.setactive(type,index);
        this.activearrindex = index;
      }
    },
    clickdefultbtn(arr) {
      //无激活棋子
      if(this.activearr[0] == undefined || this.activearr[1] == undefined) return
      //激活棋子与当前点击相同
      if(arr[0] == this.activearr[0] && arr[1] == this.activearr[1]) return
      //切换激活棋子
      if(this.isactivetype(arr)){
        this.setactive(this.activetype,this.activearrindex);
        return
      }
      
      //判读所有可能的落子位置
      let pointarr = getpoint(this.activetype,this[this.activetype][this.activearrindex].place,this[this.activetype][this.activearrindex].type);
      for(let i in pointarr){
        if(pointarr[i][0] == arr[0] && pointarr[i][1] == arr[1]){
          //判断落子是否绊蹄，或者有其他子阻挡
          if(this.pointIsOk(this[this.activetype][this.activearrindex].place, pointarr[i], this[this.activetype][this.activearrindex].type)) return
          //移动
          this.$set(this[this.activetype][this.activearrindex], 'place', pointarr[i]);
          this.activearr = pointarr[i];
          //判断是否吃子
          let thisarr = JSON.parse(JSON.stringify(this.red));
          if(this.activetype == 'red'){
            thisarr = this.black;
          }
          let iseat = false, eatindex = '';
          for(let i in thisarr){
            if(thisarr[i].place[0] == arr[0] && thisarr[i].place[1] == arr[1]){
              iseat = true;
              eatindex = i;
            }
          }
          //吃子
          if(iseat){
            if(this.activetype == 'red'){
              this.black.splice(eatindex,1);
            }else{
              this.red.splice(eatindex,1);
            }
          }

          // 清除数据
          this.activearr= [];
          this.activearrindex= '';
          for(let i in this[this.activetype]){
            this.$set(this[this.activetype][i], 'active', 'null')
          }
          for(let i=0; i<document.getElementsByClassName('defaultbtn').length;i++){
            document.getElementsByClassName('defaultbtn')[i].style.zIndex = '1';
          }

          //交换执棋方
          if(this.activetype == 'red'){
            this.activetype = 'black'
          }else{
            this.activetype = 'red'
          }

          //加入历史记录
          this.commomtohistory();
        }
      }
    },
    isactivetype(arr) {
      let isactive = false;
      for(let i in this[this.activetype]) {
        if(this[this.activetype][i].place[0] == arr[0] && this[this.activetype][i].place[1] == arr[1]){
          isactive = true;
          this.activearrindex = i;
        }
      }
      return isactive
    },
    pointIsOk(point, topoint, type){
      let noOk = false;

      if(type == 'primeminister'){
        let centerpoint = [(point[0] + topoint[0])/2, (point[1] + topoint[1])/2];
        if(this.haschess(centerpoint)){
          noOk = true
        }
      }

      if(type == 'cavalry'){
        let centerpoint;
        if(Math.abs(point[0] - topoint[0]) == 1 && point[1] - topoint[1] == 2){
          centerpoint = [point[0], point[1] - 1];
        }else if(Math.abs(point[0] - topoint[0]) == 1 && point[1] - topoint[1] == -2){
          centerpoint = [point[0], point[1] + 1];
        }else if(Math.abs(point[1] - topoint[1]) == 1 && point[0] - topoint[0] == 2){
          centerpoint = [point[0] - 1, point[1]];
        }else if(Math.abs(point[1] - topoint[1]) == 1 && point[0] - topoint[0] == -2){
          centerpoint = [point[0] + 1, point[1]];
        }
        if(this.haschess(centerpoint)){
          noOk = true
        }
      }

      if(type == 'vehicle'){
        if(point[0] == topoint[0]){
          if(point[1] > topoint[1]){
            // console.log('左移')
            for(let i = topoint[1] + 1; i < point[1]; i++){
              if(this.haschess([point[0], i])){
                noOk = true
              }
            }
          }else{
            // console.log('右移')
            for(let i = point[1] + 1; i < topoint[1]; i++){
              if(this.haschess([point[0], i])){
                noOk = true
              }
            }
          }
        }else{
          if(point[0] > topoint[0]){
            // console.log('上移')
            for(let i = topoint[0] + 1; i < point[0]; i++){
              if(this.haschess([i, point[1]])){
                noOk = true
              }
            }
          }else{
            // console.log('下移')
            for(let i = point[0] + 1; i < topoint[0]; i++){
              if(this.haschess([i, point[1]])){
                noOk = true
              }
            }
          }
        }
      }

      if(type == 'runningtroops'){
        let cross = 0;
        if(point[0] == topoint[0]){
          if(point[1] > topoint[1]){
            // console.log('左移')
            for(let i = topoint[1] + 1; i < point[1]; i++){
              if(this.haschess([point[0], i])){
                cross++;
              }
            }
            noOk = this.iseats(cross,topoint);
          }else{
            // console.log('右移')
            for(let i = point[1] + 1; i < topoint[1]; i++){
              if(this.haschess([point[0], i])){
                cross++;
              }
            }
            noOk = this.iseats(cross,topoint);
          }
        }else{
          if(point[0] > topoint[0]){
            // console.log('上移')
            for(let i = topoint[0] + 1; i < point[0]; i++){
              if(this.haschess([i, point[1]])){
                cross++;
              }
            }
            noOk = this.iseats(cross,topoint);
          }else{
            // console.log('下移')
            for(let i = point[0] + 1; i < topoint[0]; i++){
              if(this.haschess([i, point[1]])){
                cross++;
              }
            }
            noOk = this.iseats(cross,topoint);
          }
        }
      }

      return noOk
    },
    haschess(point){
      let inpoint = false;
      for(let i in this.red){
        if(this.red[i].place[0] == point[0] && this.red[i].place[1] == point[1]){
          inpoint = true;
        }
      }
      for(let i in this.black){
        if(this.black[i].place[0] == point[0] && this.black[i].place[1] == point[1]){
          inpoint = true;
        }
      }
      return inpoint;
    },
    iseats(cross,topoint){
      let noOk = false;
      if(cross > 1){
        noOk = true
      }else if(cross == 1){
        let thisarr = JSON.parse(JSON.stringify(this.red));
        if(this.activetype == 'red'){
          thisarr = this.black;
        }
        let iseat = false;
        for(let i in thisarr){
          if(thisarr[i].place[0] == topoint[0] && thisarr[i].place[1] == topoint[1]){
            iseat = true;
          }
        }
        if(!iseat){//不吃子，不能隔子走
          noOk = true;
        }
      }else if(cross == 0){//炮不能直接吃子
        if(this.haschess(topoint)){
          noOk = true;
        }
      }
      return noOk
    }
  },
  created() {
    for(let i=1; i<11; i++){
      for(let j=1; j<10; j++){
        this.defaultbtn.push([i,j])
      }
    }
    this.commomtohistory();
  }
}
</script>

<style scoped>
*{
  box-sizing: border-box;
}
.chess-container *{
  user-select: none;
}
.chess-container{
  width: 450px;
  height: 514px;
  background: url('../../static/img/chess.jpg') no-repeat;
  background-size: 100% 100%;
  margin: 20px auto;
  position: relative;
}
.chess-container > div{
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 30px;
  border-radius: 50%;
  user-select: none;
  translate: all 0.5s;
  z-index: 2;
}
.chess-container > .defaultbtn{
  background: rgba(255,255,255,0);
  transform: scale(1.1, 1.1);
  z-index: 1;
}
.chess-container > .black {
  background: black;
  color: #ffffff;
}
.chess-container > .red{
  background: red;
  color: #ffffff;
}
.chess-container > .active{
  transform: scale(1.1, 1.1);
  box-shadow: 0 0 4px 2px #999999;
}
</style>