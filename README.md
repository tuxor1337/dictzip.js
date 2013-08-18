dictzip.js
==========

JavaScript API for handling dictzip compressed files.

Since there is no canonical way of handling files in JavaScript (though
the W3C's File API looks like a promising step in that direction), this
implementation regards a "file" as a pair, consisting of a binary string
and a name (filename).


Further reading
---

Format documentation (dictzip manpage): http://linux.die.net/man/1/dictzip  
gzip format documentation (referenced in dictzip documentation): http://www.gzip.org/zlib/rfc-gzip.html

Original implementation (written in C): http://dict.cvs.sourceforge.net/viewvc/dict/dictd1/dictzip.c?view=markup  
Python API: http://code.google.com/p/pytoolkits/source/browse/trunk/utils/stardict/dictzip.py  
Java API: http://code.google.com/p/toolkits/source/browse/trunk/android/YAStarDict/src/com/googlecode/toolkits/stardict/DictZipFile.java

JavaScript API for StarDict: https://github.com/tuxor1337/stardict.js
