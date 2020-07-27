'use strict';

module.exports = function(app) {
    app.dataSources.mysqlds.autoupdate(['User','Group','UserGroup'], err => {
        if(err) throw err;
        console.log('Model schema updated');
    });
}