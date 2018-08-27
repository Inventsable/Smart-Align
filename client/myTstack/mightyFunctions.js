var csInterface = new CSInterface();

function dispatchEvent(name, data) {
  var event = new CSEvent(name, 'APPLICATION');
  event.data = data;
  csInterface.dispatchEvent(event);
}

function chainEvent(data, name) {
  csInterface.evalScript(`JSXEvent('${data}', '${name}')`)
}

function changeCSSVar(prop, data){
  document.documentElement.style.setProperty('--' + prop, data);
}

function deleteChildren(parent){
  while(parent.firstChild){
      parent.removeChild(parent.firstChild);
  }
}

function trimL(str, num) {
  return str.substr(num)
}

function trimR(str, num) {
  return str.slice(0, (num * -1));
}


// trimEdges(string, both);
// trimEdges(string, L, R);
function trimEdges(str, ...num) {
  if (num.length > 1) {
    return str.substr(num[0]).slice(0, (num[1] * -1));
  } else {
    return str.substr(num[0]).slice(0, (num[0] * -1));
  }
}


// strReplace('a b c d', 'd');
// strReplace('a b c d', 'd', '1 2 3');
// strReplace('.said./the./mouse./to./the./cur', './', '/', 2)
// strReplace('./such./a./trial./dear./sir', './', '/', 1)
function strReplace(s, ...args){
  if (args.length > 2) {
    var d = s.split(args[0]);
    var fixer = [];
    for (var i = 0; i < d.length; i++) {
      if (i < args[2]) {
        fixer.push(d[i] + args[1])
      } else {
        fixer.push(d[i] + args[0])
      };
    };
    return fixer.join('');
  } else if (args.length > 1) {
    return s.split(args[0]).join(args[1]);
  } else {
    return s.split(args[0]).join('');
  }
}

function inString(haystack, needle){
  if (haystack.includes(needle)) {
    return true;
  } else {
    return false;
  }
}


function switchClass(elt, class1, class2) {
  if (elt.classList.contains(class1)) {
    elt.classList.remove(class1);
    elt.classList.add(class2);
  }
}

function hasClass(elt, ...targets) {
  var match = false;
  var classes = elt.classList.toString();
  for (var i = 0; i < targets.length; i++) {
    if (inString(classes, targets[i])) {
      match = true;
    }
  }
  return match;
}

function containsMultiple(haystack, needle){
  if (haystack.split(needle).length > 2) {
    return true;
  } else {
    return false;
  }
}

// function hasFileExtension(str){
//   console.log(str.lastIndexOf('.'));
//   if (str.lastIndexOf('.') > 4) {
//     return false;
//   } else {
//     return true;
//   }
//
// }


function isBetween(a, b, c) {
  if ((a > b) && (a < c)) {
    return true;
  } else {
    return false;
  }
}


var contains = function (haystack, needle) {
    return !!~haystack.indexOf(needle);
};

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

// // can be used like so now:
// if (contains(items, 3452)) {
//     // do something else...
// }


// 1 param: automatic div tag, param is either id or classes (no solo class)
// createChild(preview, ['adobe adobe-btn']);

// 3 params: tag, id/classes, class
// createChild(preview, ['div', 'hello', 'fa fa-lg fa-magic']);
function createChild(parent, child) {
  var id = false;
  var classes = false;
  var tag = false;
  if (child.length < 2) {
    tag = 'div';
  } else {
    tag = child[0];
  }
  var container = parent.appendChild(document.createElement(tag))
  if (child.length > 1) {
    if (theseAreClasses(child[1])) {
      classes = child[1];
    } else {
      id = child[1];
    }
  }
  if (child.length > 3) {
    if (tag == 'input') {
      container.type = "text";
      container.name = id;
      container.value = child[3];
    } else if (tag == 'span') {
      container.textContent = child[3];
    }
    classes = child[2];
  } else if (child.length > 2) {
    id = child[1];
    classes = child[2];
  } else if (child.length > 1) {
    // console.log('Two params');
  } else if (child.length > 0) {
    if (theseAreClasses(child[0])) {
      classes = child[0];
    } else {
      id = child[0];
    }
  }
  if (classes) {
    container.setAttribute("class", classes);
  }
  if (id) {
    container.id = id;
  }
}

function theseAreClasses(target){
  if (inString(target, ' ')) {
    return true;
  } else {
    return false;
  }
}

function loadJavaScript(filename){
    var fileref=document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", "../log/" + filename + ".js")
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}
