# jquery-plugin-pagination
这是一个基于 jquery 写的分页插件，具体使用方式可以查看代码 demo 比较简单。

```html
<body>
    <div id="demo"></div>
</body>
<script src="./jquery-3.4.1.min.js"></script>
<script src="./jquery-plugin-pagination.js"></script>
<script>
    $('#demo').pagination({
        page_size: 1,
        num_display: 7,
        current_page: 1,
        callback: function (link, num, limit) {
            return 0;
        }
    });
</script>
```

具体展现样式为如下：

![](./demo.png)