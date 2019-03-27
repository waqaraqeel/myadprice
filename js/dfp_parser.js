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

/* Parse outgoing request to the ad server */

/******************************************************************************/

function translate_to_pbjs(slot, prefix) {
    var pbjs_slot = {
        bids: [{
            bidderCode: prefix ? prefix : slot.hb_bidder,
            cpm: parseFloat(slot['hb_pb' + prefix])
        }]
    };
    var size = slot['hb_size' + prefix].split('x');
    pbjs_slot.width = parseInt(size[0]);
    pbjs_slot.height = parseInt(size[1])
    return pbjs_slot
}

function parse_dfp(urls) {
    slots = {};
    for (var url of urls)
        Object.assign(slots, parse_single_dfp_url(url));
    return slots;
}

function parse_single_dfp_url(url) {
    var dfp_url_regex = /[?|&]([^?&#]+)=([^&#]*)|&|#|$/g;
    var params = {}, m = null;

    do {
        m = dfp_url_regex.exec(url);
        if (m && m[1] && m[2]) {
            params[m[1]] = decodeURIComponent(m[2].replace(/\+/g, ' '));
        }

    } while (m && m[1] && m[2]);

    var scp = params.prev_scp || params.scp;
    if (!scp)
        return null;

    scp = scp.split('|');
    adSlots = {};
    for (var ad of scp) {
        adSlot = {};
        var keys = ad.split('&');
        var prefix = '';
        for (var key of keys) {
            var v = key.split('=');
            if (v[0].startsWith('hb_adid')) {
                prefix = v[0].split('hb_adid')[1] || '';
            }
            adSlot[v[0]] = v[1];
        }
        if (adSlot['hb_adid' + prefix])
            adSlots[adSlot['hb_adid' + prefix]] = translate_to_pbjs(adSlot, prefix);
    }

    return adSlots;
}
