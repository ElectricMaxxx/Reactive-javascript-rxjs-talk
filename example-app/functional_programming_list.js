var cocktails = [
    {id: 100001, name: 'Piña Colada', zutaten: [], prozent: 5.0 },
    { id: 100002, name: ' Tequila Sunrise', zutaten: [], prozent: 6.0 },
    { id: 100003, name: ' Long Island', zutaten: [], prozent: 7.0 },
];

// bad way
var newList = [];
for(var i = 0; i <= cocktails.length; i++) {
    if (cocktails[i].prozent > 5.0) {
        newList.push({id: cocktails[i].id, title: cocktails[i].title})
    }
}

console.log(newList);

// better
var newList = [];
cocktails.forEach(function (cocktail) {
    if (cocktails[i].prozent > 5.0) {
        newList.push({id: cocktail.id, title: cocktail.title})
    }
});

console.log(newList);

var godOnes = cocktails
    .filter(function (cocktail) {
        return cocktail.prozent > 5;
    })
    .map(function (cocktail) {
        return {id: cocktail.id, name: cocktail.name};
    });

console.log(godOnes);
