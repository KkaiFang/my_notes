/**
 * Giscus 评论区
 * =============
 *
 * 页面模板（docs/overrides/partials/comments.html）只输出一个不带 src 的占位 script，
 * 配置（repo、分类、语言等）都写成 data-* 属性，由这里在合适时机创建真正的脚本：
 *
 *   <script src="https://giscus.app/client.js" data-repo=... />
 *
 * 为什么不在模板里直接写 src：
 *   - Giscus 的 client.js 执行时用 document.currentScript 读配置，并立即在脚本后面
 *     插入 iframe。它自身不会「记住」配置，页面切走后也不会重新渲染。
 *   - 站点开启了 navigation.instant（无刷新切页），切页后内联 <script> 不会重新执行，
 *     所以直接写在模板里的脚本只在首次加载时生效，切页后评论区就消失了。
 *
 * 由这里在「首次加载」和「每次切页后」为当前页面插入一次 client.js，
 * 一次切页只渲染一个评论区，既不会重复也不会消失。
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

  // 为当前页面插入 Giscus 脚本，触发评论区渲染
  function activate() {
    var placeholder = document.querySelector('script[data-giscus-placeholder]:not([data-giscus-activated])');
    if (!placeholder) {
      return;
    }
    placeholder.setAttribute('data-giscus-activated', '');

    var script = document.createElement('script');
    script.src = GISCUS_SCRIPT;
    script.async = true;
    script.crossOrigin = 'anonymous';

    // 原样搬运占位脚本上的 data-* 配置（repo、分类、语言等）
    Array.prototype.forEach.call(placeholder.attributes, function (attr) {
      if (attr.name.indexOf('data-') === 0 && attr.name !== 'data-giscus-placeholder') {
        script.setAttribute(attr.name, attr.value);
      }
    });
    script.setAttribute('data-theme', currentTheme());

    placeholder.insertAdjacentElement('afterend', script);
  }

  // 切页后旧评论区随旧 DOM 一起移除，新的加载提示需要重新计时隐藏
  function scheduleLoadingHint() {
    var loadingEl = document.getElementById('comment-loading');
    if (!loadingEl) {
      return;
    }
    loadingEl.style.display = '';
    setTimeout(function () {
      // 切页后这个节点已经不在文档里，就不要再去动了
      if (loadingEl.isConnected) {
        loadingEl.style.display = 'none';
      }
    }, LOADING_HINT_DELAY);
  }

  // Giscus 加载完成后隐藏提示，并把主题同步成站点当前配色
  window.addEventListener('message', function (event) {
    if (event.origin !== GISCUS_ORIGIN || !event.data || !event.data.giscus) {
      return;
    }
    var loadingEl = document.getElementById('comment-loading');
    if (loadingEl) {
      loadingEl.style.display = 'none';
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

    // 跟随系统：站点在「自动模式」时不经过 palette 切换，直接由系统偏好驱动
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
