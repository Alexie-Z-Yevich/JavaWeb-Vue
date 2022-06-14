import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import User from '../views/sys/User.vue'
import Role from '../views/sys/Role.vue'
import Menu from '../views/sys/Menu.vue'
import UserCenter from '../views/UserCenter.vue'
import Student from '../views/stu/Student.vue'
import Grade from '../views/stu/Grade.vue'
import Push from '../views/stu/Push.vue'
import Change from '../views/sta/Change.vue'
import Reward from '../views/sta/Reward.vue'
import Punish from '../views/sta/Punish.vue'
import ApplyStudent from '../views/apply/Student.vue'
import ApplyTeacher from '../views/apply/Teacher.vue'
import axios from "../axios";
import store from '../store'

const modules = import.meta.glob('../views/sys/**.vue')
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/index',
                name: 'Index',
                meta: {
                    title: '首页'
                },
                component: Index
            },
            {
                path: '/userCenter',
                name: 'UserCenter',
                meta: {
                    title: '个人中心'
                },
                component: UserCenter
            },
            {
                path: '/sys/users',
                name: 'SysUser',
                meta: {
                    title: '用户管理'
                },
                component: User
            },
            {
                path: '/sys/roles',
                name: 'SysRole',
                meta: {
                    title: '角色管理'
                },
                component: Role
            },
            {
                path: '/sys/menus',
                name: 'SysMenu',
                meta: {
                    title: '菜单管理'
                },
                component: Menu
            },
            {
                path: '/stu/students',
                name: 'StuStudent',
                meta: {
                    title: '学生管理'
                },
                component: Student
            },
            {
                path: '/stu/grades',
                name: 'StuGrade',
                meta: {
                    title: '成绩查询'
                },
                component: Grade
            },
            {
                path: '/stu/pushs',
                name: 'StuPush',
                meta: {
                    title: '成绩录入'
                },
                component: Push
            },
            {
                path: '/sta/changes',
                name: 'StaChange',
                meta: {
                    title: '学籍变更'
                },
                component: Change
            },
            {
                path: '/sta/rewards',
                name: 'StaReward',
                meta: {
                    title: '学生奖励'
                },
                component: Reward
            },
            {
                path: '/sta/punishs',
                name: 'StaPunish',
                meta: {
                    title: '学生处罚'
                },
                component: Punish
            },
            {
                path: '/lea/students',
                name: 'LeaStudent',
                meta: {
                    title: '学生请假'
                },
                component: ApplyStudent
            },
            {
                path: '/lea/teachers',
                name: 'LeaTeacher',
                meta: {
                    title: '假条批阅'
                },
                component: ApplyTeacher
            },
        ]
    },

    {
        path: '/login',
        name: 'Login',
        component: Login
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    let hasRoute = store.state.menus.hasRoute;

    let token = localStorage.getItem('token');
    if(to.path === '/login') {
        next();
    }else if(!token){
        next('/login');
    }else if (token && !hasRoute) {
        axios.get('/sys/menu/nav',{
            headers: {
                Authorization:localStorage.getItem('token')
            }
        }).then(res => {
            // 拿到menuList
            store.commit("setMenuList",res.data.data.nav)
            // 拿到用户权限
            store.commit("setPermList",res.data.data.authorities)
            // 动态绑定路由
            let newRoutes = router.options.routes
            res.data.data.nav.forEach(menu => {
                if(menu.children){
                    menu.children.forEach(e => {
                        // 转成路由
                        let route = menuToRouter(e)
                        // 把路由添加到路由管理中
                        if (route){
                            newRoutes[0].children.push(route)
                        }
                    })
                }
            })

            //newRoutes.forEach(newRoute => {
                router.addRoute(newRoutes)
            //})
            hasRoute = true
            store.commit("changeRouteStatus",hasRoute)
        })
    }

    next()
})

// 导航转成路由
const menuToRouter = (menu) => {
    if(!menu.component){
        return null
    }
    let route = {
        path: menu.path,
        name: menu.name,
        meta: {
            icon: menu.icon,
            title: menu.title
        }
    }

    route.component = () => import('../views/' + menu.component + '.vue')

    return route
}

export default router