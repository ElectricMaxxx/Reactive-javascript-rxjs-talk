var List = (function () {
    var index = 0,
        data = [1, 2, 3, 4, 5],
        length = data.length;
    return {
        next: function () {},
        hasNex: function () {},
        rewind: function () {},
        current: function () {}
    }
})();

while (List.hasNext()) {
    console.log(List.next());
}
