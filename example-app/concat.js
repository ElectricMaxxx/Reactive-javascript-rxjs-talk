var sourceOne = Rx.Observable.range(1,5);
var sourceTwo = Rx.Observable.range(6,5);

var merged = sourceOne.concat(sourceTwo);
var disposal = merged.subscribe(function (x) {
    console.log('Concatenated onNext: ' + x);
});
