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

Die Akteure:
* Iterator Pattern
** Grafik mit Erklärung
** Beispiele mit .map() + .reduce() + .filter()
** -> push basiert
* Observer Pattern
* Grafik mit Erklärung
* Beispiele? @Jowe ping: Angular databinding ist pub-sub, right?
* Entkoppelt

Doch dann ..

## Die Hochzeit
* Der gemeinsame Name - Rx - Reactive Extensions
* Warum Plural?
* Übersicht verschiedene Implementierungen
* ...
* The JavaScript Way -  RxJS

Es folgen wie es auch kommen muss ...

## Gemeinsamme Kinder

Nach der schönen Hochzeit und den Flitterwochen stand relativ kurz nacheinander die Geburt zweier Kids
an. Beide haben ihre eigenen Eigenschaften und Funktionen. So wie die kleine Prizessin daheim lieber mit 
ihren Pferden spielt und der Lausebub sich gern mit seinen Kumpels rauft. Die Geschlechterzuweisung in der
Realität lasse ich jetzt einmal offen. Die Eigenschaften möchte ich euch jetzt einmal schnell an kurzen
Schnipseln demonstrieren. Wie versprochen werde ich die Slides natürlich zugänglich machen. D.h. damit hat
man dann auch eine gute Zusammenfassung der wichtigsten Funktionen
* Observer
** Eigenschaften/Funktionen
** .subscribe()
** .dispose() - IDisposable, why?
* Observable
** Eigenschaften/Operatoren
** Erstellung
*** create
*** from
*** fromEvent
*** range
** Kombinationen
**v concat
*** merge
** Projektionen
*** map
*** flatMap
** Filter
*** filter
** Das Kuckukskind - Subject
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
