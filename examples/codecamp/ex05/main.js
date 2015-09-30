/*
  So we've learnt about variables, functions objects, properties, methods....

  You guys are now experts! Ok maybe not but really... in the world of programming
  these are the main concepts so you are well on the way to becoming software developers...
  that is if you want to be!

  Later on we are going to create a 2D shoot-em-up game, so for now let's see what
  a spaceship object might look like in javascript.
*/

/* Create my player object */
var spaceShip = {};

/* Give my ship some properties */
spaceShip.color = 'rgb(0, 255, 0)';
spaceShip.speed = 5; // Where 1 = slow and 10 = fast
spaceShip.image = 'ship.png';

/* Now, give my ship some things it can do - ie. some methods */

/*Shoot a bullet*/
spaceShip.shoot = function(){
  console.log('Shoot a bullet...!');
};

/* Move left */
spaceShip.moveLeft = function(){
  console.log('Moving left...!');
}

/* Move right */
spaceShip.moveRight = function(){
  console.log('Moving right...!');
}

/* Now do some stuff with the gunship */
//spaceShip.shoot();
//spaceShip.moveLeft();
//spaceShip.moveRight();




