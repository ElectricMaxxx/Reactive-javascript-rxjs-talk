var videos = [
    {
        id: 100001,
        title: 'Kill Bill 1',
        'url': '..',
        rating: 5.0
    },
    {
        id: 100002,
        title: 'Kill Bill 2',
        'url': '..',
        rating: 5.0
    },
    {
        id: 100003,
        title: 'Titanic',
        'url': '..',
        rating: 1.0
    }
];

// bad way
var newList = [];
for(var i = 0; i <= videos.length; i++) {
    if (videos[i].rating === 5.0) {
        newList.push({id: videos[i].id, title: videos[i].title})
    }
}

console.log(newList);

// better
var newList = [];

videos.forEach(function (video) {
    newList.push({id: video.id, title: video.title})
});

console.log(newList);

var newList =
    videos
        .reduce(function (video) {
            return video.rating === 5.0;
        })
        .map(function (video) {
           return  {id: video.id, title: video.title};
        });

console.log(newList);
