dictzip.js
==========

JavaScript library for handling dictzip compressed files effectively, i.e. it does not
uncompress and load into memory the whole data blob, but instead provides an interface
for (asynchronous) random access to the compressed data.

Hence it can handle really huge amounts of data which may occur e.g. when working with
local files accessed through the W3C's File API.

This implementation internally works with binary strings, which is an array
of `chars`. One char represents exactly one byte and may be human readable or not.
You can retrieve this byte's integer value by `myCharVar.charCodeAt(0)`, which will
return a value from `0` to `255` (inclusively).

It will return data as a binary string and thus return results comparable to the method
`readAsBinaryString` of the `FileReader` object in the File API. For reading e.g. UTF-8 encoded
text you may still have to convert the resulting binary string to a UTF-8 string for human
readable output.

Example code
---

Using js-inflate from https://github.com/augustl/js-inflate we get:

    /* The DictZipFile constructor expects an inflate function.
     * This function in turn is supposed to expect a binary string
     * and return a binary string in the above sense.
     */
    var dfile = new DictZipFile(JSInflate.inflate);
    
    $("input[type=file]").change(function (evt) {
        dfile.onsuccess = function () {
                /* After the dictzip blob has been "loaded",
                 * that means, it's header has been read, we can execute
                 * some fancy read operations and retrieve data.
                 */
                this.onread = function (data) {
                    // data now conains a binary string
                    console.log(data); // maybe not a good idea, since data might contain non-readable chars
                };
                /* expects start byte and length of requested data set */
                this.read(0,353);
        };
        
        dfile.onerror = function (err) {
            console.error("DictZipFile error: " + err);
        };
        
        dfile.load(evt.target.files[0]);
    });


Further reading
---

Format documentation (dictzip manpage): http://linux.die.net/man/1/dictzip  
gzip format documentation (referenced in dictzip documentation): http://www.gzip.org/zlib/rfc-gzip.html

Original implementation (written in C): http://dict.cvs.sourceforge.net/viewvc/dict/dictd1/dictzip.c?view=markup  
Python lib: http://code.google.com/p/pytoolkits/source/browse/trunk/utils/stardict/dictzip.py  
Java lib: http://code.google.com/p/toolkits/source/browse/trunk/android/YAStarDict/src/com/googlecode/toolkits/stardict/DictZipFile.java

JavaScript library for StarDict: https://github.com/tuxor1337/stardict.js
