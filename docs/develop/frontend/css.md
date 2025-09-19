# CSS 样式和布局

CSS 学习笔记和实用技巧。

## 基础选择器

```css
/* 元素选择器 */
p { color: blue; }

/* 类选择器 */
.highlight { background: yellow; }

/* ID选择器 */
#header { font-size: 24px; }
```

## Flexbox 布局

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

## Grid 布局

```css
.grid {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 20px;
}
```

## 响应式设计

```css
@media (max-width: 768px) {
    .mobile-hide { display: none; }
}
```

---

*样式设计让网页更加美观*