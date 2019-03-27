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

/* The background script */

/******************************************************************************/

var network_entries = {};
var prebidTracker = {};
var scheduled_tabs = {};
var dfp_urls = {};

var URL = 'https://www.myadprice.com/'
if (!browser)
    var browser = chrome;
// var URL = 'http://localhost:8000/'


function reportToBase(data) {
    $.ajax({
        type: 'POST',
        url: URL + 'record/',
        contentType: 'application/json',
        data: JSON.stringify(data),
    });
}

function getPbjsData(tabId) {
    if (scheduled_tabs[tabId] == 'completed')
        return;

    browser.tabs.sendMessage(tabId, { type: 'getAdUnits' }, function (response) {
        if (response && typeof response != 'undefined' && Object.keys(network_entries[tabId]).length != 0 && response.performanceEntries.length > 0) {
            response.network_entries = network_entries[tabId]
            if (!response.slots && dfp_urls[tabId])
                response.slots = parse_dfp(dfp_urls[tabId]);
            prebidTracker[tabId] = response;
            prebidTracker[tabId].stored = false;
            browser.storage.local.get({ opted: false, opted_tracert: false }, function (result) {
                if (result.opted) {
                    response.tracert = result.opted_tracert;
                    reportToBase(response);
                }
            });
        } else {
            prebidTracker[tabId] = 'nopbjs';
        }
        scheduled_tabs[tabId] = 'completed';
    });
}

browser.tabs.onUpdated.addListener(function (tabId, info) {
    if (info.status === 'complete') {
        setTimeout(getPbjsData, 1000, tabId);
    } else if (info.status == 'loading') {
        network_entries[tabId] = {};
        dfp_urls[tabId] = null;
        prebidTracker[tabId] = 'loading';
        scheduled_tabs[tabId] = 'scheduled';
        setTimeout(getPbjsData, 12000, tabId);
    }
});

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg == 'fetch')
        sendResponse(prebidTracker[request.tabId]);
    else if (request.msg == 'stored')
        prebidTracker[request.tabId].stored = true;
});

browser.webRequest.onHeadersReceived.addListener(function (details) {
    details.responseHeaders.push({ name: 'Timing-Allow-Origin', value: '*' });
    return { responseHeaders: details.responseHeaders };
}, { urls: requestURLs, types: ['script', 'xmlhttprequest'] }, ['blocking', 'responseHeaders']);


browser.webRequest.onBeforeRequest.addListener(function (request) {
    if (!request) return;
    var bidder = getBidder(request.url);
    if (!bidder) return;

    if (!(request.tabId in network_entries)) return;

    if (bidder == 'dfp') {
        if (!dfp_urls[request.tabId])
            dfp_urls[request.tabId] = [request.url];
        else
            dfp_urls[request.tabId].push(request.url);
    }

    network_entries[request.tabId][request.requestId] = {
        bidder: bidder,
        start: request.timeStamp,
        tabId: request.tabId
    }
}, { urls: requestURLs });

browser.webRequest.onCompleted.addListener(function (request) {
    if (!request) return;
    if (!(request.tabId in network_entries)) return;

    var tabRequests = network_entries[request.tabId];
    if (request.requestId in tabRequests) {
        tabRequests[request.requestId].end = request.timeStamp;
        tabRequests[request.requestId].ip = request.ip;
    }

}, { urls: requestURLs });

browser.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    delete network_entries[tabId];
    delete scheduled_tabs[tabId];
    delete prebidTracker[tabId];
});
