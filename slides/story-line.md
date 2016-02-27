# Reactive Javascript mi RxJs


## Intro

### Opening mit Slide für den Startbildschirm ###
### Vorstellung ###

* Das bin ich. Das Bild zieht sich inzwischen durch all meine Accounts im Internet.
Sowohl auf Twitter (point: @ElectricMaxxx) als auch auf Github (https://github.com/Electricmaxx).
In beiden Portalen lohnt es sich mir zu folgen. Auf Github sieht mein eigentlich meine stark PHP lastigen
Repositories. Das ist aber nur die halbe Wahrheit. In meiner Firma (Mayflower) übernehme ich immer wieder Frontend
Application oder führe Workshops. Mit Frontend meine ich jetzt aber nicht dieses Design Krams.

### Zum Thema ###
### Was ist überhaupt Reactive? ###
#### History ####

* Microsoft
* .net (bin ich hier wohl richtig oder?)
* eigentlich aber in eigner Cloud-Application

#### Überblick grob #####

* Grafik mit Event-Streams (Marbles?)

#### An die Bar ####
##### Die Akteure ####
##### Iterator Pattern #####
* Grafik mit Erklärung
* Beispiele mit .map() + .reduce() + .filter()
* -> push basiert
##### Observer Pattern #####
* Grafik mit Erklärung
* Beispiele? @Jowe ping: Angular databinding ist pub-sub, right?
* Entkoppelt
### Die Hochzeit ###
#### Der gemeinsame Name - Rx ####
* Übersicht verschiedene Implementierungen
##### The JavaScript Way #####
Warum nicht? ...
#### RxJS ####
### Gemeinsamme Kinder ###
Nach der schönen Hochzeit und den Flitterwochen stand relativ kurz nacheinander die Geburt zweier Kids
an. Beide haben ihre eigenen Eigenschaften und Funktionen. So wie die kleine Prizessin daheim lieber mit 
ihren Pferden spielt und der Lausebub sich gern mit seinen Kumpels rauft. Die Geschlechterzuweisung in der
Realität lasse ich jetzt einmal offen. Die Eigenschaften möchte ich euch jetzt einmal schnell an kurzen
Schnipseln demonstrieren. Wie versprochen werde ich die Slides natürlich zugänglich machen. D.h. damit hat
man dann auch eine gute Zusammenfassung der wichtigsten Funktionen
#### Observer ####
##### Eigenschaften/Funktionen #####
* .subscribe()
* .dispose() - IDisposable, why?
#### Observable ####
##### Eigenschaften/Operatoren #####
* Erstellung
** create
** from
** fromEvent
** fromPromise
** range
* Kombinationen
** concat
** merge
* Projektionen
** map
** flatMap
* Filter
* filter
#### Das Kuckukskind - Subject ####
### Warum keine Promises? ###
### Wir bauen ein Beispiel ###
#### Autocomplete mit Wikipedia API Request ####
* Wie im WebExample

ToDo:
* Ausformulieren von einzelnen Punkten
* Noch erwähnen: 
** Scheduler
** Subject -> Guidline
** All together
