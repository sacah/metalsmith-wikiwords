var assert = require('assert');
var wikiwords = require('..');

function getFileStr(name, files) {
    return files[name +'.md'].contents.toString();
}

/* Test directory handling and relative link generation */

describe('metalsmith-wikiwords', function () {
    var files = {
        'wikiwordextra.md': {
            contents: new Buffer(
`WikiWord at start
Also end with WikiWord
And a WikiWord in the middle
Not 0WikiWord or 0WikiWord0 with numbers
And WikiWordExtra.
Number ending WikiWord0?
Number middle Wiki0Word?
WWWeb
WWWebOfAwesome
LinksOfTheWWW
LinksOfTheWWWOfAwesome
SmA
Correct relative path to NestedFile?
WWW all by itself`)
        }, 
        'wikiword.md': {
            contents: new Buffer(
`WikiWord`)
        },
        '0wikiword.md': {
            contents: new Buffer('')
        },
        'wikiword0.md': {
            contents: new Buffer('')
        },
        'wiki0word.md': {
            contents: new Buffer('')
        },
        'wwweb.md': {
            contents: new Buffer('')
        },
        'wwwebofawesome.md': {
            contents: new Buffer('')
        },
        'linksofthewww.md': {
            contents: new Buffer('')
        },
        'linksofthewwwofawesome.md': {
            contents: new Buffer('')
        },
        'SmA.md': {
            contents: new Buffer('')
        },
        'www.md': {
            contents: new Buffer('')
        },
        'dir1/dir2/nestedfile.md': {
            contents: new Buffer(
`Correct relative path to WikiWord page`)
        },
        'dir3/anothernestedfile.md': {
            contents: new Buffer(
`Correct relative path back and forward to NestedFile page?`)
        }
    }
    wikiwords()(files, null, () => {});
    
    describe('should find and mark as a link, 3 letter words', function () {
        it('not if all caps', function () {
            assert.ok(getFileStr('wikiwordextra', files).indexOf('WWW all by itself') > -1);
        });
        it('cap, lower, cap', function () {
            assert.ok(getFileStr('wikiwordextra', files).indexOf('[SmA](sma.html)') > -1);
        });
    });
    
    describe('should find and mark as a link, consecutive caps with atleast 1 lowercase', function () {
        it('at beginning', function () {
            assert.ok(getFileStr('wikiwordextra', files).indexOf('[WWWeb](wwweb.html)') > -1);
        });
        it('at beginning with subsequent caps', function () {
            assert.ok(getFileStr('wikiwordextra', files).indexOf('[WWWebOfAwesome](wwwebofawesome.html)') > -1);
        });
        it('at end', function () {
            assert.ok(getFileStr('wikiwordextra', files).indexOf('[LinksOfTheWWW](linksofthewww.html)') > -1);
        });
        it('in middle', function () {
            assert.ok(getFileStr('wikiwordextra', files).indexOf('[LinksOfTheWWWOfAwesome](linksofthewwwofawesome.html)') > -1);
        });
    });

    describe('should find and mark as a link, number', function () {
        it('in middle', function () {
            assert.ok(getFileStr('wikiwordextra', files).indexOf('Number middle [Wiki0Word](wiki0word.html)?') > -1);
        });
        it('at end', function () {
            assert.ok(getFileStr('wikiwordextra', files).indexOf('Number ending [WikiWord0](wikiword0.html)?') > -1);
        });
        it('not if beginning with numbers', function () {
                assert.ok(getFileStr('wikiwordextra', files).indexOf('Not 0WikiWord or 0WikiWord0 with numbers') > -1);
        });        
    });
    
    describe('should find and mark as a link, WikiWord', function () {
        it('at start', function () {
                assert.ok(getFileStr('wikiwordextra', files).indexOf('[WikiWord](wikiword.html) at start') > -1);
        });
        it('at end', function () {
                assert.ok(getFileStr('wikiwordextra', files).indexOf('Also end with [WikiWord](wikiword.html)') > -1);
        });
        it('in the middle', function () {
                assert.ok(getFileStr('wikiwordextra', files).indexOf('And a [WikiWord](wikiword.html) in the middle') > -1);
        });
        it('not as part of larger WikiWord', function () {
                assert.ok(getFileStr('wikiwordextra', files).indexOf('And [WikiWordExtra](wikiwordextra.html).') > -1);
        });
        it('when only contents of file', function () {
                assert.ok(getFileStr('wikiword', files).indexOf('[WikiWord](wikiword.html)') > -1);
        });
    });
    
    describe('should find and mark as a link, WikiWords with relative locations', function () {
        it('nested 2 directories deep', function () {
            assert.ok(getFileStr('wikiwordextra', files).indexOf('Correct relative path to [NestedFile](dir1/dir2/nestedfile.html)?') > -1);
        });
        it('up 2 directories', function () {
            assert.ok(getFileStr('dir1/dir2/nestedfile', files).indexOf('Correct relative path to [WikiWord](../../wikiword.html) page') > -1);
        });
        it('up 1 directory and down 2 directories', function () {
            assert.ok(getFileStr('dir3/anothernestedfile', files).indexOf('Correct relative path back and forward to [NestedFile](../dir1/dir2/nestedfile.html) page?') > -1);
        });
    });
});