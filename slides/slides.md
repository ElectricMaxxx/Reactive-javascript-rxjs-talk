# Reactive JavaScript mit RxJS - BASTA! 2016
## Maximilian Berghoff - 23.03.2016

---

# Who am I?

- Maximilian Berghoff <!-- .element: class="fragment" -->
- @ElectricMaxxx <!-- .element: class="fragment" -->
- github.com/electrimaxxx <!-- .element: class="fragment" -->
- Maximilian.Berghoff@mayflower.de <!-- .element: class="fragment" -->
- Mayflower GmbH - Würzburg <!-- .element: class="fragment" -->

Note: 

---

# Reactive Extensions - Rx

Note: 

---

# History

## Erik Meier <!-- .element: class="fragment" -->
## Brain Backman <!-- .element: class="fragment" -->
## Mathew Podwysocki <!-- .element: class="fragment" -->

---

<!-- .slide: data-background="../docs/images/contributers_rxjs.png" -->

Note:

---

# LINQ to Events

Note:

---

# Volta

![Volta](../docs/images/volta.jpeg)

Note: 

---

# Windows Forms
# <=> <!-- .element: class="fragment" -->
# Web Forms <!-- .element: class="fragment" -->

Note:

---

# Problem?

Note:

---

## Beispiel:
# Drag & Drop
## Mausbewegung verfolgen

---

## Event Listener Registrieren

```javascript
elem.addEventListener('mousedown', mousedown, false);
elem.addEventListener('mouseup', mouseup, false);
elem.addEventListener('mousemove', mousemove, false);
```

----

## mouse down

```javascript
function mousedown(e) {
    isDown = true;
    state = { startX: e.offsetX, startY: e.offsetY};
}
```

---

## mouse move

```javascript
function mousemove(e) {
    if (!isDown) {return;}
    var delta = {
        endX: e.clientX - state.startX,
        endY: e.clientY - state.startY
    };
}
```
---
## mouse up

```javascript
function mouseup (e) {
    isDown = false;
    state = null;
}
```
---
## unsubscribe

```javascript
function dispose() {
    elem.removeEventListener('mousedown', mousedown, false);
    elem.removeEventListener('mouseup', mouseup, false);
    elem.removeEventListener('mousemove', mousemove, false);
}
```
---

<!-- .slide: data-background="../docs/images/bar.jpg" -->

---
# Die Akteure
---
# Das Iterator Pattern
---
```javascript
var Iterator = function () {};

Iterator.prototype.next();

Iterator.prototype.rewind();

Iterator.prototype.current();

Iterator.prototype.hasNext();
```
---
# Traversieren

```javascript
while (Iterator.hasNext()) {
    console.log(Iterator.next());
}
```
---
# Gedankenspiel

- Liste von Filmen <!-- .element: class="fragment" -->
- Eigenschaften: id, title, url, rating, ... <!-- .element: class="fragment" -->
- Aufgabe: "Trage id & title von allem Filmen mit rating = 5.0 zusammen" <!-- .element: class="fragment" -->
---

```javascript
 var videos = [
     {id: 100001, title: 'Kill Bill 1', 'url': '..', rating: 5.0 },
     { id: 100002, title: 'Kill Bill 2', 'url': '..', rating: 5.0 },
     {id: 100003, title: 'Titanic', 'url': '..', rating: 1.0 }
 ];
```
---
```javascript
var newList = [];
for(var i = 0; i <= videos.length; i++) {
    if (videos[i].rating === 5.0) {
        newList.push({id: videos[i].id, title: videos[i].title})
    }
}

console.log(newList);
```
---
```javascript
var newList = [];

videos.forEach(function (video) {
    newList.push({id: video.id, title: video.title})
});

console.log(newList);
```
---

```javascript
var newList =
    videos
        .reduce(function (video) {
            return video.rating === 5.0;
        })
        .map(function (video) {
           return  {id: video.id, title: video.title};
        });

console.log(newList);
```

---
# Observer Pattern
---

```
Observable.prototype.subscribe()
```

---

```javascript
Observer.prototype.notify()
```

---

```javascript
var Observable = function () {};

Observable.prototype.unsubscribe = function () {};

Observable.prototype.unsubscribe = function () {};

var Observer = function () {};

Observer.prototype.notify = function() {};
```

---

# Warum?

- Entkopplung <!-- .element: class="fragment" -->
- weniger prozedualer Code <!-- .element: class="fragment" -->
- Erweiterbarkeit erhöht <!-- .element: class="fragment" -->

---

<!-- .slide: data-background="../docs/images/hochzeit.jpg" -->

# Die Hochzeit


<span class="attribution">By Ziko van Dijk (shot by myself) [<a href="http://www.gnu.org/copyleft/fdl.html">GFDL</a> or <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a>], <a href="https://commons.wikimedia.org/wiki/File%3A2007-09-01trauungk%C3%B6ln.jpg">via Wikimedia Commons</a></a></span>
---

# Reactive Extension

- RxJava <!-- .element: class="fragment" -->
- <b>RxJS</b> <!-- .element: class="fragment" -->
- Rx.Net <!-- .element: class="fragment" -->
- Rx.Scala <!-- .element: class="fragment" -->
- Rx.Clojure <!-- .element: class="fragment" -->
- Rx.Swift <!-- .element: class="fragment" -->
- ... <!-- .element: class="fragment" -->

---

# [Reactive.io](http://reactivex.io/)

---

## [github.com/Reactive-Extionsion](https://github.com/Reactive-Extension)

---

# Stream von Events

---

```javascript
var list = [1, 2, 3, 4, 5];

list.forEach(function (item) {
    console.log("nexItem: %s", item);
});
```

---

```javascript
var list = [1, 2, 3, 4, 5];

var source = Rx.Observable.fromArray(list);

var disposal = source.subscribe(
    function (x) {console.log('Next: ' + x);},
    function (err) {console.log('Error: ' + err);},
    function () {console.log('Completed');});

disposal.dispose();
```

---

<!-- .slide: data-background="https://upload.wikimedia.org/wikipedia/commons/d/da/Kindergarten_kids_at_a_public_school_in_Montevideo%2C_Uruguay.jpg" -->

<span class="attribution">By Vince Alongi (Flickr) [<a href="http://creativecommons.org/licenses/by/2.0">CC BY 2.0</a>], <a href="https://commons.wikimedia.org/wiki/File%3AKindergarten_kids_at_a_public_school_in_Montevideo%2C_Uruguay.jpg">via Wikimedia Commons</a></span>

---

# Observer

---

```javascript
var disposal = source.subscribe(
    function (x) {console.log('Next: ' + x);},
    function (err) {console.log('Error: ' + err);},
    function () {console.log('Completed');}
);
```

---


```javascript
function Observer() { }

Observer.prototype.onNext = function (value) { ... };

Observer.prototype.onError = function (error) { ... };

Observer.prototype.onCompleted = function () { ... };
```

---

```javascript
var source = Rx.Observable.range(1,10);

var reducedSource = source.filter(function (value) {
    return value % 2 === 0;
});
```

```javascript
var disposal1 = reducedSource.subscribe(
    function (x) {console.log('Next 1: ' + x);},
    function (err) {console.log('Error 1: ' + err);},
    function () {console.log('Completed 1.');}
);
disposal1.dispose();
```

```javascript
var disposal2 = source.subscribe(
    function (x) {console.log('Next 2: ' + x);},
    function (err) {console.log('Error 2: ' + err);},
    function () {console.log('Completed 2');}
);
disposal2.dispose();
```

---

```
> Next 1: 2
> Next 1: 4
> Next 1: 6
> Next 1: 8
> Next 1: 10
> Completed 1.
> Next 2: 1
> Next 2: 2
> Next 2: 3
> Next 2: 4
> Next 2: 5
> Next 2: 6
> Next 2: 7
> Next 2: 8
> Next 2: 9
> Next 2: 10
> Completed 2
```

---

# Observalbe

---

```javascript
function Disposable() { }

Disposable.prototype.dispose = function () { ... }

function Observable() { }

Observable.prototype.subscribe = function (observer) { ... }
```

---

# Youtube

---

# (Er-) Zeugung

---

```javascript
Rx.Observable.create()
```
---

```javascript
var source = Rx.Observable.create(function (observer) {
  observer.onNext(42);
  observer.onCompleted();
  return function () {
    console.log('disposed');
  }
});

var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); }
  );

subscription.dispose();
```

---

```
> onNext: 42
> onCompleted
> disposed
```

---

```javascript
Rx.Observable.range()
```
---

```javascript
var source = Rx.Observable.range(1, 5);

var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); }
);
```

---

```
> onNext: 1
> onNext: 2
> onNext: 3
> onNext: 4
> onNext: 5
```

---

```javascript
Rx.Observable.fromEvent(element, eventName, [selector])
// oder
Rx.Observable.fromCallback(func, [context], [selector])
```
---

```javascript
var input = $('#input');

var source = Rx.Observable.fromEvent(input, 'keyup');

var subscription = source.subscribe(
  function (x) {console.log('Next: key pressed!');},
  function (err) {console.log('Error: %s', err);},
  function () {console.log('Completed');});
```

---

```javascript
var fs = require('fs'),
    Rx = require('rx');

var exists = Rx.Observable.fromCallback(fs.exists);
var source = exists('file.txt');

var subscription = source.subscribe(
    function (x) {console.log('Next: ' + x);},
    function (err) {console.log('Error: ' + err);},
    function () {console.log('Completed');}
  );
```

---

<!-- .slide: data-background="https://upload.wikimedia.org/wikipedia/commons/2/2f/Kinderarbeit.jpg" -->

<span class="attribution">von Unbekannt [Public domain], <a href="https://commons.wikimedia.org/wiki/File%3AKinderarbeit.jpg">via Wikimedia Commons</a></span>

---

# LINQ
## Language Integrated Query

---

# Kombination

```javascript
.concat();
// oder
.merge();
```

---

```javascript
var sourceOne = Rx.Observable.range(1,5);
var sourceTwo = Rx.Observable.range(6,5);

var merged = sourceOne.concat(sourceTwo);
var disposal = merged.subscribe(function (x) {
	console.log('Concat onNext: ' + x); 
});
```

---

# Output

```
> Concat onNext: 1
> Concat onNext: 2
> Concat onNext: 3
> Concat onNext: 4
> Concat onNext: 5
> Concat onNext: 6
> Concat onNext: 7
> Concat onNext: 8
> Concat onNext: 9
> Concat onNext: 10
``` 

---

```javascript
var sourceOne = Rx.Observable.range(1,5);
var sourceTwo = Rx.Observable.range(6,5);

var merged = sourceOne.merge(sourceTwo);
var disposal = merged.subscribe(function (x) {
	console.log('Merged onNext: ' + x); 
});
```

---

# Output

```
> Merged onNext: 1
> Merged onNext: 6
> Merged onNext: 2
> Merged onNext: 7
> Merged onNext: 3
> Merged onNext: 8
> Merged onNext: 4
> Merged onNext: 9
> Merged onNext: 5
> Merged onNext: 10
```

---

# Filter

---

```javascript
var source = Rx.Observable.range(1,10);

var filtered = source.filter(function (x) {
    return x % 2 === 0;
});

var disposal = filtered.subscribe(function (x) {
    console.log('onNext: ' + x);
});
```

---

# Output

```
> onNext: 2
> onNext: 4
> onNext: 6
> onNext: 8
> onNext: 10
```

---

# Projektionen

---

```
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
```

---

# Output

``` 
onNext Id: 1
onNext Id: 2
onNext Id: 3
```

---

# ?

```javascript
.flatMap();
```

---

```javascript
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
```

---

```javascript
return Rx.Observable.range(1, 2);
return Rx.Observable.range(2, 2);
``` 

---

```
> onNext: 1
> onNext: 2
> onNext: 2
> onNext: 3
```

---

# Noch mehr?

#### [Github/Dokumentation](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/categories.md) 

---

# Promises?

- Single Value <!-- .element class="fragment" -->
- Cancellation? <!-- .element class="fragment" -->

---

<!-- .slide: data-background="https://upload.wikimedia.org/wikipedia/commons/6/62/Thw_Betonkettensaege_in_aktion.jpg" -->
# Action
<span class="attribution">von Thiemo Schuff (Eigenes Werk) [<a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a>], <a href="https://commons.wikimedia.org/wiki/File%3AThw_Betonkettensaege_in_aktion.jpg">via Wikimedia Commons</a></span>

---

```html
<input type="text" id="input"/>

<h2>Results</h2>
<ul id="results">
</ul>
```

---

```javascript
    var $input = $('#input');
    var $results = $('#results');

    var suggestions = Rx.Observable.fromEvent($input, 'keyup');
``` 

---

``` javascript
var suggestions = Rx.Observable.fromEvent($input, 'keyup')
        .pluck('target', 'value')
        .filter(function(text) { return text.length > 2 })
        .debounce(500 /* ms */)
        .distinctUntilChanged();
```

---

```javascript
    ...
    flatMapLatest(function (term) {
            return $.ajax({
                url: 'https://en.wikipedia.org/w/api.php',
                dataType: 'jsonp',
                data: {
                    action: 'opensearch',
                    format: 'json',
                    search: term
                }
            }).promise();
        });
```

---

```javascript
    ...
    .subscribe(
        function(data) {
            $results
                .empty()
                .append($.map(data[1], function (value) {
                    return $('<li>').text(value);
                }))
        },
        function(error) {
            $results
                .empty()
                .append($('<li>'))
                .text('Error:' + error);
        }
    );
```

---

<!-- .slide: data-background="https://upload.wikimedia.org/wikipedia/commons/2/2a/X6029_-_Tr%C3%A4skofiol_-_ok%C3%A4nd_tillverkare_-_foto_Mikael_Bodner.jpg" -->
# js fiddle
<span class="attribution">By Musik- och teatermuseet (Own work) [<a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a>], <a href="https://commons.wikimedia.org/wiki/File%3AX6029_-_Tr%C3%A4skofiol_-_ok%C3%A4nd_tillverkare_-_foto_Mikael_Bodner.jpg">via Wikimedia Commons</a></span>

---

# Questions?

- Ask Now!
- Twitter: @ElectricMaxxx <!-- .element: class="fragment" -->
- Mail: Maximilian.Berghoff@mayflower.de <!-- .element: class="fragment" -->

---

# Thank You!
