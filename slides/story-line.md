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
Nun es gibt verschiedene Implementierungen:
* RxJava
* <b>RxJS</b>
* Rx.Net
* Rx.Scala
* Rx.Clojure
* Rx.Swift
* und viele mehr

Wenn man sich einen Überblick verschaffen will sollte man mal die Website `http://reactivex.io/` besuchen
oder man wirft ein Blick in die Github Organisation unter der alles zusammen gefasst ist:
`https://github.com/Reactive-Extension`

## Gemeinsamme Kinder

Nach der schönen Hochzeit und den Flitterwochen stand relativ kurz nacheinander die Geburt zweier Kids
an. Beide haben ihre eigenen Eigenschaften und Funktionen. So wie die kleine Prizessin daheim lieber mit 
ihren Pferden spielt und der Lausebub sich gern mit seinen Kumpels rauft. Die Geschlechterzuweisung in der
Realität lasse ich jetzt einmal offen. Die Eigenschaften möchte ich euch jetzt einmal schnell an kurzen
Schnipseln demonstrieren. Wie versprochen werde ich die Slides natürlich zugänglich machen. D.h. damit hat
man dann auch eine gute Zusammenfassung der wichtigsten Funktionen

* Observer
* * Eigenschaften/Funktionen
* * .subscribe()
* * .dispose() - IDisposable, why?
* Observable
* * Eigenschaften/Operatoren
* * Erstellung
* * * create
* * * from
* * * fromEvent
* * * range
* * Kombinationen
* * * concat
* * * merge
* * Projektionen
* * * map
* * * flatMap
* * Filter
* * * filter
* * Das Kuckukskind - Subject
* Warum keine Promises?


## Wir bauen ein Beispiel
* Autocomplete mit Wikipedia API Request
* Wie im WebExample

ToDo:
* Ausformulieren von einzelnen Punkten
* Noch erwähnen: 
** Scheduler
** Subject -> Guidline
** All together
