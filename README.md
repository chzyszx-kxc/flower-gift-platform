# 花礼展示与订阅平台

Vue3 + Express + MySQL 全栈项目，独立完成展示型前台、订阅业务闭环与 Nginx 公网部署。

- 在线访问：http://115.29.203.212/flower/
- 免注册在线访问：http://115.29.203.212/flower-demo/
- 技术栈：Vue3 / Vue Router / Axios / Element Plus / Node.js / Express / MySQL / Nginx

## 项目难点
### 维护用户订阅状态
完成数据库结构的构建与连表查询逻辑。基于季度起始时间、订阅开始季和可用季度额度，实现跨季度订阅资格动态计算，并在数据库端统一校验订阅开放窗口，维护订阅页、商品详情页和用户中心的状态一致性。具体实现：用户选择了四季订阅，当用户在未来的季度重新查询订阅状态时能够正确地查到”订阅生效中“(如果用户订阅了多季度的话)
<img width="1200" height="1200" alt="未命名" src="https://github.com/user-attachments/assets/422d94db-6994-45c9-b65a-05b50edd8837" />


## 项目亮点

- 独立完成展示型前台、订阅业务闭环、MySQL 建模与公网部署。
- 实现花礼详情页精准展示与同季关联推荐，根据当前产品的 `season_id` 展示同季花礼。
- 基于 Vue Router、Axios、Express Router 组织前后端请求链路。
- 实现配送信息维护、订阅资格创建、当季花礼预约和状态回显流程。

## 目录结构

```text
flower-project
├── frontend/myapp
│   ├── public
│   │   ├── index.html
│   │   └── img/                         # 公共图片资源
│   ├── src
│   │   ├── main.js                      # Vue 应用入口
│   │   ├── App.vue                      # 根组件
│   │   ├── router
│   │   │   └── router.js                # 前端页面路由
│   │   ├── components
│   │   │   ├── MyNavigate.vue           # 顶部导航
│   │   │   ├── MyFooter.vue             # 页脚
│   │   │   ├── LeftBar.vue              # 侧边栏
│   │   ├── views
│   │   │   ├── Home
│   │   │   │   └── index.vue            # 首页
│   │   │   ├── ThisSeason
│   │   │   │   └── ThisSeason.vue       # 当季花礼
│   │   │   ├── FlowerShop
│   │   │   │   ├── ArchiveProducts.vue  # 往季花礼
│   │   │   │   └── ProductDetails.vue   # 花礼详情与同季推荐
│   │   │   ├── User
│   │   │   │   ├── UserLogin.vue        # 登录
│   │   │   │   ├── UserRegister.vue     # 注册
│   │   │   │   ├── UserManager.vue      # 用户中心
│   │   │   │   └── SubscribePage.vue    # 订阅页面
│   │   │   └── AboutUs
│   │   │       └── AboutUs.vue          # 关于我们
│   │   └── assets                       # 图片、视频、Logo 等资源
│   ├── package.json
│   └── vue.config.js                    # Vue CLI 配置与代理/部署路径
│
├── backend/myapp
│   ├── app.js                           # Express 应用入口
│   ├── bin
│   │   └── www                          # 服务启动文件
│   ├── db
│   │   └── index.js                     # MySQL 连接配置
│   ├── routes
│   │   ├── flowers.js                   # 花礼展示、季度、详情、推荐接口
│   │   └── users.js                     # 用户、配送信息、订阅接口
│   ├── views                            # Express 默认模板目录
│   └── package.json
│
└── database_for_flowers.sql             # 花礼项目数据库结构与基础数据```

## 本地运行

后端：

```bash
cd backend/myapp
cp .env.example .env
npm install
npm start
```

前端：

```bash
cd frontend/myapp
npm install
npm run serve
```

## 数据库说明

`database_for_flowers.sql` 保留表结构和花礼展示数据。公开仓库版本已移除用户账号、配送信息、订阅记录等运行时数据。

## 展示效果
<img width="242" height="152" alt="截屏2026-07-17 21 30 46" src="https://github.com/user-attachments/assets/73fc6ee8-66c4-4611-bbae-7dae5bf7cd7c" />
<img width="242" height="152" alt="截屏2026-07-17 21 31 29" src="https://github.com/user-attachments/assets/434fddf4-73d1-4fe1-a70e-117cd962091a" />
<img width="242" height="152" alt="截屏2026-07-17 21 31 08" src="https://github.com/user-attachments/assets/3b9d188e-a728-48a7-916d-8c8b3c565b6e" />
<img width="242" height="152" alt="截屏2026-07-17 21 31 41" src="https://github.com/user-attachments/assets/ae9e8bb7-3eb9-47b8-b730-7ea76a764b19" />
<img width="242" height="152" alt="Adobe Express - 20260717_214511" src="https://github.com/user-attachments/assets/53fabbb4-8cff-4f2a-bc9c-d41d5854378d" />
<img width="242" height="152" alt="Adobe Express - 20260717_213512" src="https://github.com/user-attachments/assets/8a42e761-ea76-4b7b-bf39-bb94fb4a06c5" />
<img width="242" height="152" alt="Adobe Express - 20260717_205333" src="https://github.com/user-attachments/assets/b2d75f6d-2326-4bc6-9aab-6c97a03a571d" />

