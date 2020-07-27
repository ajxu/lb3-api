'use strict';

module.exports = function(app) {
    app.dataSources.mysqlds.autoupdate(['UserModel','GroupModel','UserGroupModel'], err => {
        if(err) throw err;
        console.log('Model schema updated');
    });
}