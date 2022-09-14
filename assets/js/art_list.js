$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable()
    initCate()
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 为筛选表单绑定 submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total)
        laypage.render({
            // 分页容器的Id
            elem: 'pagebox',
            // 总数据条数
            count: total,
            // 每页显示几条数据
            limit: q.pagesize,
            // 设置默认被选择的分页
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jump回调
            jump: function (obj, first) {
                // console.log(first)
                // console.log(obj.curr)

                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表,并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }

            }
        })
    }
    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // console.log(len)
        // 获取到文章的id
        var id = $(this).attr('data-id')
        // console.log('ok')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    } else {
                        layer.msg('删除文章成功')
                        // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                        // 如果没有剩余的数据了，就让页码值-1
                        // 再重新调用 initTable方法
                        if (len === 1) {
                            //如果len的值等于1，证明删除完毕以后，页面上就没有任何数据了
                        }
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                        initTable()
                    }
                }
            })

            layer.close(index);
        });
    })
})