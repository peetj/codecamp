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
/* Load explosion image */
var explosionSprite_1 = {"sprites": {"img/explosion_0.png": {tile: 196, tileh: 190, map: {explosion_start: [0, 0], explosion_end: [12, 0] } } } };
/* Load Bomb explosion */
var enemyExplosionSprite = {"sprites": {"img/explosionEnemy.png": {tile: 46, tileh: 40, map: {enemyExplosion_start: [0, 0], enemtExplosion_end: [0, 4] } } } };

/* Load sounds */
Crafty.audio.add("ship-spawn", "sounds/powerup.wav");
Crafty.audio.add("ship-shoot", "sounds/shoot.wav");
Crafty.audio.add("explosion-1", "sounds/enemy-explosion.wav");
Crafty.audio.add("enemy-explosion", "sounds/enemyExplode.wav");

/* Initialise Game Engine */
Crafty.init(_screenWidth, _screenHeight, document.getElementById('gamecanvas'));

/* Load Assets */
Crafty.background('rgb(0,0,0)');
Crafty.load(shipSpriteImages, spawnShip);
Crafty.load(enemySpriteImages, spawnEnemies);
Crafty.load(explosionSprite_1, function(){console.log('Loaded enemy explosion...');});
Crafty.load(enemyExplosionSprite, function(){console.log('Loaded bomb explosion...');});

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

    if (Crafty.frame() % 25 === 0) {
      var willShoot = decideIfWeWillShoot();
      if(willShoot){
        var enemyToShoot = enemies[Math.ceil(Math.random() * 10) - 1];
        if(enemyToShoot.id !== -1)
          dropBullet(enemyToShoot.x + (direction === 1 ? 10 : -3), enemyToShoot.y + 10);
      }
      /* Move enemies along unless at either end */
      /* Find the first and last non-dead enemy */
      var firstEnemy, lastEnemy;
      for(var j=0; j < enemies.length; j++){
        if(enemies[j].id !== -1){
          firstEnemy = enemies[j];
          break;
        }
        else{
          continue;
        }
      }
      for (var k = enemies.length - 1; k >= 0; k--) {
        if(enemies[k].id !== -1){
          lastEnemy = enemies[k];
          break;
        }
        else{
          continue;
        }
      };

      if(!firstEnemy && !lastEnemy)
        return;

      if((firstEnemy.x < 100 || lastEnemy.x > 640) && !changedDirection) {
        axis ='y';
      }
      else{
        axis='x';
        changedDirection = false;
      }

      /* Loop through enemies and move them one by one */
      for(var i=0; i < enemies.length; i++){
        axis === 'y' ? enemies[i].y += 20 : enemies[i].x += (20 * direction);
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
                    .bind("explode", function(){
                      this.destroy();
                    });

                  /* Play bullet sound */
                  Crafty.audio.play("ship-shoot");
              }
          }
      )
      .bind("explode",
          function() {
              var that=this;
              this.destroy();
              Crafty.e('2D, Canvas, explosion_start, SpriteAnimation, Collision')
                .attr({x: this.x-55, y: this.y-75 })
                .reel("shipExplode", 750, [[0, 0],[1, 0],[2, 0],[3, 0],[4, 0],[5, 0],[6, 0],[7, 0],[8, 0],[9, 0],[10, 0],[11, 0],[12, 0]])
                .animate("shipExplode");

              /* Play explosion */
              Crafty.audio.play('explosion-1');
              //window.setTimeout(handleShipDied, 500);
          }
      )
      .onHit('EnemyBullet', function(o) {
          for (var i = 0; i < o.length; i++) {
            var obj = o[i];
            if(obj.overlap < -20){
              o[i].obj.trigger("explode");
              this.trigger("explode");
            }
          }
      });

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
  .animate("moveEnemy", -1)
  .bind("explode", function() {
      this.id = -1;
      this.destroy();
      Crafty.audio.play("enemy-explosion");
      Crafty.e('2D, Canvas, enemyExplosion_start, SpriteAnimation, Collision')
        .attr({x: this.x-5, y: this.y-5 })
        .reel("bombExplode", 500, [[0, 0],[0, 1],[0, 2],[0, 3], [0, 4]])
        .animate("bombExplode");
  })
  .onHit('Bullet', function(o) {
      for (var i = 0; i < o.length; i++) {
          o[i].obj.trigger("explode");
      }
      this.trigger("explode");
  });

  /* Add the enemy to the list of enemies */
  enemies.push(enemy);
  enemy.id = enemies.length;
}

function dropBullet(x1, y1){
  Crafty.e('EnemyBullet, 2D, Canvas, Collision, Color, Solid, Tween')
    .attr({x: x1 + 15, y: y1 + 30, w: 4, h: 8 })
    .color("#FF2233")
    .tween({y: 620 }, 1500)
    .bind("explode", function(e){
      this.destroy();
    });
}
