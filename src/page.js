
function setupPage() {
    background(255);

    strokeWeight(5);
    line(0, boxHeight, 2*boxWidth, boxHeight);
    line(boxWidth, 0, boxWidth, 2*boxHeight);
    line(0, 0, 0, 2*boxHeight);
    line(2*boxWidth, 0, 2*boxWidth, 2*boxHeight);
    line(0, 0, 2*boxWidth, 0);
    line(0, 2*boxHeight, 2*boxWidth, 2*boxHeight);

    textSize(25);
    fill(0, 102, 153);
    strokeWeight(0);
    text('Signal: ' + signalDegree, 10, 30);
    text('Kernel: ' + kernelDegree, 10+boxWidth, 30);
    text('Convolution', 10, 30+boxHeight);
    
    textSize(20);
    // signal view
    text('2', 10+boxWidth/2, 30);
    text('-2', 10+boxWidth/2, boxHeight-10);
    text('2', boxWidth-30, boxHeight/2-10);
    text('-2', 10, boxHeight/2-10);

    // kernel view
    text('2', 10+3*boxWidth/2, 30);
    text('-2', 10+3*boxWidth/2, boxHeight-10);
    text('2', 2*boxWidth-30, boxHeight/2-10);
    text('-2', 10+boxWidth, boxHeight/2-10);

    // convolution view
    text('2', 10+boxWidth, 30+boxHeight);
    text('-2', 10+boxWidth, 2*boxHeight-10);
    text('3', 2*boxWidth-30, 3*boxHeight/2-10);
    text('-3', 10, 3*boxHeight/2-10);
    
    noFill();

    drawCoords();

    // If a point is selected, move it with the mouse
    if (selectedPoint1) {
        selectedPoint1[0] = mouseX - offsetX;
        selectedPoint1[1] = mouseY - offsetY;
        pointsChanged = true;
    }

    // If a point is selected, move it with the mouse
    if (selectedPoint2) {
        selectedPoint2[0] = mouseX - offsetX;
        selectedPoint2[1] = mouseY - offsetY;
        pointsChanged = true;
    }
}


function drawCoords() {
    strokeWeight(1);
    stroke(0);
    // top left panel
    strokeWeight(3);
    line(boxWidth/2, 0, boxWidth/2, boxHeight);
    line(0, boxHeight/2, boxWidth, boxHeight/2);
    strokeWeight(1);
    line(boxWidth/4, 0, boxWidth/4, boxHeight);
    line(3*boxWidth/4, 0, 3*boxWidth/4, boxHeight);
    line(0, boxHeight/4, boxWidth, boxHeight/4);
    line(0, 3*boxHeight/4, boxWidth, 3*boxHeight/4);

    // top right panel
    strokeWeight(3);
    line(boxWidth*1.5, 0, boxWidth*1.5, boxHeight);
    line(boxWidth, boxHeight/2, boxWidth*2, boxHeight/2);
    strokeWeight(1);
    line(boxWidth*(7/4), 0, boxWidth*(7/4), boxHeight);
    line(boxWidth*(5/4), 0, boxWidth*(5/4), boxHeight);
    line(boxWidth, boxHeight/4, boxWidth*2, boxHeight/4);
    line(boxWidth, 3*boxHeight/4, boxWidth*2, 3*boxHeight/4);

    // bottom panel
    strokeWeight(3);
    line(0, boxHeight*1.5, boxWidth*2, boxHeight*1.5);
    line(boxWidth, boxHeight*1, boxWidth, boxHeight*2.5);
    strokeWeight(1);
    line(0, boxHeight*(7/4), boxWidth*2, boxHeight*(7/4));
    line(0, boxHeight*(5/4), boxWidth*2, boxHeight*(5/4));
    line(boxWidth/2, boxHeight*1, boxWidth/2, boxHeight*2.5);
    line(boxWidth*(3/2), boxHeight*1, boxWidth*(3/2), boxHeight*2.5);
    line(boxWidth/4, boxHeight*1, boxWidth/4, boxHeight*2.5);
    line(boxWidth*(3/4), boxHeight*1, boxWidth*(3/4), boxHeight*2.5);
    line(boxWidth*(5/4), boxHeight*1, boxWidth*(5/4), boxHeight*2.5);
    line(boxWidth*(7/4), boxHeight*1, boxWidth*(7/4), boxHeight*2.5);


}


function drawPoints(points) {
    strokeWeight(15);
    stroke(0,0,250)
    for (let i = 0; i < points.length; i++) {
        point(points[i][0], points[i][1]);
    }
    strokeWeight(5);
    stroke(0);
}


function degreeHandling() {
    if ((keyCode === UP_ARROW || keyCode === DOWN_ARROW) && (mouseX > 0 && mouseX < boxWidth && mouseY > 0 && mouseY < boxHeight)) {
        if (keyCode === UP_ARROW && keyIsPressed) {
            signalDegree += 1;
        } else if (keyCode === DOWN_ARROW && keyIsPressed) {
            signalDegree -= 1;
        }
    } else if ((keyCode === UP_ARROW || keyCode === DOWN_ARROW) && (mouseX > boxWidth && mouseX < boxWidth*2 && mouseY > 0 && mouseY < boxHeight)) {
        if (keyCode === UP_ARROW && keyIsPressed) {
            kernelDegree += 1;
        } else if (keyCode === DOWN_ARROW && keyIsPressed) {
            kernelDegree -= 1;
        }
    }
}



function shiftDrawPoints(points, x, y) {
    strokeWeight(1);
    stroke(0,0,250)

    let temp = [];
    for (let i = 0; i < points.length; i++) {
        temp.push([points[i][0] + x, points[i][1] + y]);
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
        temp.push([points[j][0]+i-boxWidth*0.5, points[j][1]+boxHeight]);
    }
    if (temp.length > 1) {
        let curveObj = p5bezier.newBezierObj(temp);
        curveObj.draw();
    }
    strokeWeight(5);
    stroke(0);
}


function mousePressed() {
    if (mouseX > 0 && mouseX < boxWidth && mouseY > 0 && mouseY < boxHeight){
        // Check if the mouse is over any point
        let check = 0;
        let minD = Infinity;
        for (let i = 0; i < points1.length; i++) {
            let d = dist(mouseX, mouseY, points1[i][0], points1[i][1]);
            if (mouseButton === RIGHT) {
                if (d < 10) {
                    pointsChanged = true;
                    points1.splice(i, 1);
                    check = 1;
                    if (signalDegree > points1.length-1) {
                        signalDegree = points1.length-1;
                    }
                    break;
                } else {
                    minD = min(minD, d);
                }
            } else if (d < 10 && mouseButton === LEFT) {
                if (d < 10) {
                    selectedPoint1 = points1[i];
                    offsetX = mouseX - selectedPoint1[0];
                    offsetY = mouseY - selectedPoint1[1];
                    break;
                }
                
            }
        }

        // If the mouse is not over any existing point, add a new point
        if (!selectedPoint1 && check == 0) {
            points1.push([mouseX, mouseY]);
            pointsChanged = true;
        }


    } else if (mouseX > boxWidth && mouseX < boxWidth*2 && mouseY > 0 && mouseY < boxHeight) {
        // Check if the mouse is over any point
        let check = 0;
        let minD = Infinity;
        for (let i = 0; i < points2.length; i++) {
            let d = dist(mouseX, mouseY, points2[i][0], points2[i][1]);
            if (mouseButton === RIGHT) {
                if (d < 10) {
                    pointsChanged = true;                    
                    points2.splice(i, 1);
                    check = 1;
                    if (kernelDegree > points2.length-1) {
                        kernelDegree = points2.length-1;
                    }
                    break;
                } else {
                    minD = min(minD, d);
                }
            } else if (d < 10 && mouseButton === LEFT) {
                if (d < 10) {
                    selectedPoint2 = points2[i];
                    offsetX = mouseX - selectedPoint2[0];
                    offsetY = mouseY - selectedPoint2[1];
                    break;
                }
                
            }
        }

        // If the mouse is not over any existing point, add a new point
        if (!selectedPoint2 && check == 0) {
            points2.push([mouseX, mouseY]);
            pointsChanged = true;
        }


    }

}

function mouseReleased() {
    // Deselect the point when the mouse is released
    selectedPoint1 = null;
    selectedPoint2 = null;
}


function keyPressed() {
    // check if the key pressed is c
    if (keyCode === 67) {
        destroyGraphs();
    }

    // check if the key pressed is a number
    if (keyCode >= 48 && keyCode <= 57) {
        // change curve degree based on the input number over the top right or top left panel
        // check if the mouse is over the top left panel
        if (mouseX > 0 && mouseX < boxWidth && mouseY > 0 && mouseY < boxHeight) {
            if (keyCode - 48 < points1.length && keyCode - 48 >= 1) {
                signalDegree = keyCode - 48;
                pointsChanged = true;
            } else {
                signalDegree = points1.length-1;
                pointsChanged = true;
            }
        }
        // check if the mouse is over the top right panel
        if (mouseX > boxWidth && mouseX < boxWidth*2 && mouseY > 0 && mouseY < boxHeight) {
            if (keyCode - 48 < points2.length && keyCode - 48 >= 1) {
                kernelDegree = keyCode - 48;
                pointsChanged = true;
            } else {
                kernelDegree = points2.length-1;
                pointsChanged = true;
            }
        }
    }
}


function destroyGraphs(){
    points1 = [];
    points2 = [];
    pointsChanged = true;
    BSplineSignal = [];
    BSplineKernel = [];
    convResults = {};
    counter = -boxWidth;
    bottomBSplineSignal = [];
    bottomBSplineKernel = [];
    strokeWeight(5);
    stroke(0);
}