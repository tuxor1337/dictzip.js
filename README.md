dictzip.js
==========

JavaScript library for handling dictzip compressed files effectively, i.e. it does not
uncompress and load into memory the whole data blob, but instead provides an interface
for (asynchronous or synchronous) random access to the compressed data.

Hence it can handle really huge amounts of data which may occur e.g. when working with
local files accessed through the W3C's File API.

This implementation internally works with ArrayBuffers and will return data
as ArrayBuffers and thus return results comparable to the method
`readAsArrayBuffer` of the `FileReader` object in the File API. For reading
e.g. UTF-8 encoded text you may still have to convert the resulting 
ArrayBuffer to a UTF-8 string for human readable output.

dictzip.js depends on an inflate implementation written in JavaScript like
JSZLib from https://github.com/dasmoth/jszlib which expects an ArrayBuffer
and returns an ArrayBuffer.

zip.js from https://github.com/gildas-lormeau/zip.js is not compatible
at the moment, because dictzip.js expects a synchronous inflate implementation.

Example code
---

Using JSZLib we get for the synchronous API:
    
    var upload = document.getElementsByTagName('input')[0];
    upload.onchange = function (evt) {
        try {
            /* The DictZipFile constructor expects a File Object and an
             * inflate function. This function is supposed to expect an
             * ArrayBuffer and return an ArrayBuffer.
             */
            var dzreader = new DictZipFile(
                evt.target.files[0],
                jszlib_inflate_buffer
            );
            
            /* expects start byte and length of requested data set */
            var buffer = dzreader.read(0,353);
            
            // do something with buffer
        } catch(err) {
            console.error("DictZipFile error: " + err.message);
        }
    };

The asynchronous API uses promises and hence looks like this:

    var upload = document.getElementsByTagName('input')[0];
    upload.onchange = function (evt) {
        var dzreader = new DictZipFile(
            evt.target.files[0],
            jszlib_inflate_buffer
        );
        
        dzreader.load().then(function () {
            return dzreader.read(0,353);
        }, function (err) {
            console.error("DictZipFile load error: " + err.message);
        }).then(function (buffer) {
            // do something with buffer
        }, function (err) {
            console.error("DictZipFile read error: " + err.message);
        });
    };

Further reading
---

Format documentation (dictzip manpage): http://linux.die.net/man/1/dictzip  
gzip format documentation (referenced in dictzip documentation): http://www.gzip.org/zlib/rfc-gzip.html

Original implementation (written in C): http://dict.cvs.sourceforge.net/viewvc/dict/dictd1/dictzip.c?view=markup  
Python lib: http://code.google.com/p/pytoolkits/source/browse/trunk/utils/stardict/dictzip.py  
Java lib: http://code.google.com/p/toolkits/source/browse/trunk/android/YAStarDict/src/com/googlecode/toolkits/stardict/DictZipFile.java

JavaScript library for StarDict: https://github.com/tuxor1337/stardict.js
