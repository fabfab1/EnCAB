/*
 * scripts.js for EnCAB
 *
 */


// Output decimal round precision
var digits = 7;


function calc(obj) {
    var tab = closest(obj, 'table'),
        inputs = tab.querySelectorAll('input'); // .getElementsByTagName

    // Convert inputs to local variables
    for (const input of inputs) {
        var name = input.getAttribute('name'),
            value = input.value;
        if (value == '') { value = '0'; }

        this[name] = Number( value.replace(',','.') );
        // Math.pow(10, 10);
    }

    // Run the operations
    var total;
    for (const input of inputs) {
        if ( ! input.isSameNode(obj) ) {
            if ( input.dataset.op ) {
                total = Number( eval( input.getAttribute('data-op') ) );
                if ( total && total !== NaN ) {
                    input.value = round(total); //correctoutput()
                } else {
                    input.value = '';
                }
            }
        }
    }
    //console.log(this);
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
    })

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
