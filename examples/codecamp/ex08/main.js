/* Initialise variables */
var _screenWidth = 800;
var _screenHeight = 600;

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

/* Load Assets */
Crafty.background('rgb(0,0,0)');

/*
  createStar is a handy little function that when called will place a newly created star
  on the screen. It does this by using Crafty to create an entity object with certain
  properties.
 */
function createStar() {
    var random_x = Math.floor((Math.random() * _screenWidth) + 50);
    var rock_size = Math.random() * 3;
    var R = Math.ceil(Math.random() * 255);
    var G = 128;
    var B = 128;
    Crafty.e('Drop, 2D, Canvas, Color, Solid, Gravity')
      .attr({x: random_x, y: 33, w: rock_size, h: rock_size })
      .color('rgb(' + R + ',' + G + ',' + B + ')')
      .gravity()
      .gravityConst(Math.random() * 0.03)
      .bind("EnterFrame", function() {
          if (this.y > _screenHeight) {
              this.destroy();
              return;
          }
      });
}

/*
 This little bit of code is vital. Without it we would not have so many stars being created
 during every animation cycle (ie. during each frame of animation)
 */
Crafty.bind("EnterFrame", function() {
    if (Crafty.frame() % 2 === 0) {
        createStar();
    }
});
