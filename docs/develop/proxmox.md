---
title: 欢迎来到我的博客 
hide:
#   - navigation # 显示右
#   - toc #显示左
  - footer
  - feedback
comments: true
---
如果要保证 **Ubuntu 云镜像克隆后每台机器都自动生成唯一的 machine-id** 和 **DHCP 客户端 ID**（避免 IP 冲突），可以结合 **cloud-init + netplan** 这样配置。

---

## **1. cloud-init 模板（推荐写到 `/etc/cloud/cloud.cfg.d/99-custom.cfg`）**

```yaml
# cloud-init configuration
# 确保每次实例化时重新生成 machine-id 和 DHCP 客户端 ID

# 保证 systemd-machine-id 每次克隆都重建
system_info:
  regenerate_ssh_host_keys: true

bootcmd:
  # 删除旧的 machine-id，systemd 会在开机时自动生成新的
  - rm -f /etc/machine-id
  - rm -f /var/lib/dbus/machine-id
  - systemd-machine-id-setup

# 确保 cloud-init 不保留 DHCP 客户端 ID（默认就会根据 machine-id 生成新的）
network:
  config: disabled  # 告诉 cloud-init 不去覆盖 netplan，让我们自己管理
```

---

## **2. Netplan DHCP 配置（例如 `/etc/netplan/01-netcfg.yaml`）**

确保 **所有网卡通过 DHCP 自动获取地址**：

```yaml
network:
  version: 2
  ethernets:
    ens18:       # 按需替换为你的网卡名
      dhcp4: true
      dhcp-identifier: mac   # 使用 MAC 地址做 DHCP ID（避免 machine-id 重复问题）
```

> * 如果使用 `dhcp-identifier: mac`，则每台 VM 的 DHCP 租约基于 MAC，不基于 machine-id
> * 如果使用 `dhcp-identifier: duid`，则基于 DUID（默认用 machine-id 生成）
> * 云环境常用 `mac`，因为每个克隆 VM 通常会改 MAC

---

## **3. 云镜像准备注意事项**

1. **清理 cloud-init 状态**（做模板前执行一次）

```bash
sudo cloud-init clean --logs --machine-id
sudo rm -f /etc/machine-id /var/lib/dbus/machine-id
sudo systemd-machine-id-setup
```

2. **关机并制作镜像/模板**（不要再开机）
3. **克隆时保证 MAC 地址不同**（不然即使用 mac 作为 ID，也会冲突）

---

## **完整流程总结**

* **cloud-init** 负责清理 machine-id 并重新生成
* **netplan** 设置为 DHCP 自动获取
* **dhcp-identifier: mac** 避免因 machine-id 重复导致的冲突
* 模板制作前运行 `cloud-init clean` 并清除 machine-id

---
