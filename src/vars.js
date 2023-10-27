let points1 = [];
let points2 = [];

let BSplineSignal = [];
let BSplineKernel = [];

// a dicionary to store conv resutlts regarding different counter values
let convResults = {};

let signalDegree = 1;
let kernelDegree = 1;
let conv = 0;

let parameterX = 2;
let parameterY = 2;

let selectedPoint1 = null;
let selectedPoint2 = null;

let offsetX = 0;
let offsetY = 0;

let boxWidth = 350;
let boxHeight = 350;
let speed = 0;
let stride = 2;
let counter = -boxWidth;
let pointsChanged = false;

let signals = {
    'square': [[-0.5, 0], [-0.5, -1], [0.5, -1], [0.5, 0]],
    'hat': [[-1, 0], [0, -1], [1, 0]]
};

let SignalCurve = {};


let figCount = 0;
let paramConv = [];
let folded = [];