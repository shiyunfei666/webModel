import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import chess from '@/components/chess'
import manMachineChess from '@/components/manMachineChess'
import read from '@/components/read'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },{
      path: '/index',
      name: 'index',
      component: index
    },{
      path: '/chess',
      name: 'chess',
      component: chess
    },{
      path: '/manMachineChess',
      name: 'manMachineChess',
      component: manMachineChess
    },{
      path: '/read',
      name: 'read',
      component: read
    }
  ]
})
