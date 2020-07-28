module.exports = {

    base64MimeType : function(encoded) {
        var result = null;
        if (typeof encoded !== 'string') {
            return result;
        }
        /* Extract mime with regexp */
        var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        if (mime && mime.length) {
            result = mime[1];
        }
        /* Returns "image/png", "image/jpeg" */
        return result;
    },
    
    // functionName2 : function() {
    //  // some code
    // },
    
}