$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本编辑器 
    initEditor()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    var $image = $('#image')
    var options = { aspectRatio: 400 / 280, preview: '.img-preview' }
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        if (files.length == 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)
    })
    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)

        // fd.forEach(function (v, k) {
        //     console.log(k, v)
        // })
        $image
            .cropper('getCroppedCanvas', {
                width: 400, height: 280
            })
            .toBlob(function (blob) {
                fd.append('cover_img', blob)
                publish(fd)
            })


    })
    function publish(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                } else {
                    layer.msg('发布文章成功')
                    location.href = '/article/art_list.html'
                }

            }
        })
    }
})