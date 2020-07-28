'use strict';

module.exports = function(User) {

    var app = require('../../server/server');

    /* 
     * Register function for /user/register endpoint 
     * Accepts groupId and array of users in request
     */
    User.register = function(groupId, users, callback) {
        /* Import Group */
        var Group = app.models.Group;

        /* Check if group exist */
        Group.find({where: {groupId: groupId}})
        .then((group) => {
            console.log(group);
            if(group.length){
                /* If group exist, check if users exist */
                User.find({
                    where:{
                        /* Users that are in request array and not suspended */
                        and: [
                            {userId: {inq: users}},
                            /* Uncomment this if users are required to not be suspended */
                            //{isSuspended: 0}
                        ]
                    }
                })
                .then(users => {
                    // If eligible users are found, add group to them
                    if(users.length){
                        let upDateUsers = users.map((user) => {
                            return new Promise((resolve) => {
                                user.groups.add(group[0].groupId, function(err, user){
                                    if(err){
                                        console.log(err);
                                    }
                                    else {
                                        resolve('Processed '+ user.userId);
                                    }
                                    
                                });
                            });
                        })
                        
                        Promise.all(upDateUsers).then((msgs) => {
                            console.log(msgs);
                            console.log('Completed adding group to users');
                            callback(null, users);
                        });
                    }
                    else {
                        //console.log('Ended without update');
                        callback(null, users);
                    }
                    
                })
                .catch(err => {
                    callback(err);
                });
            }
            else {
                /* 
                 * User stories did not indicate validation if groupId was not found,
                 * This is just an example of validation.
                 */
                //throw "Group not found, please check groupId";
                callback(err);
            }
        });
    };

    /* Custom remoteMethod for route registration of /user/register endpoint */
    User.remoteMethod('register', {
        accepts: [
            {arg:'groupId', type:'number'},
            {arg:'users', type:'array'}
        ],
        // HTTP Status 204 (No Content)
        // returns: [
        //     {arg:'groupId', type:'number'},
        //     {arg:'users', type:'array'}
        // ],
        http: {
            verb: "post",
            path: "/register",
            status: 204
        },
        description: "Register users to group - Refer to User stories 1."
    });
};
