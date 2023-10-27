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

function CalcBSpline(points, degree){
    let results = [];
    for (let t = 0; t < 1; t+=0.002) {
        results.push(BSplineInterpolate(t, degree, points));
    }
    return results;
}

function drawCurve(points) {
    strokeWeight(5);
    stroke(0,250,0);
    for (let i = 0; i < points.length-1; i++) {
        line(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
    }
    strokeWeight(5);
    stroke(0);
}
