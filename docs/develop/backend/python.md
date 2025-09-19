# Python 开发

Python 后端开发学习笔记。

## 基础语法

```python
# 变量定义
name = "Python"
version = 3.9

# 函数定义
def greet(name):
    return f"Hello, {name}!"
```

## Web 框架

### Flask
```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'
```

### Django
```python
# Django 模型示例
from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
```

## 数据库操作

```python
import sqlite3

# 连接数据库
conn = sqlite3.connect('example.db')
cursor = conn.cursor()

# 执行查询
cursor.execute("SELECT * FROM users")
results = cursor.fetchall()
```

---

*Python 让后端开发变得简单高效*