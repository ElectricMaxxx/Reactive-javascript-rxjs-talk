var source = Rx.Observable.range(1,10);

var filtered = source.filter(function (x) {
    return x % 2 === 0;
});

var disposal = filtered.subscribe(function (x) {
    console.log('onNext: ' + x);
});
