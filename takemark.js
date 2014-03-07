var fs = require("fs");
var path = require("path");
var md = require( "markdown" ).markdown;

var DEFAULT_CHARSET_NAME = 'utf8';

function addHeader(level, title) {
    return new Array(level + 1).join('#') + ' ' + title;
}

function extractTitles(path, func) {
    fs.readFile(path, DEFAULT_CHARSET_NAME, function(err, text){
        var tree = md.parse(text);
        var titles = tree.filter(function(token) {
            return token[0] == 'header';
        }).map(function(token) {
            var level = token[1]['level'];
            var title = token[2];
            return addHeader(level, title);
        });
        func(titles);
    });
}

function readTexts(chapterDirPath, func) {
  fs.readdir(chapterDirPath, function (error, fileNames) {
      var paths = fileNames.map(function(fileName) {
          return path.join(chapterDirPath, fileName)
      })
      paths.map(function(path) {
          extractTitles(path, func);
      });
  });
}

function readChapters(baseDir, func) {
    fs.readdir(baseDir, function (error, chapterDirNames) {
        var paths = chapterDirNames.map(function(chapterDirName) {
            return path.join(baseDir, chapterDirName)
        })
        for (idx in paths) {
            readTexts(paths[idx], func);
        }
    });
}

function getBaseDirFromArgs() {
    if (process.argv[0] == 'node') {
        return process.argv[2];
    } else {
        return process.argv[3];
    }
}

readChapters(getBaseDirFromArgs(), function(titles) {
    titles.forEach(function(title) {
        console.log(title);
    });
});
