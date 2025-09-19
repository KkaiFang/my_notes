# 前端框架

## 主流前端框架概览

### React
Facebook 开发的用于构建用户界面的 JavaScript 库

#### 核心概念
```jsx
// 函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 类组件
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// Hook 使用
import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `点击了 ${count} 次`;
  }, [count]);
  
  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>
        点击我
      </button>
    </div>
  );
}
```

#### 状态管理
```jsx
// Context API
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <ThemedButton />;
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>主题按钮</button>;
}
```

### Vue.js
渐进式 JavaScript 框架

#### 基础语法
```vue
<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <button @click="reverseMessage">反转消息</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('')
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

#### 组合式 API
```vue
<template>
  <div>
    <p>计数: {{ count }}</p>
    <p>双倍: {{ double }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>
```

### Angular
Google 开发的企业级前端框架

#### 组件示例
```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>{{ title }}</h1>
      <button (click)="changeTitle()">改变标题</button>
    </div>
  `,
  styles: [`
    h1 {
      color: #333;
    }
  `]
})
export class AppComponent {
  title = 'Angular 应用';
  
  changeTitle() {
    this.title = '标题已改变!';
  }
}
```

#### 服务示例
```typescript
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('/api/users');
  }
}
```

## 框架对比

| 特性 | React | Vue | Angular |
|------|--------|-----|---------|
| 学习曲线 | 中等 | 简单 | 陡峭 |
| 数据绑定 | 单向 | 双向 | 双向 |
| 组件化 | ✅ | ✅ | ✅ |
| TypeScript | 可选 | 可选 | 内置 |
| 体积 | 小 | 最小 | 大 |
| 生态系统 | 丰富 | 丰富 | 完整 |

## 现代前端工具链

### 包管理器
```bash
# npm
npm install react react-dom

# yarn
yarn add vue@next

# pnpm
pnpm add angular
```

### 构建工具

#### Vite (推荐)
```bash
# 创建项目
npm create vite@latest my-app --template react
npm create vite@latest my-vue-app --template vue

# 配置示例
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
```

#### Webpack
```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

## 状态管理

### Redux (React)
```javascript
// store.js
import { configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1 },
    decrement: state => { state.value -= 1 }
  }
})

export const { increment, decrement } = counterSlice.actions
export default configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
})
```

### Pinia (Vue)
```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})
```

## 路由管理

### React Router
```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### Vue Router
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user/:id', component: User, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

## UI 组件库

### React UI 库
- **Ant Design**: 企业级 UI 设计语言
- **Material-UI**: Google 的 Material Design
- **Chakra UI**: 简单、模块化和可访问的组件库

### Vue UI 库
- **Element Plus**: 基于 Vue 3 的组件库
- **Ant Design Vue**: Ant Design 的 Vue 版本
- **Vuetify**: Material Design 组件框架

### 使用示例 (Ant Design)
```jsx
import { Button, Table, Form, Input } from 'antd'

function UserList() {
  const columns = [
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { 
      title: '操作', 
      render: (text, record) => (
        <Button type="primary" onClick={() => editUser(record)}>
          编辑
        </Button>
      )
    }
  ]
  
  return <Table columns={columns} dataSource={users} />
}
```

## 测试

### React Testing Library
```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'

test('计数器功能测试', () => {
  render(<Counter />)
  
  const button = screen.getByText('增加')
  fireEvent.click(button)
  
  expect(screen.getByText('计数: 1')).toBeInTheDocument()
})
```

### Vue Test Utils
```javascript
import { mount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

test('计数器功能测试', async () => {
  const wrapper = mount(Counter)
  
  await wrapper.find('button').trigger('click')
  
  expect(wrapper.text()).toContain('计数: 1')
})
```

## 部署

### 静态部署
```bash
# 构建生产版本
npm run build

# 部署到 GitHub Pages
npm install -g gh-pages
gh-pages -d dist
```

### Docker 部署
```dockerfile
# Dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

*持续更新中...*