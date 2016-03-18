var path = require('path');

module.exports = function metalsmithWikiWords() {
    return function wikiWords(files, metalsmith, done) {
        for(var file in files) {
            var dirDepth = path.parse(file).dir ? path.normalize(path.parse(file).dir).split(path.sep).length : 0;
            var fileContents = files[file].contents = files[file].contents.toString();
            var wikiwords = new Set(fileContents.match(/[A-Z]([A-Z0-9]*[a-z][a-z0-9]*[A-Z]|[a-z0-9]*[A-Z][A-Z0-9]*[a-z])[A-Za-z0-9]*/g));
            //var wikiwords = new Set(fileContents.match(/[A-Z][a-z][A-Za-z0-9]/g));
            if (!wikiwords) continue;
            wikiwords.forEach(function (wikiword) {
                var fileLocation = Object.keys(files).find((file) => {
                    return path.parse(file).name.toLowerCase() === wikiword.toLowerCase() ? file : false;
                });
                if (!fileLocation) return;
                fileLocation = path.parse(fileLocation).dir;
                fileLocation += fileLocation ? '/' + wikiword : wikiword;
                for (var a = 0; a < dirDepth; a++) fileLocation = '../' + fileLocation;
                var t = new RegExp('([^a-zA-Z0-9]|^)'+ wikiword +'([^a-zA-Z0-9\\]]|$)', 'g');
                var rep =  '$1[' + wikiword + '](' + fileLocation.toLowerCase() + '.html)$2';
                fileContents = fileContents.replace(t, rep);
            });
            files[file].contents = new Buffer(fileContents);
        }
        done();
    }
}