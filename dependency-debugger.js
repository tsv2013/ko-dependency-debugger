function getStack(cutCount) {
  var stack = [];
  cutCount = cutCount || 4;
  try {
    throw Error("stack");
  }
  catch(e) {
    stack = e.stack.split("\n").splice(cutCount).map(s => s.trim(" "));
  }
  return stack;
}

var originalObservable = ko.observable;
var newObservable = (...args) => {
  var result = originalObservable.apply(originalObservable, args);
  result.__debugCreatedStack = getStack();
  result['__ko_proto__'] = newObservable;
  return result;
}
ko.observable = newObservable;

var originalComputed = ko.computed;
var newComputed = (...args) => {
  var result = originalComputed.apply(originalComputed, args);
  result.__debugCreatedStack = getStack();
  result['__ko_proto__'] = newObservable;
  return result;
}
ko.computed = newComputed;

var outerFrames = [], currentFrame;
var originalDdBegin = ko.dependencyDetection.begin;
ko.dependencyDetection.begin = options => {
  outerFrames.push(currentFrame);
  currentFrame = options;
  if(options) {
    options.computed.__PreviousDebugDependencies = options.computed.__DebugDependencies;
    options.computed.__DebugDependencies = [];
  }
  originalDdBegin.apply(originalDdBegin, [options]);
}
var originalDdEnd = ko.dependencyDetection.end;
ko.dependencyDetection.end = () => {
  currentFrame = outerFrames.pop();
  originalDdEnd.apply(originalDdEnd, []);
}
var originalDdRegisterDependency = ko.dependencyDetection.registerDependency;
ko.dependencyDetection.registerDependency = (...args) => {
  if(!!currentFrame) {
    var dependency = {
      object: args[0],
      stack: !!args[0] && getStack(5)
    }
    currentFrame.computed.__DebugDependencies.push(dependency);
  }
  originalDdRegisterDependency.apply(originalDdRegisterDependency, args);
}

var o1 = ko.observable(1);
var o2 = ko.observable(2);
var o3 = ko.observable(3);
function getSomeData() {
	return o2() + o3();
}
var c1 = ko.computed(() => {
	return o1() + getSomeData();
});

c1.subscribe(newVal => {
  console.log(c1.__PreviousDebugDependencies);
	debugger;
});
o3(4);
