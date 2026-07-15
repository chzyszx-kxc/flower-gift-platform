import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: "Home",
        component: () => import('../views/Home/index.vue'),
        meta: {
            title: '首页'
        }
    },
    // {
    //     path: '/aboutus',
    //     name: 'aboutus',
    //     component: () => import('../views/AboutUs/AboutUs.vue'),
    //     meta: {
    //         title: '关于我们'
    //     }
    // },
    {
        path: '/ArchiveProducts',
        name: 'ArchiveProducts',
        component: () => import('../views/FlowerShop/ArchiveProducts.vue'),
        meta: {
            title: '往季产品'
        }
    },
    {
        path: '/flowers/product_details_page',
        name: 'ProductDetails',
        component: () => import('../views/FlowerShop/ProductDetails.vue'),
        meta: {
            title: '花礼详情页'
        }
    },
    {
        path: '/about_us',
        name: 'about_us',
        component: () => import('../views/AboutUs/AboutUs.vue'),
        meta: {
            title: '关于我们'
        }
    },
    {
        path: '/user',
        name: 'user',
        redirect: '/user/login',
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('../views/User/UserLogin.vue'),
                meta: {
                    title: '用户登陆'
                }
            },
            {
                path: 'manager',
                name: 'manager',
                component: () => import('@/views/User/UserManager.vue'),
                meta: {
                    title: '用户管理'
                }
            },
            {
                path: 'register',
                name: 'register',
                component: () => import('../views/User/UserRegister.vue'),
                meta: {
                    title: "用户注册"
                }
            },
            {
                path: 'subscribe',
                name: 'subscribe',
                component: () => import('../views/User/SubscribePage.vue'),
                meta: {
                    title: '用户订阅'
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory('/flower/'),
    routes
})

export default router
