/*
  We are going to create an Object in javascript below. An object is simply
  a thing that does stuff! It usually has properties and methods (a method is
  basically a function - we generally use the term 'method' when talking about
  objects).

  For example a car is an object. It has properties like colour and weight and maxSpeed.
  It also can do 'stuff' like start, drive, brake, turn, reverse.

  The object we are creating below is a Calculator object. We will just write a single
  function/method for our Calculator. Not very useful but good if you just like to add up!
*/

/*
  In Javascript, an object is created with squiggly braces. In the code below, we
  will create an object variable called 'Calculator'.
*/
var Calculator = {};

/*
  At this point Calculator can do absolutely nothing!
  So let's give it the ability to add two numbers together
 */

Calculator.add = function(firstNumber, secondNumber){
  return firstNumber + secondNumber;
};

/*
  How could we change the 'add' function above so that it could add
  3 numbers together ?

  Let's talk about the 'return' keyword. It is very important!
 */

/* Lets see if we can call the 'add' method on the Calculator*/
var answer = Calculator.add(2,2);

/* Now let's print out the answer to the screen */
//console.log(answer);



/*
  Now, try and add a subtract method above.
*/
