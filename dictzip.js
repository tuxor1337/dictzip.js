
var DictZipFile = (function () {
    var FTEXT = 1,
        FHCRC = 2,
        FEXTRA = 4,
        FNAME = 8,
        FCOMMENT = 16;
        
    function stringToIntArray(arr) {
        ret = []
        for(var i = 0; i < arr.length; i++) {
            ret.push(arr[i].charCodeAt(0));
        }
        return ret;
    }
    
    var cls = function (gunzip_func) {
        var dzfile;
        var verified = false, firstpos = 1;
        var gzip_flag, xlen, ver;
        var chunks = [], chlen = 0, chcnt = 0;
        var that = this;
        var gunzip = gunzip_func;
        
        if(!(gunzip instanceof Function)) {
            throw "Given gunzip_func is not a function.";
        }
        
        function load_fextra() {
            reader = new FileReader();
            reader.onload = (function (theDzFile) {
                return function (e) {
                    var l, ver;
                    blob = stringToIntArray(e.target.result);
                    while(true) {
                        l = blob[2] + 256*blob[3];
                        b = blob.slice(0,4+l);
                        if(String.fromCharCode(b[0]) != 'R'
                            || String.fromCharCode(b[1]) != 'A') {
                            blob = blob.slice(4+l);
                            if(blob.length == 0) {
                                theDzFile.onerror("Not a dictzip header.");
                                return;
                            }
                        } else {
                            break;
                        }
                    }
                    /* only format version 1 supported */
                    ver = blob[4] + 256*blob[5];
                    chlen = blob[6] + 256*blob[7];
                    chcnt = blob[8] + 256*blob[9];
                    for(var i = 0, p = 10, chpos = 0; 
                       i < chcnt && p < blob.length;
                       i++, p += 2) {
                        thischlen = blob[p] + 256*blob[p+1];
                        chunks.push([chpos,thischlen]);
                        chpos += thischlen;
                    }
                    console.log("chlen="+chlen);
                    console.log("chcnt="+chcnt);
                    locate_firstpos(1);
                };
            })(that);
            reader.readAsBinaryString(
                dzfile.slice(12, 12 + xlen)
            );
        }
        
        function locate_firstpos(n) {
            console.log("Has name: " + (gzip_flag & FNAME));
            console.log("Has comment: " + (gzip_flag & FCOMMENT));
            console.log("Has hcrc: " + (gzip_flag & FHCRC));
            if(gzip_flag & FNAME == 0 &&
               gzip_flag & FCOMMENT == 0) {
                firstpos = 12 + xlen + 2 * (gzip_flag & FHCRC);
                return;
            }
            reader = new FileReader();
            reader.onload = (function (theDzFile, theN) {
                return function (e) {
                    blob = stringToIntArray(e.target.result);
                    for(var i = 0; i < blob.length; i++) {
                        if(blob[i] == 0x00) {
                            if(gzip_flag & FNAME == 0 && firstpos == 1
                              || gzip_flag & FCOMMENT != 0 && firstpos == 2
                              || firstpos == 1) {
                                firstpos = 12+xlen+(theN-1)*1024+i+1;
                                theDzFile.verified = true;
                                theDzFile.onsuccess();
                                return;
                            } else {
                                firstpos += 1;
                            }
                        }
                    }
                    if(firstpos < 3) {
                        locate_firstpos(theN+1);
                    } else {
                        theDzFile.onerror("Invalid gzip header.");
                    }
                };
            })(that, n);
            reader.readAsBinaryString(
                dzfile.slice(12 + xlen, 12 + xlen + n * 1024)
            );
        }
        
        this.onsuccess = function () { };
        this.onerror = function () { };
        this.onread = function () { };
        
        this.load = function(f) {
            reader = new FileReader();
            dzfile = f;
            reader.onload = (function (theDzFile) {
                return function (e) {
                    blob = stringToIntArray(e.target.result);
                    if(blob[0] != 0x1F || blob[1] != 0x8B) {
                        theDzFile.onerror("Not a gzip header.");
                        return;
                    }
                    if(blob[2] != 0x08) {
                        theDzFile.onerror("Unknown compression method.");
                        return;
                    }
                    gzip_flag = blob[3];
                    if(gzip_flag & DictZipFile.FEXTRA == 0x00) {
                        theDzFile.onerror("Not a dictzip header.");
                        return;
                    }
                    xlen = blob[10] + 256 * blob[11];
                    console.log("xlen=" + xlen);
                    load_fextra();
                };
            })(this);
            reader.readAsBinaryString(dzfile.slice(0,12));
        };
        
        this.read = function (pos, len) {
            if(!this.verified) {
                this.onerror("Read attempt before loadend.");
            }
            var firstchunk = Math.floor(pos/chlen);
            var offset = pos - firstchunk*chlen;
            var lastchunk = Math.floor((pos+len)/chlen);
            var finish = offset + len;
            reader = new FileReader();
            reader.onload = (function (theDzFile) {
                return function (e) {
                    blob = e.target.result;
                    buf = "";
                    for(var i = firstchunk, j = chunks[firstchunk][0];
                       i <=  lastchunk && j < blob.length;
                       j += chunks[i][1], i++) {
                        inflated = gunzip(blob.slice(j,j+chunks[i][1]));
                        buf += inflated;
                    }
                    theDzFile.onread(buf.slice(offset,finish));
                };
            })(this);
            reader.readAsBinaryString(dzfile.slice(
                firstpos + chunks[firstchunk][0],
                firstpos + chunks[lastchunk][0] + chunks[lastchunk][1]
            ));
        };
    };

    return cls;
})();
