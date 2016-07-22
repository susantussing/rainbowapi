var colorChanger = {};

colorChanger.hues = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];
colorChanger.delay = 5000;

colorChanger.getNextHue = function(){
  // Switch to the next hue in the list.
  this.hues.push(this.hues.shift());
  return this.hues[0];
};

colorChanger.doNext = function(color) {
  // Change to the next background.
  var result = this.thisResult;

  // Fade in the new background.
  $('.main').css('background-image','url('+result.imageUrl+')');
  $('.main').hide().fadeIn(500,"easeInQuad");
  
  // Set up the next background.
  window.setTimeout(function(){
    $('.container').css('background-image','url('+result.imageUrl+')');
    $('.main').hide();
    $('.main').css('background-image','url('+colorChanger.nextResult.imageUrl+')');
  },this.delay / 2);

  $('.title').text(result.title);
  $('.title').attr('href', result.url);
  $('.creator').text(result.userName + "'s ");
  $('.current-hue').text(this.lastHue || color);

  // Create the color palette.
  var colors = $.map(_.uniq(result.colors),function(val, i){
    var color = '#' + val;
    var light = '<p class="light">' + color + "</p>";
    var dark = '<p class="dark">' + color + "</p>";

    return $('<li>').css('background-color',color).html(light+dark);
  });
  $('.colors').html(colors);

  this.lastHue = color;
};

colorChanger.callAPI = function() {
  // Get a pattern from the ColourLovers.com API.
  // Pick a random number from 1-25, so we'll always get a top-25 result.
  var random = Math.floor((Math.random() * 25) + 1);
  var color = this.getNextHue();

  $.ajax('http://www.colourlovers.com/api/patterns?jsonCallback=callback',{
    data: {
      hueOption: color,
      numResults: '1',
      resultOffset: random,
      orderCol: 'score',
      sortBy: 'desc'
    },
    dataType: 'jsonp',
    type: 'GET',
    jsonp: false,
    jsonpCallback: 'callback',
    success: function(result){
      // On the first call, go ahead and set it; the first will be up twice as long but that's fine.
      colorChanger.thisResult = colorChanger.nextResult || result[0];
      colorChanger.nextResult = result[0];
      colorChanger.doNext(color);
    },
    error: function(XHR, textStatus, errorThrown) {
        console.log("error: " + textStatus);
        console.log("error: " + errorThrown);
    },
    timeout: 3000
  });
};


$(document).ready(function() {

  // Initial call to the API.
  colorChanger.callAPI();

  // Set up the automatic background shift.
  var cycle = window.setInterval(function(){
    colorChanger.callAPI();
  },colorChanger.delay);
  var cycling = true;
  $('.pause').addClass("fa-pause");
  $(document).on('click', '.circle', function(){
    if (cycling) {
      window.clearInterval(cycle);
      $('.pause').removeClass("fa-pause").addClass("fa-play");
      cycling = false;
    } else {
      cycle = window.setInterval(function(){
        colorChanger.callAPI();
      },colorChanger.delay);
      $('.pause').removeClass("fa-play").addClass("fa-pause");
      cycling = true;
    }
  });


});