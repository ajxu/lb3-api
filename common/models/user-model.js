'use strict';

module.exports = function(User) {

    /* 
     * Register function for /user/register endpoint 
     * Accepts groupId and array of users in request
     */
    User.register = function(req, callback) {

        //console.log(req.headers['content-type']);

        /* Get parsed params */
        var groupId = req.body.groupId;
        var users = req.body.users;
        
        /* Import Group */
        var Group = User.app.models.Group;

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
                            callback(null);
                        });
                    }
                    else {
                        callback(null);
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
                 * Assume 400 bad request
                 */
                const err = {
                    statusCode: 400,
                    message: "Group not found, please check groupId.",
                };
                callback(err);
            }
        });
    };

    /* Custom remoteMethod for route registration of /user/register endpoint */
    User.remoteMethod('register', {
        accepts: [
            { arg: 'req', type: 'object', http: function(ctx) { return ctx.req; } },
        ],
        returns: [
            // Returns Content-Type:application/json
            // Note that HTTP Status Code 204 is No Content
            //{arg: 'res', type: 'object', 'http': {source: 'res'}}
        ],
        http: {
            verb: "post",
            path: "/register",
            status: 204
        },
        description: "Register users to group - Refer to User stories 1."
    });

    /* 
     * Upload photo function for /user/upload-photo endpoint 
     * Accepts userId and photoBase64 in request
     * According to instructions in user stories Content-Type: application/json
     * If need to test with real image file upload, this method can be converted to multi-part/form
     */

    User.uploadphoto = function(req, callback){
        /* Require isBase64 library - npm install is-base64 */
        var isBase64 = require('is-base64');

        /* Get parsed params */
        var userId = req.body.userId;
        var photoBase64 = req.body.photoBase64;

        /* Mime basically means data has starting descriptor e.g. data:image/png;base64, */
        const is_photoWithMime = isBase64(photoBase64, {mimeRequired: true});

        /* Check if valid MIME type base64 encoding */
        if(is_photoWithMime) {

            /* Check is it jpg or png format only */
            var helpers = require('../../server/helpers');
            var mime = helpers.base64MimeType(photoBase64);

            if(mime == "image/png" || mime == "image/jpeg" || mime == "image/jpg"){
                /* Update user, no validation to check if user exists */
                User.updateAll({userId: userId},{photoBase64: photoBase64})
                .then(count => {
                    /* returns count which is number of records updated */
                    callback(null, count);
                })
                .catch(err => {
                    callback(err);
                })
            }
            else {
                /* HTTP 400 for bad request */
                const err = {
                    statusCode: 400,
                    message: "Image format has to be png or jpeg format.",
                };
                callback(err);
            }
        }
        else{
            /* HTTP 400 for bad request */
            const err = {
                statusCode: 400,
                message: "Image file does not meet MIME type base64 encoding.",
            };
            callback(err);
        }
    };

    User.remoteMethod('uploadphoto', {
        accepts: [
            {arg: 'req', type: 'object', 'http': function(ctx) {return ctx.req;}}, 
        ],
        returns: [
            { arg: 'res', type: 'object', 'http': { source: 'res' } }
        ],
        http: {
            verb: "post",
            path: "/upload-photo",
            status: 200
        },
        description: "Upload user photo - Refer to User stories 2."
    });

};
