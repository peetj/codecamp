/* Initialise variables */
var _screenWidth = 800;
var _screenHeight = 600;

var enemies = [];
var changedDirection = false;
var direction = 1;
var axis = 'x';

/* Create assets */
var shipSpriteImages = {"sprites": {"img/ship.png": {tile: 72, tileh: 72, map: {ship_start: [0, 0], ship_end: [3, 0]}}}};
var enemySpriteImages = {"sprites": {"img/invader.png": {tile: 40, tileh: 40, map: {enemy_start: [0, 0], enemy_end: [6, 0]}}}};

/* Load sounds */
Crafty.audio.add("ship-spawn", "sounds/powerup.wav");
Crafty.audio.add("ship-shoot", "sounds/shoot.wav");

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

/* Load Assets */
Crafty.background('rgb(0,0,0)');
Crafty.load(shipSpriteImages, spawnShip);
Crafty.load(enemySpriteImages, spawnEnemies);

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

    if (Crafty.frame() % 50 === 0) {
      var willShoot = decideIfWeWillShoot();
      if(willShoot){
        var enemyToShoot = enemies[Math.ceil(Math.random() * 10) - 1];
        dropBullet(enemyToShoot.x + (direction === 1 ? 10 : -3), enemyToShoot.y + 10);
      }
      /* Move enemies along unless at either end */
      if((enemies[0].x < 100 || enemies[9].x > 640) && !changedDirection) {
        axis ='y';
      }
      else{
        axis='x';
        changedDirection = false;
      }

      /* Loop through enemies and move them one by one */
      for(var i=0; i < enemies.length; i++){
        axis === 'y' ? enemies[i].y += 10 : enemies[i].x += (10 * direction);
      }

      /* Change direction if we are at the start of end of the line */
      if(axis === 'y'){
        direction = direction * -1;
        changedDirection = true;
      }
    }
});

function decideIfWeWillShoot(){
  var testNum = Math.ceil(Math.random() * 100);
  //return isPrime(testNum);
  return testNum % 2 === 0 || testNum % 3 === 0;
}

function isPrime(value) {
    for(var i = 2; i < value; i++) {
        if(value % i === 0) {
            return false;
        }
    }
    return value > 1;
}

/*
  So this function creates the ship for us. Again, we create a Crafty entity with a bunch
  of components including SpriteAnimation
 */
function spawnShip() {
    var ship = Crafty.e('2D, Canvas, ship_start, SpriteAnimation, Multiway, Collision, Solid')
      .attr({x: 364, y: 525 })
      .reel("thrust", 500, [[0, 0], [1, 0], [2, 0], [3, 0]])
      .animate("thrust", -1)
      .multiway(3, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180 })
      .bind("KeyDown",
          function(e) {
              if (e.key == Crafty.keys["SPACE"]) {
                  var bulletX = this.x + 34.5;
                  var bulletY = this.y + 5;
                  Crafty.e("Bullet, 2D, Canvas, Color, Collision, Tween")
                    .attr({x: bulletX, y: bulletY, w: 4, h: 8 })
                    .color("#00FEEE")
                    .tween({y: -20 }, 750)

                  /* Play bullet sound */
                  Crafty.audio.play("ship-shoot");
              }
          }
      );

      /* Once the ship is created and on screen, make the sound! */
      Crafty.audio.play('ship-spawn',1,1);
}

function spawnEnemies(){
  var spaceBetweenEnemies = 5;
  for(var i=0; i < 10; i++){
    spawnEnemy(i * 50) + spaceBetweenEnemies;
  }
}

function spawnEnemy(offset) {
  var direction = 1;
  var enemy = Crafty.e('2D, Canvas, enemy_start, SpriteAnimation, Multiway, Collision')
  .attr({x: 100 + offset , y: 64 })
  .reel("moveEnemy", 2000, [[0, 0],[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0] ])
  .animate("moveEnemy", -1);

  /* Add the enemy to the list of enemies */
  enemies.push(enemy);
}

function dropBullet(x1, y1){
  Crafty.e('EnemyBullet, 2D, Canvas, Collision, Color, Solid, Tween')
    .attr({x: x1 + 15, y: y1 + 30, w: 4, h: 8 })
    .color("#FF2233")
    .tween({y: 620 }, 1500);
}
