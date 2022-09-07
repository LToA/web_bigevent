$(function () {
    var layer = layui.layer
    // 获取裁剪区域的DOM元素
    var $image = $('#image')
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 创建裁剪区域
    $image.cropper(options)

    $('#IMAGE').on('click', function () {
        //   为上传按钮绑定点击事件

        $('#file').click()
    })
    // 为文件选择框绑定 change事件
    $('#file').on('change', function (e) {
        // console.log(e)
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }
        // 1.拿到用户选择的文件
        var file = e.target.files[0]
        // 2.将文件，转化为路径
        var imgurl = URL.createObjectURL(file)
        $image
            .cropper('destroy')
            .attr('src', imgurl)
            .cropper(options)
    })
    $('#btnUpload').on('click', function () {
        //  要拿到用户裁剪之后的头像
        // 调用接口，把头像上传到服务器
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                width: 100, height: 100
            })
            .toDataURL('image/png')
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败')
                } else {
                    layer.msg('更换头像成功')
                    window.parent.getUserInfo()
                }
            }
        })
    })
})