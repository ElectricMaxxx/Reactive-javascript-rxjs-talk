# Reactive Javascript mi RxJs


## Intro

* `Opening mit Slide für den Startbildschirm`
* `Vorstellung`  Das bin ich. Das Bild zieht sich inzwischen durch all meine Accounts im Internet.
Sowohl auf Twitter (point: @ElectricMaxxx) als auch auf Github (https://github.com/Electricmaxx).
In beiden Portalen lohnt es sich mir zu folgen. Auf Github sieht mein eigentlich meine stark PHP lastigen
Repositories. Das ist aber nur die halbe Wahrheit. In meiner Firma (Mayflower) übernehme ich immer wieder Frontend
Application oder führe Workshops. Mit Frontend meine ich jetzt aber nicht dieses Design Krams.
Aber wir sind ja heute nicht wegen mir hier ...
* `Zum Thema - Was ist überhaupt Reactive?` Es geht um Reactive. Im Speziellen um die Implementierung
in JavaScript. Doch schauen wir uns erst einmal die ...
* `History` ... an. 
Mitte der 2000er (sagt man so?) haben `Erik Mejer` und `Brian Backman` bei Microsoft ein Cloud Programming Team
gegründet. In dem Team befand sich auch
[Mathew Podwysocki](https://twitter.com/mattpodwysocki) `=> images/contributers_rxjs.png`
Die Jungs hatten in dem Projekt den schönen Effekt, dass sie unbegrenztes Budget hatte.
Sie sollten eigentlich die Cloud ergründen und bauten dabei fast aus Zufall die Reactive Extension.
Es wird auch als `LINQ to Events` bezeichnet.
Ich bin ja hier auf einer .net lastigen Konferenz, da muss ich wohl nicht groß erklären was 
LINQ ist, oder? (Innerhalb von .net einheitliche Methode um auf Daten zuzugreifen - Language Integrated Query)
Doch wie ist das geschehen? Es begann mit einem Projekt names `Volta` Es sollte wohl Applications
plattformunabhängig kompilierbar machen. So kam es dazu, dass man versuchte `Windows Forms` in Web Forms
mit Hilfe von HTML und JavaScript für die "Plattform" Web zu kompilieren. Doch das Web ist asynchron. 
Promises gab es noch nicht. Also stand man in der wohlbekannten asynchronen Hölle. Dazu kommen Events
bspw. in Ajax Calls mehr als Metadaten vor.
* Schauen wir uns doch einmal ein simples `Drag&Drop` an - und davon einfach nur die Mausbewegung:
* * Wir registrieren Eventlistener
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
```javascript
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

Doch nun ...

## An die Bar

Ich möchte euch kurz die Akteure vorstellen:
* Das `Iterator Pattern` => `TODO: UML Image = > #2` beschreibt einen Einheitlichen Umgang mit Array, Collects oder
oder ähnlichem. Mit Umgang meine ich das Traversieren der Einträge ohne sich über die Strucktur gedanken zu machen.

```javascript
var List = (function () {
    var index = 0,
        data = [1, A, 3, B, 5],
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
```

Die Methoden sind natürlich noch sinnvoll zu implementieren. Aber man sollte eine Ausgabe in der Form erhalten:

```
> 1
> A
> 3
> B
> 5
```

Das Handling von Collections wird aber nicht nur durch das Iterator Pattern bestimmt. So lassen sich auf
solchen Listen auch wunderbar Queries durch `Functional Programming` absetzen. Stellen wir uns mal folgende
Aufgabe vor: `Liste von Filmen => trage id + title von Filmen mit Rating 5.0 zusammen` Das könnte so auf 
einem onDemand System a la Netflix passieren. Das heißt wir haben eine Liste wie:

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

Wir könnten jetzt wie folgt vorgehen:

```javascript
var newList = [];
for(var i = 0; i <= videos.length; i++) {
    if (videos[i].rating === 5.0) {
        newList.push({id: videos[i].id, title: videos[i].title})
    }
}

console.log(newList);
```

ein wenig besser wäre vielleicht:

```javascript
var newList = [];

videos.forEach(function (video) {
    newList.push({id: video.id, title: video.title})
});

console.log(newList);
```

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

Wir arbeiten hier jetzt mit einer Filter-Funktion (reduce) und einer Projektion (map)
mit der dann die Richtigen Werte generiert werden.

TODO klären ab wann und wo die funktionen vorhanden sind => #1

Was dieses Vorghen aumacht: Es ist Pull basiert. Das heißt Werte, die man haben will holt man sich aus der
Liste und eben nur genau die.

Neben dem Iterator Pattern ging es ja auch um das `Observer Pattern` => `Todo: Image => #3`. Dieses beschreibt die Verbindung zwischen 
einem Beobachteten Objekt und seinen Beobachtern. Dabei wird wohl eher ein bestimmter Status-Wechsel beobachtet
als das Objekt an sich. Bei dem beobachteten Object spricht man von dem Subject oder besser Observable 
(engl. beobachtet). Dieses stellt eine methode zum subscriben berereit. Das heißt ein Beobachter - auch 
Observer genannt - registriert sich und meldet interesse an Status Wechseln an. Damit der Observable den Observer
über Änderungen informieren kann, muss dieser eine Methode zum Mitteilen implementieren (bspw. notify()).
Der Observable sollte dann natürlich auch eine Methode zum unsubscriben bereithalten damit der Observer
seine Registrierung auch wieder Rückgängig machen kann.

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
    });

// unsubscribe
disposal.dispose();
```
Das sieht jetzt ein wenig mehr Schreibarbeit für die Ausgabe eines Arrays aus. 
Aber stellen wir uns einmal vor, das wären jetzt Push Notifications aus einer WebSocket
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

Wenn der Observer, wie obn im Beispiel nicht nur aus Callbacks, besteht, also so ...

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
/**
 * Provides a mechanism for receiving push-based notifications.
 */
function Observer() { }

/**
 * Provides the observer with new data.
 *
 * @param {Any} value The current notification information.
 */
Observer.prototype.onNext = function (value) { ... };

/**
 * Notifies the observer that the provider has experienced an error condition.
 *
 * @param {Error} error An object that provides additional information about the error.
 */
Observer.prototype.onError = function (error) { ... };

/**
 * Notifies the observer that the provider has finished sending push-based notifications.
 */
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

var disposal1 = reducedSource.subscribe(
  function (x) {
        console.log('Next 1: ' + x);
    },
    function (err) {
        console.log('Error 1: ' + err);
    },
    function () {
        console.log('Completed 1.');
    });

disposal1.dispose();

var disposal2 = source.subscribe(
function (x) {
        console.log('Next 2: ' + x);
    },
    function (err) {
        console.log('Error 2: ' + err);
    },
    function () {
        console.log('Completed 2');
    });
disposal2.dispose();
```

(Hint: auf Slides verteilen)

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

Damit das Observable Object erst einmal grundlegend funktioniert benötigt es
ein `subscribe()` Methode ...

```javascript
/**
 * Defines a method to release allocated resources.
 */
function Disposable() { }

/**
 * Performs application-defined tasks associated with freeing, releasing, or resetting resources.
 */
Disposable.prototype.dispose = function () { ... }

/**
 * Defines a provider for push-based notification.
 */
function Observable() { }

/**
 * Notifies the provider that an observer is to receive notifications.
 *
 * @param {Observer} observer The object that is to receive notifications.
 * @returns {Disposable} A reference to disposable that allows observers to stop receiving notifications before the provider has finished sending them.
 */
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
Eine nächste einfach möglichkeit besteht mit `Rx.Observable.range()`. Damit generiert man sich ähnlich wie mit einem
Array eine Sequenz, auf die sich der Observer registrieren kann. Ich glaube wir hatten dazu heute schon
einmal ein Beispiel aber hier dann nochmal:

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
  function (x) {
    console.log('Next: key pressed!');
  },
  function (err) {
    console.log('Error: %s', err);
  },
  function () {
    console.log('Completed');
  });
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

Wenn wir die Kids dann nach dem Vorbild von RxJS erzeugt haben wollen wir auch mit ihnen Arbeiten. Am liebsten
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
> Merged onNext: 1
> Merged onNext: 2
> Merged onNext: 3
> Merged onNext: 4
> Merged onNext: 5
> Merged onNext: 6
> Merged onNext: 7
> Merged onNext: 8
> Merged onNext: 9
> Merged onNext: 10
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
Rx.Observable.range(1, 2);
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


## Wir bauen ein Beispiel
* Autocomplete mit Wikipedia API Request
* Wie im WebExample

ToDo:
* Ausformulieren von einzelnen Punkten
* Noch erwähnen: 
** Scheduler
** Subject -> Guidline
** All together
