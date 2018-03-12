/*
 * scripts.js for EnCAB
 *
 */


// Output decimal round precision
var digits = 7;


function calc(obj) {
    var tab = closest(obj, 'table'),
        inputs = tab.querySelectorAll('input'), // .getElementsByTagName
        i;

    // Convert inputs to local variables
    for (i = 0; i < inputs.length; i++) {
        var name = inputs[i].getAttribute('name'),
            value = inputs[i].value;
        if (value == '') { value = '0'; }

        this[name] = Number( value.replace(',','.') );
    }

    // Run the operations
    for (i = 0; i < inputs.length; i++) {
        if ( ! inputs[i].isSameNode(obj) ) {
            if ( inputs[i].dataset.op ) {
                var total = Number( eval( inputs[i].getAttribute('data-op') ) );
                if ( total ) {
                    inputs[i].value = round(total);
                } else {
                    inputs[i].value = '';
                }
            }
        }
    }
}


function closest(el, selector) {
    var matchesFn;

    // find vendor prefix
    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    });

    var parent;

    // traverse parents
    while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
}


function round(n) {
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    return Math.round(n) / multiplicator;
}
