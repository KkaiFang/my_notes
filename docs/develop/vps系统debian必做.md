

### 第一步：安装 wget

在 VPS 上执行：

```
apt update
apt install -y wget
```

### 第二步：重新运行安装命令

```
curl -fsSL https://raw.githubusercontent.com/zhanghanyun/backtrace/main/install.sh | bash
```

这次就不会再因为缺少 wget 而失败了。

### 第三步：运行测试

安装完成后：

```
backtrace
```

这个工具是用来测试 VPS 到中国大陆三大运营商（电信、联通、移动）的回程路由线路的。

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub+1



如果你想先检查安装脚本，也可以直接查看：

```
curl -fsSL https://raw.githubusercontent.com/zhanghanyun/backtrace/main/install.sh
```

建议： 你现在刚装好 Debian 13，可以顺便安装一些常用基础工具：

```
apt install -y curl wget vim nano sudo unzip tar htop
```

这样后面安装 VPS 测速、Docker 和代理服务会方便很多。



# docker



你的 VPS 是 Debian 13 x86_64，我建议直接安装 Docker 官方版本，不建议使用 Debian 自带的旧版 Docker 包。

我们安装这几个组件：

- Docker Engine：容器运行环境
- Docker CLI：命令行管理工具
- Docker Compose Plugin：管理多个容器
- containerd：容器底层运行时

### 第一步：清理可能存在的旧版本

在 VPS 上执行：

```
apt remove -y docker.io docker-doc docker-compose podman-docker containerd runc
```

这不会删除你已经下载的普通文件。

### 第二步：添加 Docker 官方软件源

直接复制下面整段执行：

```
apt update
apt install -y ca-certificates curl

install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/debian/gpg \
  -o /etc/apt/keyrings/docker.asc

chmod a+r /etc/apt/keyrings/docker.asc

cat > /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: trixie
Components: stable
Architectures: amd64
Signed-By: /etc/apt/keyrings/docker.asc
EOF

apt update
```

### 第三步：安装 Docker 和 Compose

```
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 第四步：启动并设置开机自启

```
systemctl enable --now docker
```

### 第五步：验证安装

依次执行：

```
docker --version
docker compose version
docker run hello-world
```



安装成功

&#x20;如果最后出现 `Hello from Docker!`，就说明安装完成。



以上采用 Docker 官方 Debian 软件源，支持 Debian 13 Trixie。

[image](https://www.google.com/s2/favicons?domain=https://docs.docker.com\&sz=32)

Docker Docs+1



官方文档：[Docker Engine for Debian](https://docs.docker.com/engine/install/debian/?utm_source=chatgpt.com)。

下一步建议： 如果你准备在这台 VPS 上部署多个服务，我建议再装一个 Docker 可视化管理面板 Portainer，这样以后管理容器、查看日志、重启服务都可以通过网页操作。