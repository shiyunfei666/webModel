const com = {};

//noChess 0

//b_king 1  将
//b_car 2   车
//b_horse 3 马
//b_canon 4 炮
//b_bishop 5士
//b_elephont 6象
//b_pawn 7  兵

//r_king 8
//r_car 9
//r_horse 10
//r_canon 11
//r_bishop 12
//r_elephont 13
//r_pawn 14
com.initData = [
  [2,3,6,5,1,5,6,3,2],
  [0,0,0,0,0,0,0,0,0],
  [0,4,0,0,0,0,0,4,0],
  [7,0,7,0,7,0,7,0,7],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [14,0,14,0,14,0,14,0,14],
  [0,11,0,0,0,0,0,11,0],
  [0,0,0,0,0,0,0,0,0],
  [9,10,13,12,8,12,13,10,9],
]

/**
 * @description: 根据棋盘数字，返回对应的key
 * @param {*} x 棋盘数字
 * @return {*} key，用于设置对应棋子的价值
 */
com.getKeyWord = function(x){
  switch(x){
    case 0:
      return 'noChess';
    case 1:
    case 8:
      return 'king';
    case 2:
    case 9:
      return 'car';
    case 3:
    case 10:
      return 'horse';
    case 4:
    case 11:
      return 'canon';
    case 5:
    case 12:
      return 'bishop';
    case 6:
    case 13:
      return 'elephont';
    case 7:
    case 14:
      return 'pawn';
    default:
      return 'noChess';
  }
}

/**
 * @description: 根据棋盘数字，返回对应的汉字
 */
com.getName = function(x) {
  switch(x){
    case 0:
      return '';
    case 1:
      return '将';
    case 8:
      return '帅';
    case 2:
    case 9:
      return '车';
    case 3:
    case 10:
      return '马';
    case 4:
    case 11:
      return '炮';
    case 5:
    case 12:
      return '士';
    case 6:
      return '象';
    case 13:
      return '相';
    case 7:
      return '卒';
    case 14:
      return '兵';
    default:
      return '';
  }
}

/**
 * @description: 根据棋盘中的棋子的数字，返回所属方，n为空白，r为红方，b为黑方
 */
com.isType = function(x) {
  if (x == 0) {
    return 'n'
  } else if (x < 8) {
    return 'b'
  } else {
    return 'r';
  }
}

/**
 * @description: 是否红方
 */
com.isBlack = function(x) {
  return x > 0 && x < 8
}

/**
 * @description: 是否黑方
 */
com.isRed = function(x) {
  return x > 7 && x < 15
}

/**
 * @description: 两个棋子是否为同一方
 */
com.isSameSide = function(x,y) {
  return this.isBlack(x) && this.isBlack(y) || this.isRed(x) && this.isRed(y)
}

/**
 * @description: 当前棋盘处除是否有棋子
 */
com.hasChess = function(data,i,j){
  return data[i][j] == 0 ? false : true
}

/**
 * @description: 当前棋盘处除是否有己方棋子
 */
com.hasSelfChess = function(data,i,j,type) {
  return data[i][j] == 0 ? false : (type == 'red' ? this.isSameSide(data[i][j],8) : this.isSameSide(data[i][j],1))
}

/**
 * @description: 根据走法，移动棋子
 * @param {*} data 棋盘数据
 * @param {*} i 走法中的某一个
 * @return {*} 走完后的新棋盘数据
 */
com.moveStep = function(data, i) {
  const newData = JSON.parse(JSON.stringify(data));

  newData[i.from[0]][i.from[1]] = 0;
  newData[i.to[0]][i.to[1]] = i.short;

  return newData;
}

/**
 * @description: 根据给定的范围，去除所有落点中超出的部分
 * @param {*} a 横坐标最大值
 * @param {*} b 横坐标最小值
 * @param {*} c 纵坐标最大值
 * @param {*} d 纵坐标最小值
 * @param {*} arr 所有可能的走法
 * @return {*} 符合范围的走法
 */
com.fca = function(a,b,c,d,arr) {
  return arr.filter((item)=>{
    return item[0] > a && item[0] < b && item[1] > c && item[1] < d;
  });
}

/**
 * @description: 搜索页面所有棋子，获取所有可能的点
 * @param {*} data 棋盘数据
 * @param {*} type 当前执棋方
 * @return {*} 当前执棋方所有走法的数组
 */
com.getMoveGenerator = function(data,type) {
  let pa = [], ca = [];
  for(let i = 0; i < 10; i++) {
    for(let j = 0; j < 9; j++){
      let d = data[i][j];
      if(d != 0 && (type == 'red' ? this.isRed(d) : this.isBlack(d))) {
        switch (d) {
          //将帅
          case 1:
          case 8:
            ca = [
              [i + 1, j],
              [i - 1, j],
              [i, j + 1],
              [i, j - 1],
            ]
            if(d == 1){
              ca = this.fca(-1,3,2,6,ca);
            }else{
              ca = this.fca(6,10,2,6,ca)
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //筛选点落地不能有己方棋子
              if(this.hasSelfChess(data, ca[a][0], ca[a][1], type)){
                ca.splice(a,1);
              }
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //加入数组
              pa.push({short: d, from: [i,j], to: ca[a]});
            }
            break;
          //士
          case 5:
          case 12:
            ca = [
              [i + 1, j + 1],
              [i - 1, j + 1],
              [i + 1, j - 1],
              [i - 1, j - 1],
            ]
            if(d == 5){
              ca = this.fca(-1,3,2,6,ca);
            }else if(d == 12) {
              ca = this.fca(6,10,2,6,ca);
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //筛选点落地不能有己方棋子
              if(this.hasSelfChess(data, ca[a][0], ca[a][1], type)){
                ca.splice(a,1);
              }
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //加入数组
              pa.push({short: d, from: [i,j], to: ca[a]});
            }
            break;
          //象
          case 6:
          case 13:
            ca = [
              [i + 2, j + 2],
              [i - 2, j + 2],
              [i + 2, j - 2],
              [i - 2, j - 2],
            ]
            if(d == 6){
              ca = this.fca(-1,5,-1,9,ca);
            }else if(d == 13) {
              ca = this.fca(4,10,-1,9,ca);
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //筛选点落地不能有己方棋子
              if(this.hasSelfChess(data, ca[a][0], ca[a][1], type)){
                ca.splice(a,1);
                continue;
              }
              //象眼不能有棋子
              let cpt = [(i + ca[a][0])/2, (j + ca[a][1])/2];
              if(this.hasChess(data,cpt[0],cpt[1])){
                ca.splice(a,1);
              }
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //加入数组
              pa.push({short: d, from: [i,j], to: ca[a]});
            }
            break;
          //马
          case 3:
          case 10:
            ca = [
              [i + 2, j + 1],
              [i + 1, j + 2],
              [i - 2, j + 1],
              [i - 1, j + 2],
              [i + 2, j - 1],
              [i + 1, j - 2],
              [i - 2, j - 1],
              [i - 1, j - 2],
            ]
            ca = this.fca(-1,10,-1,9,ca);
            for(let a = ca.length - 1; a >= 0; a--){
              //筛选点落地不能有己方棋子
              if(this.hasSelfChess(data, ca[a][0], ca[a][1], type)){
                ca.splice(a,1);
                continue
              }
              //马眼不能有棋子
              let cpt;
              if(Math.abs(i - ca[a][0]) == 1 && j - ca[a][1] == 2){
                cpt = [i, j - 1];
              }else if(Math.abs(i - ca[a][0]) == 1 && j - ca[a][1] == -2){
                cpt = [i, j + 1];
              }else if(Math.abs(j - ca[a][1]) == 1 && i - ca[a][0] == 2){
                cpt = [i - 1, j];
              }else if(Math.abs(j - ca[a][1]) == 1 && i - ca[a][0] == -2){
                cpt = [i + 1, j];
              }
              if(this.hasChess(data,cpt[0],cpt[1])){
                ca.splice(a,1);
              }
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //加入数组
              pa.push({short: d, from: [i,j], to: ca[a]});
            }
            break;
          //车
          case 2:
          case 9:
            ca = [];
            for(let ik=0; ik<10; ik++){
              ca.push([ik,j]);
            }
            for(let jk=0; jk<9; jk++){
              ca.push([i,jk]);
            }
            ca = this.fca(-1,10,-1,9,ca);
            for(let a = ca.length - 1; a >= 0; a--){
              //筛选点落地不能有己方棋子
              if(this.hasSelfChess(data, ca[a][0], ca[a][1], type)){
                ca.splice(a,1);
                continue
              }
              //不能越棋走
              if(i == ca[a][0]){
                if(j > ca[a][1]){
                  // console.log('左移')
                  for(let is = j - 1; is > ca[a][1]; is--){
                    if(this.hasChess(data, i, is)){
                      ca.splice(a,1);
                      break;
                    }
                  }
                }else{
                  // console.log('右移')
                  for(let is = ca[a][1] - 1; is > j; is--){
                    if(this.hasChess(data, i, is)){
                      ca.splice(a,1);
                      break;
                    }
                  }
                }
              }else{
                if(i > ca[a][0]){
                  // console.log('上移')
                  for(let is = i - 1; is > ca[a][0]; is--){
                    if(this.hasChess(data, is, j)){
                      ca.splice(a,1);
                      break;
                    }
                  }
                }else{
                  // console.log('下移')
                  for(let is = ca[a][0] - 1; is > i; is--){
                    if(this.hasChess(data,is, j)){
                      ca.splice(a,1);
                      break;
                    }
                  }
                }
              }
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //加入数组
              pa.push({short: d, from: [i,j], to: ca[a]});
            }
            break;
          //炮
          case 4:
          case 11:
            ca = [];
            for(let ik=0; ik<10; ik++){
              ca.push([ik,j]);
            }
            for(let jk=0; jk<9; jk++){
              ca.push([i,jk]);
            }
            ca = this.fca(-1,10,-1,9,ca);
            for(let a = ca.length - 1; a >= 0; a--){
              let cross = 0;
              //筛选点落地不能有己方棋子
              if(this.hasSelfChess(data, ca[a][0], ca[a][1], type)){
                ca.splice(a,1);
                continue;
              }
              //不能越棋走
              if(cross > 1){
                return
              }else{
                if(i == ca[a][0]){
                  if(j > ca[a][1]){
                    // console.log('左移')
                    for(let is = j - 1; is > ca[a][1]; is--){
                      if(this.hasChess(data, i, is)){
                        cross++;
                        if(cross > 2) break;
                      }
                    }
                  }else{
                    // console.log('右移')
                    for(let is = ca[a][1] - 1; is > j; is--){
                      if(this.hasChess(data, i, is)){
                        cross++;
                        if(cross > 2) break;
                      }
                    }
                  }
                }else{
                  if(i > ca[a][0]){
                    // console.log('上移')
                    for(let is = i - 1; is > ca[a][0]; is--){
                      if(this.hasChess(data, is, j)){
                        cross++;
                        if(cross > 2) break;
                      }
                    }
                  }else{
                    // console.log('下移')
                    for(let is = ca[a][0] - 1; is > i; is--){
                      if(this.hasChess(data,is, j)){
                        cross++;
                        if(cross > 2) break;
                      }
                    }
                  }
                }
              }
              //穿越多少棋子
              if(cross > 1){
                ca.splice(a,1);
              }else if(cross == 1){
                if(!this.hasChess(data, ca[a][0], ca[a][1])){
                  ca.splice(a,1);
                }
              }else if(cross == 0){//炮不能直接吃子
                if(this.hasChess(data, ca[a][0], ca[a][1])){
                  ca.splice(a,1);
                }
              }
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //加入数组
              pa.push({short: d, from: [i,j], to: ca[a]});
            }
            break;
          //兵
          case 14:
            if(i > 4){
              ca = [
                [i - 1, j],
              ]
            }else{
              ca = [
                [i - 1, j],
                [i, j + 1],
                [i, j - 1],
              ]
            }
            ca = this.fca(-1,10,-1,9,ca);
            for(let a = ca.length - 1; a >= 0; a--){
              //筛选点落地不能有己方棋子
              if(this.hasSelfChess(data, ca[a][0], ca[a][1], type)){
                ca.splice(a,1);
              }
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //加入数组
              pa.push({short: d, from: [i,j], to: ca[a]});
            }
            break;
          //卒
          case 7:
            if(i < 5){
              ca = [
                [i + 1, j],
              ]
            }else{
              ca = [
                [i + 1, j],
                [i, j + 1],
                [i, j - 1],
              ]
            }
            ca = this.fca(-1,10,-1,9,ca);
            for(let a = ca.length - 1; a >= 0; a--){
              //筛选点落地不能有己方棋子
              if(this.hasSelfChess(data, ca[a][0], ca[a][1], type)){
                ca.splice(a,1);
              }
            }
            for(let a = ca.length - 1; a >= 0; a--){
              //加入数组
              pa.push({short: d, from: [i,j], to: ca[a]});
            }
            break;
        }
      }
    }
  }
  
  return pa;
}

//价值表
const vl = {
  noChess: {
    baseval: 0,
    moveval: 0
  },
  king: {
    baseval: 10000,
    moveval: 0
  },
  car: {
    baseval: 500,
    moveval: 6
  },
  horse: {
    baseval: 350,
    moveval: 12
  },
  canon: {
    baseval: 350,
    moveval: 6
  },
  bishop: {
    baseval: 250,
    moveval: 1
  },
  elephont: {
    baseval: 250,
    moveval: 1
  },
  pawn: {
    baseval: 100,
    moveval: 15
  }
}

// 红方棋盘点位价值表
const redpown = [
  [0,0,0,0,0,0,0,0,0],
  [90,90,110,120,120,120,110,90,90],
  [90,90,110,120,120,120,110,90,90],
  [70,90,110,110,110,110,110,90,70],
  [70,70,70,70,70,70,70,70,70],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
]

// 黑方棋盘点位价值表
const blackpown = [
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [70,70,70,70,70,70,70,70,70],
  [70,90,110,110,110,110,110,90,70],
  [90,90,110,120,120,120,110,90,90],
  [90,90,110,120,120,120,110,90,90],
  [0,0,0,0,0,0,0,0,0],
]

/**
 * @description: 估值函数，根据页面上的棋子，估计局面的优劣
 * @param {*} data 棋盘数据
 * @param {*} type 当前执棋方
 * @param {*} redmove 当前执棋方可行动的所有走法
 * @param {*} blackmove 对方可行动的所有走法
 * @return {*} 分数
 */
com.getChessValue = function(data, type, redmove, blackmove) {
  let al = 0, rl = 0, rm = 0, rb = 1, bl = 0, bm = 0, bb = 1;

  for(let i = 0; i < 10; i++){
    for(let j = 0; j < 9; j++){
      if(this.isRed(data[i][j])){
        rm = 0;
        rb = 1;

        rm += vl[com.getKeyWord(data[i][j])].baseval;
        
        if(data[i][j] == 14){
          rm += redpown[i][j];
        }

        if(data[i][j] == 7){
          rm += blackpown[i][j];
        }
        for(let l in redmove){
          if(redmove[l].from[0] == i && redmove[l].from[1] == j){
            rm += vl[com.getKeyWord(redmove[l].short)].moveval;
          }
          if(redmove[l].to[0] == i && redmove[l].to[1] == j){
            rb++;
          }
        }

        for(let m in blackmove){
          if(blackmove[m].to[0] == i && blackmove[m].to[1] == j){
            rb--;
          }
        }
        if(rb > 0){
          rl += rm + rb - 1;
        }
      }

      if(this.isBlack(data[i][j])){
        bm = 0;
        bb = 1;

        bm += vl[com.getKeyWord(data[i][j])].baseval;
        
        if(data[i][j] == 14){
          bm += redpown[i][j];
        }

        if(data[i][j] == 7){
          bm += blackpown[i][j];
        }
        for(let l in blackmove){
          if(blackmove[l].from[0] == i && blackmove[l].from[1] == j){
            bm += vl[com.getKeyWord(blackmove[l].short)].moveval;
          }
          if(blackmove[l].to[0] == i && blackmove[l].to[1] == j){
            bb++;
          }
        }

        for(let m in redmove){
          if(redmove[m].to[0] == i && redmove[m].to[1] == j){
            bb--;
          }
        }
        if(rb > 0){
          bl += bm + bb - 1;
        }
      }
    }
  }

  if(type == 'red'){
    al = rl - bl
  }else{
    al = bl - rl
  }
  return al;
}

export default com;