define(function(a,b,c){function d(a,b,c,d){var e="email"==d?"getAuthCodeForEmail":"getAuthCodeForPhone";j[e](a,b).then(function(a){a&&"OK"==a.status?c.text("验证码发送成功！"):"Error"==a.status&&c.text(a.message)})["catch"](function(a){c.removeAttr("disabled").text(a)}).done()}var e=SUI.$,f=a("scripts/baseController"),g=new f,h=a("build/template"),i=a("scripts/public/helper"),j=a("scripts/services/oUserService"),k=a("scripts/public/bowser"),l=k.bowser,m=function(){this.namespace="password",this.actions={getAuthCode:function(a){a.preventDefault();var b=this,c=e.trim(e("#userName").val());if(i.validateUserName(c)){var f,g,h=AppUser.getSession();i.isEmail(c)&&(f="邮箱验证码已在路上...",g="email"),i.isPhoneNumber(c)&&(f="短信验证码已在路上...",g="phone"),b.attr("disabled","disabled").text(f),h?d(c,h,b,g):window.location.reload()}else alert("无效的用户名")},resetPassword:function(){event.preventDefault();var a,b=e.trim(e("#userName").val()),c=e("#authCode").val(),d=e("#newPassword").val(),f=e("#reNewPassword").val(),g=AppUser.getSession();return i.validateUserName(b)?c.length<=0?a="验证码不能为空！":d.length<3||d.length>12?a="密码长度必须为3-12位":d!=f&&(a="两次新密码不一致"):a="用户名必须为手机号码或者邮箱！",a?void alert(a):void j.resetPassword(b,c,d,g).then(function(a){a&&"OK"==a.status&&alert("密码修改成功")})["catch"](function(a){alert(a)}).done()},changePassword:function(a){function b(a){i.globalResponseHandler({url:"/api/account/change_password",type:"post",dtaType:"json",data:{session:a,password:f,new_password:g}}).then(function(a){if(!a||"OK"!=a.status)throw a||"请求失败";alert("修改成功")})["catch"](function(a){alert(a)}).done()}function c(a){alert(a)}a.preventDefault();var d=e.trim(e("#userName").val()),f=e("#oldPassword").val(),g=e("#newPassword").val(),h=e("#confirmPassword").val(),j=null;return i.validateUserName(d)?""==f?j="请填写旧密码":""==g?j="请填写新密码":""==h?j="请确认新密码":g!=h?j="两次新密码不一致":g.length<3||g.length>12?j="密码长度必须为3-12位":f==g&&(j="新密码不能与旧密码一样"):j="无效的用户名",j?void alert(j):void i.requestWithSession(b,c)}}};g.extend(m),m.prototype.init=function(a,b){e(".body").append(l.android||l.ios||l.wx?h(a,b||{mobile:!0}):h(a,b||{}));var c=this;e(document).on("click."+this.namespace,"[data-xx-action]",function(a){var b=e(this),d=b.attr("data-xx-action");a=a||window.event,c.actions&&c.actions[d]&&e.isFunction(c.actions[d])&&c.actions[d].call(b,a)}),e(document).on("keyup."+this.namespace,"#userName",function(a){a=a||window.event;var b=e(this).val();i.isEmail(b)||i.isPhoneNumber(b)?e("#btn_auth_code").show():e("#btn_auth_code").hide()})},c.exports=m});