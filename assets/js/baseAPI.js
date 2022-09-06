// 注意：每次调用$.get()或者$.post()或$.ajax()的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log(options.url)
    // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my')) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    options.complete = function (res) {
        // console.log('执行了complete回调')
        // console.log(res)
        if (res.responseJSON.status === 1) {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }

    }

})