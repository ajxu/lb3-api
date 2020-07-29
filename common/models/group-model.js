'use strict';

module.exports = function(Group) {

    /* 
     * This code block below is to turn on/off individual auto-generated api routes 
     */

    /* Find all instances of the model matched by filter from the data source. */
    // User.disableRemoteMethodByName('find');

    /* Create a new instance of the model and persist it into the data source. */
    // UserModel.disableRemoteMethodByName('create');

    Group.disableRemoteMethodByName('findById');
    Group.disableRemoteMethodByName('findOne');
    Group.disableRemoteMethodByName('findOrCreate');
    Group.disableRemoteMethodByName('exists');
    Group.disableRemoteMethodByName('createChangeStream');
    Group.disableRemoteMethodByName('upsert');
    Group.disableRemoteMethodByName('updateAll');
    Group.disableRemoteMethodByName('upsertWithWhere');
    Group.disableRemoteMethodByName('replaceOrCreate');
    Group.disableRemoteMethodByName('replaceById');
    Group.disableRemoteMethodByName('destroyById');
    Group.disableRemoteMethodByName('destroyAll');
    Group.disableRemoteMethodByName('count');
    Group.disableRemoteMethodByName('prototype.updateAttributes');
    Group.disableRemoteMethodByName('prototype.__findById__users');
    Group.disableRemoteMethodByName('prototype.__destroyById__users');
    Group.disableRemoteMethodByName('prototype.__updateById__users');
    //Group.disableRemoteMethodByName('prototype.__get__users');
    //Group.disableRemoteMethodByName('prototype.__create__users');
    Group.disableRemoteMethodByName('prototype.__delete__users');
    Group.disableRemoteMethodByName('prototype.__count__users');
    Group.disableRemoteMethodByName('prototype.__exists__users');
    Group.disableRemoteMethodByName('prototype.__link__users');
    Group.disableRemoteMethodByName('prototype.__unlink__users');
};
