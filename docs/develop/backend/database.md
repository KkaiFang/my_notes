# 数据库技术

数据库相关技术和最佳实践。

## 关系型数据库

### MySQL
```sql
-- 创建数据库
CREATE DATABASE myapp;

-- 创建表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE
);
```

### PostgreSQL
```sql
-- PostgreSQL 特有功能
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    metadata JSONB
);
```

## NoSQL 数据库

### MongoDB
```javascript
// MongoDB 文档示例
{
    "name": "John",
    "age": 30,
    "hobbies": ["reading", "coding"]
}
```

### Redis
```redis
# Redis 命令
SET user:1:name "John"
GET user:1:name
```

## 数据库设计

- 范式理论
- 索引优化
- 查询优化

---

*数据是应用的核心，合理设计很重要*