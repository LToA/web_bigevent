$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var htmlstr = template('tpl-table', res)
                // console.log(res);
                $('tbody').html(htmlstr)
            }
        })
    }
    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialong-add').html()
        })
    })
    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log('ok')
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                } else {
                    initArtCateList()
                    layer.msg('新增分类成功')
                    layer.close(indexAdd)
                }

            }

        })
    })
    var indexEdit = null
    // 通过代理的形式，为btn-edit 按钮绑定点击事件
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $('#dialong-edit').html()
        })

        var id = $(this).attr('data-id')
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    // 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {

        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                } else {
                    layer.msg('更新分类数据成功')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            }
        })
    })
    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function () {
        // console.log('ok')
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    } else {
                        layer.msg('删除分类成功')
                        layer.close(index)
                        initArtCateList()
                    }
                }
            })

            layer.close(index);
        })
    })
})