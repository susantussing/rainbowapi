var colorChanger = {};

colorChanger.hues = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];
colorChanger.currentHue = 0;
colorChanger.delay = 8000;

colorChanger.getNextHue = function(){
  // Switch to the next hue in the list.
  this.hues.push(this.hues.shift());
  return this.hues[0];
};

colorChanger.doNext = function() {
  // Change to the next background.
  var result = this.thisResult;

  // Fade in the new background.
  $('.main').css('background-image','url('+result.imageUrl+')');
  $('.main').fadeIn('slow');
  
  // Set up the next background.
  window.setTimeout(function(){
    $('body').css('background-image','url('+result.imageUrl+')');
    $('.main').hide();
    $('.main').css('background-image','url('+this.nextResult.imageUrl+')');
  },this.delay / 2);

  $('.title').text(result.title);
  $('.title').attr('href', result.url);
  $('.creator').text(result.userName + "'s ");
  $('.current-hue').text(this.hues[0]);

  // Create the color palette.
  var colors = $.map(_.uniq(result.colors),function(val, i){
    var color = '#' + val;
    var light = '<p class="light">' + color + "</p>";
    var dark = '<p class="dark">' + color + "</p>";

    return $('<li>').css('background-color',color).html(light+dark);
  });
  $('.colors').html(colors);
  // this.isMain ^= true;
};

colorChanger.callAPI = function(color) {
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
        console.log("error: " + textStatus);
        console.log("error: " + errorThrown);
    },
    timeout: 3000
  });
};


$(document).ready(function() {
  // Initial call to the API.
  colorChanger.callAPI(colorChanger.getNextHue());

  // Set up the automatic background shift.
  var cycle = window.setInterval(function(){
    colorChanger.callAPI(colorChanger.getNextHue());
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
        colorChanger.callAPI(colorChanger.getNextHue());
      },colorChanger.delay);
      $('.pause').removeClass("fa-pause").addClass("fa-play");
      cycling = true;
    }
  });
});