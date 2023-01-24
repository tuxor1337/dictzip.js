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
pako from https://github.com/nodeca/pako/tree/0.2.8 (version 0.2.x) which expects
an ArrayBuffer and returns an ArrayBuffer.

However, zip.js from https://github.com/gildas-lormeau/zip.js is not compatible
at the moment, because dictzip.js expects a synchronous inflate implementation.

### Example code

Note that the code in the "demo" subdirectory depends on the file "pako_inflate.js"
from the pako project (see above). If you want to run the demo code, copy
a version of that file into the demo directory.

### Documentation: Synchronous interface

Include `dictzip_sync.js` into your worker's scope, e.g. using `importScripts`. This adds `DictZipFile` as a global variable.

    var dzreader = new DictZipFile(blob, inflate);
    
The `DictZipFile` constructor expects a Blob object `blob` and a function `inflate`. This function is supposed to expect an ArrayBuffer and return an ArrayBuffer (e.g. `pako.inflateRaw` from the pako project).

    var buffer = dzreader.read(offset, size);
    
Instances of `DictZipFile` have only this method. `offset` and `size` are unsigned integers that represent the offset and size with respect to the inflated data. Both are optional and default to 0 (for `offset`) and the inflated data's bytelength (for `size`).

In case of errors, `DictZipFile` throws an instance of `Error` with the respective `message` property. 

### Documentation: Asynchronous interface

The asynchronous interface is provided by `dictzip.js` and adds `DictZipFile` as a global variable.

    var dzreader = new DictZipFile(blob, inflate);
    
For `blob` and `inflate` cf. the synchronous case (note that `inflate` is supposed to be a _synchronous_ implementation of the inflate algorithm). Before we can do anything with our instance of `DictZipFile` we have to wait for it to `load`:

    dzreader.load().then(function () {
        // now you can use the `read` method etc.
    }, function (err) {
        console.error("DictZipFile load error: " + err.message);
    });

The `load` method returns a `Promise` object. `DictZipFile` reads the file's header and verifies that it's indeed a dictzip file. Once the promise is fulfilled we can do some `read` operations:

    dzreader.read(offset, size).then(function (buffer) {
        // do something with buffer
    }, function (err) {
        console.error("DictZipFile read error: " + err.message);
    });
    
Again `read` returns a `Promise` object that provides you with an ArrayBuffer `buffer` when fulfilled. For the parameters `offset` and `size` refer to the synchronous case.

Further reading
---

* Format documentation (dictzip manpage): http://linux.die.net/man/1/dictzip
* gzip format documentation (referenced in dictzip documentation): http://www.gzip.org/zlib/rfc-gzip.html
* Original implementation (written in C): http://dict.cvs.sourceforge.net/viewvc/dict/dictd1/dictzip.c?view=markup
* Python lib: http://code.google.com/p/pytoolkits/source/browse/trunk/utils/stardict/dictzip.py
* Java lib: http://code.google.com/p/toolkits/source/browse/trunk/android/YAStarDict/src/com/googlecode/toolkits/stardict/DictZipFile.java
* JavaScript library for StarDict: https://framagit.org/tuxor1337/stardict.js
