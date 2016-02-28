var list = [
    {id: 1, title: 'Kill Bill 1'},
    {id: 2, title: 'Kill Bill 2'},
    {id: 3, title: 'Titanic'}
];

var source = Rx.Observable.from(list);

var ids = source.map(function (item) {
    return item.id;
});

var disposal = ids.subscribe(function (x) {
    console.log('onNext Id: ' + x);
});

disposal.dispose();
