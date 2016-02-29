var Iterator = function () {};

/**
 * Returns the next object in the collection.
 */
Iterator.prototype.next = function() {};

/**
 * Will reset the internal index. Calling .next() will return the first item now.
 */
Iterator.prototype.rewind = function() {};

/**
 * Returns the current item in the collection.
 */
Iterator.prototype.current = function() {};

/**
 * Decider whether there is a next element or not.
 * Returns false when the collection is at his end.
 */
Iterator.prototype.hasNext = function() {};


while (Iterator.hasNext()) {
    console.log(Iterator.next());
}
