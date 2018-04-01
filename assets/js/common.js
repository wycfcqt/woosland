(function () {
  var cw = window.innerWidth;
  cw = cw / 16;
  //计算倍数，数值可变。
  if (cw < 20) {
    cw = 20
  } //最小宽度
  if (cw > 40) {
    cw = 40
  } //最大宽度
  document.documentElement.style.cssText = "font-size:" + cw + "px !important";
  window.onresize = function () {
    var cw = window.innerWidth;
    cw = cw / 16;
    //计算倍数，数值可变。
    if (cw < 20) {
      cw = 20
    } //最小宽度
    if (cw > 40) {
      cw = 40
    } //最大宽度
    document.documentElement.style.cssText = "font-size:" + cw + "px !important";
  }
})();
/*回到顶部*/
(function ($) {
  $.fn.backToTop = function (options) {
    var $this = $(this);
    $this.hide().click(function () {
      $("body, html").animate({scrollTop: "0px"});
    });
    var $window = $(window);
    $window.scroll(function () {
      if (
        $window.scrollTop() > 0) {
        $this.fadeIn();
      }
      else {
        $this.fadeOut();
      }
    });
    return this;
  };
})(jQuery);

function windowInfos () {
  var winInfo = {};
  if (document.documentElement && document.documentElement.scrollTop) {
    winInfo.scrollHeight = document.documentElement.scrollHeight;
    winInfo.clientHeight = document.documentElement.clientHeight;
    winInfo.width = document.documentElement.clientWidth;
    winInfo.scrollTop = document.documentElement.scrollTop;
  } else if (document.body) {
    winInfo.scrollHeight = document.body.scrollHeight;
    winInfo.clientHeight = document.body.clientHeight;
    winInfo.width = document.body.clientWidth;
    winInfo.scrollTop = document.body.scrollTop;
  }
  return winInfo;
}

function windowScroll (distance) {
  var scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  }
  else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  var ws = windowInfos()
  if ((scrollTop + ws.clientHeight) >= (ws.scrollHeight - distance)) {
    return !0
  }
  return !1
}

// 滚动监听，显示回到顶部按钮
$(document).on('scroll', function () {
  var st = $(this).scrollTop();
  if (st > 300) {
    createTop();
  } else {
    var obj = $('.back-to-top');
    if (obj.length > 0) {
      obj.fadeOut();
      obj.remove();
    }
  }
})
// 缓慢回到顶部
$(document).on('click', '.back-to-top', function () {
  scrollSmooth(0, 'up', 100)
})

function createTop () {
  var obj = $('.back-to-top');
  if (obj.length > 0) {
    obj.fadeIn(100)
    return
  }
  $('body').append($('<a class="back-to-top hidden-xs" title="回到顶部"><span class="glyphicon glyphicon-circle-arrow-up"></span></a>'));
}

$(function () {
  var navListContainer = $('.nav-list-container'), subBar = $('.nav-sub-bar'),
    subBarContainer = $('.sub-bar-container'), curBar = $('li.cur-bar'),
    timeId = null, timeId1 = null
  // 初始化设置二级菜单位置
  subBarContainer.css({
    marginLeft: navListContainer.offset().left
  })
  // 初始化cur样式
  moveBar($('.nav-item.active'), navListContainer, curBar, !0)
  // 鼠标移动到以及菜单，显示二级菜单，移开做判断
  navListContainer.mouseenter(function (e) {
    console.log(9999)
    if (timeId || timeId1) {
      clearTimeout(timeId1)
      clearTimeout(timeId)
      timeId1 = null
      timeId = null
      return
    }
    subBar.stop().slideDown(100)
  })
  navListContainer.mouseleave(function () {
    timeId = setTimeout(function () {
      subBar.stop().slideUp(100)
      timeId = null
      timeId1 = null
      resetPosition(navListContainer, curBar)
    }, 300)
  })
  subBar.mouseenter(function () {
    if (timeId || timeId1) {
      clearTimeout(timeId)
      clearTimeout(timeId1)
      timeId = null
      timeId1 = null
    }
  })
  subBar.mouseleave(function () {
    timeId1 = setTimeout(function () {
      subBar.stop().slideUp(100)
      timeId = null
      timeId1 = null
      resetPosition(navListContainer, curBar)
    }, 300)
  })
  $(document).on('mouseover', '.nav-item', function (e) {
    // e.stopPropagation()
    moveBar($(this), navListContainer, curBar)
  })
  $(window).resize(debounce(function () {
    subBarContainer.css({
      marginLeft: navListContainer.offset().left
    })
  }, 500, !1))
})

function moveBar (self, base, curBar, flag) {
  if ($(window).width() < 768) {
    return
  }
  var sw = self.width() + 4, index = self.attr('data-index'), parent = self.parent(),
    pw = parent.width(), position = parent.offset(), now = position.left - base.offset().left + (pw - sw) / 2
  if (flag) {
    var tmp = JSON.stringify({width: sw, left: now, index: index})
    curBar.parent().attr('data-cur', tmp)
  }
  curBar.stop().animate({
    width: sw,
    left: now
  }, 100, 'linear')
  index && $('.sub-bar[data-index=' + index + ']').show().siblings().hide();
}

function resetPosition (obj, target) {
  var shap = obj.attr('data-cur')
  if (shap) {
    shap = JSON.parse(shap)
    target.stop().animate({
      width: shap.width,
      left: shap.left
    }, 100, 'linear')
    shap.index && $('.sub-bar[data-index=' + shap.index + ']').show().siblings().hide();
  }
}

// 防抖，是否立即执行
function debounce (func, delay, immediate) {
  var timer = null;
  return function () {
    var context = this;
    var args = arguments;
    if (timer) clearTimeout(timer);
    if (immediate) {
      //根据距离上次触发操作的时间是否到达delay来决定是否要现在执行函数
      var doNow = !timer;
      //每一次都重新设置timer，就是要保证每一次执行的至少delay秒后才可以执行
      timer = setTimeout(function () {
        timer = null;
      }, delay);
      //立即执行
      if (doNow) {
        func.apply(context, args);
      }
    } else {
      timer = setTimeout(function () {
        func.apply(context, args);
      }, delay);
    }
  }
}

// 缓动函数
function scrollSmooth (final, d, s, fn) {
  var speed = s || 22;
  var direct = d || 'down';
  var t = windowInfos().scrollTop;
  var time = setInterval(function () {
    if (direct === 'down') {
      if (t >= final) {
        clearInterval(time);
        fn && fn();
        return;
      }
      t += speed;
    } else {
      if (t <= final) {
        clearInterval(time);
        fn && fn();
        return;
      }
      t -= speed;
    }
    if (document.documentElement && document.documentElement.scrollTop) {
      document.documentElement.scrollTop = t;
    } else if (document.body) {
      document.body.scrollTop = t;
    }
  }, 16);
}