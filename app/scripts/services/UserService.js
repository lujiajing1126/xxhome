define(function(require, exports, module) {
    var $ = SUI.$;
    require('scripts/public/helpers');
    /**
     * 获取当前用户信息
     * @param  {int} userId  [用户ID]
     * @param  {string} session [当前用户的Session]
     * @return {obj}         [返回$.globalResponseHandler对象]
     */
    exports.getOwnerUserInfo = function(userId, session, orgId) {
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
        var url = orgId ? '/api/org/' + orgId + '/user/' + userId + '/info?session=' + session + '&fields=' + fields.join(',') : '/api/user/' + userId + '/info?session=' + session + '&fields=' + fields.join(',');
        return $.globalResponseHandler({
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
            // 'userInfo.emails',
            // 'userInfo.phoneNumbers',
            //'studentInfo.studentId',
            //'studentInfo.district',
            //'studentInfo.major',//专业
            // 'studentInfo.classId',
            //'extendedUserInfo.dayOfBirth',
            //'extendedUserInfo.instanceMessageAccounts',//微信号
            //'extendedUserInfo.monthOfBirth',
            // 'extendedUserInfo.yearOfBirth',
            // 'dynamic.numberOfFriends',
            // 'dynamic.numberOfFollowers',
            // 'dynamic.numberOfExecutingEvents',
            // 'dynamic.isfriend', //不是好友 返回 是否关注 isFollower
            // 'dynamic.executingEvent' //executingEvent  countPraiser
            'membership.tags'
        ];
        return $.globalResponseHandler({
            url: '/api/org/' + orgId + '/user/' + userId + '/info?session=' + session + '&fields=' + fields.join(','),
            type: 'GET',
            dataType: 'JSON'
        });
    };

    /**
     * 更新用户信息
     * @param  {Integer} userId 用户ID
     * @param  {Object} data   需要更新的资料&session
     * @return {Promise}        $.globalResponseHandler对象
     */
    exports.updateUserInfo = function(userId, data) {
        return $.globalResponseHandler({
            url: '/api/user/' + userId + '/update',
            type: 'POST',
            dataType: 'JSON',
            data: data
        });
    };
    /**
     * 获取学生居住地信息
     * @param  {UUID} session 用户的Session令牌
     * @param  {Integer} id 用户ID
     * @return {Promise}
     */
    exports.getStudentResidenceInfoDirectory = function(session, id) {
        id = id || 0;
        return $.globalResponseHandler({
            url: '/api/info/load_student_residence_info_directory?session=' + session + '&id=' + id,
            dataType: 'json'
        });
    }
});