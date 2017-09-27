/* Spectrum is a project by Brian Grinstead at https://bgrins.github.io/spectrum/ */

/* given a string hex, converts hex to rgb, returns an array */
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

/* given a number in decimal format, the round function returns it with 2 digits after the decimal point */
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

/* given some rgb value, the getStandard function converts standard rgb to values ready for luminance calculation, returns number */
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

/* given a hex value, calculates relative luminance, returns a number */
function getLuminance(hex) {
  var rgb = hexToRgb(hex); // array

  var red = getStandard(rgb[0]);
	var green = getStandard(rgb[1]);
	var blue = getStandard(rgb[2]);

	return (0.2126*red)+(0.7152*green)+(0.0722*blue);
}

/* given hex values of color1 and color2, where color1 has higher luminance, color2 has lower,
    returns a number rounded to two decimal places */
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

/* given a contrast ratio, determines whether the ratio is passing according to ada web standards, returns a string */
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
          ["#3284bf", "#0054a6", "#00a5e5", "#20c4f4", "#347bad"],
          ["#ffc828", "	#ffe600", "#fff200"]
      ]
  });

  var headers = ["hex", "rgb", "sample", "background", "ratio", "pass"];
  var colors = ["#3284bf", "#ffc828", "#ffe600", "#0054a6", "#00a5e5", "#fff200", "#35b558", "#ec008c", "#20c4f4", "#6658a6", "#347bad"];

  // populate table with rows
  for (color in colors) {
    $('tbody').append(document.createElement('tr'));
    $('tbody > tr:not(:first-child)').addClass('row');
  }

  // add classes to rows
  $('.row').each( function(i) {
    // adding cells
    for(var i=0; i<headers.length; i++) {
      $(this).append(document.createElement('td'));
      $('td:last-child').addClass('cell').addClass(headers[i]);
    }

    // takes care of bug where last cell contains all headers as classes
    if ($('td:last-child').hasClass('hex rgb sample background ratio')) {
      $('td:last-child').removeClass("hex rgb sample background ratio");
    }

  });

  // populate with DATA!!
  $('.row').each( function(i) {
    $('.hex').each( function (i) {
      $(this).html("<p>" + colors[i] + "</p>");
    });

    $('.rgb').each( function (i) {
      $(this).html("<p>(" + hexToRgb(colors[i]) + ")</p>");
    });

    $('.sample').each( function (i) {
      $(this).css('background-color', colors[i]);
    });

    $('.background').each( function (i) {
      $(this).html("<p>TEST</p>");
      $(this).css('color', colors[i]);
    });

   });


  /* updateColor updates the color of background cell as user chooses a color, also updates contrast ratio and whether or not it's passing */
  function updateColor(color) {
    var hexColor = "transparent";
    if (color) {
      hexColor = color.toHexString();
    }
    $('.background').css('background-color', hexColor);

    $('.ratio').each( function (i) {
      $(this).html(contrastRatio(colors[i], hexColor));
    });

    $('.pass').each( function (i) {
      $(this).html(isPassing(contrastRatio(colors[i], hexColor)));
    });
  }

})
