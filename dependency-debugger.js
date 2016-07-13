function getStack(cutCount = 4) {
  var stack = [];
	try {
		throw Error("stack");
  }
  catch(e) {
  	stack = e.stack.split("\n").splice(cutCount).map(s => s.trim(" "));
  }
  return stack;
}

var originalComputed = ko.computed;
ko.computed = (...args) => {
  var result = originalComputed.apply(originalComputed, args);
  result.__debugCreatedStack = getStack();
	return result;
}

var originalObservable = ko.observable;
ko.observable = (...args) => {
  var result = originalObservable.apply(originalObservable, args);
  result.__debugCreatedStack = getStack();
	return result;
}

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
