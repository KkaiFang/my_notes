/**
 * Giscus 评论区
 * =============
 *
 * 模板（docs/overrides/partials/comments.html）只输出一个配置占位 <div>，
 * 真正的 giscus client.js 由这里插入，它执行时会在脚本后面创建 iframe。
 *
 * 为什么配置挂在 <div> 上、而不是像官方示例那样直接写 <script src="client.js">：
 *   1. 站点开启了 navigation.instant（无刷新切页），切页后内联 <script> 不会重新执行，
 *      giscus 也不会自己重新渲染，直接写死会导致切页后评论区消失。
 *   2. Material 切页时会把容器内所有 <script> 替换成新建元素，且只搬运 src 属性，
 *      内联脚本的属性全被丢弃——配置如果挂在 <script> 上，切页后就找不回来了。
 *
 * 所以这里在「首次加载」和「每次切页后」为当前页面插入一次 client.js，
 * 既不会重复渲染，也不会切页后丢失。
 */
(function () {
  'use strict';

  var GISCUS_ORIGIN = 'https://giscus.app';
  var GISCUS_SCRIPT = GISCUS_ORIGIN + '/client.js';
  var THEME = { light: 'light', dark: 'transparent_dark' };
  var LOADING_HINT_DELAY = 3000;

  function currentTheme() {
    var palette = window.__md_get && window.__md_get('__palette');
    if (palette && typeof palette.color === 'object') {
      return palette.color.scheme === 'slate' ? THEME.dark : THEME.light;
    }
    return THEME.light;
  }

  function postMessageToGiscus(message) {
    var frame = document.querySelector('.giscus-frame');
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ giscus: message }, GISCUS_ORIGIN);
    }
  }

  // 配置由模板写在占位 <div> 的 data-* 上
  function readConfig(placeholder) {
    return {
      repo: placeholder.getAttribute('data-giscus-repo'),
      repoId: placeholder.getAttribute('data-giscus-repo-id'),
      category: placeholder.getAttribute('data-giscus-category'),
      categoryId: placeholder.getAttribute('data-giscus-category-id'),
    };
  }

  // 为当前页面插入 giscus client.js，触发评论区渲染
  function activate() {
    var placeholder = document.querySelector('[data-giscus-placeholder]:not([data-giscus-activated])');
    if (!placeholder) {
      return;
    }
    placeholder.setAttribute('data-giscus-activated', '');

    var config = readConfig(placeholder);

    var script = document.createElement('script');
    script.src = GISCUS_SCRIPT;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', config.repo);
    script.setAttribute('data-repo-id', config.repoId);
    script.setAttribute('data-category', config.category);
    script.setAttribute('data-category-id', config.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', currentTheme());
    script.setAttribute('data-lang', 'zh-CN');

    // giscus 会把 iframe 插到脚本后面
    placeholder.appendChild(script);
  }

  // 切页后旧评论区随旧 DOM 一起移除，新页面的加载提示需要重新计时隐藏
  function scheduleLoadingHint() {
    var hint = document.querySelector('.giscus-loading');
    if (!hint) {
      return;
    }
    setTimeout(function () {
      if (hint.isConnected) {
        hint.style.display = 'none';
      }
    }, LOADING_HINT_DELAY);
  }

  // giscus 加载完成后隐藏提示，并把主题同步成站点当前配色
  window.addEventListener('message', function (event) {
    if (event.origin !== GISCUS_ORIGIN || !event.data || !event.data.giscus) {
      return;
    }
    var hint = document.querySelector('.giscus-loading');
    if (hint) {
      hint.style.display = 'none';
    }
    if (!event.data.giscus.error) {
      postMessageToGiscus({ setConfig: { theme: currentTheme() } });
    }
  });

  // 切换亮色/暗色时同步 iframe 内部主题（只绑定一次）
  var paletteBound = false;
  function bindPalette() {
    if (paletteBound) {
      return;
    }
    paletteBound = true;

    // 手动切换：Material 的配色组件被点击
    var ref = document.querySelector('[data-md-component=palette]');
    if (ref) {
      ref.addEventListener('change', function () {
        postMessageToGiscus({ setConfig: { theme: currentTheme() } });
      });
    }

    // 跟随系统：站点处于「自动模式」时不经过配色组件，直接由系统偏好驱动
    var scheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (scheme && scheme.addEventListener) {
      scheme.addEventListener('change', function () {
        setTimeout(function () {
          postMessageToGiscus({ setConfig: { theme: currentTheme() } });
        }, 100);
      });
    }
  }

  function init() {
    bindPalette();
    scheduleLoadingHint();
    activate();
  }

  // 首次加载与每次 instant 切页后都会触发
  if (window.InstantNavigation && typeof window.InstantNavigation.register === 'function') {
    window.InstantNavigation.register(init, 'giscus-comments');
  } else if (window.document$ && !window.document$.isStopped) {
    window.document$.subscribe(init);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
