/*
TODO:
 - access currentColor outside of function
 - create contrast ratio function
*/

// given string hex, converts hex to rgb, returns a string
function hexToRgb(hex) {
    while (hex.charAt(0)=='#') {
      hex = hex.substr(1);
    }

    // parses string, returns integer in base 16
    var bigint = parseInt(hex, 16);

    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return "(" + r + "," + g + "," + b + ")";
}


/********************* for spectrum *******************/
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

function updateColor(color) {
  var hexColor = "transparent";
  if (color) {
    hexColor = color.toHexString();
  }
  $('.background').css('background-color', hexColor);
}
/*****************************************************/

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

  $("#picker").on('move.spectrum', function(e, tinycolor) {

  });

  $('.row > .hex').each( function ( i, el) {
	  $(this).find('p').html($(this).parent('.row').attr('data-rowcolor'));
	 });
  $('.row > .rgb').each( function (i, el) {
    $(this).find('p').html(hexToRgb($(this).parent('.row').attr('data-rowcolor')));
  });
	$('.row > .sample').each( function ( i, el) {
		$(this).css('background-color', $(this).parent('.row').attr('data-rowcolor'));
	});
  $('.row > .background').each( function ( i, el) {
    $(this).find('p').html("TEST");
    $(this).css('color', $(this).parent('.row').attr('data-rowcolor'));
  });
  $('.row > .light').each( function ( i, el) {
	  $(this).css('color', $(this).parent('.row').attr('data-rowcolor'));
	  });
})
