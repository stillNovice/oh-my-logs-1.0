const fs = require('fs');

const path = require('path');

const express = require('express');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

function printFunction(concernedFilePath, dirString, req, res) {
  fs.stat(concernedFilePath, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    if (stats.isFile()) {
      fs.readFile(concernedFilePath, (err, fileContents) => {
        if (err) {
          console.error(err);
          return;
        }
        res.json(fileContents.toString());
      });
    } else {
      fs.readdir(concernedFilePath, (err, files) => {
        if (err) {
          console.error(err);
        }

        const strArr = dirString.split('/');
        res.render('index', {title: 'OH-MY-LOGS', msg: strArr.pop(), prev: dirString, arr: files});
      });
    }
  });
}

app.get('/', (req, res) => {
  let dirString = req.query.dir;
  let concernedFilePath;

  if (typeof dirString === 'undefined') {
    concernedFilePath = __dirname;
    dirString = '';
  } else {
    concernedFilePath = path.join(__dirname, dirString);
  }

  console.log(concernedFilePath);
  printFunction(concernedFilePath, dirString, req, res);
});

app.listen(1080);
