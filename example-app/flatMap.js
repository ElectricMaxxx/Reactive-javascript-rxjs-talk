var source = Rx.Observable
    .range(1, 2)
    .flatMap(function (x) {
        return Rx.Observable.range(x, 2);
    });

var subscription = source.subscribe(
    function (x) {
        console.log('onNext: ' + x);
    }
);
