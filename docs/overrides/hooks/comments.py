"""
评论区启用规则
==============

站点的评论系统统一用 Giscus（GitHub Discussions 驱动），实际渲染逻辑在
``docs/overrides/partials/comments.html``。本 hook 只负责决定「哪些页面开启评论」：

  1. 只有 COMMENT_DIRECTORIES 下的页面默认开启
  2. 页面 front matter 显式写 ``comments: false`` 时不开启（可用于单页关闭）
  3. EXCLUDED_PAGES / EXCLUDED_PATTERNS 命中的页面不开启

注意：不要再往 Markdown 里注入评论系统的 HTML/JS。之前在 on_page_markdown 里注入
Twikoo，结果每页同时出现 Twikoo + Giscus 两套评论，暗色模式下 Twikoo 的样式还压不住。
"""

import re

# 配置：需要添加评论的目录
COMMENT_DIRECTORIES = ['blog/', 'develop/', 'trip/', 'stock/']

# 配置：排除评论的页面列表
EXCLUDED_PAGES = {
    'blog/index.md',
    'blog/indexblog.md',
    'develop/index.md',
}

# 配置：排除评论的页面模式
EXCLUDED_PATTERNS = [
    r'.*\/index\.md$',  # 排除所有 index.md 文件
    r'.*\/archive\.md$',  # 排除所有 archive.md 文件
    r'^blog/archive/.*',  # 排除所有 blog/archive 目录下的所有内容
    r'^blog/category/.*',  # 排除所有 blog/category 目录下的所有内容
]


def is_page_excluded(file_path):
    """检查页面是否应该排除评论"""
    if file_path in EXCLUDED_PAGES:
        return True

    for pattern in EXCLUDED_PATTERNS:
        if re.match(pattern, file_path):
            return True

    return False


def should_add_comments(file_path):
    """检查文件是否应该添加评论"""
    if not file_path.endswith('.md'):
        return False

    if is_page_excluded(file_path):
        return False

    return any(file_path.startswith(directory) for directory in COMMENT_DIRECTORIES)


def on_page_markdown(markdown, **kwargs):
    """给符合条件的页面打上 comments 标记，模板据此渲染 Giscus。"""
    page = kwargs['page']

    if not should_add_comments(page.file.src_path):
        return markdown

    # 页面显式关闭评论时尊重页面的选择
    if page.meta is not None and page.meta.get('comments') is False:
        return markdown

    if page.meta is None:
        page.meta = {}
    page.meta['comments'] = True

    return markdown
