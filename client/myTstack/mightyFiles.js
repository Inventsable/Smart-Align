var csInterface = new CSInterface();
var sysPath = csInterface.getSystemPath(SystemPath.EXTENSION);
var logPath = sysPath + "/log/";

// To see adobe i/o functions:
// console.log(window.cep.fs);

function clearTests() {
  fileArray = ['test1.js', 'test2.js', 'test3.js', 'test4.js', 'test5.js', 'test6.json'];
  myT.deleteFiles('./log', fileArray);
}

function howToWriteFile(){
  var variablePath = logPath + 'test3.js';
  myT.writeFile('.log/', 'test1.js', `I'm test 1!`);
  myT.writeFile('./log/test2.js', `I'm test 2!`);
  myT.writeFile(variablePath, `I'm test 3!`);
  myT.writeFile(logPath, 'test4.js', `I have (directory, name, content) parameters`);
  myT.writeFile(logPath + 'test5.js', 'Or (fullPath, content) parameters');
  myT.writeFile(logPath, 'test6', `With 3 arguments I'll default to .json if name has no extension`);
}


function correctPathErrors(str) {
  str = (inString(str, '//') ? strReplace(str, '//', '/') : str );
  str = ( !hasFileExtension(str) ? ((str[str.length - 1] !== '/') ? str + '/' : str ) : str)
  str = (/^.[a-z]/.test(str.substr(0,3)) ? str.replace('.', './') : str);
  return str;
}

function smartPath(path) {
  path = correctPathErrors(path);
  return (isLocalFile(path) ? sysPath + path : path);
}

function isLocalFile(file){
  var str = csInterface.getSystemPath(SystemPath.EXTENSION);
  var parent = str.substring(str.lastIndexOf('/') + 1, str.length);
  if (!inString(file, parent)) {
    return true;
  } else {
    return false;
  }
}


var smartReg = {
  backwardSlash : /\\/g,
  multiSlash : /\/*\//g,
  hasFileExt : /\.([a-zA-Z])*[^\W]/g,
  local : /(\.){1,2}(\/)/,
};


// console.log(hasParentRegEx(logPath, extFolder()));
function hasParentRegEx(str, arg){
  var value = false;
  var regEx = `(/)` + arg;
  var reg = new RegExp(regEx, "g");
  return reg.test(str)
}


//  DIRECTORY
//

const myT = {
  makeDir : function(path){
    path = myT.isDirectory(smartPath(path));
    var result = window.cep.fs.makedir(path);
    if (0 == result.err)
      return result.data;
    else
      return false;
  },
  readDir : function(path){
    path = myT.isDirectory(smartPath(path));
    var result = window.cep.fs.readdir(path);
    if (0 == result.err)
      return result.data;
    else
      return false;
  },
  readAllFiles : function(path){
    path = myT.isDirectory(smartPath(path));
      var collection = [];
      var children = myT.readDir(path);
      children.forEach(function(v,i,a){
        collection.push(myT.readFile(path + '/' + v));
      });
      return collection;
  },
  deleteDir : function(path){
    path = myT.isDirectory(smartPath(path));
    try {
      var children = myT.readDir(path);
      myT.deleteFiles(path, children);
      csInterface.evalScript(`deleteFolder('${path}')`, function(e){
        return true;
      })
    } catch(e){return false;}
  },
  isDirectory : function(path){
    var lastChar = path.substring(path.length - 1, path.length);
    if (lastChar  == '/') {
      path = trimR(path, 1);
    }
    return path;
  },
  readFile : function(args){
    var result;
    let path = smartPath(arguments[0]);
    if (arguments.length > 1) {
      result = window.cep.fs.readFile(path + arguments[1]);
    } else {
      result = window.cep.fs.readFile(path);
    }
    if (0 == result.err) {
      return result.data;
    }
  },
  readFiles : function(path, ...args){
    path = smartPath(path);
    var mirror = [];
    for (var i = 0; i < args.length; i++) {
      if (hasArray(args[i])) {
        var children = args[i];
        for (var e = 0; e < children.length; e++){
          mirror.push(myT.readFile(path, children[e]));
        }
      } else {
        mirror.push(myT.readFile(path, args[i]));
      }
    }
    return mirror;
  },
  writeFile : function(args) {
    var directory = smartPath(arguments[0]);
    var result;
    if (arguments.length > 2) {
      res = directory + arguments[1];
      res = (hasFileExtension(res) ? res : res += '.json');
      result = window.cep.fs.writeFile(res, arguments[2]);
    } else if (arguments.length > 1) {
      directory = (hasFileExtension(directory) ? directory : directory += '.json');
      result = window.cep.fs.writeFile(directory, arguments[1])
    } else {
      console.log("Need more parameters for myT.writeFile(name, data)");
      return false;
    }
    if (0 == result.err) {
      return true;
    } else {
      return false;
    }
  },
  writeFiles : function(path, paths=[], contents=[]){
    path = smartPath(path);
    var errors = [];
    paths.forEach(function(v,i,a){
      var rewrite = myT.writeFile(path, v, contents[i]);
      if (!rewrite)
        errors.push(i);
    });
    if (!errors)
      return true;
    else
      return false;
  },
  deleteFile : function(path, name){
    path = smartPath(path);
    var result = window.cep.fs.deleteFile(path + name);
    return result;
  },
  deleteFiles: function(path, ...args){
    path = smartPath(path);
    var mirror = [];
    for (var i = 0; i < args.length; i++) {
      if (hasArray(args[i])) {
        var children = args[i];
        for (var e = 0; e < children.length; e++){
          mirror.push(myT.deleteFile(path, children[e]));
        }
      } else {
        mirror.push(myT.deleteFile(path, args[i]));
      }
    }
    return mirror;
  },
  copyFile : function(path, ...args){
    path = smartPath(path);
    var original, newName;
    if (args.length > 2) {
      original = args[0];
      newName = args[2];
      path2 = smartPath(args[1]);
    } else if (args.length > 1) {
      original = args[0];
      newName = args[1];
      path2 = path;
    } else {
      original = args[0];
      newName = insertAliasBeforeExt(original);
      path2 = path;
    }
    var result = myT.writeFile(path2, newName, myT.readFile(path, original));
    return result;
  }
}


function insertAliasBeforeExt(...args){
  if (args.length > 1) {
    return args[0].insert(args[0].lastIndexOf('.'), args[1]);
  } else {
    return args[0].insert(args[0].lastIndexOf('.'), 'copy');
  }
}



function extFolder(){
  var str = csInterface.getSystemPath(SystemPath.EXTENSION);
  var parent = str.substring(str.lastIndexOf('/') + 1, str.length);
  return parent;
}


function hasFileExtension(str){
  var errs = [];
  var ext = ['.js', '.jsx', '.html', '.css', '.json', '.svg', '.txt', '.md'];
  for (var i = 0; i < ext.length; i++){
    if (inString(str, ext[i])) {
      errs.push(ext[i]);
    }
  }
  if (errs.length > 0) {
    return true;
  } else {
    return false;
  }
}


function findBetween(str, first, second){
    var string = str.match(new RegExp(first + "(.*)" + second));
    if (string !== null) {
      return string[1];
    } else {
      return false;
    }
}

function hasArray(...args){
  var err = false;
  for (var i = 0; i < args.length; i++){
    if (args[i].constructor == Array)
      err = args[i];
  }
  return err;
}


// function parseClassesFromLayerNames(str){
// var classes = (findBetween('id=\"hello .class\" ', 'id=\"', '\"')) ? true : false;
// }

// console.log(findBetween('id=\"hello .class\" ', 'id=\"', '\"'));
// console.log(findBetween('id=\"what now\"', 'id', 'hello'));

// console.log(hasArray('said', 'the', 'mouse', ['to', 'the', 'cur']));
// console.log(myT.readFile('./log/test1.js'));
// console.log(myT.readFile(logPath, 'test2.js'));
// console.log(myT.readFile('./log', 'test3.js'));

// var thisDir =myT.readDir('./log');
// console.log(readDir('./log'));
// console.log(readDir(logPath))
// console.log(thisDir[0]);
// console.log(readDir('./log'));
// myT.copyFile('./log', 'test1.js')
// console.log(copyFile('./log', 'item.svg', './log/test', 'newItem.svg'));
// console.log(copyFile('./log', 'test7.json'));
// console.log(copyFile('.log', 'test7.json'));
// myT.copyFile('./log', 'test1.js', './log/temp', 'test9.js')

// myT.readFiles('./log', 'test1.js', 'test2.js', 'test3.js')
// myT.readFiles('./log', ['test1.js', 'test2.js', 'test3.js'])

// console.log(correctPathErrors('.//log//'));
// console.log(correctPathErrors('./data//temp'));
// console.log(correctPathErrors('.temp/'));
// console.log(correctPathErrors('.log/data.json'));

// console.log(strReplace('.said./the./mouse./to./the./cur', './', '/', 2));
// console.log(strReplace('./such./a./trial./dear./sir', './', '/', 1));
// console.log(strReplace('no no yes yes no no', 'no', 'yes'));
// console.log(strReplace('no no yes yes no no', 'no'));
// console.log(smartPath(logPath));
// console.log(smartPath('.log/test.js'));
// console.log(smartPath('.//log/'));
