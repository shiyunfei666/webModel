<template>
  <div id="index">
    <div class="btncontainer">
      <button @click.stop="changetype('square')" :class="{active: dragtype == 'square'}">方框</button>
      <button @click.stop="changetype('circle')" :class="{active: dragtype == 'circle'}">椭圆</button>
      <button @click.stop="changetype('arrow')" :class="{active: dragtype == 'arrow'}">箭头</button>
      <button @click.stop="toback">上一步</button>
      <button @click.stop="tonext">下一步</button>
      <button @click.stop="cleardiv">清屏</button>
      <button @click.stop="downLoad"><a class="down" href="" download="downImg">下载</a></button>
    </div>
    <div class="divcontainer" @mousedown.self="selectBox">
      <template v-for="(val,i) in thisindex">
        <div 
        v-if="val.type == 'square'" 
        :key="i"
        :data-key="i"
        class="drsElement drsMoveHandle aaa"
        :id="val.id != undefined ? val.id : null"
        :style="{
          top: val.top,
          left: val.left,
          width: val.width + 'px',
          height: val.height + 'px'
        }"></div>
        <div 
        v-if="val.type == 'circle'" 
        :key="i"
        :data-key="i"
        class="drsElement drsMoveHandle aaa"
        :id="val.id != undefined ? val.id : null"
        :style="{
          top: val.top,
          left: val.left,
          width: val.width + 'px',
          height: val.height + 'px'
        }"></div>
        <div 
        v-if="val.type == 'arrow'" 
        :key="i"
        :data-key="i"
        class="drsElement drsMoveHandle arrow aaa"
        :id="val.id != undefined ? val.id : null"
        :style="{
          top: val.top,
          left: val.left,
          width: val.width + 'px',
          height: val.height + 'px',
          transformOrigin: val.transformOrigin,
          transform: 'rotate(' + (val.dir + 140) + 'deg)'
        }"></div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      dragtype: 'square',
      history: [],
      historyindex: 0,
      thisindex: [],
    }
  },
  mounted() {
    let width = document.body.clientWidth, height = document.body.clientHeight, self = this;
    let dragresize = new DragResize('dragresize',
    { minWidth: 3, minHeight: 3, minLeft: 0, minTop: 50, maxLeft: width, maxTop: height });
    dragresize.isElement = function(elm)
    {
    if (elm.className && elm.className.indexOf('drsElement') > -1) return true;
    };
    dragresize.isHandle = function(elm)
    {
    if (elm.className && elm.className.indexOf('drsMoveHandle') > -1) return true;
    };
    dragresize.ondragfocus = function() { };
    // dragresize.ondragstart = function(isResize) { };
    dragresize.ondragmove = function(isResize) {
      let key = document.getElementsByClassName("active_Drag")[0].getAttribute('data-key');
      self.thisindex[key].left = window.getactive_Drag.elmX + 'px';
      self.thisindex[key].width = window.getactive_Drag.elmW;
      self.thisindex[key].top = window.getactive_Drag.elmY + 'px';
      self.thisindex[key].height = window.getactive_Drag.elmH;
    };
    // dragresize.ondragend = function(isResize) { };
    dragresize.ondragblur = function() { 
      self.commomtohistory();
    };
    dragresize.apply(document);
  },
  methods:{
    changetype(type){
      this.dragtype = type;
    },
    cleardiv(){
      if(this.thisindex.length == 0) return
      if(this.history[this.history.length-1].length == 0){
        this.$set(this,'thisindex', []);
        this.historyindex = this.history.length - 1;
      }else{
        this.$set(this,'thisindex', []);
        this.history.push([]);
        this.historyindex = this.history.length - 1;
      }
    },
    toback(){
      this.historyindex = this.historyindex < 1 ? -1 : this.historyindex - 1;
      this.thisindex = JSON.parse(JSON.stringify(this.historyindex == -1 ? [] : this.history[this.historyindex]))
    },
    tonext(){
      this.historyindex = this.historyindex == this.history.length - 1 ? this.history.length - 1 : this.historyindex + 1;
      this.thisindex = JSON.parse(JSON.stringify(this.historyindex == -1 ? [] : this.history[this.historyindex]));
    },
    commomtohistory(){
      var self = this;
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
    // 下载
    downLoad(){
      debugger
      //创建一个新的canvas
      var canvas2 = document.createElement("canvas");
      let
      _canvas = document.getElementById('index');
      var w = parseInt(window.getComputedStyle(_canvas).width);
      var h = parseInt(window.getComputedStyle(_canvas).height);
      //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
      canvas2.width = w * 2;
      canvas2.height = h * 2;
      canvas2.style.width = w + "px";
      canvas2.style.height = h + "px";
      //可以按照自己的需求，对context的参数修改,translate指的是偏移量
      //  var context = canvas.getContext("2d");
      //  context.translate(0,0);
      var context = canvas2.getContext("2d");
      context.scale(2, 2);
      html2canvas(document.getElementById('index'), { canvas: canvas2 }).then(function(canvas) {
      //document.body.appendChild(canvas);
      //canvas转换成url，然后利用a标签的download属性，直接下载，绕过上传服务器再下载
      document.querySelector(".down").setAttribute('href', canvas.toDataURL());
    });
    },
    selectBox(event){
      var self = this;
      /**----------------------------- 方框 --------------------------- */
      if(this.dragtype == "square"){
        let e = event || window.event;
        // startX, startY 为鼠标点击时初始坐标
        let startX, startY, comwidth, comheight, styleTop, styleLeft;
        // 鼠标按下
        startX = e.pageX;
        startY = e.pageY;
        //删除未监听到的onmouseup事件，导致active_box遗留
        document.getElementById("active_box") && document.getElementById("active_box").remove();
        // 如果鼠标在 drsElement 上被按下
        if(e.target.className.match(/divcontainer/)) {
            // 在页面创建 drsElement
            self.thisindex.push({
              type: 'square',
              width: 1,
              height: 1,
              top: startY + 'px',
              left: startX + 'px',
              id: 'active_box'
            })
        }
        // 鼠标移动
        document.onmousemove = function(e) {
            // 更新 drsElement 尺寸
            if(document.getElementById("active_box") !== null) {
                let ab = document.getElementById("active_box");
                comwidth = Math.abs(startX - e.pageX);
                comheight = Math.abs(startY - e.pageY);
                ab.style.width = comwidth + 'px';
                ab.style.height = comheight + 'px';
                if(e.pageX > startX && e.pageY > startY){
                  styleTop = startY + 'px';
                  styleLeft = startX + 'px';
                }else if(e.pageX < startX && e.pageY < startY){
                  styleTop = startY - comheight + 'px';
                  styleLeft = startX - comwidth + 'px';
                }else if(e.pageX < startX && e.pageY > startY){
                  styleTop = startY + 'px';
                  styleLeft = startX - comwidth + 'px';
                }else if(e.pageX > startX && e.pageY < startY){
                  styleTop = startY - comheight + 'px';
                  styleLeft = startX + 'px';
                }
                ab.style.top = styleTop;
                ab.style.left = styleLeft;
            }
        };
                
        // 鼠标抬起
        document.onmouseup = function(e) {
          document.onmousemove = null
          if(document.getElementById("active_box") !== null) {
              let ab = document.getElementById("active_box");
              ab.removeAttribute("id");
              // 如果长宽均小于 3px，移除 box
              if(ab.offsetWidth < 3 || ab.offsetHeight < 3) {
                  for(let i in self.thisindex){
                    if(self.thisindex[i].id == 'active_box'){
                      self.thisindex.splice(i,1);
                    }
                  }
              }else{
                  for(let i in self.thisindex){
                    if(self.thisindex[i].id == 'active_box'){
                      self.$set(self.thisindex, i, {
                        type: self.dragtype,
                        top: styleTop,
                        left: styleLeft,
                        width: comwidth,
                        height: comheight
                      })
                    }
                  }
                  self.commomtohistory();
              }
          }
        };
      }
      /**----------------------------- 椭圆 --------------------------- */
      if(this.dragtype == "circle"){
        let e = event || window.event;
        // startX, startY 为鼠标点击时初始坐标
        let startX, startY, comwidth, comheight, styleTop, styleLeft;
        // 鼠标按下
        startX = e.pageX;
        startY = e.pageY;
        //删除未监听到的onmouseup事件，导致active_box遗留
        document.getElementById("active_box") && document.getElementById("active_box").remove();
        // 如果鼠标在 drsElement 上被按下
        if(e.target.className.match(/divcontainer/)) {
            // 在页面创建 drsElement
            self.thisindex.push({
              type: 'circle',
              width: 1,
              height: 1,
              top: startY + 'px',
              left: startX + 'px',
              id: 'active_box'
            })
        }
        // 鼠标移动
        document.onmousemove = function(e) {
            // 更新 drsElement 尺寸
            if(document.getElementById("active_box") !== null) {
                let ab = document.getElementById("active_box");
                comwidth = Math.abs(startX - e.pageX);
                comheight = Math.abs(startY - e.pageY);
                ab.style.width = comwidth + 'px';
                ab.style.height = comheight + 'px';
                ab.style.borderRadius = '100%';
                if(e.pageX > startX && e.pageY > startY){
                  styleTop = startY + 'px';
                  styleLeft = startX + 'px';
                }else if(e.pageX < startX && e.pageY < startY){
                  styleTop = startY - comheight + 'px';
                  styleLeft = startX - comwidth + 'px';
                }else if(e.pageX < startX && e.pageY > startY){
                  styleTop = startY + 'px';
                  styleLeft = startX - comwidth + 'px';
                }else if(e.pageX > startX && e.pageY < startY){
                  styleTop = startY - comheight + 'px';
                  styleLeft = startX + 'px';
                }
                ab.style.top = styleTop;
                ab.style.left = styleLeft;
            }
        };
                
        // 鼠标抬起
        document.onmouseup = function(e) {
          document.onmousemove = null
          if(document.getElementById("active_box") !== null) {
              let ab = document.getElementById("active_box");
              ab.removeAttribute("id");
              // 如果长宽均小于 3px，移除 box
              if(ab.offsetWidth < 3 || ab.offsetHeight < 3) {                  
                for(let i in self.thisindex){
                    if(self.thisindex[i].id == 'active_box'){
                      self.thisindex.splice(i,1);
                    }
                  }
              }else{
                  for(let i in self.thisindex){
                    if(self.thisindex[i].id == 'active_box'){
                      self.$set(self.thisindex, i, {
                        type: self.dragtype,
                        top: styleTop,
                        left: styleLeft,
                        width: comwidth,
                        height: comheight
                      })
                    }
                  }
                  self.commomtohistory();
              }
          }
        };
      }
      /*-----------------箭头----------------------*/
      if(this.dragtype == 'arrow'){
        let e = event || window.event;
        // startX, startY 为鼠标点击时初始坐标
        let startX, startY, comwidth, comheight, styleTop, styleLeft, dir;
        // 鼠标按下
        startX = e.pageX;
        startY = e.pageY;
        //删除未监听到的onmouseup事件，导致active_box遗留
        document.getElementById("active_box") && document.getElementById("active_box").remove();
        // 如果鼠标在 drsElement 上被按下
        if(e.target.className.match(/divcontainer/)) {
            // 在页面创建 drsElement
            self.thisindex.push({
              type: 'arrow',
              width: 1,
              height: 1,
              top: startY + 'px',
              left: startX + 'px',
              id: 'active_box'
            })
        }
        // 鼠标移动
        document.onmousemove = function(e) {
            // 更新 drsElement 尺寸
            if(document.getElementById("active_box") !== null) {
                let ab = document.getElementById("active_box");
                
                comheight = 40;
                comwidth = self.PointLegth([startX,startY],[e.pageX,e.pageY]);
                
                dir = self.getAngle([startX,startY],[e.pageX,e.pageY]);

                ab.style.transformOrigin = "center left";
                ab.style.transform = "rotate(" + (dir + 140) + "deg)";
                ab.style.width = comwidth + 'px';
                ab.style.height = comheight + 'px';
            }
        };
                
        // 鼠标抬起
        document.onmouseup = function(e) {
          document.onmousemove = null
          if(document.getElementById("active_box") !== null) {
              let ab = document.getElementById("active_box");
              ab.removeAttribute("id");
              // 如果长宽均小于 3px，移除 box
              if(ab.offsetWidth < 3 || ab.offsetHeight < 3) {
                  for(let i in self.thisindex){
                    if(self.thisindex[i].id == 'active_box'){
                      self.thisindex.splice(i,1);
                    }
                  }
              }else{
                  for(let i in self.thisindex){
                    if(self.thisindex[i].id == 'active_box'){
                      self.$set(self.thisindex, i, {
                        type: self.dragtype,
                        top: startY + 'px',
                        left: startX + 'px',
                        width: comwidth,
                        height: comheight,
                        transformOrigin: 'center left',
                        dir: dir
                      })
                    }
                  }
                  self.commomtohistory();
              }
          }
        };
      }
    },
    // 旋转角度
    getAngle(cen, first) {
　　　//斜边长度
      let length = this.PointLegth(first, cen);
      //对边比斜边 sin
      let hudu = Math.asin(Math.abs(first[1] - cen[1])/length);
      let ag = hudu*180/Math.PI;
      
      //第一象限90-
      if ((cen[0] - first[0]) <= 0 && (cen[1] - first[1]) >= 0)
          ag = 90 - ag;
          //第二象限90+
      else if ((cen[0] - first[0]) <= 0 && (cen[1] - first[1]) <= 0)
          ag = ag + 90;
          //第三象限270-
      else if ((cen[0] - first[0]) >= 0 && (cen[1] - first[1]) <= 0)
          ag = 270 - ag;
          //第四象限270+
      else if ((cen[0] - first[0]) >= 0 && (cen[1] - first[1]) >= 0)
          ag = ag + 270;
      //偏移
      ag -= 235;
      return ag;
    },
    PointLegth(pa,pb){
      return Math.sqrt(Math.pow((pa[0] - pb[0]), 2) + Math.pow((pa[1] - pb[1]), 2));
    },
    getType(obj){
      var str = Object.prototype.toString.call(obj);
      var map={
        '[object Boolean]'  : 'boolean', 
        '[object Number]'   : 'number', 
        '[object String]'   : 'string', 
        '[object Function]' : 'function', 
        '[object Array]'    : 'array', 
        '[object Date]'     : 'date', 
        '[object RegExp]'   : 'regExp', 
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null', 
        '[object Object]'   : 'object'
      }
      if(obj instanceof Element){ //判断是否是dom元素，如div等
        return "element";
      }
      return map[str];
    },
    //深拷贝函数
    deepCopy(p){
      var obj;
      var str = this.getType(p);
      if(str == 'array'){
        obj = [];
        for (var i = 0; i < p.length; i++) {
          obj.push(arguments.callee(p[i]));  //回调自己
        }
      }else if(str == 'object'){
        obj = {};
        for(var i in p){
          obj[i] = arguments.callee(p[i]);
        }
      }else{
        return p;
      }
      return obj;
    }
  }
}
</script>

<style scoped>
*{
  box-sizing: border-box;
}
#index *{
  user-select: none;
}
#index,.divcontainer{
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 2;
}
.divcontainer{
  padding-top: 50px;
}
.btncontainer{
  width: 100%;
  height: 50px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
}
#index button{
  border: none;
  outline: none;
  color: #666666;
  background: #f8f8f8;
  text-align: center;
  border-radius: 3px;
  margin-top: 10px;
  padding: 3px 8px;
  height: 30px;
  line-height: 24px;
  cursor: pointer;
}
#index button.active{
  color: #ffffff;
  background: #1c75ff;
}
#index button .down{
  color: #666666;
}
.box {
  /* background: #f00; */
  border:1px solid red;
  width: 0px;
  height: 0px;
  position: absolute;
  /* opacity: 0.5; */
  cursor: move;/*鼠标拖到图标*/
}
#toolBox {
  width: 300px;
  height:50px;
  border:1px solid #333;
  margin:20px 0 0 100px;
}
.toolStyle {
  width: 60px;
  height: 25px;
  margin:12px;
  border:1px solid #666;
}
.toolStyle:hover {
  border-color: #000;
}
.drsElement {
  position: absolute;
  border: 1px solid #333;
}
.drsMoveHandle {
  height: 20px;
  cursor: move;
}
.dragresize {
  position: absolute;
  width: 5px;
  height: 5px;
  font-size: 1px;
  background: #fff;
  border: 1.5px solid red;
  border-radius: 100%;
}
.dragresize-tl {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}
.dragresize-tm {
  top: -4px;
  left: 50%;
  margin-left: -4px;
  cursor: n-resize;
}
.dragresize-tr {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.dragresize-ml {
  top: 50%;
  margin-top: -4px;
  left: -4px;
  cursor: w-resize;
}
.dragresize-mr {
  top: 50%;
  margin-top: -4px;
  right: -4px;
  cursor: e-resize;
}

.dragresize-bl {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}
.dragresize-bm {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
  cursor: s-resize;
}
.dragresize-br {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}
.arrow{
  position: absolute;
  background: url('../../static/img/arrow.jpg') no-repeat;
  background-size: 100% 100%;
  border: none;
}
</style>