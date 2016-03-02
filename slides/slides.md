## Reactive JavaScript mit RxJS - BASTA! 2016
#### Maximilian Berghoff - 23.03.2016

Note: Wollen wir loslegen?
      Bevor wir wirklich los legen eine kurze ....

KLICK

---

<span class="title-container">![Title-Pic](/docs/images/title_picture.jpg)</span>

- Maximilian Berghoff <!-- .element: class="fragment" -->
- @ElectricMaxxx <!-- .element: class="fragment" -->
- github.com/electrimaxxx <!-- .element: class="fragment" -->
- Maximilian.Berghoff@mayflower.de <!-- .element: class="fragment" -->
- Mayflower GmbH - Würzburg <!-- .element: class="fragment" -->

Note: Das bin ich. Das Bild zieht sich inzwischen durch all meine
      Accounts im Internet. Sowohl auf Twitter...
      KLICK (point: @ElectricMaxxx) als auch auf Github ... KLICK
      (https://github.com/ElectricMaxxx). Trotze des Bildes lohnt es sich in beiden Portalen mir zu folgen.
      Auf Github sieht man meine eigentlich meine stark PHP lastigen
      Repositories. (CMF) Das ist aber nur die halbe Wahrheit. In meiner Firma (Mayflower) übernehme
      ich immer wieder Frontend Application oder führe Workshops durch. Mit Frontend
      meine ich jetzt aber nicht dieses Design Krams. Aber wir sind ja heute nicht wegen mir hier ...
      KLICK

---

# Reactive Extensions - Rx

Note: Nun zum Thema : Im groben geht es heute um `Reactive Extensions - Rx` Im Speziellen um die Implementierung
      in JavaScript. Doch schauen wir uns erst einmal die ...
      KLICK

---

# History

## Erik Meier <!-- .element: class="fragment" -->
## Brain Backman <!-- .element: class="fragment" -->
## Mathew Podwysocki <!-- .element: class="fragment" -->

Note: ... Geschichte an.
      Mitte der 2000er (sagt man so?) haben `Erik Mejer` und `Brian Backman` bei Microsoft ein Cloud Programming
      Team gegründet. In dem Team befand sich auch
      [Mathew Podwysocki](https://twitter.com/mattpodwysocki), den man nicht vergessen sollte, weil ...
      KLICK

---

<!-- .slide: data-background="../docs/images/contributers_rxjs.png" -->

Note: Die Jungs hatten in dem Projekt den schönen Effekt, dass sie unbegrenztes Budget hatten.
      Sie sollten eigentlich die Cloud ergründen und bauten dabei fast aus Zufall die Reactive Extension.
      Dort und im Nachgang werden sie auch als ... KLICK

---

# LINQ to Events

Note: ... `LINQ to Events` bezeichnet.
      Ich bin ja hier auf einer .net lastigen Konferenz, da muss ich wohl nicht groß erklären was 
      LINQ ist, oder? (Innerhalb von .net einheitliche Methode um auf Daten zuzugreifen
      - Language Integrated Query)
      Doch wie kamen die Jungs dazu? Es begann mit einem Projekt mit dem Namen ... KLICK

---

# Volta

![Volta](../docs/images/volta.jpeg)

Note: ... `Volta`. Das hat Nichts mit dem Physiker zu tun. Es sollte Applikationen
      plattformunabhängig kompilierbar machen. So kam es dazu, dass man versuchte ... KLICK

---

# Windows Forms
# <=> <!-- .element: class="fragment" -->
# Web Forms <!-- .element: class="fragment" -->

Note: ... `Windows Forms` ... KLICK ...  in ... KLICK ... `Web Forms` umzuwandeln.
      Die Zielplatform ist also das Web mit HTML + JavaScript. Doch das Web ist asynchron. 
      Promises gab es noch nicht. Also stand man in der wohlbekannten asynchronen Hölle. Dazu kommen Events
      bspw. in Ajax Calls mehr als Metadaten vor. ... KLICK

---

## Beispiel:
# Drag & Drop <!-- .element: class="fragment" -->
## Mausbewegung verfolgen <!-- .element: class="fragment" -->

Note: Schauen wir uns doch einmal ein Beispiel an: ... KLiCK  `Drag&Drop` an - und noch einfacher:
      ... KLiCK ...  davon einfach nur die Mausbewegung, das heißt wir müssen ... KLICK

---

## Event Listener Registrieren

```javascript
elem.addEventListener('mousedown', mousedown, false);
elem.addEventListener('mouseup', mouseup, false);
elem.addEventListener('mousemove', mousemove, false);
```
Note: ... Die Event Listener Registrieren, um das klicken, bewegen und loslassen der Maus zu erfassen. Dazu implementieren wir die Funktionen
      für die Callbacks: ... KLICK
      
---

## mouse down

```javascript
function mousedown(e) {
    isDown = true;
    state = { startX: e.offsetX, startY: e.offsetY};
}
```
Note: ... Mouse down, also man beginnt zu klicken ... KLICK

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

Note: ... Für die Mouse Bewegung wird einfach nur mal die Entfernung getrackt ... KLICK

---

## mouse up

```javascript
function mouseup (e) {
    isDown = false;
    state = null;
}
```

Note: ... und dann noch das Mouse UP, wenn die Bewegung vorbei ist. Was wir nicht vergessen sollten ... KLICK

---

## unsubscribe

```javascript
function dispose() {
    elem.removeEventListener('mousedown', mousedown, false);
    elem.removeEventListener('mouseup', mouseup, false);
    elem.removeEventListener('mousemove', mousemove, false);
}
```

Note: ... sich wieder zu Lösen - vom Listener. Hier den Überblick zu behalten ist schon schwer und kommt einem Jonglieren
      von State und Event schon nahe. Dazu kommen jetzt wohl noch interaction mit einer API oder local storages usw - 
      alles asynchron. Doch nun erst einmal an ... KLICK

---

<!-- .slide: data-background="../docs/images/bar.jpg" -->

Note: ... die Bar. Es sieht auf dem Bild zwar gerade leer aus, aber am Abend treffen sich hier ... KLICK

---

# Die Akteure

Note: ... Die Akteuere unseres heutigen Stückes. Ich möchte sie euch vorstellen: ... KLICK

---

# Iterator Pattern

Note: Das `Iterator Pattern`. Es beschreibt einen Einheitlichen Umgang mit Array, Collections oder
      oder Ähnlichem. Mit Umgang meine ich das Traversieren der Einträge ohne sich über die Strucktur Gedanken 
      machen zu müssen.
      Schauen wir uns einmal an, wie das aussehen könnte: ... KLICK

---

```javascript
var Iterator = function () {};

Iterator.prototype.next();

Iterator.prototype.rewind();

Iterator.prototype.current();

Iterator.prototype.hasNext();
```

Note: Hinter solch einem Objekt steckt ja meist immer irgend ein Liste. Man kann sich damit den aktuellen Wert
      Ausgeben lassen auf den gerade ein Zeiger zeigt, man kann den Zeiger um eins nach vorne Stellen, man
      kann erfragen ob es noch einen nächsten gibt, oder gar den Zeiger auf Anfang zurück setzen. Dabei ist die
      Idee mit dem Zeiger schon wieder ein Teil der Implementierung, der mich als Nutzer eines Iterators schon nicht interessieren sollte.
      Aber, mit einer Kombination aus `.next()` und `.hasNext()` ließe sich nun relativ einfach traversieren.
      ... KLICK

---

# Traversieren

```javascript
while (Iterator.hasNext()) {
    console.log(Iterator.next());
}
```

Note: Das Handling von Collections wird aber nicht nur durch das Iterator Pattern bestimmt. So lassen sich auf
      solche Listen auch wunderbar Queries absetzen. Stellen wir uns mal folgende Aufgabe vor: ... KLICK

---

# Gedankenspiel

- Liste von Cocktails <!-- .element: class="fragment" -->
- Eigenschaften: id, name, zutaten, prozent, ... <!-- .element: class="fragment" -->
- Aufgabe: "id & name von allem Contails mit prozent > 5.0" <!-- .element: class="fragment" -->

Note: `Liste von Cocktails => trage id + name von Cocktails mit mehr als 5.0% Alc zusammen`
       Das heißt wir haben eine Liste wie:
       ... KLICK
       
---

```javascript
var cocktails = [
    {id: 100001, name: 'Piña Colada', zutaten: [], prozent: 5.0 },
    { id: 100002, name: ' Tequila Sunrise', zutaten: [], prozent: 6.0 },
    { id: 100003, name: ' Long Island', zutaten: [], prozent: 7.0 },
];
```

Note:  Die Liste ist jetzt noch nicht so lang. Mein Alkohol-Konsum ist nicht derart hoch. Bitte nagelt mich jetzt
       auch nicht auf den Werten für die Volumen Prozent fest.
       Um durch die Liste zu kommen, könnten jetzt wie folgt vorgehen:
        ... KLICK

---

```javascript
var newList = [];
for(var i = 0; i <= cocktails.length; i++) {
    if (cocktails[i].prozent > 5.0) {
        newList.push({id: cocktails[i].id, title: cocktails[i].title})
    }
}

console.log(newList);
```

Note: Ja .. naiv würde man so erst einmal eine Liste durch wühlen und auswerten, besser ... KLICK

---
```javascript
var newList = [];
cocktails.forEach(function (cocktail) {
    if (cocktails[i].prozent > 5.0) {
        newList.push({id: cocktail.id, title: cocktail.title})
    }
});
```

Note: Wäre jetzt schon eine Array-Funktion dafür zu verwenden. Aber richtig cool ... KLICK

---

```javascript
var newList =
    cocktails
        .reduce(function (cocktail) {
            return cocktail.prozent > 5.0;
        })
        .map(function (cocktail) {
           return  {id: cocktail.id, title: cocktail.title};
        });

console.log(newList);
```

Note: ... Hier wir jetzt schon ein funktionaler Ansatz verwendet. `.reduce()` liefert nur noch die
      Einträge zurück für die `true` zurück gegeben wird. `.map()` transformiert das Ergebnis. 
      Im Grunde läuft jeder Wert einmal von oben nach unten durch, wenn er an reduce vorbei kommt natürlich.
      Was dieses Vorghen aumacht: Es ist Pull basiert. Das heißt Werte, die man haben will holt man sich aus der
      Liste filtert Diese und sucht sich dann noch die richtigen Properties raus.
      Neben dem Iterator Pattern ging es ja auch noch um das ... KLICK

---

# Observer Pattern

Note: Das `Observer Pattern`, als zweiten Akteur an der Bar.
      Dieses beschreibt die Verbindung zwischen einem Beobachteten Objekt - dem Subject oder Observable -
      und seinen Beobachtern - dem Observer.
      Dabei wird eher ein bestimmter Status-Wechsel beobachtet. Das Observable Objekt stellt dem Observer
      eine Methode zum Registrieren berereit. ... KLICK

---

```
Observable.prototype.subscribe()
```

Note: `Observable.prototype.subscribe()` könnte solch
      ein Interface aussehen. Nun meldet ein Observer Interesse an dem Observable an.
      Damit der Observable den Observer über Änderungen informieren kann, muss der Observer wiederum eine Methode zum
      Mitteilen implementieren. Die könnte beispielsweise ... KLICK

---

```javascript
Observer.prototype.notify()
```

Note: `Observer.prototype.notify()` lauten.
      Der Observable sollte dann natürlich auch eine Methode zum unsubscriben bereithalten damit der Observer
      seine Registrierung auch wieder Rückgängig machen kann. ... KLICK

---

```javascript
var Observable = function () {};

Observable.prototype.unsubscribe = function () {};

Observable.prototype.unsubscribe = function () {};

var Observer = function () {};

Observer.prototype.notify = function() {};
```

Note: Und so könnte es zusammen gefasst aussehen. Aber ... KLICK

---

# Warum?

- Entkopplung <!-- .element: class="fragment" -->
- weniger prozedualer Code <!-- .element: class="fragment" -->
- Erweiterbarkeit erhöht <!-- .element: class="fragment" -->

Note: `Was bringt einem das ganze?`. ... KLICK `Entkopplung` Man verhindert dann doch all zu ... KLICK prozedualen Code. 
      Dem Observable muss es nicht interessieren wer da in der Leitung hängt - Hauptsache er kann jedem seine Änderung
      mitteilen. Als Observer kann ich mich ganz auf die Reaktion zu gegebenen Events konzentrieren. Nun sind
      wir bei `Events`. Diese sind im Web Context das Mittel der Wahl um Informationen vom Observable zum 
      Observer zu übermitteln. So implementieren wir sog. Event Handler, also Callback-Funktionen, um auf
      Ereignisse im Browser reagieren zu können. Wir haben ja vorhin schon ein Beispiel dazu gesehen.
      Nun kommt es wie es kommen musste. Der Abend in der Bar war zu schön. Beide Pattern lernten sich näher kennen
      und es kam zur ... KLICK

---

<!-- .slide: data-background="../docs/images/hochzeit.jpg" -->

# Die Hochzeit


<span class="attribution">By Ziko van Dijk (shot by myself) [<a href="http://www.gnu.org/copyleft/fdl.html">GFDL</a> or <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a>], <a href="https://commons.wikimedia.org/wiki/File%3A2007-09-01trauungk%C3%B6ln.jpg">via Wikimedia Commons</a></a></span>

Note:... Sie entschieden sich dazu als sog. ... KLICK
      
---

# Reactive Extension

- RxJava <!-- .element: class="fragment" -->
- <b>RxJS</b> <!-- .element: class="fragment" -->
- Rx.Net <!-- .element: class="fragment" -->
- Rx.Scala <!-- .element: class="fragment" -->
- Rx.Clojure <!-- .element: class="fragment" -->
- Rx.Swift <!-- .element: class="fragment" -->
- ... <!-- .element: class="fragment" -->

Note: `Reactive Extensions` gemeinsame Wege zu gehen. Doch warum `Plural?`
      Nun, ... es gibt verschiedene Implementierungen KLICK KLICK
      Wenn man sich einen Überblick verschaffen will sollte man mal die Website ... KLICK

---

# [Reactive.io](http://reactivex.io/)

Note: `http://reactivex.io/` besuchen
      oder man wirft ein Blick in die Github Organisation unter der alles zusammen gefasst ist:

---

## [github.com/Reactive-Extionsion](https://github.com/Reactive-Extension)

Note: https://github.com/Reactive-Extension`. Doch was mach diese Vereinigung nun aus? Mit Rx kann sich ein 
      Observer nun auf einen sog. ... 

---

# Stream von Events

Note: `Stream von Events` subscriben. Um diesen Stream zu begrenzen werden von den Observables
      Operatoren bereit gestellt, den Stream für ein Observer manipulieren oder filtern können.
      Aus ... 

---

```javascript
var list = [1, 2, 3, 4, 5];

list.forEach(function (item) {
    console.log("nexItem: %s", item);
});
```
Note: ... Wird jetzt ...

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

Note: Das sieht jetzt ein wenig mehr Schreibarbeit für die Ausgabe eines Arrays aus. 
      Aber stellen wir uns einmal vor, das wären jetzt Push Notifications von einem WebSocket
      Verbindung oder Informationen aus dem Mouse-Move-Events, wie sie vorhin gebaut haben. Zu den genaueren 
      Vorgängen komme ich im Anschluss.
      Ja was folgt im Anschluss an eine Hochzeit. Ja ? ... KLICK
      
---

<!-- .slide: data-background="../docs/images/kinder.jpg" -->

<span class="attribution">By Vince Alongi (Flickr) [<a href="http://creativecommons.org/licenses/by/2.0">CC BY 2.0</a>], <a href="https://commons.wikimedia.org/wiki/File%3AKindergarten_kids_at_a_public_school_in_Montevideo%2C_Uruguay.jpg">via Wikimedia Commons</a></span>

Note: ... Die gemeinsamen Kinder. Die Flitterwochen waren noch nicht einmal ganz vorüber, da standen relativ kurz nacheinander
          die Geburt zweier Kids an. Beide haben ihre eigenen Eigenschaften und Funktionen. So wie die kleine Prizessin daheim lieber mit 
          ihren Pferden spielt und der Lausebub sich gern mit seinen Kumpels rauft. Die Geschlechterzuweisung in der
          Realität lasse ich jetzt einmal offen. Die Eigenschaften möchte ich euch an kurzen
          Schnipseln demonstrieren. Ich werde die Slides natürlich zugänglich machen. D.h. damit hat
          man dann auch eine gute Zusammenfassung der wichtigsten Funktionen.
          
          So dann schauen wir uns die Racker mal an ... KLICK

---

# Observer

Note: ... Wenn also der `Observer`, wie im Beispiel nicht nur aus Callbacks, ...

---

```javascript
var disposal = source.subscribe(
    function (x) {console.log('Next: ' + x);},
    function (err) {console.log('Error: ' + err);},
    function () {console.log('Completed');}
);
```

Note: ... sollte er Methoden implementieren, die vom Observalbe Object aufgeufn werden können um über neue Werte, 
      über einen Fehler oder über das Ende zu informieren. Das ist ja schon Bestandteil des Observer Pattern.

---


```javascript
function Observer() { }

Observer.prototype.onNext = function (value) { ... };

Observer.prototype.onError = function (error) { ... };

Observer.prototype.onCompleted = function () { ... };
```

Note: Wir haben hier die `onNext()` Methode, diese wird immer aufgerufen, wenn ein neuer Wert eintrifft. Beispielsweise
      würde ohne Filter mit einer Subscription auf Mouse-Move-Events, jeder Punkt der Bewegung einen Aufruf von `onNext()`
      zu folge haben. Die beiden anderen Methoden beenden automatisch die Registrierung. `onError()` wird, wie der
      Name schon vermuten lässt im Fehlerfall aufgerufen. `onComplete`, wenn ein Stream beendet wird. Nach dem Aufruf
      beider Funktionen gibt es keinen weiteren Aufruf von `onNext()` mehr.
      Es reicht aber vollkommen aus, die drei Funktionen als Callback-Funktionen der `subscribe()` Methode zu übermitteln.
      Die Reihenfolge ist dabei `onNext, onError, onCompleted`
      Damit hat jeder Observer für sich allein die Möglichkeit Werte aus dem Stream abzugreifen und auf Fehler zu reagieren.
      Dabei beeinflusst er andere Subscriber nicht: ... KLICK

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

Note: Was haben wir hier? Wir bauen uns ein Observable, der einfach die Werte von 1 .. 10 durch gibt.
      Auf diesen registrieren wir uns einmal in Gänze und einmal reduziert - nur die geraden Wert.
      Der Output sieht dann so aus ... KLICK
      
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

Note: Zum endlich zum ' Observable` Objekt ... KLICK
            
---

# Observalbe

Note: Damit das Observable Objekt erst einmal grundlegend funktioniert benötigt es
      ein `subscribe()` Methode ... KLICK

---

```javascript
function Disposable() { }

Disposable.prototype.dispose = function () { ... }

function Observable() { }

Observable.prototype.subscribe = function (observer) { ... }
```

Note: .. wie man hier erkennen kann dient diese nicht nur zum registrieren auf einem Stream,
      sondern liefert gleich ein `Disposable` Objekt zurück. Mit diesen kann man sich dann
      auch wieder ganz einfach Abmelden. Damit erhällt man auch keine Notifications mehr.
      Der `subscribe()` Methode übergibt mein den Observer. Das kann entweder ein Objekt
      nach dem vorhin definierten Interface sein, oder man übergibt einfach alle drei 
      Funktionen einzeln als Callbacks. Zumindest die `onNext()` muss übergeben werden sonst
      macht das ganze Registrieren keinen Sinn mehr.
      Nun waren die Kids echt so cool, dass beide Eltern begannen anderen Eltern von ihnen zu erzählen. Und da man
      das heute wohl so als stolze Eltern macht, wurde ein eigner ... KLICK

---

# Youtube

Note:  Youtube-Channel eingerichtet ...
       ... er sollte nun viele anderen Eltern zeigen wie sie selbst solche Kids bekommen können. Ich habe mir die 
       mal für euch angeschaut. Und wie gehts los? Beim ersten Video geht es zum die ... KLICK

---

# (Er-) Zeugung

Note: `(Er-) Zeugung`. Ich erspare
      euch jetzt einmal die Bilder. Bleiben wir lieber bei den Fakten - also dem Code.
      Fangen wir einmal mit einer einfachen Methode zum Erzeugen an  ... KLICK

---

```javascript
Rx.Observable.create()
```

Note: `Rx.Observable.create()`. Dieser Methode übergibt man eine Constructor Funktion,
      die selbst den Observer als Parameter bekommt. Hier ein Beispiel ... KLICK
      
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

Note: Damit erhält eine neue Observable Instanz. Diese muss eine Funktion zurückgeben, die im Falle eines dispose
      Aufrufs ausgeführt wird. Das ganze hat etwas von einem Destrktor. Es gillt als Konvention, dass kein weiterer
      onNext() Call mehr nach dem onCompleted() kommen kann. Übrigens die Ausgabe sähe dann so aus: ... KLICK

---

```
> onNext: 42
> onCompleted
> disposed
```
Note: Also so wie man es sich vorstellt.  ... KLICK

---

```javascript
Rx.Observable.range()
```

Note: Eine nächste einfach möglichkeit besteht mit `Rx.Observable.range()`. Damit generiert man sich eine Sequenz,
      auf die sich der Observer registrieren kann. Ich glaube wir hatten dazu heute schon einmal ein
      Beispiel aber hier dann nochmal: ... KLICK
      
---

```javascript
var source = Rx.Observable.range(1, 5);

var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); }
);
```

Note: Die Signatur ist hier Startwert und die Anzahl der Schritte. Das gibt dann: ... KLICK

---

```
> onNext: 1
> onNext: 2
> onNext: 3
> onNext: 4
> onNext: 5
```
Note: Hiermit lässt sich ganz einfach sequentielles in ein Observable packen. Doch interessanter wird es mit 
      Methoden, die Events oder Asynchrones in Observables transformieren. Angefangen von ... KLICK
      
---

```javascript
Rx.Observable.fromEvent(element, eventName, [selector])
// oder
Rx.Observable.fromCallback(func, [context], [selector])
```

Note: `Rx.Observable.fromEvent(element, eventName, [selector])` bis `Rx.Observable.fromCallback(func, [context], [selector])`
      gibt es dort einige. Mit dem Ersten lassen sich auch Events auf JQuery Selectoren fangen: ... KLICK

---

```javascript
var input = $('#input');

var source = Rx.Observable.fromEvent(input, 'keyup');

var subscription = source.subscribe(
  function (x) {console.log('Next: key pressed!');},
  function (err) {console.log('Error: %s', err);},
  function () {console.log('Completed');});
```

Note: So lassen sich realativ einfach Autocomplete Funktionen umsetzen. Mit der Callback Methode ließen sich 
      bspw. blockende Dateizugriffe in NodeJs bewältigen: ... KLICK

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

Note: Das ist zwar jetzt nur die Existenz aber der reine Zugriff ließe sich damit auch machen.      
      Wenn wir die Kids dann nach dem Vorbild von RxJS erzeugt haben wollen wir auch mit ihnen ... KLICK 

---

<!-- .slide: data-background="../docs/images/Kinderarbeit.jpg" -->

<span class="attribution">von Unbekannt [Public domain], <a href="https://commons.wikimedia.org/wiki/File%3AKinderarbeit.jpg">via Wikimedia Commons</a></span>

Note: `Arbeiten`. Am liebsten
      Wollen wir sie mit Queries - also Abfragen - versehen, wie wir es auf Collections gewohnt sind. Das heißt
      wir wollen Projektionen wir `.map()` oder `.flatMap()` ausführen, dazu wollen wir die Resultate Filtern
      `.filter()` oder gar zusammenführen `.merge()`/`.concat()`. Da die Jungs, die die Reactive Extensions gebaut
      haben alle samt aus dem .net Umfeld kommen kannten sie natürlich auch  ... KLICK

---

# LINQ
## Language Integrated Query

Note: `LINQ - Language Integrated Query`.
      Es ist kein wunder, aber Rx wird meist auch Eventbasiertes oder asynchrones LINQ genannt. Und das beantworted
      auch die Frage nach den Operatoren. Natürlich gib es diese - und zwar ganz nach dem Vorbild von LINQ. Aber
      sie sollten uns aus dem Handling von Collections auch in Javascript nicht ganz fremd sein.
      Fangen wir einmal bei letzteren an: den ... KLICK

---

# Kombination

```javascript
.concat();
// oder
.merge();
```

Note: ... Kombinationen. So lassen sich also mit `.concat()` / `.merge()` also
      ganze Streams vereinen. Doch wo ist der Unterschied? Schauen wir es uns einfach an: ... KLICK

---

```javascript
var sourceOne = Rx.Observable.range(1,5);
var sourceTwo = Rx.Observable.range(6,5);

var merged = sourceOne.concat(sourceTwo);
var disposal = merged.subscribe(function (x) {
	console.log('Concat onNext: ' + x); 
});
```

Note: Was gibt das wohl? Richtig ...

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

Note: Die Einträge werden direkt an einander gehangen. Mit merge ... KLICK

---

```javascript
var sourceOne = Rx.Observable.range(1,5);
var sourceTwo = Rx.Observable.range(6,5);

var merged = sourceOne.merge(sourceTwo);
var disposal = merged.subscribe(function (x) {
	console.log('Merged onNext: ' + x); 
});
```

Note: Gibt das dann wirklich, was man von einem Merge erwarted: ... KLICK

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

Note: Die Werte werden direkt in einander gefädelt.  ... KLICK    
      
---

# Filter

Note: Wertemengen lassen sich aber nicht nur Vergrößern. So kann man mit `.filter()`
      beispielsweise nur bestimmte Werte im Stream durch lassen:

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

Note: Wie bei jedem Filter gibt man ein Boolean zurück, der über Weiter oder nicht Weiter
      für den Wert entscheidet. Das Resultat sähe dann so aus: ... KLICK

---

# Output

```
> onNext: 2
> onNext: 4
> onNext: 6
> onNext: 8
> onNext: 10
```
Note: Eben genau wie wir es erahnt haben ... KLICK

---

# Projektionen

Note: Nun noch zu den sogenannten Projektionen. Das Funktionen, die Werte im Stream für
      nachfolgende Operatoren oder den Observer selbst in ein anderes Format bringen kann. Dabei wirken sich
      Änderungen nicht auf Andere Observer aus. Das heißt das folgende Beispiel:

---

```
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
```

Note: ... funktioniert für den Observer wie gewünscht, er erhält nur seine Liste der IDs ... KLICK

---

# Output

``` 
onNext Id: 100001
onNext Id: 100002
onNext Id: 100003
```

Note: ... eben auch mit dem gewünschten Output. Andere Observer haben diese Projektion nicht erhalten
      also die komplette Quelle. ... KLICK
      
---

# ?

```javascript
.flatMap();
```

Note: Was macht dann eigentlich `.flatMap()` anders? Dieses Map kann auch auf
      ineinander geschachtelte Observables mit einander Verbinden oder eine Projektion
      darauf ausführen:


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

Note: Was kann das wohl ergeben? Das äußere Observable Object ist eine Range von 1 bis 2. Das
      heißt es fließen beide Werte aus ihm heraus. Diese Landen dann im inneren Observable Objekt
      welches in beiden durchläufen dann zu: ... KLICK
      
```

---

```javascript
return Rx.Observable.range(1, 2);
return Rx.Observable.range(2, 2);
``` 

Note: wird. Diese ergeben dann nacheinander folgenden Output:

---

# Output

```
> onNext: 1
> onNext: 2
> onNext: 2
> onNext: 3
```
Note: ... KLICK

---

# Noch mehr?

#### [Github/Dokumentation](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/categories.md) 

Note: Es gibt noch viele weitere Operatoren um auf den Observalbes zu arbeiten. Eine gute
      Zusmmenfassung findet man nach Kategorien getrennt unter
      `https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/categories.md`
      un noch zu einem kontroversen Thema. Inzwischen verwenden eine Vielzahl von JavaScript-Familien
      ... KLICK
      
---

# Promises?

- Single Value <!-- .element class="fragment" -->
- Cancellation? <!-- .element class="fragment" -->

Note: `Promises` um mit asynchronen Aufgaben umgehen zu können. Doch warum kommt jetzt Famile RxJS mit etwas neum daher?
     Wir haben uns doch gerade erst daran gewöhnt. 
     Es gibt zwei Gründe dafür. Zum einem geht es bei Streams um ... KLICK`Mehrere Werte` während bei Promisses immer nur der eine 
     Datensatz kommt, den man beispielsweise gerade per AJAX angefragt hat. Außerdem fehlt den Promisses die Möglichkeit die
     Registrierung auf die Antwort ... KLICK abzubrechen. Oder habt ihr schon man in während des Wartens auf eine Ajax Response dem
     Server gesagt - nee will es jetzt doch nicht mehr haben?
     Wer aber doch Promisses verwenden will und daraus Obserables bauen will, dem bietet sich eine `.fromPromise()` Methode.
     Diese lässt zwar dann auch nur einen Wert an den Observer durch. Man könnte diesen aber mit anderen Streams concatenieren
     oder mergen. Besteht der Stream dann eh nur aus einem Wert, so kann man kann man den Observer dann mit `.toPromise()`
     wieder in ein Promise zurück transformieren. Ein weiterer Punkt ist ... KLICK
     
---

# Array Operatoren
### vs.
# Rx Operatoren

Note:  Was ist jetzt der Unterschied? 

---

## Array Operatoren

* Komplette Liste wird durch gereicht
* dabei auf jedem Eintrag
* * Projektion - map, ..
* * Gefiltert - reduce, filter
* * Ergänzt - concat, merge

Note: Bei Array Operatoren wird immer das Ganze Array von Oben nach Unten durch gereicht. Dazu wird auf jedem
      Eintrag dann die Projektion (map, ..), der Filter, oder eine Kombination angewendet. Jedes dieser Element hat als
      Resultat wiederum eine neues Array - eben mit abgeänderten/gefilterten/ergänzten Werten.
      ... KLICK

---

## Rx Opertoren

* Jedes Event/Jeder Eintrag einzeln
* dabei
* * Projektion - map, ..
* * Gefiltert - reduce, filter
* * Ergänzt - concat, merge
* Filter = STOP => nicht weiter gereicht
* Ergänzung nur der Zugang für weiteren Stream

Note: Bei Rx wird immer wenn ein Event im Stream ist, genau dieses Event einmal durch gepushed. Genau dieses
      wird verändert (Projektion) oder gefiltert. Bei einer Kombination wird ein weiterer Stream angeschlossen, aus
      dem jetzt einzelnen Events kommen ...
      So nun wollen wir doch mal Famile RxJS in Aktion sehen ... KLICK

---


<!-- .slide: data-background="../docs/images/Thw_Betonkettensaege_in_aktion.jpg" -->
# Action
<span class="attribution">von Thiemo Schuff (Eigenes Werk) [<a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a>], <a href="https://commons.wikimedia.org/wiki/File%3AThw_Betonkettensaege_in_aktion.jpg">via Wikimedia Commons</a></span>

Note: ... Wir wollen für Familie RxJS jetzt noch eine kleine Application umsetzen mit sie in windeseile mal eben die API
      von Wikipedia anpingen können. Dabei soll mit Hilfe eines Inputfeldes auf jedem keyup ein ein Request auf Wikipedia
      abgesetzt werden wenn,  im Input mehr als 3 Buchstaben eingegeben wurden. Die Titel der Ergebnisse werden dann in
      einer Liste dargestellt. ... Bauen wir uns dazu erst einmal ein klein wenig HTML zusammen. ... KLICK

---

```html
<input type="text" id="input"/>

<h2>Results</h2>
<ul id="results">
</ul>
```

Note: Ich fange jetzt nicht an das in irgendeiner Art und Weise zu stylen - kann ich eh nicht. Wir starten erst einmal damit
      die keyups im Input zu sammeln: ... KLICK

---

```javascript
    var $input = $('#input');
    var $results = $('#results');

    var suggestions = Rx.Observable.fromEvent($input, 'keyup');
``` 

Note: Darauf könnte man sich jetzt auch schon subscriben und mit den Werten arbeiten, die hier kommen. Doch wir wollen nur
      wollen nur arbeiten, wenn der String schon länger als 2 Zeichen ist. Also: ... KLICK

---

``` javascript
var suggestions = Rx.Observable.fromEvent($input, 'keyup')
        .pluck('target', 'value')
        .filter(function(text) { return text.length > 2 })
        .debounce(500 /* ms */)
        .distinctUntilChanged();
```

Note: Dazu wird der Input der Werte im Stream noch um eine halbe Sekunde verzögert und wir lassen nur distinkte Werte zu. Soo
      das sieht doch schon noch besser aus. Die Werte können wir uns doch jetzt abgreifen und damit ein Request auf die API
      fahren oder? Nein noch nicht! Wie wäre es denn wenn wir AJAX Request mit in den Stream einfließen ließen? `.flatMap()`
      wäre da doch schon eine gute Idee, wir nehmen hier nur lieber gleich `.flatMapLatest()` um nur auf den letzten Wert
      zuzugreifen. Der Operator könnte dann ja so aussehen: ... KLICK

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

Note: Wir feuern hier gleich den Request ab und verwenden den Promise Ausgang von $.ajax(). flatMap macht daraus wieder ein 
      Observalbe und gibt dann dieses Objekt im Stream weiter. Und genau das wollen wir, denn jetzt können wir uns direkt
      auf das Ergebnis subscriben und ein wenig am DOM rum spielen, um das Ergebnis darzustellen: ... KLICK

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

Note: Hier hängen wir jetzt nur noch die Ergebnisse, oder auch den Fehler, in eine zuvor gelehrte Liste ein. Das können wir
      uns dann auch mal ganz anschauen ... KLICK

---

<!-- .slide: data-background="../docs/images/fiddle.jpg" -->
# js fiddle
<span class="attribution">By Musik- och teatermuseet (Own work) [<a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a>], <a href="https://commons.wikimedia.org/wiki/File%3AX6029_-_Tr%C3%A4skofiol_-_ok%C3%A4nd_tillverkare_-_foto_Mikael_Bodner.jpg">via Wikimedia Commons</a></span>

Note:  Browser => jsfidle => show Result + Console

---

# Questions?

- Ask Now!
- Twitter: @ElectricMaxxx <!-- .element: class="fragment" -->
- Mail: Maximilian.Berghoff@mayflower.de <!-- .element: class="fragment" -->

---

# Thank You!

---

# Links

- [Slides in Markdown](https://github.com/ElectricMaxxx/Reactive-javascript-rxjs-talk/blob/master/slides/slides.md), Slideshare folgt
- [RxJS docs](https://github.com/Reactive-Extensions/RxJS/tree/master/doc)
- [Marbles](http://rxmarbles.com)
- [Liste an Tutorials]( http://reactivex.io/tutorials.html)
- [Repository](https://github.com/Reactive-Extensions/RxJS)
- [Ausführliches Tutorial](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
- [Video Tutorials](https://egghead.io/technologies/rx)
- [Buch](http://www.introtorx.com/)

#### Alternativen
- [cyclejs](https://t.co/4BYrlRXlzo)
- [BACONJS](https://baconjs.github.io/)

---
