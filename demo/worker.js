
var console = {
    "log": function (str) {
        postMessage(str);
    },
    "error": function (str) {
        postMessage("Error: " + str);
    }
};

importScripts("inflate.js");
importScripts("../dictzip_sync.js");
            
        
function intArrayToString(arr) {
    ret = ""
    for(var i = 0; i < arr.length; i++) {
        ret += String.fromCharCode(arr[i]);
    }
    return ret;
}

onmessage = function (oEvent) {
    var files = oEvent.data;
    try {
        var dzreader = new DictZipFile(
                files,
                jszlib_inflate_buffer
            ),
            view = new Uint8Array(dzreader.read(0,100));
        console.log(intArrayToString(view));
    } catch(err) {
        console.error("DictZipFile error: " + err.message);
    }
}
