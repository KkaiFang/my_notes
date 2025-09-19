# API 设计

## RESTful API 设计原则

### 基本原则
- **资源导向**：API 应该基于资源而不是动作
- **统一接口**：使用标准的 HTTP 方法（GET, POST, PUT, DELETE）
- **无状态**：每个请求都应该包含完成请求所需的所有信息
- **可缓存**：响应应该明确是否可缓存

### HTTP 方法使用
```http
GET /api/users          # 获取用户列表
GET /api/users/123      # 获取特定用户
POST /api/users         # 创建新用户
PUT /api/users/123      # 更新用户信息
DELETE /api/users/123   # 删除用户
```

### 状态码规范
- `200 OK` - 请求成功
- `201 Created` - 资源创建成功
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未授权
- `403 Forbidden` - 权限不足
- `404 Not Found` - 资源不存在
- `500 Internal Server Error` - 服务器内部错误

### 响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "users": []
  }
}
```

## Python API 开发

### Flask RESTful API 示例
```python
from flask import Flask, jsonify, request
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

class UserList(Resource):
    def get(self):
        users = [{'id': 1, 'name': '张三'}, {'id': 2, 'name': '李四'}]
        return jsonify({'users': users})
    
    def post(self):
        data = request.get_json()
        # 创建用户逻辑
        return jsonify({'message': '用户创建成功'}), 201

class User(Resource):
    def get(self, user_id):
        # 获取特定用户逻辑
        return jsonify({'user': {'id': user_id, 'name': '张三'}})
    
    def put(self, user_id):
        data = request.get_json()
        # 更新用户逻辑
        return jsonify({'message': '用户更新成功'})
    
    def delete(self, user_id):
        # 删除用户逻辑
        return jsonify({'message': '用户删除成功'})

api.add_resource(UserList, '/api/users')
api.add_resource(User, '/api/users/<int:user_id>')

if __name__ == '__main__':
    app.run(debug=True)
```

### FastAPI 示例
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

class User(BaseModel):
    id: int
    name: str
    email: str

# 模拟数据库
users_db = []

@app.get("/api/users", response_model=List[User])
def get_users():
    return users_db

@app.post("/api/users", response_model=User)
def create_user(user: User):
    users_db.append(user)
    return user

@app.get("/api/users/{user_id}", response_model=User)
def get_user(user_id: int):
    for user in users_db:
        if user.id == user_id:
            return user
    raise HTTPException(status_code=404, detail="用户不存在")

@app.put("/api/users/{user_id}", response_model=User)
def update_user(user_id: int, user: User):
    for i, existing_user in enumerate(users_db):
        if existing_user.id == user_id:
            users_db[i] = user
            return user
    raise HTTPException(status_code=404, detail="用户不存在")

@app.delete("/api/users/{user_id}")
def delete_user(user_id: int):
    for i, user in enumerate(users_db):
        if user.id == user_id:
            del users_db[i]
            return {"message": "用户删除成功"}
    raise HTTPException(status_code=404, detail="用户不存在")
```

## API 文档

### Swagger/OpenAPI
- **Flask**: 使用 `flask-restx` 自动生成 Swagger 文档
- **FastAPI**: 内置 OpenAPI 文档支持，访问 `/docs`

### 文档示例
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="用户管理API", 
              description="用户管理的RESTful API",
              version="1.0.0")

class User(BaseModel):
    """用户模型"""
    id: int
    name: str
    email: str

@app.get("/api/users")
def get_users():
    """
    获取所有用户
    
    Returns:
        List[User]: 用户列表
    """
    pass
```

## API 安全

### 认证方式
- **JWT (JSON Web Token)**
- **OAuth 2.0**
- **API Key**

### JWT 示例
```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

app = FastAPI()
security = HTTPBearer()

SECRET_KEY = "your-secret-key"

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token已过期")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token无效")

@app.get("/api/protected")
def protected_route(user_data: dict = Depends(verify_token)):
    return {"message": "这是受保护的路由", "user": user_data}
```

## API 测试

### 使用 pytest
```python
# test_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_users():
    response = client.get("/api/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_user():
    user_data = {"id": 1, "name": "测试用户", "email": "test@example.com"}
    response = client.post("/api/users", json=user_data)
    assert response.status_code == 201
    assert response.json()["name"] == "测试用户"
```

## 最佳实践

1. **版本控制**: 在 URL 中包含版本号 `/api/v1/users`
2. **分页**: 对列表数据提供分页支持 `/api/users?page=1&limit=10`
3. **过滤**: 支持数据过滤 `/api/users?role=admin&status=active`
4. **排序**: 支持结果排序 `/api/users?sort=name&order=asc`
5. **错误处理**: 提供详细的错误信息和调试建议
6. **限流**: 实现 API 调用频率限制
7. **监控**: 记录 API 调用日志和性能指标

---

*持续更新中...*