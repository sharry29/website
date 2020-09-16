// // Create a Paper.js Path to draw a line into it:

// const { view } = require("paper");

var originals = new Group({});

var sWidth = 0;

var first = new Path.Circle({
  center: view.center,
  radius: Math.min(view.size.height, view.size.width) * 0.25,
  parent: originals,
  fillColor: "#fff7e3",
  strokeColor: "black",
  strokeWidth: sWidth,
});

var second = new Path.Circle({
  center: view.center + [50, 50],
  radius: Math.min(view.size.height, view.size.width) * 0.2,
  parent: originals,
  fillColor: "#fff7e3",
  strokeColor: "black",
  strokeWidth: sWidth,
});

var third = new Path.Circle({
  center: view.center - [50, 50],
  radius: Math.min(view.size.height, view.size.width) * 0.3,
  parent: originals,
  fillColor: "#fff7e3",
  strokeColor: "black",
  strokeWidth: sWidth,
});

var vel = 3;
var firstDir = new Point(Math.random() - 0.5, Math.random() - 0.5).normalize(
  vel - 1
);
var secondDir = new Point(Math.random() - 0.5, Math.random() - 0.5).normalize(
  vel - 2
);
var thirdDir = new Point(Math.random() - 0.5, Math.random() - 0.5).normalize(
  vel
);
var balls = [first, second, third];
var dirs = [firstDir, secondDir, thirdDir];
var redResult, blueResult, orangeResult;
var results = [redResult, blueResult, orangeResult];

console.log(balls[0]);

function onFrame() {
  for (var i = 0; i < 3; i++) {
    var item = balls[i];
    if (item.bounds.left <= 0 || item.bounds.right >= view.size.width) {
      dirs[i].x *= -1;
    }
    if (item.bounds.top <= 0 || item.bounds.bottom >= view.size.height) {
      dirs[i].y *= -1;
    }
  }

  third.position += thirdDir;
  second.position += secondDir;
  first.position += firstDir;

  if (redResult) redResult.remove();
  if (blueResult) blueResult.remove();
  if (orangeResult) orangeResult.remove();

  redResult = first.intersect(second);
  blueResult = second.intersect(third);
  orangeResult = third.intersect(first);

  redResult.fillColor = "#db2822";
  orangeResult.fillColor = "#ff7f0e";
  blueResult.fillColor = "#1f77b4";
}
