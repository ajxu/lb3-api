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
     * Accepts userId and photoBase64 in request as JSON
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


    /* 
     * Suspend user for /user/suspend endpoint 
     * Accepts userId in request as JSON
     */

    User.suspend = function(req, callback){
        /* Get parsed params */
        var userId = req.body.userId;

        /* Update user, no validation to check if user exists */
        User.updateAll({userId: userId}, {isSuspended: true})
        .then(count => {
            callback(null, count);
        })
        .catch(err => {
            callback(err);
        });
    };

    User.remoteMethod('suspend', {
        accepts: [
            {arg: 'req', type: 'object', 'http': function(ctx) {return ctx.req;}}, 
        ],
        returns: [
            { arg: 'res', type: 'object', 'http': { source: 'res' } }
        ],
        http: {
            verb: "post",
            path: "/suspend",
            status: 200
        },
        description: "Suspend user - Refer to User stories 3."
    });

    /* 
    * Retrieve for Notifications 
    */

   User.retrievefornotifications = function(req, callback){

        /* Get parsed params */
        var groupId = req.body.group
        var notification = req.body.notification

        /* Get Group Model */
        var Group = User.app.models.Group;

        /* Find group based on groupId in request */
        Group.find({
            include: {
                relation: 'users'
            },
            where: {
                groupId: groupId
            }
        })
        .then(group => {
            /* Only include NOT suspended users */
            group[0].users({
                where: { isSuspended: false },
                /* Omit unnecessary fields, only email (userId) is required.*/
                fields: {userId: true, photoBase64: false, isSuspended: false}
            }, function(err, users){
                if(err) {
                    callback(err);
                }
                else {
                    /* Match emails found in notifications */
                    const regex = /[^@\r\n\t\f\v ]+[a-z0-9@]@[a-z0-9\.]+/img;
                    let extraEmails = (notification.match(regex) || []);

                    /* Convert user objects into an array */
                    let userEmails = users.map(user => {
                        return user['userId'];
                    });

                    /* Concatenate all recipients to be used for notification */
                    let allRecipients = userEmails.concat(extraEmails);
                    console.log(allRecipients);
                    callback(null, allRecipients)
                }
            })
        })
        .catch(err => {
            callback(err);
        });
    }

    User.remoteMethod('retrievefornotifications', {
        accepts: [
            {arg: 'req', type: 'object', 'http': function(ctx) {return ctx.req;}}, 
        ],
        returns: [
            { arg: 'recipients', type: 'object', 'http': { source: 'res' } }
        ],
        http: {
            verb: "post",
            path: "/retrievefornotifications",
            status: 200
        },
        description: "Retrieve a list of users who can receive a given notification - Refer to User stories 4."
    });

    /* 
     * This code block below is to turn on/off individual auto-generated api routes 
     */

    /* Find all instances of the model matched by filter from the data source. */
    // User.disableRemoteMethodByName('find');

    /* Create a new instance of the model and persist it into the data source. */
    // UserModel.disableRemoteMethodByName('create');

    User.disableRemoteMethodByName('findById');
    User.disableRemoteMethodByName('findOne');
    User.disableRemoteMethodByName('findOrCreate');
    User.disableRemoteMethodByName('exists');
    User.disableRemoteMethodByName('createChangeStream');
    User.disableRemoteMethodByName('upsert');
    User.disableRemoteMethodByName('updateAll');
    User.disableRemoteMethodByName('upsertWithWhere');
    User.disableRemoteMethodByName('replaceOrCreate');
    User.disableRemoteMethodByName('replaceById');
    User.disableRemoteMethodByName('destroyById');
    User.disableRemoteMethodByName('destroyAll');
    User.disableRemoteMethodByName('count');
    User.disableRemoteMethodByName('prototype.updateAttributes');
    User.disableRemoteMethodByName('prototype.__findById__groups');
    User.disableRemoteMethodByName('prototype.__destroyById__groups');
    User.disableRemoteMethodByName('prototype.__updateById__groups');
    //User.disableRemoteMethodByName('prototype.__get__groups');
    //User.disableRemoteMethodByName('prototype.__create__groups');
    User.disableRemoteMethodByName('prototype.__delete__groups');
    User.disableRemoteMethodByName('prototype.__count__groups');
    User.disableRemoteMethodByName('prototype.__exists__groups');
    //User.disableRemoteMethodByName('prototype.__link__groups');
    User.disableRemoteMethodByName('prototype.__unlink__groups');

};
