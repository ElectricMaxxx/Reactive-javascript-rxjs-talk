var list = [1, 2, 3, 4, 5];

// normal way
list.forEach(function (item) {
    console.log("nexItem: %s", item);
});

// create an observable
var source = Rx.Observable.fromArray(list);

//subscribe an observer
var disposal = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    }
);

// unsubscribe
disposal.dispose();
