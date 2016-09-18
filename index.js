
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
