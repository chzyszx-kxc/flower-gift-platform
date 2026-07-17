# 花礼展示与订阅平台

Vue3 + Express + MySQL 全栈项目，独立完成展示型前台、订阅业务闭环与 Nginx 公网部署。

- 在线访问：http://115.29.203.212/flower/
- 技术栈：Vue3 / Vue Router / Axios / Element Plus / Node.js / Express / MySQL / Nginx

## 项目亮点

- 独立完成展示型前台、订阅业务闭环、MySQL 建模与公网部署。
- 实现花礼详情页精准展示与同季关联推荐，根据当前产品的 `season_id` 展示同季花礼。
- 基于 Vue Router、Axios、Express Router 组织前后端请求链路。
- 实现配送信息维护、订阅资格创建、当季花礼预约和状态回显流程。

## 目录结构

```text
backend/myapp/        Express 后端服务
frontend/myapp/       Vue3 前端应用
database_for_flowers.sql  MySQL 表结构和展示数据
```

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

