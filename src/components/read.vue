<template>
  <div id="read">
    <div class="name">我的世界 第{{toUpper(contentList)}}章 {{read[contentList]['title']}}</div>
    <div class="content">
      <div class="conList" v-for="(item, index) in read[contentList]['content']" :key="index">
        {{item}}
      </div>
    </div>
    <div class="tools">
      颜色选择器 <input type="color">
    </div>
  </div>
</template>

<script>
import read from '../assets/read';
export default {
  name: 'read',
  data () {
    return {
      read,
      contentList: 1,
    }
  },
  mounted() {
    
  },
  methods: {
    toUpper(inputnum){
      var num = inputnum;
      if(isNull(num)){
        return ;
      }
      for ( var int = 0; int < num.length; int++) {
        if(checkNum(num)){
          break;
        }else{
          num = removeLastChar(num);
          int --;
        }
        if(isNull(num)) return;
      }
      return this.ToTrans(num)
      
      function isNull(num){
        return num === null || num === "" || num === undefined
      }
    },
    //校验是否为正浮点数或正整数
    checkNum(str){
      var patrn=/^([+]?)\d*\.?\d+$/;
      return patrn.test(str);
    },
    
    //移除最后一个字符
    removeLastChar(str){
      if(str == null || str == ""){
        return str;
      }
      return str.substring(0,str.length-1);
    },
    
    ToTrans(a) {
        var b = 9.999999999999E10,
        f = "\u96f6",
        h = "\u58f9",
        g = "\u8d30",
        e = "\u53c1",
        k = "\u8086",
        p = "\u4f0d",
        q = "\u9646",
        r = "\u67d2",
        s = "\u634c",
        t = "\u7396",
        l = "\u62fe",
        d = "\u4f70",
        i = "\u4edf",
        j = "\u4ebf",
        c = "\u89d2",
        n = "\u5206",
        a = a.toString();
        if (a == "") {
            alert("转换内容不能为空!");
            return "";
        }
        if (a.match(/[^,.\d]/) != null) {
            alert("输入有误,请输入小数点和纯数字!");
            return "";
        }
        if (a.match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
            alert("输入有误,请输入小数点和纯数字!");
            return "";
        }
        a = a.replace(/,/g, "");
        a = a.replace(/^0+/, "");
        if (Number(a) > b) {
            alert("\u5bf9\u4e0d\u8d77,\u4f60\u8f93\u5165\u7684\u6570\u5b57\u592a\u5927\u4e86!\u6700\u5927\u6570\u5b57\u4e3a99999999999.99\uff01");
            return "";
        }
        b = a.split(".");
        if (b.length > 1) {
            a = b[0];
            b = b[1];
            b = b.substr(0, 2);
        } else {
            a = b[0];
            b = "";
        }
        h = new Array(f, h, g, e, k, p, q, r, s, t);
        l = new Array("", l, d, i);
        n = new Array(c, n);
        c = "";
        if (Number(a) > 0) {
            for (d = j = 0; d < a.length; d++) {
                e = a.length - d - 1;
                i = a.substr(d, 1);
                g = e / 4;
                e = e % 4;
                if (i == "0") j++;
                else {
                    if (j > 0) c += h[0];
                    j = 0;
                    c += h[Number(i)] + l[e];
                }
            }
        }
        if (b != "") for (d = 0; d < b.length; d++) {
            i = b.substr(d, 1);
            if (i != "0") c += h[Number(i)] + n[d];
        }
        return c;
    }
  }
}
</script>

<style scoped>
#read{
  background-color: #cec9c2;
  width: 100vw;
  min-height: 100vh;
  font-size: 16px;
  color: #333333;
  line-height: 1.7em;
  letter-spacing: 1px;
}
.name {
  font-size: 1.4em;
  font-weight: 600;
  line-height: 50px;
}
.content {
  width: 1200px;
  margin: 0 auto;
}
.conList {
  text-align: left;
  text-indent: 2em;
}
</style>