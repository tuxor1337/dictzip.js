/*
 * Copyright (c) 2018 tuxor1337
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
