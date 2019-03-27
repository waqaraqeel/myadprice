/*******************************************************************************
  
    MyAdPrice - a browser extension to track ad activity
    Waqar Aqeel

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.
    Home: https://github.com/gorhill/uBlock
*/

/* The content script */

/******************************************************************************/

var pbjs;
if (!browser)
    var browser = chrome;


function retrievePbjsData(variables) {
    var scriptContent = `
        function find_property_pbjs(obj) {
            for (var property in obj) {
                if (obj[property] && obj[property] === obj || property == 'document' || property == 'location' || property == 'localStorage')
                    continue;

                try {
                    if (obj[property] && obj[property].hasOwnProperty('getBidResponses'))
                        return obj[property];
                } catch (err) {}
            }
            return null;
        }

        var pbjs_handler = find_property_pbjs(window);
        var body = document.getElementsByTagName('body')[0];
        body.setAttribute('tmp_domain', window.location.hostname);
        if (pbjs_handler) {
            body.setAttribute('tmp_units', JSON.stringify(pbjs_handler.adUnits));
            body.setAttribute('tmp_bids', JSON.stringify(pbjs_handler.getBidResponses()));
            body.setAttribute('tmp_winners', JSON.stringify(pbjs_handler.getAllWinningBids()));
            body.setAttribute('tmp_timeout', JSON.stringify(pbjs_handler.cbTimeout));
        }`
    var body = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (document.body || document.head || document.documentElement).appendChild(script);

    var domain = body.getAttribute('tmp_domain');
    if (body.getAttribute('tmp_bids') == null)
        return {domain: domain};

    var units, responses, winners, timeout;
    try {
        units = JSON.parse(body.getAttribute('tmp_units'));
    } catch (err) { }
    try {
        responses = JSON.parse(body.getAttribute('tmp_bids'));
    } catch (err) { }
    try {
        winners = JSON.parse(body.getAttribute('tmp_winners'));
    } catch (err) { }
    try {
        timeout = JSON.parse(body.getAttribute('tmp_timeout'));
    } catch (err) { }

    var slots = {}
    body.removeAttribute('tmp_units');
    body.removeAttribute('tmp_bids');
    body.removeAttribute('tmp_winners');
    body.removeAttribute('tmp_winners');
    body.removeChild(document.getElementById('tmpScript'));

    for (var unit of units) {
        slots[unit.code] = {
            bids: [],
            winner: null,
            height: null,
            width: null
        };
        if (unit.sizeMapping) {
            var max_size = 0;
            for (var mapping of unit.sizeMapping) {
                if (mapping.sizes && mapping.sizes.length > 0) {
                    for (var size of mapping.sizes) {
                        if (size[0] * size[1] > max_size) {
                            max_size = size[0] * size[1];
                            slots[unit.code].width = size[0];
                            slots[unit.code].height = size[1];
                        }
                    }
                }
            }
        } else if (unit.sizes && unit.sizes.length > 0) {
            var max_size = 0;
            for (var size of unit.sizes) {
                if (size[0] * size[1] > max_size) {
                    max_size = size[0] * size[1];
                    slots[unit.code].width = size[0];
                    slots[unit.code].height = size[1];
                }
            }
        }

    }

    for (var label in responses) {
        for (bid of responses[label].bids) {
            if (typeof slots[label] == 'undefined') {
                slots[label] = {
                    bids: [],
                    winner: null,
                    height: null,
                    width: null
                };
            }
            slots[label].bids.push(bid)
            if (bid.cpm > 0) {
                if (!slots[label].height) {
                    slots[label].height = bid.height;
                    slots[label].width = bid.width;
                }
            }
        }
    }

    for (var winner of winners) {
        slots[winner.adUnitCode].winner = winner;
        slots[winner.adUnitCode].height = parseInt(winner.height);
        slots[winner.adUnitCode].width = parseInt(winner.width);
        for (var cBid of responses[winner.adUnitCode].bids) {
            if (cBid.adId == winner.adId) {
                cBid.winner = true;
                break;
            }
        }
    }

    return {
        domain: domain,
        slots: slots,
        timeout: timeout
    }
}

function sendPbjsData(sender, sendResponse) {
    if (!pbjs)
        pbjs = retrievePbjsData(['pbjs']);

    if (!pbjs) {
        // sendResponse(null);
        pbjs = {};
    }

    entries = window.performance.getEntries().filter(ent => ent.initiatorType == 'xmlhttprequest' ||
        ent.initiatorType == 'script' ||
        ent.initiatorType == 'iframe')

    shippableEntries = []
    for (var entry of entries) {
        var bidder = getBidder(entry.name);
        if (bidder) {
            var shippableEntry = entry.toJSON()
            var matches = shippableEntry.name.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            shippableEntry.name = matches && matches[1];
            shippableEntry.bidder = bidder;
            shippableEntries.push(shippableEntry);
        }
    }
    pbjs.performanceEntries = shippableEntries;
    pbjs.pageLoad = window.performance.timing;
    sendResponse(pbjs);
}

function focus_div(id) {
    var div = document.getElementById(id) || document.getElementById('div-gpt-ad-' + id);
    if (!div)
        return;

    div.style.position = 'relative';
    div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    var positionInfo = div.getBoundingClientRect();
    var overlay = document.createElement('div');
    overlay.setAttribute('id', 'myadprice-focus');
    overlay.style.position = 'absolute';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = positionInfo.width + 'px';
    overlay.style.height = positionInfo.height + 'px';
    overlay.style.zIndex = '500';
    overlay.style.backgroundColor = 'rgba(255,255,0,0.5)';
    div.appendChild(overlay);
}

function unfocus_div(id) {
    var div = document.getElementById('myadprice-focus');
    if (div)
        div.outerHTML = '';
}

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == 'getAdUnits')
        sendPbjsData(sender, sendResponse);
    else if (request.type == 'focus_div')
        focus_div(request.id);
    else if (request.type == 'unfocus_div')
        unfocus_div(request.id);
});