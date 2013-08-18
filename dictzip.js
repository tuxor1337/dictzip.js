
var DictZipFile = (function () {
    
    var FEXTRA = 4;

    /*
     * expects File object (W3C File API)
     */
    var cls = function (f) {
        var dzfile = f;
        var chunks, chlen, chcnt;
        var pos = 0;
        
        if(!DictZipFile.verify_header(this.dzfile)) {
            /* Add Exception/Error handling */
            return null;
        } else {
            /* fill chunk list, determine chlen, chcnt */
            chunks = [];
        }
        
        this.seek = function (newpos) {
            this.pos = newpos;
        };
        
        this.read = function (len) {
            /* Returns binary array. */
            return [];
        };
        
        this.tell = function () {
            return this.pos;
        }
    }
    
    cls.verify_header

    return cls;
})()
