function setup() {
    let c = createCanvas(boxWidth*2, boxWidth*2, "signal-canvas");
    c.parent("canvasContainer");

    let signalSel = select("#signal-select");
    signalSel.option('square');
    signalSel.option('hat');
    signalSel.selected('square');
    signalSel.changed(() => {
        temp = signals[signalSel.value()];
        temp = deParameterize(temp);
        points1 = toRegion(temp, 'signal');
        pointsChanged = true;
    });

    let kernelSel = select("#kernel-select");
    kernelSel.option('square');
    kernelSel.option('hat');
    kernelSel.selected('hat');
    kernelSel.changed(() => {
        temp = signals[kernelSel.value()];
        temp = deParameterize(temp);
        points2 = toRegion(temp, 'kernel');
        pointsChanged = true;
    });

    let saveButton = createButton('Save');
    saveButton.parent("save-signal");
    saveButton.mousePressed(() => {
        // signals["newCurve "+figCount] = ;
        signalSel.option("newCurve"+figCount);
        figCount++;
    });

    noFill();
}

function draw() {
    setupPage();
    degreeHandling();

    drawPoints(points1);
    drawPoints(points2);
    

    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        
        paramSignal = parameterize(bottomBSplineSignal);
        paramKernel = parameterize(bottomBSplineKernel);
        paramCounter = map(counter, -boxWidth, boxWidth, -parameterX*1.5, parameterX*1.5);

        if (keyCode === LEFT_ARROW && keyIsPressed) {
            paramConv = fold(paramSignal, paramKernel, paramCounter);
            convResults[counter] = toRegionPoint(deParameterizePoint([0, -paramConv[0]]), 'conv')[1];
            speed = -stride;
        } else if (keyCode === RIGHT_ARROW && keyIsPressed) {
            paramConv = fold(paramSignal, paramKernel, paramCounter);
            convResults[counter] = toRegionPoint(deParameterizePoint([0, -paramConv[0]]), 'conv')[1];
            speed = stride;
        } else {
            speed = 0;
        }
    }


    if (points1.length >= 3 && pointsChanged) {
        BSplineSignal = CalcBSpline(points1, signalDegree);
    }
    if (BSplineSignal.length > 1) {
        drawCurve(BSplineSignal);
        bottomBSplineSignal = BSplineSignal.map(x => [x[0]-boxWidth*0.5, x[1]-boxHeight*0.5]);
        drawCurve(bottomBSplineSignal.map(x => [x[0]+boxWidth, x[1]+boxHeight*1.5]));
    }

    if (points2.length >= 3 && pointsChanged) {
        BSplineKernel = CalcBSpline(points2, kernelDegree);
    }
    if (BSplineKernel.length > 1) {
        console.log(BSplineKernel);
        drawCurve(BSplineKernel);
        bottomBSplineKernel = BSplineKernel.map(x => [x[0]-boxWidth*1.5, x[1]-boxHeight*0.5]);
        drawCurve(bottomBSplineKernel.map(x => [x[0]+counter+boxWidth, x[1]+boxHeight*1.5]));
    }
    

    // draw convolution result
    strokeWeight(5);
    stroke(0,0,250, 80);
    // if (paramConv.length > 1) {
    //     paramConv = paramConv[1].map(x => [x[0], -x[1]]);
    //     paramConv = deParameterize(paramConv);
    //     folded = toRegion(paramConv, 'conv');
    //     console.log(folded[0][0]+boxWidth, folded[0][1]+boxHeight);
    //     for (let i = 0; i < folded.length-1; i++) {
    //         rect(folded[i][0], folded[i][1], 1, 50);
    //     }
    // }
    for (let i = -boxWidth; i < counter; i++) {
        // folded = de
        // rect(i+boxWidth, convResults[i], 1, -convResults[i]+boxHeight*1.5);
        // point(i+boxWidth, convResults[i]);
        line(i+boxWidth, convResults[i], i+boxWidth, boxHeight*1.5);
    }
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
