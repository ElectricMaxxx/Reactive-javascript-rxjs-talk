# Reactive Javascript mi RxJs

## Abstract
Stellen Sie sich vor, das Iterator Pattern und das Observer Pattern lernen sich in einer Bar kennen, verlieben sich
ineinander und zeugen ein Kind, das sie “RxJS” nennen. RxJS stellt Erweiterungen zur reaktiven Programmierung in
JavaScript bereit. Es handelt sich hierbei um ein Paradigma, bei dem der Datenfluss im Fokus liegt. Angestrebt wird,
ein stabiles, skalierbares und resilientes Anwendererlebnis zu schaffen. Im Kern steht der effiziente Umgang mit
asynchronen Ereignissen. Und die sind zahlreich: vom Bootstraping der Applikation, Steuern von Animationen, Umgang
mit Benutzereingaben bishin zu XHRs. Die Session erklärt anhand beispielhafter Implementierungen was hinter diesem
Paradigma steht. Sie zeigt überdies auf, wie damit zeitgemäße asychrone Anwendungen eventgetrieben entwickelt werden
ohne überflüssigen Overhead zu produzieren.

## Intro

`Opening mit Slide für den Startbildschirm`

Bevor wir wirklich los legen eine kurze `Vorstellung - Who am I?`.  Das bin ich. Das Bild zieht sich inzwischen durch all meine
Accounts im Internet. Sowohl auf Twitter (point: @ElectricMaxxx) als auch auf Github (https://github.com/Electricmaxx).
Bevor wir wirklich los legen eine kurze `Vorstellung`.  Das bin ich. Das Bild zieht sich inzwischen durch all meine
Accounts im Internet. Sowohl auf Twitter (point: @ElectricMaxxx) als auch auf Github (https://github.com/ElectricMaxxx).
In beiden Portalen lohnt es sich mir zu folgen. Auf Github sieht man meine eigentlich meine stark PHP lastigen
Repositories. Das ist aber nur die halbe Wahrheit. In meiner Firma (Mayflower) übernehme ich immer wieder Frontend
Application oder führe Workshops durch. Mit Frontend meine ich jetzt aber nicht dieses Design Krams.
Aber wir sind ja heute nicht wegen mir hier ...

Nun zum Thema : Im groben geht es heute ja eigentlich um `Reactive Extensions - Rx` Im Speziellen um die Implementierung
in JavaScript. Doch schauen wir uns erst einmal die `History` an.
 
Mitte der 2000er (sagt man so?) haben `Erik Mejer` und `Brian Backman` bei Microsoft ein Cloud Programming
Team gegründet. In dem Team befand sich auch
[Mathew Podwysocki](https://twitter.com/mattpodwysocki) `=> images/contributers_rxjs.png`
Die Jungs hatten in dem Projekt den schönen Effekt, dass sie unbegrenztes Budget hatte.
Sie sollten eigentlich die Cloud ergründen und bauten dabei fast aus Zufall die Reactive Extension.
Dort und im Nachgang wird auch als `LINQ to Events` bezeichnet.
Ich bin ja hier auf einer .net lastigen Konferenz, da muss ich wohl nicht groß erklären was 
LINQ ist, oder? (Innerhalb von .net einheitliche Methode um auf Daten zuzugreifen - Language Integrated Query)
Doch wie ist das geschehen? Es begann mit einem Projekt names `Volta` Es sollte wohl Applications
plattformunabhängig kompilierbar machen. So kam es dazu, dass man versuchte `Windows Forms` in `Web Forms`
mit Hilfe von HTML und JavaScript für die "Plattform" Web zu kompilieren. Doch das Web ist asynchron. 
Promises gab es noch nicht. Also stand man in der wohlbekannten asynchronen Hölle. Dazu kommen Events
bspw. in Ajax Calls mehr als Metadaten vor. 

Schauen wir uns doch einmal ein simples `Drag&Drop` an - und davon einfach nur die Mausbewegung:

Wir registrieren Eventlistener

```
elem.addEventListener('mousedown', mousedown, false);
elem.addEventListener('mouseup', mouseup, false);
elem.addEventListener('mousemove', mousemove, false);
```

um das klicken, bewegen und loslassen der Maus zu erfassen. Dazu implementieren wir die Funktionen
für die Callbacks:

```javascript
function mousedown(e) {
    isDown = true;
    state = { startX: e.offsetX, startY: e.offsetY};
}
```

und 

```javascript
function mousemove(e) {
    if (!isDown) {return;}
    var delta = {
        endX: e.clientX - state.startX,
        endY: e.clientY - state.startY
    };
}
``` 

```javascript
function mouseup (e) {
    isDown = false;
    state = null;
}
```

und was wir nicht vergessen sollten, das Unsubscriben:

```javascript
function dispose() {
    elem.removeEventListener('mousedown', mousedown, false);
    elem.removeEventListener('mouseup', mouseup, false);
    elem.removeEventListener('mousemove', mousemove, false);
}
```

Hier den Überblick zu behalten ist schon schwer und kommt einem Jonglieren von State und Event schon nahe.

Doch nun erst einmal...

## An die Bar

Ich möchte euch kurz die Akteure vorstellen:

Das `Iterator Pattern` => `TODO: UML Image = > #2` beschreibt einen Einheitlichen Umgang mit Array, Collections oder
oder Ähnlichem. Mit Umgang meine ich das Traversieren der Einträge ohne sich über die Strucktur gedanken zu machen.
Schauen wir uns einmal an, wie das aussehen könnte:

```javascript
var Iterator = function () {};

/**
 * Returns the next object in the collection.
 */
Iterator.prototype.next();

/**
 * Will reset the internal index. Calling .next() will return the first item now.
 */
Iterator.prototype.rewind();

/**
 * Returns the current item in the collection.
 */
Iterator.prototype.current();

/**
 * Decider whether there is a next element or not. 
 * Returns false when the collection is at his end.
 */
Iterator.prototype.hasNext();
```

Mit einer Kombination aus `.next()` und `.hasNext()` lässt sich nun relativ einfach traversieren.

```javascript
while (Iterator.hasNext()) {
    console.log(Iterator.next());
}
```

Das Handling von Collections wird aber nicht nur durch das Iterator Pattern bestimmt. So lassen sich auf
solche Listen auch wunderbar Queries durch absetzen. Stellen wir uns mal folgende
Aufgabe vor: `Liste von Filmen => trage id + title von Filmen mit Rating 5.0 zusammen` Das könnte so auf 
einem onDemand System a la Netflix zum täglichen Brot gehören. Das heißt wir haben eine Liste wie:

```javascript
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
```

Die Liste ist jetzt noch nicht so lang. Mein Video-Porta befindet sich noch im Aufbau.
Um durch die Liste zu kommen, könnten jetzt wie folgt vorgehen:

```javascript
var newList = [];
for(var i = 0; i <= videos.length; i++) {
    if (videos[i].rating === 5.0) {
        newList.push({id: videos[i].id, title: videos[i].title})
    }
}

console.log(newList);
```

Ein wenig besser wäre vielleicht:

```javascript
var newList = [];

videos.forEach(function (video) {
    newList.push({id: video.id, title: video.title})
});

console.log(newList);
```

Denn wenn es native Array-Funktionen gibt sollte man sie auch nutzen.
Doch wie wäre es mit?

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

Wir arbeiten hier jetzt mit einer Filter-Funktion (reduce) und einer Projektion (map),
mit der dann die Richtigen Werte generiert werden. Beide Funktionen gehören ebenfalls zu den nativen
Array-Funktionenn.

Was dieses Vorghen aumacht: Es ist Pull basiert. Das heißt Werte, die man haben will holt man sich aus der
Liste filtert Diese und sucht sich dann noch die richtigen Properties raus.

Neben dem Iterator Pattern ging es ja auch noch um das `Observer Pattern`, als zweiten Akteur.
Dieses beschreibt die Verbindung zwischen einem Beobachteten Objekt und seinen Beobachtern.
Dabei wird eher ein bestimmter Status-Wechsel beobachtet
als das Objekt an sich. Bei dem beobachteten Object spricht man von dem Subject oder Observable 
(engl. beobachtbar). Dieses stellt eine Methode zum Registrieren berereit. `Observable.prototype.subscribe()` könnte solch
ein Interface aussehen. Nun meldet ein Beobachter - auch Observer genannt - also Interesse an dem Observable an.
Damit der Observable den Observer über Änderungen informieren kann, muss der Observer wiederum eine Methode zum
Mitteilen implementieren. Die könnte beispielsweise `Observer.prototype.notify()` lauten.
Der Observable sollte dann natürlich auch eine Methode zum unsubscriben bereithalten damit der Observer
seine Registrierung auch wieder Rückgängig machen kann.

```javascript
var Observable = function () {};

/**
 * Method to register an Observer Object.
 */
Observable.prototype.unsubscribe = function () {};


/**
 * Method to unregister an Observer Object. 
 */
Observable.prototype.unsubscribe = function () {};


var Observer = function () {};

/**
 * Method to inform the Observer, when there are changes.
 */
Observer.prototype.notify = function() {};
```

`Was bringt einem das ganze?`. `Entkopplung` Man verhindert dann doch all zu prozedualen Code. 
Dem Observable muss es nicht interessieren wer da in der Leitung hängt - Hauptsache er kann jedem seine Änderung
mitteilen. Als Observer kann ich mich ganz auf die Reaktion zu gegebenen Events konzentrieren. Nun sind
wir bei `Events`. Diese sind im Web Context das Mittel der Wahl um Informationen vom Observable zum 
Observer zu übermitteln. So implementieren wir sog. Event Handler, also Callback-Funktionen, um auf
Ereignisse im Browser reagieren zu können. Wir haben ja vorhin schon ein Beispiel dazu gesehen.

Nun kommt es wie es kommen musste. Der Abend in der Bar war zu schön. Beide Pattern lernten sich näher kennen
und es kam zur ...

## Die Hochzeit

... Sie entschieden sich dazu als sog. `Reactive Extensions` gemeinsame Wege zu gehen. Doch warum `Plural?`
Nun, ... es gibt verschiedene Implementierungen:
* RxJava
* <b>RxJS</b>
* Rx.Net
* Rx.Scala
* Rx.Clojure
* Rx.Swift
* ...

Wenn man sich einen Überblick verschaffen will sollte man mal die Website `http://reactivex.io/` besuchen
oder man wirft ein Blick in die Github Organisation unter der alles zusammen gefasst ist:
`https://github.com/Reactive-Extension`. Doch was mach diese Vereinigung nun aus? Mit Rx kann sich ein 
Observer nun auf einen `Stream von Events` subscriben. Um diesen Stream zu begrenzen werden von den Observables
Operatoren bereit gestellt, den Stream für ein Observer manipulieren oder filtern können. Aus
```javascript
var list = [1, 2, 3, 4, 5];

list.forEach(function (item) {
    console.log("nexItem: %s", item);
});
```

wird jetzt

```javascript
var list = [1, 2, 3, 4, 5];

var source = Rx.Observable.fromArray(list);

var disposal = source.subscribe(
    function (x) {console.log('Next: ' + x);},
    function (err) {console.log('Error: ' + err);},
    function () {console.log('Completed');});

disposal.dispose();
```

Das sieht jetzt ein wenig mehr Schreibarbeit für die Ausgabe eines Arrays aus. 
Aber stellen wir uns einmal vor, das wären jetzt Push Notifications von einem WebSocket
Verbindung oder Informationen aus dem Mouse-Move-Events, wie sie vorhin gebaut haben. Zu den genaueren 
Vorgängen komme ich im Anschluss.
Ja was folgt im Anschluss an eine Hochzeit. Ja ? ...

## Gemeinsamme Kinder

... Die Flitterwochen waren noch nicht einmal ganz vorüber, da standen relativ kurz nacheinander
die Geburt zweier Kids an. Beide haben ihre eigenen Eigenschaften und Funktionen. So wie die kleine Prizessin daheim lieber mit 
ihren Pferden spielt und der Lausebub sich gern mit seinen Kumpels rauft. Die Geschlechterzuweisung in der
Realität lasse ich jetzt einmal offen. Die Eigenschaften möchte ich euch jetzt einmal schnell an kurzen
Schnipseln demonstrieren. Ich werde die Slides natürlich zugänglich machen. D.h. damit hat
man dann auch eine gute Zusammenfassung der wichtigsten Funktionen.

Wenn der `Observer`, wie obn im Beispiel nicht nur aus Callbacks, besteht, also so ...

```javascript
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
```

... sollte er Methoden implementieren, die vom Observalbe Object aufgeufn werden können um über neue Werte, 
über einen Fehler oder über das Ende zu informieren:

```javascript
function Observer() { }

Observer.prototype.onNext = function (value) { ... };

Observer.prototype.onError = function (error) { ... };

Observer.prototype.onCompleted = function () { ... };
```

Wir haben hier die `onNext()` Methode, diese wird immer aufgerufen, wenn ein neuer Wert eintrifft. Beispielsweise
würde ohne Filter mit einer Subscription auf Mouse-Move-Events, jeder Punkt der Bewegung einen Aufruf von `onNext()`
zu folge haben. Die beiden anderen Methoden beenden automatisch die Registrierung. `onError()` wird, wie der
Name schon vermuten lässt im Fehlerfall aufgerufen. `onComplete`, wenn ein Stream beendet wird. Nach dem Aufruf
beider Funktionen gibt es keinen weiteren Aufruf von `onNext()` mehr.
Es reicht aber vollkommen aus, die drei Funktionen als Callback-Funktionen der `subscribe()` Methode zu übermitteln.
Die Reihenfolge ist dabei `onNext, onError, onCompleted`
Damit hat jeder Observer für sich allein die Möglichkeit Werte aus dem Stream abzugreifen und auf Fehler zu reagieren.
Dabei beeinflusst er andere Subscriber nicht:

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

In der Console sieht man dann:

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
Zum `Observable` ..
Damit das Observable Objekt erst einmal grundlegend funktioniert benötigt es
ein `subscribe()` Methode ...

```javascript
function Disposable() { }

Disposable.prototype.dispose = function () { ... }

function Observable() { }

Observable.prototype.subscribe = function (observer) { ... }
```

.. wie man hier erkennen kann dient diese nicht nur zum registrieren auf einem Stream
sondern liefert gleich ein `Disposable` Objekt zurück. Mit diesen kann man sich dann
auch wieder ganz einfach Abmelden. Damit erhällt man auch keine Notifications mehr.
Der `subscribe()` Methode übergibt mein den Observer. Das kann entweder ein Objekt
nach dem vorhin definierten Interface sein, oder man übergibt einfach alle drei 
Funktionen einzeln als Callbacks. Zumindest die `onNext()` muss übergeben werden sonst
macht das ganze Registrieren keinen Sinn mehr.

Nun waren die Kids echt so cool, dass beide Eltern begannen anderen Eltern von ihnen zu erzählen. Und da man
das heute wohl so als stolze Eltern macht, wurde ein eigner Youtube-Channel eingerichtet ...

## Youtube

... er sollte nun viele anderen Eltern zeigen wie sie selbst solche Kids bekommen können. Ich habe mir die 
mal für euch angeschaut. Und wie gehts los? Beim ersten Video geht es zum die `(Er-) Zeugung`. Ich erspare
euch jetzt einmal die Bilder. Bleiben wir lieber bei den Fakten - also dem Code.

Fangen wir einmal mit einer einfachen Methode zum Erzeugen an - `Rx.Observable.create()`. Dieser Methode
übergibt man eine Constructor Funktion, die selbst den Observer als Parameter bekommt.

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

Damit erhält eine neue Observable Instanz. Diese muss eine Funktion zurückgeben, die im Falle eines dispose
Aufrufs ausgeführt wird. Das ganze hat etwas von einem Destrktor. Es gillt als Konvention, dass kein weiterer
onNext() Call mehr nach dem onCompleted() kommen kann. Übrigens die Ausgabe sähe dann so aus:

```
> onNext: 42
> onCompleted
> disposed
```

Also so wie man es sich vorstellt. 
Eine nächste einfach möglichkeit besteht mit `Rx.Observable.range()`. Damit generiert man sich eine Sequenz,
auf die sich der Observer registrieren kann. Ich glaube wir hatten dazu heute schon einmal ein
Beispiel aber hier dann nochmal:

```javascript
var source = Rx.Observable.range(1, 5);

var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });
```

Die Signatur ist hier Startwert und die Anzahl der Schritte. Das gibt dann:

```
> onNext: 1
> onNext: 2
> onNext: 3
> onNext: 4
> onNext: 5
```

Hiermit lässt sich ganz einfach sequentielles in ein Observable packen. Doch interessanter wird es mit 
Methoden, die Events oder Asynchrones in Observables transformieren. Angefangen von
`Rx.Observable.fromEvent(element, eventName, [selector])` bis `Rx.Observable.fromCallback(func, [context], [selector])`
gibt es dort einige. Mit dem Ersten lassen sich auch Events auf JQuery Selectoren fangen:

```javascript
var input = $('#input');

var source = Rx.Observable.fromEvent(input, 'keyup');

var subscription = source.subscribe(
  function (x) {console.log('Next: key pressed!');},
  function (err) {console.log('Error: %s', err);},
  function () {console.log('Completed');});
```
 
So lassen sich realativ einfach Autocomplete Funktionen umsetzen. Mit der Callback Methode ließen sich 
bspw. blockende Dateizugriffe in NodeJs bewältigen:

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

Das ist zwar jetzt nur die Existenz aber der reine Zugriff ließe sich damit auch machen.

Wenn wir die Kids dann nach dem Vorbild von RxJS erzeugt haben wollen wir auch mit ihnen `Arbeiten`. Am liebsten
Wollen wir sie mit Queries - also Abfragen - versehen, wie wir es auf Collections gewohnt sind. Das heißt
wir wollen Projektionen wir `.map()` oder `.flatMap()` ausführen, dazu wollen wir die Resultate Filtern
`.filter()` oder gar zusammenführen `.merge()`/`.concat()`. Da die Jungs, die die Reactive Extensions gebaut
haben alle samt aus dem .net Umfeld kommen kannten sie natürlich auch `LINQ - Language Integrated Query`.
Es ist kein wunder, aber Rx wird meist auch Eventbasiertes oder asynchrones LINQ genannt. Und das beantworted
auch die Frage nach den Operatoren. Natürlich gib es diese - und zwar ganz nach dem Vorbild von LINQ. Aber
sie sollten uns aus dem Handling von Collections auch in Javascript nicht ganz fremd sein. 

Fangen wir einmal bei letzteren an: den Kombinationen. So lassen sich also mit `.concat()` / `.merge()` also
ganze Streams vereinen. Doch wo ist der Unterschied? Schauen wir es uns einfach an:

```javascript
var sourceOne = Rx.Observable.range(1,5);
var sourceTwo = Rx.Observable.range(6,5);

var merged = sourceOne.concat(sourceTwo);
var disposal = merged.subscribe(function (x) {
	console.log('Merged onNext: ' + x); 
});
```

Was gibt das wohl? Richtig ...

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

Die Einträge werden direkt an einander gehangen. Mit merge ....

```javascript
var sourceOne = Rx.Observable.range(1,5);
var sourceTwo = Rx.Observable.range(6,5);

var merged = sourceOne.merge(sourceTwo);
var disposal = merged.subscribe(function (x) {
	console.log('Merged onNext: ' + x); 
});
```

Gibt das dann wirklich, was man von einem Merge erwarted:

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

Die Werte werden direkt in einander gefädelt. (Streams => #4?)

Wertemengen lassen sich aber nicht nur Vergrößern. So kann man mit `.filter()`
beispielsweise nur bestimmte Werte im Stream durch lassen:

```javascript
var source = Rx.Observable.range(1,10);

var filtered = source.filter(function (x) {
    return x % 2 === 0;
});

var disposal = filtered.subscribe(function (x) {
    console.log('onNext: ' + x);
});
```

Wie bei jedem Filter gibt man ein Boolean zurück, der über Weiter oder nicht Weiter
für den Wert entscheidet. Das Resultat sähe dann so aus:

```
> onNext: 2
> onNext: 4
> onNext: 6
> onNext: 8
> onNext: 10
```
Nun noch zu den sogenannten Projektionen. Das Funktionen, die Werte im Stream für
nachfolgende Operatoren oder den Observer selbst in ein anderes Format bringen kann. Dabei wirken sich
Änderungen nicht auf Andere Observer aus. Das heißt das folgende Beispiel:

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

Hier wollen interessieren wir uns also nur für die Ids in einer Liste von Filmen.
Also subscriben wir uns auch nur auf Diese. Als Ergebniss erhielte man dann:

``` 
onNext Id: 1
onNext Id: 2
onNext Id: 3
```

Wie erwarted. Was macht dann eigentlich `.flatMap()` anders? Dieses Map kann auch auf
ineinander geschachtelte Observables mit einander Verbinden oder eine Projektion
darauf ausführen:

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

Was kann das wohl ergeben? Das äußere Observable Object ist eine Range von 1 bis 2. Das
heißt es fließen beide Werte aus ihm heraus. Diese Landen dann im inneren Observable Objekt
welches in beiden durchläufen dann zu:

```javascript
return Rx.Observable.range(1, 2);
return Rx.Observable.range(2, 2);
``` 

wird. Diese ergeben dann nacheinander folgenden Output:

```
> onNext: 1
> onNext: 2
> onNext: 2
> onNext: 3
```

Es gibt noch viele weitere Operatoren um auf den Observalbes zu arbeiten. Eine gute
Zusmmenfassung findet man nach Kategorien getrennt unter
`https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/categories.md`

* * Das Kuckukskind - Subject => erst mal aus lassen, schauen wo ich zeitlich lande

Nun noch zu einem kontroversen Thema. Inzwischen verwenden eine Vielzahl von JavaScript-Familien
`Promises` um mit asynchronen Aufgaben umgehen zu können. Doch warum kommt jetzt Famile RxJS mit etwas neum daher?
Wir haben uns doch gerade erst daran gewöhnt. 
Es gibt zwei Gründe dafür. Zum einem geht es bei Streams um `Mehrere Werte` während bei Promisses immer nur der eine 
Datensatz kommt, den man beispielsweise gerade per AJAX angefragt hat. Außerdem fehlt den Promisses die Möglichkeit die
Registrierung auf die Antwort abzubrechen. Oder habt ihr schon man in während des Wartens auf eine Ajax Response dem
Server gesagt - nee will es jetzt doch nicht mehr haben?
Wer aber doch Promisses verwenden will und daraus Obserables bauen will, dem bietet sich eine `.fromPromise()` Methode.
Diese lässt zwar dann auch nur einen Wert an den Observer durch. Man könnte diesen aber mit anderen Streams concatenieren
oder mergen. Besteht der Stream dann eh nur aus einem Wert, so kann man kann man den Observer dann mit `.toPromise()`
wieder in ein Promise zurück transformieren.


So nun wollen wir doch mal Famile RxJS in Aktion sehen ...

## API Call auf Wikipedia

... Wir wollen für Familie RxJS jetzt noch eine kleine Application umsetzen mit sie in windeseile mal eben die API
von Wikipedia anpingen können. Dabei soll mit Hilfe eines Inputfeldes auf jedem keyup ein ein Request auf Wikipedia
abgesetzt werden wenn,  im Input mehr als 3 Buchstaben eingegeben wurden. Die Titel der Ergebnisse werden dann in
einer Liste dargestellt.

Bauen wir uns dazu erst einmal ein klein wenig HTML zusammen:


```html
<input type="text" id="input"/>

<h2>Results</h2>
<ul id="results">
</ul>
```


Ich fange jetzt nicht an das in irgendeiner Art und Weise zu stylen - kann ich eh nicht. Wir starten erst einmal damit
die keyups im Input zu sammeln:

```javascript
    var $input = $('#input');
    var $results = $('#results');

    var suggestions = Rx.Observable.fromEvent($input, 'keyup');
``` 

Darauf könnte man sich jetzt auch schon subscriben und mit den Werten arbeiten, die hier kommen. Doch wir wollen nur
wollen nur arbeiten, wenn der String schon länger als 2 Zeichen ist. Also:

``` javascript
var suggestions = Rx.Observable.fromEvent($input, 'keyup')
        .pluck('target', 'value')
        .filter(function(text) { return text.length > 2 })
        .debounce(500 /* ms */)
        .distinctUntilChanged();
```

Dazu wird der Input der Werte im Stream noch um eine halbe Sekunde verzögert und wir lassen nur distinkte Werte zu. Soo
das sieht doch schon noch besser aus. Die Werte können wir uns doch jetzt abgreifen und damit ein Request auf die API
fahren oder? Nein noch nicht! Wie wäre es denn wenn wir AJAX Request mit in den Stream einfließen ließen? `.flatMap()`
wäre da doch schon eine gute Idee, wir nehmen hier nur lieber gleich `.flatMapLatest()` um nur auf den letzten Wert
zuzugreifen. Der Operator könnte dann ja so aussehen:

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

Wir feuern hier gleich den Request ab und verwenden den Promise Ausgang von $.ajax(). flatMap macht daraus wieder ein 
Observalbe und gibt dann dieses Objekt im Stream weiter. Und genau das wollen wir, denn jetzt können wir uns direkt
auf das Ergebnis subscriben und ein wenig am DOM rum spielen, um das Ergebnis darzustellen:

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

Hier hängen wir jetzt nur noch die Ergebnisse, oder auch den Fehler, in eine zuvor gelehrte Liste ein. Das können wir
uns dann auch mal ganz anschauen => Browser => jsfidle => show Result + Console

So nun haben ich euch eine ganze Stunde in die Geschichte der Familie RxJS mitgenommen. Gibt es dazu Fragen?

** Scheduler
** Subject -> Guidline
