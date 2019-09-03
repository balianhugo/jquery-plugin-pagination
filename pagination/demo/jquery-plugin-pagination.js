(function ($) {

    /*这是一个基于jquery的分页插件，可以通过下面的配置项进行自定义*/
    /*
          使用方法 (整页刷新)
          定义<div id="demo"></div>
          调用 js
          $('#demo').pagination({
              total: 50,	
              page_size: 1,
              link_to: '#',
              num_display: 5,	
              current_page: 1,
              callback: function(link, num, limit) {
                  // link 为请求 url, num 为请求页, limit 显示条数
                  window.location.url = "";
              }
          });
    
          使用方法 ( ajax 部分刷新)
          定义<div id="demo"></div>
          调用 js
          $('#demo').pagination({
              page_size: 1,
              num_display: 5,	
              link_to: '#',
              current_page: 1,
              callback: function(link, num, limit) {
                  // link 为请求 url, num 为请求页, limit 显示条数
                  return 10; //要返回数据总条数
              }
          });
    
      */

    // 分页默认配置
    var _config = {
        total: 0,
        //总条目数	必选参数，整数 多用于整页面刷新
        page_size: 10,
        //每页显示的条目数	可选参数，默认是10
        num_display: 6,
        //连续分页主体部分显示的分页条目数	可选参数，默认是6
        current_page: 1,
        //当前选中的页面	可选参数，默认是1，表示第1页
        link_to: '#',
        //分页的链接	字符串，可选参数，默认是"#"
        prev_text: "上一页",
        //“上一页”分页按钮上显示的文字	字符串参数，可选，默认是"上一页"
        next_text: "下一页",
        //“下一页”分页按钮上显示的文字	字符串参数，可选，默认是"下一页"
        first_text: "首页",
        // 首页显示文字
        last_text: "尾页",
        // 尾页显示文字
        show_text: "共{0}条  跳转到 {1} 页 {2}",
        // 跳转文字
        callback: null //用户自定义回调方法function(link, num, limit){}请求后台操口数据，返回数据总条数, ajax 方式
    };

    // 默认对象属性个数
    var _config_len = 11;

    // 获取对象属性个数
    function configLength(config) {
        var len = 0;
        $.each(config, function (_key, _val) {
            len++;
        });
        return len;
    }

    // 装入用户配置
    function initConfig(config) {

        if (typeof config === "object") {

            if (configLength(config) === _config_len) {
                return config;
            }

            var ownConfig = $.extend(true, {}, _config);

            $.each(ownConfig, function (_key, _val) {
                $.each(config, function (key, val) {
                    if (_key === key) {
                        ownConfig[_key] = config[key];
                    }
                });
            });
            return ownConfig;
        }

        return _config;
    }

    // 初始化分页界面
    function initUI(config, obj) {

        $(obj).empty();

        // 总页数
        var page_num = Math.ceil(config.total / config.page_size);

        // 分页展示列计数值
        var temp_num = Math.ceil(config.num_display / 2);

        var html = '<ul><li><a href="javascript:;" number="' + 1 + '"><span>' + config.first_text + '</span></a></li>';

        if ((config.current_page - 1) > 0) {
            html += '<li><a href="javascript:;" number="' + (config.current_page - 1) + '"><span>' + config.prev_text + '</span></a></li>';
        }

        if (page_num <= config.num_display) {
            for (var i = 1; i <= page_num; i++) {
                if (config.current_page == i) {
                    html += '<li><a href="javascript:;" number="' + i + '"><span class="active">' + i + '</span></a></li>'
                } else {
                    html += '<li><a href="javascript:;" number="' + i + '"><span>' + i + '</span></a></li>';
                }
            }
        } else {
            if (config.current_page < temp_num) {
                for (var i = 1; i <= config.num_display; i++) {
                    if (config.current_page == i) {
                        html += '<li><a href="javascript:;" number="' + i + '"><span class="active">' + i + '</span></a></li>'
                    } else {
                        html += '<li><a href="javascript:;" number="' + i + '"><span>' + i + '</span></a></li>';
                    }
                }
            } else if (config.current_page > (page_num - temp_num)) {
                for (var i = (page_num - config.num_display + 1); i <= page_num; i++) {
                    if (config.current_page == i) {
                        html += '<li><a href="javascript:;" number="' + i + '"><span class="active">' + i + '</span></a></li>'
                    } else {
                        html += '<li><a href="javascript:;" number="' + i + '"><span>' + i + '</span></a></li>';
                    }
                }
            } else {
                for (var i = 1; i < temp_num; i++) {
                    html += '<li><a href="javascript:;" number="' + (config.current_page - temp_num + i) + '"><span>' + (config.current_page - temp_num + i) + '</span></a></li>';
                }
                html += '<li><a href="javascript:;" number="' + config.current_page + '"><span class="active">' + config.current_page + '</span></a></li>';
                for (var j = 1; j < temp_num; j++) {
                    html += '<li><a href="javascript:;" number="' + (config.current_page + j) + '"><span>' + (config.current_page + j) + '</span></a></li>';
                }
            }
        }

        if (config.current_page < page_num) {
            html += '<li><a href="javascript:;" number="' + (config.current_page + 1) + '"><span>' + config.next_text + '</span></a></li>';
        }

        html += '<li><a href="javascript:;" number="' + (page_num == 0 ? 1 : page_num) + '"><span>' + config.last_text + '</span></a></li>'

        var _input = '<input type="text" value="' + config.current_page + '">';

        var _button = '<button>Go</button>';

        html += '<li>' + config.show_text.replace("{0}", config.total).replace("{1}", _input).replace("{2}", _button) + '</li></ul>';

        $(obj).append(html);

        var $input = $(obj).find('input').first();
        var $button = $(obj).find('button').first();

        $input.keyup(function () {
            $input.val($input.val().replace(/[^\d]/g, ''));
        });

        $button.click(function () {
            var num = new Number($input.val());
            _go(config, num < page_num ? num : page_num, obj);
        });

        $(obj).find('a').click(function () {
            _go(config, new Number($(this).attr("number")), obj);
        });

        initCSS(obj);
    }

    // 初始化样式
    function initCSS(obj) {

        $(obj).find('*').css({
            'margin': 0,
            'padding': 0,
            'list-style': 'none',
            'text-decoration': 'none'
        });

        $(obj).find('ul>li').css({
            'display': 'inline',
            'font-size': '12px',
            'line-height': '20px',
            'font-weight': 'bold',
            'color': '#165d9c',
            'margin-right': '5px'
        });

        $(obj).find('li input').css({
            'text-align': 'center',
            'border': '1px solid #bfbfbf',
            'color': '#666',
            'height': '20px',
            'width': '43px'
        });

        $(obj).find('li button').css({
            'width': '34px',
            'height': '20px',
            'border': '1px solid #bfbfbf',
            'background': '#ffffff',
            'color': '#165d9c',
            'cursor': 'pointer'
        });

        $(obj).find('li span').css({
            'padding': '0px 6px',
            'border-radius': '3px',
            'color': '#165d9c',
            'background': '#ffffff',
            'display': 'inline-block'
        });

        $(obj).find('li span').each(function () {
            $(this).hover(function () {
                $(this).css({
                    'color': '#FFFFFF',
                    'background': '#165d9c'
                });
            },
            function () {
                if (!$(this).hasClass('active')) {
                    $(this).css({
                        'color': '#165d9c',
                        'background': '#ffffff'
                    });
                }
            });
        });

        $(obj).find('.active').css({
            'color': '#FFFFFF',
            'background': '#165d9c'
        });

    }

    // 点击 go 所执行的查询, conifg 配置对象，num 请求页数
    function _go(config, num, obj) {

        var _total = config.total;

        if (typeof config.callback === "function") {
            _total = config.callback(config.link_to, num, config.page_size);
        } else {
            console.log("url: " + config.link_to + ", page_num: " + num);
        }

        config.total = _total;
        config.current_page = num;

        initUI(initConfig(config), obj);
    }

    $.fn.extend({
        "pagination": function (config) {
            var conf = initConfig(config);
            _go(conf, conf.current_page, this);
        }
    });

})(jQuery);