var list = [
    {id: 100001, name: 'Piña Colada', zutaten: [], prozent: 5.0 },
    { id: 100002, name: ' Tequila Sunrise', zutaten: [], prozent: 6.0 },
    { id: 100003, name: ' Long Island', zutaten: [], prozent: 7.0 },
];

var source = Rx.Observable.from(list);

var ids = source.map(function (item) {
    return item.id;
});

var disposal = ids.subscribe(function (x) {
    console.log('onNext Id: ' + x);
});

disposal.dispose();
