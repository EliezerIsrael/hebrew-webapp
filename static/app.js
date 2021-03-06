;
function loadXMLDoc(url, data, success, error) {
    var xmlhttp;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                if (!!success) success(xmlhttp.responseText);
            } else {
                if (!!error) error(xmlhttp.responseText);
            }
        }

    };

    xmlhttp.open("GET", url + '?input=' + data, true);
    xmlhttp.send();
}

function forceArray(item) {

    if (Object.prototype.toString.call(item) !== "[object Array]") {
        item = [item];
    }

    return item;
}

function addListeners(event, handler, items) {

    event = forceArray(event);
    handler = forceArray(handler);

    // add handler to each item for each event
    event.forEach(function(ev) {
        handler.forEach(function (h) {
            items.forEach(function (i) {i.addEventListener(ev, h);});
        });
    });
}

function isMobileSafari() {
    return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)
}

function reverseChunks(l, n) {
    var out = [];
    for (var i = l.length; i > 0; i -= n) {
        out.unshift(l.slice(i - n < 1 ? 0 : i - n, i));
    }

    return out;
}

function prettifyNumbers(number) {
    return reverseChunks(number, 3).join(',');
}

// Hebrew handling
(function () {

    var a = document.getElementById('a');
    var b = document.getElementById('b');

    var updateItem = function(hebrew, item) {
        var url = hebrew ? '/decode' : '/encode';

        loadXMLDoc(url, item.value.replace(/,/g, ''),
            function(response) {
                if (hebrew) {
                    otherItem(item).value = prettifyNumbers(response);
                } else {
                    otherItem(item).value = response;
                }
            },
            function(response) {
                otherItem(item).value = "";
            });

    };

    var otherItem = function(item) {
        return item === a ? b : a;
    };

    var event = 'input';

    var handler = function(e) {
        var item = e.srcElement;
        var hebrew = isNaN(+item.value.replace(/,/g, ''));
        if (!hebrew) {
            item.value = prettifyNumbers(item.value.replace(/,/g, ''))
        }
        updateItem(hebrew, item);
    };

    //add event handlers
    addListeners(event, handler, [a, b]);

})();

// Select entire text on focus
(function () {

    var a = document.getElementById('a');
    var b = document.getElementById('b');

    var handler = function(e) {
        var elem = e.srcElement;

        if (isMobileSafari()) {
            elem.setSelectionRange(0, elem.value.length);
        } else {
            elem.select();
        }
    };

    addListeners(['focus', 'click'], handler, [a, b]);

})();

