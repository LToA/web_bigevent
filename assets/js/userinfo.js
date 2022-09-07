$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })

    ininUserInfo()
    function ininUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                } else {
                    console.log(res)
                    form.val('formUserInfo', res.data)
                }
            }
        })
    }
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        ininUserInfo()
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                } else {
                    layer.msg('更新用户信息成功')
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                    window.parent.getUserInfo()
                }
            }
        })
    })
})