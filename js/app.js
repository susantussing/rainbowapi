var colorChanger = {};

colorChanger.hues = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];
colorChanger.current = 0;
colorChanger.isMain = true;

colorChanger.bottomLayer = function(){
  if (this.isMain) {
    return ".alternate";
  } else {
    return ".main";
  }
};

colorChanger.getNext = function(){
  this.current++;
  if (this.current >= this.hues.length) {
    this.current = 0;
  }
  return this.current;
};

colorChanger.setBackground = function(result) {
  $('.main').toggleClass('show');
  $('.alternate').toggleClass('show');
  // $('.pause').css('color', this.hues[this.current]);
  $(colorChanger.bottomLayer()).css('background-image','url('+result.imageUrl+')');
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
  this.isMain ^= true;
};

colorChanger.getBackground = function(color) {
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
      colorChanger.setBackground(result[0]);
    },
    error: function(XHR, textStatus, errorThrown) {
        console.log(  "error: " + textStatus);
        console.log("error: " + errorThrown);
    },
    timeout: 3000
  });
};


$(document).ready(function() {
  colorChanger.getBackground(colorChanger.hues[0]);
  var cycle = window.setInterval(function(){
    colorChanger.getBackground(colorChanger.hues[colorChanger.getNext()]);
  },8000);
  var cycling = true;
  $('.pause').addClass("fa-play");
  $(document).on('click', '.circle', function(){
    if (cycling) {
      window.clearInterval(cycle);
      $('.pause').removeClass("fa-play").addClass("fa-pause");
      cycling = false;
    } else {
      cycle = window.setInterval(function(){
        colorChanger.getBackground(colorChanger.hues[colorChanger.getNext()]);
      },10000);
      $('.pause').removeClass("fa-pause").addClass("fa-play");
      cycling = true;
    }
  });
});