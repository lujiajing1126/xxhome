define(function(require, exports, module) {
    var $ = SUI.$,
        Helper = require('scripts/public/helper');
    /**
     * 获取当前用户信息
     * @param  {int} userId  [用户ID]
     * @param  {string} session [当前用户的Session]
     * @return {obj}         [返回$.globalResponseHandler对象]
     */
    exports.getOwnerUserInfo = function(userId, session) {
        var fields = ['userInfo.gender',
            'userInfo.nickname',
            'userInfo.name',
            'userInfo.emails',
            'userInfo.phoneNumbers',
            'studentInfo.studentId',
            'studentInfo.city',
            'studentInfo.school',
            'studentInfo.department',
            'studentInfo.grade',
            'studentInfo.district',
            'studentInfo.major',
            'studentInfo.classId',
            'extendedUserInfo.dayOfBirth',
            'extendedUserInfo.hobby',
            'extendedUserInfo.hometown',
            'extendedUserInfo.instanceMessageAccounts',
            'extendedUserInfo.isInRelation',
            'extendedUserInfo.location',
            'extendedUserInfo.monthOfBirth',
            'extendedUserInfo.sexualOrientation',
            'extendedUserInfo.yearOfBirth',
            'dynamic.numberOfFriends',
            'dynamic.numberOfFollowers',
            'dynamic.numberOfExecutingEvents',
            'dynamic.isfriend', //不是好友 返回 是否关注 isFollower
            'dynamic.executingEvent', //executingEvent  countPraiser
            'membership.tags'
        ];
        var url = '/api/user/' + userId + '/info?session=' + session + '&fields=' + fields.join(',');
        return Helper.globalResponseHandler({
            url: url,
            type: 'GET',
            dataType: 'JSON'
        });
    };
    /**
     * getUserInfo 通过组织获取他人个人信息，获取他人信息部分信息受限
     * @param  {int} userId  [用户ID]
     * @param  {string} session [当前用户的Session]
     * @param  {string} orgId [当前组织ID]
     * @return {obj}         [返回$.globalResponseHandler对象]
     */
    exports.getUserInfo = function(userId, session, orgId) {
        var fields = ['userInfo.gender',
            'userInfo.nickname',
            'userInfo.name',
            'studentInfo.city',
            'studentInfo.school',
            'studentInfo.department', //院系
            'studentInfo.grade', //年级
            'extendedUserInfo.hobby',
            'extendedUserInfo.hometown',
            'extendedUserInfo.isInRelation',
            'extendedUserInfo.location',
            'extendedUserInfo.sexualOrientation', //性取向
            'membership.tags'
        ];
        return Helper.globalResponseHandler({
            url: '/api/org/' + orgId + '/user/' + userId + '/info?session=' + session + '&fields=' + fields.join(','),
            type: 'GET',
            dataType: 'JSON'
        });
    };


    /**
     * 邮箱获取验证码
     */
    exports.getAuthCodeForEmail = function(userName, session) {
        return Helper.globalResponseHandler({
            url: '/api/account/find_password_by_email',
            dataType: 'JSON',
            data: {
                email: userName,
                session: session
            }
        });
    };
    /**
     * 手机获取验证码
     */
    exports.getAuthCodeForPhone = function(userName, session) {
        return Helper.globalResponseHandler({
            url: '/api/account/find_password_by_phone_number',
            dataType: 'JSON',
            data: {
                phone_number: userName,
                session: session
            }
        });
    };
    /**
     * 重置密码
     */
    exports.resetPassword = function(userName, authCode, newPassword, session) {
        var url, data = {
            new_password: newPassword,
            token: authCode,
            session: session
        };
        if (Helper.isEmail(userName)) {
            data.email = userName;
            url = "/api/account/reset_password_by_email";
        }
        if (Helper.isPhoneNumber(userName)) {
            data.phone_number = userName;
            url = "/api/account/reset_password_by_phone_number";
        }
        return Helper.globalResponseHandler({
            url: url,
            type: 'post',
            dataType: 'JSON',
            data: data
        });
    };
});