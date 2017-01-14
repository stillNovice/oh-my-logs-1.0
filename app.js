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

    const strArr = dirString.split('/');
    let stVal;

    if (strArr.length === 1) {
      stVal = "root";
    } else {
      stVal = strArr.pop();
    }


    if (stats.isFile()) {
      fs.readFile(concernedFilePath, (err, fileContents) => {
        if (err) {
          console.error(err);
          return;
        }
        //res.json(fileContents.toString());
        //console.log(typeof fileContents);
        res.render('index', {
          title: 'OH-MY-LOGS!',
          msg: stVal,
          prev: dirString,
          notLast: false,
          arr: fileContents.toString
        })
      });
    } else {
      fs.readdir(concernedFilePath, (err, files) => {
        if (err) {
          console.error(err);
        }

        // console.log(stVal);
        let filesArrayObj = [];
        for (let i = 0; i < files.length; i++) {
          let statRet = fs.statSync(path.join(concernedFilePath, files[i]));

          let fType = statRet.isFile() ? 'file_img.png' : 'folder_img.jpg';
          filesArrayObj.push({
            'fileName': files[i],
            'fileType': fType
          });
        }

        res.render('index', {
          title: 'OH-MY-LOGS!',
          msg: stVal,
          prev: dirString,
          notLast: true,
          arr: filesArrayObj
        });
      });
    }
  });
}

app.use((req, res, next) => {
  var dirSt = req.query.dir;
  if (typeof dirSt !== 'undefined' && dirSt.indexOf("..") !== -1) {
    printFunction(__dirname, '', req, res);
    return;
  }

  next();
});

app.get('/', (req, res) => {
  let dirString = req.query.dir;
  let concernedFilePath;

  if (typeof dirString === 'undefined') {
    concernedFilePath = __dirname;
    dirString = '';
  } else {
    concernedFilePath = path.join(__dirname, dirString);
  }

  //console.log(concernedFilePath);
  printFunction(concernedFilePath, dirString, req, res);
});

app.listen(1080);