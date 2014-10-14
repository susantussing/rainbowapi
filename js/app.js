var colorChanger = {};

colorChanger.hues = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];
colorChanger.currentHue = 0;
colorChanger.delay = 4000;

colorChanger.getNextHue = function(){
  // Figure out what color we're on.
  this.currentHue++;
  if (this.currentHue >= this.hues.length) {
    this.currentHue = 0;
  }
  return this.currentHue;
};

colorChanger.doNext = function() {
  // Change to the next background.
  var result = this.thisResult;
  $('.main').css('background-image','url('+result.imageUrl+'),url('+this.nextResult.imageUrl+')');
  $('.title').text(result.title);
  $('.title').attr('href', result.url);
  $('.creator').text(result.userName + "'s ");
  var colors = $.map(_.uniq(result.colors),function(val, i){
    var color = '#' + val;
    var light = '<p class="light">' + color + "</p>";
    var dark = '<p class="dark">' + color + "</p>";

    return $('<li>').css('background-color',color).html(light+dark);
  });
  $('.colors').html(colors);
  // this.isMain ^= true;
};

colorChanger.getBackground = function(color) {
  // Get a pattern from the ColourLovers.com API.
  var random = Math.floor((Math.random() * 25) + 1);
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
      colorChanger.doNext();
    },
    error: function(XHR, textStatus, errorThrown) {
        console.log(  "error: " + textStatus);
        console.log("error: " + errorThrown);
    },
    timeout: 3000
  });
};


$(document).ready(function() {
  // Initial call to the API.
  colorChanger.getBackground(colorChanger.hues[0]);

  // Set up the automatic background shift.
  var cycle = window.setInterval(function(){
    colorChanger.getBackground(colorChanger.hues[colorChanger.getNextHue()]);
  },colorChanger.delay);
  var cycling = true;
  $('.pause').addClass("fa-play");
  $(document).on('click', '.circle', function(){
    if (cycling) {
      window.clearInterval(cycle);
      $('.pause').removeClass("fa-play").addClass("fa-pause");
      cycling = false;
    } else {
      cycle = window.setInterval(function(){
        colorChanger.getBackground(colorChanger.hues[colorChanger.getNextHue()]);
      },colorChanger.delay);
      $('.pause').removeClass("fa-pause").addClass("fa-play");
      cycling = true;
    }
  });
});