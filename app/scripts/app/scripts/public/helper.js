define(function(a,b){var c=a("sui/async/q"),d=/(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/,e=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,f=function(a){var b=function(a){var b="/index.html";switch(a.status){case"OK":return a;case"Error":throw a.message;case"Expired":$.removeCookie("userSession",{path:"/"}),window.location.href=b;break;case"CAPTCHA":throw"对不起，您请求过于频繁，请输入验证码后再试";case"Not Logged In":return a.status;case"Permission Denied":throw"Permission Denied";case"Inconsistent Arguments":throw"Inconsistent Arguments"}};return c($.ajax(a)).then(function(a){return b(a)},function(a){throw seajs.log(a),"Web Service Error"})};b.globalResponseHandler=f;var g=function(){return $.removeCookie("userSession"),f({url:"/api/session/create",type:"POST",dataType:"JSON"}).then(function(a){if(seajs.log(a),"OK"==a.status)return a.session;throw"session create failed"},function(){throw"session create failed"})};b.getSession=g,b.requestWithSession=function(a,b){function c(){g().then(function(b){a&&$.isFunction(a)&&a(b)})["catch"](function(a){b&&$.isFunction(b)&&b(a)}).done()}var d=$.cookie("userSession");d?f({url:"/api/account/id?session="+d,type:"GET",dataType:"JSON"}).then(function(b){"OK"==b.status&&a&&$.isFunction(a)&&a(d)})["catch"](function(){c()}):c()},b.getParam=function(a){if(a=a||null){var b=new RegExp("[\\?\\&]"+a+"=([\\w\\d]*)"),c=window.location.href.match(b);return c?c[1]:null}var c=window.location.href.match(/\?(.*)/)||null;return c?c[1].split("&"):{}},b.validateUserName=function(a){var b=!1;return(d.test(a)||e.test(a))&&(b=!0),b},b.isEmail=function(a){return e.test(a)},b.isPhoneNumber=function(a){return d.test(a)}});