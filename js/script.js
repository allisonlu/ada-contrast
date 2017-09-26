/*
TODO:
 - access currentColor outside of function
 - create contrast ratio function
*/

// given a string hex, converts hex to rgb, returns an array
function hexToRgb(hex) {
    while (hex.charAt(0)=='#') {
      hex = hex.substr(1);
    }

    // parses string, returns integer in base 16
    var bigint = parseInt(hex, 16);

    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r,g,b];
}

// rounding a decimal 2 places
function round(decimal) {
  return parseFloat(Math.round(decimal * 100) / 100).toFixed(2);
}

/********************* for spectrum.js *******************/
function deselect(e) {
  $('.popup').slideFadeToggle(function() {
    e.removeClass('selected');
  });
}

$(function() {
  $('.clickity').on('click', function() {
    if($(this).hasClass('selected')) {
      deselect($(this));
    } else {
      $(this).addClass('selected');
      $('.popup').slideFadeToggle();
    }
    return false;
  });

  $('.close').on('click', function() {
    deselect($('.clickity'));
    return false;
  });
});

$.fn.slideFadeToggle = function(easing, callback) {
  return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};

/*****************************************************/

// given some rgb value, converts standard rgb to values ready for luminance calculation
function getStandard(val) {
	var standard = val/255;

	if (standard <= 0.03928) {
		standard = standard/12.92;
	}
	else {
		standard = Math.pow(((standard+0.055)/1.055), 2.4);
	}

	return standard;
}

// given a hex value, calculates relative luminance, returns a number
function getLuminance(hex) {
  var rgb = hexToRgb(hex); // array

  var red = getStandard(rgb[0]);
	var green = getStandard(rgb[1]);
	var blue = getStandard(rgb[2]);

	return (0.2126*red)+(0.7152*green)+(0.0722*blue);
}

/* given hex values of color1 and color2, where color1 has higher luminance, color2 has lower
    returns number */
function contrastRatio(color1, color2) {
	var ratio;
	luminance1 = getLuminance(color1);
	luminance2 = getLuminance(color2);

	if (luminance1>luminance2) {
		ratio = (luminance1+0.05)/(luminance2+0.05);
	}
	else {
		ratio = (luminance2+0.05)/(luminance1+0.05);
	}

	return round(ratio);
}

function isPassing(ratio) {
  if (ratio >= 7.99) {
    return "Passing - Level AAA";
  }
  else if (ratio >= 4.5) {
    return "Passing - Level AA";
  }
  else {
    return "Failing";
  }
}

// console.log(contrastRatio("#3284bf", "#fff"));
// console.log(isPassing(contrastRatio("#3284bf", "#fff")));


// var colors = [{
//     "Hex": "#3284bf",
//     "RGB": "",
//     "Sample": "",
//     "Background": "",
//     "Contrast Ratio": "",
//     "P/NP": ""
//   }, {
//     "Hex": "#ffc828",
//     "RGB": "",
//     "Sample": "",
//     "Background": "",
//     "Contrast Ratio": "",
//     "P/NP": ""
//   }];
//
// function makeTable(data) {
//   // extract header data
//   var col = [];
//   for (var i=0; i<data.length; i++) {
//     for (var key in data[i]) {
//       // prevents duplicates
//       if (col.indexOf(key)===-1) {
//         col.push(key);
//       }
//     }
//   }
//
//   // create table
//   var table = document.createElement("table");
//   var tableBody = document.createElement("tbody");
//   table.appendChild(tableBody);
//   var tr = document.createElement('tr');
//   tableBody.appendChild(tr);
//
//   // populate header
//   for (var i=0; i<col.length; i++) {
//     var th = document.createElement("th");
//     th.appendChild(document.createTextNode(col[i]));
//     tr.appendChild(th);
//   }
//
//   // add data
//   for (var i=0; i<data.length; i++) {
//     var tr = document.createElement("tr");
//
//     for (var j=0; j<col.length; j++) {
//       var td = document.createElement("td");
//       td.appendChild(document.createTextNode(data[i][col[j]]));
//       tr.appendChild(td);
//     }
//     tableBody.appendChild(tr);
//   }
//
//   // add data to html
//   var container = document.getElementById("showData");
//   container.innerHTML = "";
//   container.appendChild(table);
//
// }
//
// makeTable(colors);


$(document).ready(function() {

  $("#picker").spectrum({
      color: "#f00",
      move: updateColor,
      showPaletteOnly: true,
      hideAfterPaletteSelect: true,
      preferredFormat: "hex",
      showInput: true,
      togglePaletteOnly: true,
      togglePaletteMoreText: 'more',
      togglePaletteLessText: 'less',
      palette: [
          ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
          ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
          ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
          ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
          ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
          ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
          ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
          ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
      ]
  });

  // $("#picker").on('move.spectrum', function(e, tinycolor) {
  //
  // });

  var classNames = ["hex", "rgb", "sample", "background", "ratio", "pass"];

  // populate table
  $('.row').each( function(i,el) {
    $(this).append(document.createElement('td'));

  });


  function updateColor(color) {
    var hexColor = "transparent";
    if (color) {
      hexColor = color.toHexString();
    }
    $('.background').css('background-color', hexColor);

    $('.row > .ratio').each( function ( i, el) {
      $(this).find('p').html(contrastRatio($(this).parent('.row').attr('data-rowcolor'), hexColor));
    });
    $('.row > .pass').each( function ( i, el) {
      $(this).find('p').html(isPassing(contrastRatio($(this).parent('.row').attr('data-rowcolor'), hexColor)));
    });
  }

  // $('.row > .hex').each( function ( i, el) {
	//   $(this).find('p').html($(this).parent('.row').attr('data-rowcolor'));
	//  });
  // $('.row > .rgb').each( function (i, el) {
  //   $(this).find('p').html('(' + hexToRgb($(this).parent('.row').attr('data-rowcolor')) + ')');
  // });
	// $('.row > .sample').each( function ( i, el) {
	// 	$(this).css('background-color', $(this).parent('.row').attr('data-rowcolor'));
	// });
  // $('.row > .background').each( function ( i, el) {
  //   $(this).find('p').html("TEST");
  //   $(this).css('color', $(this).parent('.row').attr('data-rowcolor'));
  // });



})
