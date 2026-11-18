"""
自动导航标题补全
================

背景：导航改由 awesome-pages 按目录自动生成后，插件在导航阶段（on_nav）
就已经决定了每个条目的标题。MkDocs 只有在渲染页面时才会去读正文的 H1，
所以「没写 front matter title、.pages 里也没显式命名」的文件，标题是 None，
而标题为 None 的条目不会出现在侧边栏里——等于新加的 md 又看不见了。

这个 hook 在 on_nav 之后补一遍：对标题为空的页面，从正文取第一条一级标题
当作导航标题。这样规则就变成——

  1. front matter 里写了 title      -> 用 title
  2. .pages 里显式写了标题          -> 用 .pages 的标题
  3. 文件第一行是一级标题 # xxx      -> 用 xxx
  4. 都没有                          -> 用文件名

新增 md 时只要第一行写个 `# 标题` 就能自动出现在导航里，无需改任何配置。
"""

import re
from pathlib import Path

# 匹配正文里的第一条一级标题（允许前面有 front matter、空行、HTML 注释）
_H1_RE = re.compile(r"^\s*#\s+(.+?)\s*#*\s*$", re.MULTILINE)
_FRONT_MATTER_RE = re.compile(r"\A---\s*\n.*?\n---\s*\n", re.DOTALL)


def _title_from_file(abs_src_path):
    """从文件正文提取第一条一级标题，取不到返回 None。"""
    try:
        text = Path(abs_src_path).read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return None

    # 跳过 front matter，避免把 YAML 里的 # 注释误当成标题
    body = _FRONT_MATTER_RE.sub("", text, count=1)

    # 跳过围栏代码块，避免把代码里的 # 注释当标题
    lines, in_fence = [], False
    for line in body.splitlines():
        stripped = line.lstrip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            in_fence = not in_fence
            continue
        if not in_fence:
            lines.append(line)

    match = _H1_RE.search("\n".join(lines))
    if not match:
        return None
    title = re.sub(r"\s+", " ", match.group(1)).strip()
    return title or None


def _fallback_name(src_path):
    """最后兜底：用文件名（去掉扩展名和目录）。"""
    return Path(src_path).stem.replace("-", " ").replace("_", " ")


def _walk(items):
    for item in items:
        if item.is_section:
            yield from _walk(item.children)
        else:
            yield item


def on_nav(nav, **kwargs):
    filled = []
    for page in _walk(nav.items):
        if page.title:
            continue
        title = _title_from_file(page.file.abs_src_path) or _fallback_name(
            page.file.src_path
        )
        page.title = title
        filled.append(f"{page.file.src_path} -> {title}")

    if filled:
        print(f"🔖 自动补全导航标题 {len(filled)} 个：")
        for line in filled:
            print(f"   {line}")
    return nav
