// html

// <!-- <div class="adobe-toolbar-sp">
//   <div id="NW" class="adobe adobe-btn-sp"><span class="icon-NW"></span></div>
//   <div id="N" class="adobe adobe-btn-sp"><span class="icon-N"></span></div>
//   <div id="NE" class="adobe adobe-btn-sp"><span class="icon-NE"></span></div>
// </div>
// <div class="adobe-toolbar-sp">
//   <div id="W" class="adobe adobe-btn-sp"><span class="icon-W"></span></div>
//   <div id="Center" class="adobe adobe-btn-sp"><span class="icon-Center"></span></div>
//   <div id="E" class="adobe adobe-btn-sp"><span class="icon-E"></span></div>
// </div>
// <div class="adobe-toolbar-sp">
//   <div id="SW" class="adobe adobe-btn-sp"><span class="icon-SW"></span></div>
//   <div id="S" class="adobe adobe-btn-sp"><span class="icon-S"></span></div>
//   <div id="SE" class="adobe adobe-btn-sp"><span class="icon-SE"></span></div>
// </div> -->
//
//
// <!-- <div class="animContainer">
//   <div id="bMovin"></div>
// </div> -->





// // Vanilla
// var httpRequest = new XMLHttpRequest()
// httpRequest.onreadystatechange = function (data) {
//   var svg = $(xmlDoc).find("svg");
//   container.append(svg);
//   // code
// }
// httpRequest.open('GET', url)
// httpRequest.send()
//
//
// $.get(svgUrl)
//   .then(injectSvg)
//   // .always(startAnimation);
//
// function injectSvg(xmlDoc) {
//
//   var svg = $(xmlDoc).find("svg");
//   container.append(svg);
// }


// console.log(controls);
// console.log(bBox.style);


// function svgloaded() {
//   console.log("test");
// 	var svgEmbed = document.querySelector("#svgembed");
// 	var svg = svgEmbed.getSVGDocument();
//   // for (var d in controls) {
//   //   controls[d] = svg.getElementById(controls[d]);
//   // }
//   var testNode = svg.getElementById('N');
//   testNode.style.fill = "red";
//   console.log(controls);
// }
//
// document.addEventListener("DOMContentLoaded", function(){
// 	var svgEmbed = document.querySelector("#svgembed");
// 	svgEmbed.addEventListener("load", svgloaded);
// },false);

// var ajax = new XMLHttpRequest();
// ajax.open("GET", "FullPad.svg", true);
// ajax.send();
// ajax.onload = function(e) {
//   var pad = document.getElementById('placeHolder');
//   pad.innerHTML = ajax.responseText;
// }


// buildBodyMovin();
// function buildBodyMovin() {
// 	var bMovin = document.getElementById('bMovin');
// 	var animData = {
// 			wrapper: bMovin,
// 			animType: 'svg',
// 			loop: false,
// 			prerender: true,
// 			autoplay: true,
// 			path: './data.json'
// 	};
// 	var anim = bodymovin.loadAnimation(animData);
// }
//
// var nCenter = document.getElementById('center');
// nCenter.addEventListener("mouseover", function(e){
//   console.log(e);
// }, false)

  // document.querySelectorAll(".fillNode").forEach(function(e){
	// 	e.style.fill = '#' + ;
	// 	e.style.stroke = '#' + ;
	// });



// var SAbtn = [].slice.call(document.getElementsByClassName('adobe-btn-sp'));
// SAbtn.forEach(function(v,i,a) {
//   v.addEventListener("click", function(e){
//     var classN, target;
//     if (e.target.classList.contains('adobe')) {
//       classN = e.target.classList;
//       target = e.target;
//     } else {
//       classN = e.target.parentNode.classList;
//       target = e.target.parentNode;
//     }
//     action = toggle.direction + target.id;
//     csInterface.evalScript(`app.doScript('${action}', 'SmartAlign');`)
//     console.log(`Action to trigger: ${action}`);
//   }, false)
// });
