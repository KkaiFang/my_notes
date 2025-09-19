// 下拉菜单功能
document.addEventListener('DOMContentLoaded', function() {
    // 为包含子页面的导航项添加下拉功能
    const navItems = document.querySelectorAll('.md-tabs__item');
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        const href = link.getAttribute('href');
        
        // 检查是否有对应的子页面
        if (hasSubPages(href)) {
            item.classList.add('has-dropdown');
            
            // 创建下拉菜单
            const dropdown = createDropdown(href);
            item.appendChild(dropdown);
            
            // 移动端点击事件
            if (window.innerWidth <= 1220) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    item.classList.toggle('active');
                });
            }
        }
    });
    
    // 点击外部关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.md-tabs__item.has-dropdown')) {
            document.querySelectorAll('.md-tabs__item.has-dropdown').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
});

// 检查是否有子页面
function hasSubPages(href) {
    // 这里可以根据实际的导航结构来判断
    const subPages = getSubPages(href);
    return subPages.length > 0;
}

// 获取子页面列表
function getSubPages(parentHref) {
    const subPages = [];
    
    // 根据你的导航结构定义子页面
    const navStructure = {
        'develop/': [
            { title: '开发首页', url: 'develop/' },
            { title: 'Proxmox虚拟机', url: 'develop/proxmox/' },
            { title: '前端开发', url: 'develop/frontend/' },
            { title: '后端开发', url: 'develop/backend/' }
        ],
        'blog/': [
            { title: '博客首页', url: 'blog/' },
            { title: '测试评论功能', url: 'blog/posts/test1/' },
            { title: '评论测试', url: 'blog/posts/test-comment/' }
        ],
        'notes/': [
            { title: '笔记首页', url: 'notes/' }
        ],
        'trip/': [
            { title: '旅行首页', url: 'trip/' }
        ],
        'stock/': [
            { title: '股票首页', url: 'stock/' }
        ],
        'about/': [
            { title: '关于我', url: 'about/about/' },
            { title: '个人经历', url: 'about/个人经历/' }
        ]
    };
    
    // 移除开头的斜杠并确保以斜杠结尾
    const normalizedHref = parentHref.replace(/^\//, '').replace(/\/$/, '') + '/';
    
    // 查找匹配的父级导航
    for (const [key, pages] of Object.entries(navStructure)) {
        if (normalizedHref.includes(key)) {
            return pages;
        }
    }
    
    return subPages;
}

// 创建下拉菜单
function createDropdown(parentHref) {
    const dropdown = document.createElement('div');
    dropdown.className = 'md-tabs__dropdown';
    
    const subPages = getSubPages(parentHref);
    
    subPages.forEach(page => {
        const dropdownItem = document.createElement('a');
        dropdownItem.className = 'md-tabs__dropdown-item';
        dropdownItem.href = page.url;
        dropdownItem.textContent = page.title;
        
        // 检查是否是当前页面
        if (window.location.pathname.includes(page.url)) {
            dropdownItem.classList.add('active');
        }
        
        dropdown.appendChild(dropdownItem);
    });
    
    return dropdown;
}

// 响应式处理
window.addEventListener('resize', function() {
    const navItems = document.querySelectorAll('.md-tabs__item.has-dropdown');
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        
        if (window.innerWidth <= 1220) {
            // 移动端模式
            link.removeEventListener('click', preventDefault);
            link.addEventListener('click', function preventDefault(e) {
                e.preventDefault();
                item.classList.toggle('active');
            });
        } else {
            // 桌面端模式
            link.removeEventListener('click', preventDefault);
            item.classList.remove('active');
        }
    });
});