function evaluateFunction(curve, x, adj=0.001) {
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
        return y/(count);
    }
}

function fold(signal, kernel, t, step=0.02) {
    let result = 0;
    let paramFolded = [];
    for (let i = -1; i < 1; i+=step) {
        evalSig = evaluateFunction(signal, i, 0.005);
        evalKer = evaluateFunction(kernel, t-i, 0.005);
        result +=  evalSig * evalKer * step;
        paramFolded.push([i, evalSig * evalKer * step]);
    }
    return [result, paramFolded];
}


function parameterize(points){
    // scale the points to -parameterx to parameterx and -parametery to parametery

    let result = [];
    for (let i = 0; i < points.length; i++) {
        result.push(parameterizePoint(points[i]));
    }   
    return result;
}

function parameterizePoint(point){
    // scale the point to -parameterx to parameterx and -parametery to parametery
    return [(parameterX*point[0])/(boxWidth*0.5), (parameterY*point[1])/(boxHeight*0.5)];
}

function deParameterize(points){
    // scale the points to -parameterx to parameterx and -parametery to parametery
    let result = [];
    for (let i = 0; i < points.length; i++) {
        result.push(deParameterizePoint(points[i]));
    }   
    return result;
}

function deParameterizePoint(point){
    // scale the point to -parameterx to parameterx and -parametery to parametery
    return [(boxWidth*0.5*point[0])/(parameterX), (boxHeight*0.5*point[1])/(parameterY)];
}

function toOrigin(points, region){
    if (region == 'signal') {
        offsetX = boxWidth*0.5;
        offsetY = boxHeight*0.5;
    } else if (region == 'kernel') {
        offsetX = boxWidth*1.5;
        offsetY = boxHeight*0.5;
    } else if (region == 'conv') {
        offsetX = boxWidth;
        offsetY = boxHeight*1.5;
    }

    let result = [];
    for (let i = 0; i < points.length; i++) {
        result.push([points[i][0]-offsetX, points[i][1]-offsetY]);
    }
    return result;
}

function toRegion(points, region){
    if (region == 'signal') {
        offsetX = boxWidth*0.5;
        offsetY = boxHeight*0.5;
    }
    if (region == 'kernel') {
        offsetX = boxWidth*1.5;
        offsetY = boxHeight*0.5;
    }
    if (region == 'conv') {
        offsetX = boxWidth;
        offsetY = boxHeight*1.5;
    }

    let result = [];
    for (let i = 0; i < points.length; i++) {
        result.push([points[i][0]+offsetX, points[i][1]+offsetY]);
    }
    return result;
}


function toOriginPoint(point, region){
    if (region == 'signal') {
        offsetX = boxWidth*0.5;
        offsetY = boxHeight*0.5;
    }
    if (region == 'kernel') {
        offsetX = boxWidth*1.5;
        offsetY = boxHeight*0.5;
    }
    if (region == 'conv') {
        offsetX = boxWidth;
        offsetY = boxHeight*1.5;
    }
    return [point[0]-offsetX, point[1]-offsetY];
}

function toRegionPoint(point, region){
    if (region == 'signal') {
        offsetX = boxWidth*0.5;
        offsetY = boxHeight*0.5;
    }
    if (region == 'kernel') {
        offsetX = boxWidth*1.5;
        offsetY = boxHeight*0.5;
    }
    if (region == 'conv') {
        offsetX = boxWidth;
        offsetY = boxHeight*1.5;
    }
    return [point[0]+offsetX, point[1]+offsetY];
}