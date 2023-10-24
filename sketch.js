let hat = [[0, 0], [0.5, 0.5], [1, 0]];
let box = [[0, 0], [0, 1], [1, 1], [1, 0]];
let resultConv = [];

let points1 = [];
let points2 = [];

let BSplineSignal = [];
let BSplineKernel = [];

// a dicionary to store conv resutlts regarding different counter values
let convResults = {};

let signalDegree = 1;
let kernelDegree = 1;
let conv = 0;

let selectedPoint1 = null;
let selectedPoint2 = null;

let signalSel, kernelSel;

let offsetX = 0;
let offsetY = 0;

let boxWidth = 500;
let boxHeight = 500;
let speed = 0;
let stride = 2;
let counter = -boxWidth;
let pointsChanged = false;

function setupPage() {
    background(255);

    strokeWeight(5);
    rect(0, 0+offsetY, boxWidth, boxHeight+offsetY);
    rect(boxWidth, 0+offsetY, boxWidth, boxHeight+offsetY);
    rect(0, boxHeight+offsetY, 2*boxWidth, boxHeight+offsetY);

    textSize(32);
    fill(0, 102, 153);
    strokeWeight(0);
    text('Signal: ' + signalDegree, 10, 30);
    text('Kernel: ' + kernelDegree, 10+boxWidth, 30);
    text('Convolution', 10, 30+boxHeight);
    noFill();

    drawCoords();
}


function drawCoords() {
    strokeWeight(1);
    stroke(0);
    // top left panel
    line(boxWidth/2, 0, boxWidth/2, boxHeight);
    line(0, boxHeight/2, boxWidth, boxHeight/2);

    // top right panel
    line(boxWidth*1.5, 0, boxWidth*1.5, boxHeight);
    line(boxWidth, boxHeight/2, boxWidth*2, boxHeight/2);

    // bottom panel
    line(0, boxHeight*1.5, boxWidth*2, boxHeight*1.5);
    line(boxWidth, boxHeight*1, boxWidth, boxHeight*2.5);
}


function drawPoints(points) {
    strokeWeight(15);
    stroke(0,0,250)
    for (let i = 0; i < points.length; i++) {
        point(points[i].x, points[i].y);
    }
    strokeWeight(5);
    stroke(0);
}

function loadCurve() {
    // let item = sel.value();
    // background(200);
    // text('It is a ' + item + '!', 50, 50);
}

function saveConv() {
    // sel.option('conv');
}


function setup() {
    let c = createCanvas(1100, 1000);

    let signalSel = createSelect();
    signalSel.position(10, 10);
    signalSel.option('box');
    signalSel.option('hat');
    signalSel.option('bspline');
    signalSel.selected('hat');
    signalSel.changed(loadCurve);
    // show the next drop down beneath the previous one

    let kernelSel = createSelect();
    kernelSel.position(boxWidth*2, 10);
    kernelSel.option('box');
    kernelSel.option('hat');
    kernelSel.option('bspline');
    kernelSel.selected('box');
    kernelSel.changed(loadCurve);

    // button to save the convolution result curve
    button = createButton('save');
    button.position(boxWidth*2, boxHeight*2.5);
    // set the triger function
    // button.mousePressed(saveConv(signalSel));

    p5bezier.initBezier(c);
    noFill();
}

function draw() {
    setupPage();

    drawPoints(points1);
    drawPoints(points2);
    

    // If a point is selected, move it with the mouse
    if (selectedPoint1) {
        selectedPoint1.x = mouseX - offsetX;
        selectedPoint1.y = mouseY - offsetY;
        pointsChanged = true;
    }

    // If a point is selected, move it with the mouse
    if (selectedPoint2) {
        selectedPoint2.x = mouseX - offsetX;
        selectedPoint2.y = mouseY - offsetY;
        pointsChanged = true;
    }

    // Draw the curve
    temp = [];
    for (let i = 0; i < points1.length; i++) {
        temp.push([points1[i].x, points1[i].y]);
    }
    if (temp.length > 2) {
        let curve1 = p5bezier.newBezierObj(temp);
        curve1.draw();
        shiftDrawPoints(points1, boxWidth/2, boxHeight);
        bottomSignal = curve1['vertexList'];
    }
    
    temp = [];
     
    for (let i = 0; i < points2.length; i++) {
        temp.push([points2[i].x, points2[i].y]);
    }
    if (temp.length > 2) {  
        let curve2 = p5bezier.newBezierObj(temp);
        curve2.draw();
        
        animateKernel(points2, counter);

        bottomKernel = curve2['vertexList'];
        // shift kernel to be centered at the bottom panel
        // bottomKernel = bottomKernel.map(x => [x[0]-boxWidth*1.5, x[1]+boxHeight]);

    }

    // shift signal to be centered at the bottom panel


    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        // perform convolution

        // console.log(bottomSignal[0] + " " + bottomKernel[0]);

        translatedSignal = bottomSignal.map(x => [x[0] - boxWidth/2, (x[1] - boxHeight*0.5)]);
        translatedKernel = bottomKernel.map(x => [x[0] - boxWidth*1.5, (x[1] - boxHeight*0.5)]);
        // calculate average x, y of translated signal and kernel
        signalAttrs = [0, 0];
        kernelAttrs = [0, 0];
        for (let i =0; i < 500; i++) {
            signalAttrs[0] += translatedSignal[i][0];
            signalAttrs[1] += translatedSignal[i][1];
            kernelAttrs[0] += translatedKernel[i][0];
            kernelAttrs[1] += translatedKernel[i][1];
        }
        signalAttrs[0] /= 500;
        kernelAttrs[0] /= 500;
        signalAttrs[1] /= 500;
        kernelAttrs[1] /= 500;

        
        if (keyCode === LEFT_ARROW && keyIsPressed) {
            conv = convolutionAtT(translatedSignal, translatedKernel, counter)*boxHeight*0.5;
            convResults[counter] = conv;
            speed = -stride;
            console.log(conv);
            console.log("counter " + counter);
            console.log(signalAttrs[0] + " " + signalAttrs[1]);
            console.log(kernelAttrs[0] + " " + kernelAttrs[1]);


        } else if (keyCode === RIGHT_ARROW && keyIsPressed) {
            conv = convolutionAtT(translatedSignal, translatedKernel, counter)*boxHeight*0.5;
            convResults[counter] = conv;
            speed = stride;
            console.log(conv);
            console.log("counter " + counter);
            console.log(signalAttrs[0] + " " + signalAttrs[1]);
            console.log(kernelAttrs[0] + " " + kernelAttrs[1]);

        } else {
            speed = 0;
        }
    }
    
    if ((keyCode === UP_ARROW || keyCode === DOWN_ARROW) && (mouseX > 0 && mouseX < boxWidth && mouseY > 0 && mouseY < boxHeight)) {
        if (keyCode === UP_ARROW && keyIsPressed) {
            signalDegree += 1;
        } else if (keyCode === DOWN_ARROW && keyIsPressed) {
            signalDegree -= 1;
        }
    }


    
    if (points1.length >= 3 && pointsChanged) {
        let temp = [];
        for (let i = 0; i < points1.length; i++) {
            temp.push([points1[i].x, points1[i].y]);
        }
        BSplineSignal = CalcBSpline(temp, signalDegree);
    }
    if (BSplineSignal.length > 1) {
        drawBSpline(BSplineSignal);
    }


    // draw convolution result
    strokeWeight(5);
    stroke(0,0,250);
    for (let i = -boxWidth; i < counter; i++) {
        line(i+boxWidth, -1*convResults[i]+boxHeight*1.5, i+boxWidth+1, -1*convResults[i+1]+boxHeight*1.5);
    }
    // point(counter+boxWidth, -1*convResults[counter]+boxHeight*1.5);
    strokeWeight(5);
    stroke(0);
    

    if (counter > boxWidth) {
        counter = boxWidth;
    }else if (counter < -boxWidth) {
        counter = -boxWidth;
    } else {
        counter += speed;
    }
    pointsChanged = false;
}


function realCoords(points, xShifted, yShifted){
    let result = [];
    for (let i = 0; i < points.length; i++) {
        result.push([points[i].x - xShifted, points[i].y - yShifted]);
    }
    return result;
}

function evaluateFunction(curve, x, adj=0.1) {
    // return estimated value of given curve at x
    let y = 0;
    count = 0;
    // only keep those points that are in neighborhood of x of 0.1
    let filtered = curve.filter((point) => { return Math.abs(point[0] - x) < adj; });
    // return average of y values of filtered points
    for (let i = 0; i < filtered.length; i++) {
        y += filtered[i][1];
        count++;
    }
    if (count == 0) {
        return 0;
    } else {
        return y/(boxWidth*count);
    }
}




function shiftDrawPoints(points, x, y) {
    strokeWeight(1);
    stroke(0,0,250)

    let temp = [];
    for (let i = 0; i < points.length; i++) {
        temp.push([points[i].x + x, points[i].y + y]);
    }
    if (temp.length > 1) {
        let curveObj = p5bezier.newBezierObj(temp);
        curveObj.draw();
    }

    strokeWeight(5);
    stroke(0);
}

function animateKernel(points, i) {
    strokeWeight(1);
    stroke(0,0,250)
    let temp = [];
    for (let j = 0; j < points.length; j++) {
        temp.push([points[j].x+i-boxWidth*0.5, points[j].y+boxHeight]);
    }
    if (temp.length > 1) {
        let curveObj = p5bezier.newBezierObj(temp);
        curveObj.draw();
    }
    strokeWeight(5);
    stroke(0);
}

function convolutionAtT(signal, kernel, t) {
    let result = 0;
    for (let i = -boxWidth; i < boxWidth; i++) {
        evalSig = evaluateFunction(signal, i, 0.5);
        evalKer = evaluateFunction(kernel, t-i, 0.5);
        // console.log(evalSig + " " + evalKer);
        // break;
        result +=  evalSig * evalKer;
    }
    return result;
}

function CalcBSpline(points, degree){
    let results = [];
    for (let t = 0; t < 1; t+=0.002) {
        results.push(BSplineInterpolate(t, degree, points));
    }
    return results;
}

function drawBSpline(points) {
    strokeWeight(5);
    stroke(0,250,0);
    for (let i = 0; i < points.length-1; i++) {
        line(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
    }
    strokeWeight(5);
    stroke(0);
}

function BSplineInterpolate(t, degree, points) {

    var i,j,s,l;              // function-scoped iteration variables
    var n = points.length;    // points count
    var d = points[0].length; // point dimensionality
    if (degree < 1) {
        console.log('degree must be at least 1 (linear)');
        signalDegree = 1;
    }
    if (degree > (n-1)){
        console.log('degree must be less than or equal to point count - 1');
        signalDegree = n-1;
    } 
  
    let weights = [];
    for(i=0; i<n; i++) {
        weights[i] = 1;
    }

    // build know vector for an interpolating curve (clamped)
    var knots = [];
    for (i=0; i<degree+1; i++) {
      knots[i] = 0;
    }
    for(i=degree+1; i<n; i++) {
        knots[i] = i - degree;
    }
    for(i=n; i<n+degree+1; i++) {
        knots[i] = n - degree;
    }

    var domain = [
      degree,
      knots.length-1 - degree
    ];
  

    // remap t to the domain where the spline is defined
    var low  = knots[domain[0]];
    var high = knots[domain[1]];
    t = t * (high - low) + low;

    if (t < low || t > high) {
        console.log('out of bounds');
    }

    // find s (the spline segment) for the [t] value provided
    for(s=domain[0]; s<domain[1]; s++) {
      if(t >= knots[s] && t <= knots[s+1]) {
        break;
      }
    }
  
    // convert points to homogeneous coordinates
    var v = [];
    for(i=0; i<n; i++) {
      v[i] = [];
      for(j=0; j<d; j++) {
        v[i][j] = points[i][j] * weights[i];
      }
      v[i][d] = weights[i];
    }
  
    // l (level) goes from 1 to the curve degree + 1
    var alpha;
    for(l=1; l<=degree+1; l++) {
      // build level l of the pyramid
      for(i=s; i>s-degree-1+l; i--) {
        alpha = (t - knots[i]) / (knots[i+degree+1-l] - knots[i]);
  
        // interpolate each component
        for(j=0; j<d+1; j++) {
          v[i][j] = (1 - alpha) * v[i-1][j] + alpha * v[i][j];
        }
      }
    }
    // convert back to cartesian and return
    var result = [];
    for(i=0; i<d; i++) {
      result[i] = v[s][i] / v[s][d];
    //   console.log(result[i]+"here");
    }
  
    return result;
  }
  


function mousePressed() {
    if (mouseX > 0 && mouseX < boxWidth && mouseY > 0 && mouseY < boxHeight){
        // Check if the mouse is over any point
        let check = 0;
        let minD = Infinity;
        for (let i = 0; i < points1.length; i++) {
            let d = dist(mouseX, mouseY, points1[i].x, points1[i].y);
            if (mouseButton === RIGHT) {
                if (d < 10) {
                    pointsChanged = true;
                    points1.splice(i, 1);
                    check = 1;
                    break;
                } else {
                    minD = min(minD, d);
                }
            } else if (d < 10 && mouseButton === LEFT) {
                if (d < 10) {
                    selectedPoint1 = points1[i];
                    offsetX = mouseX - selectedPoint1.x;
                    offsetY = mouseY - selectedPoint1.y;
                    break;
                }
                
            }
        }

        // If the mouse is not over any existing point, add a new point
        if (!selectedPoint1 && check == 0) {
            points1.push(createVector(mouseX, mouseY));
            pointsChanged = true;
        }

        if (mouseButton === RIGHT && check == 0 && minD > 10) {
            pointsChanged = true;
            points1 = [];
            BSplineSignal = [];
            convResults = {};
        }

    } else if (mouseX > boxWidth && mouseX < 1000 && mouseY > 0 && mouseY < boxHeight) {
        // Check if the mouse is over any point
        let check = 0;
        let minD = Infinity;
        for (let i = 0; i < points2.length; i++) {
            let d = dist(mouseX, mouseY, points2[i].x, points2[i].y);
            if (mouseButton === RIGHT) {
                if (d < 10) {
                    pointsChanged = true;
                    
                    points2.splice(i, 1);
                    check = 1;
                    break;
                } else {
                    minD = min(minD, d);
                }
            } else if (d < 10 && mouseButton === LEFT) {
                if (d < 10) {
                    selectedPoint1 = points2[i];
                    offsetX = mouseX - selectedPoint1.x;
                    offsetY = mouseY - selectedPoint1.y;
                    break;
                }
                
            }
        }

        // If the mouse is not over any existing point, add a new point
        if (!selectedPoint1 && check == 0) {
            points2.push(createVector(mouseX, mouseY));
            pointsChanged = true;
        }

        if (mouseButton === RIGHT && check == 0 && minD > 10) {
            points2 = [];
            pointsChanged = true;
            BSplineKernel = [];
            convResults = {};
        }
    }

}

function mouseReleased() {
    // Deselect the point when the mouse is released
    selectedPoint1 = null;
    selectedPoint2 = null;
}
