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

/* The popup script. Depends on utils.js */

/******************************************************************************/

document.addEventListener('DOMContentLoaded', function () {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var url = tabs[0].url;
        var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
        var domain = matches && matches[1];
        if (domain) {
            window.domain = domain.split('.').reverse()[1];
            $('#explore-link')[0].childNodes[2].nodeValue = 'Explore ' + window.domain;
        }
    });

    pollforBidData();

    browser.storage.local.get({ opted: false }, function (result) {
        if (result.opted) {
            createStatsChart();
        }
        else {
            $('.not-agreed').removeClass('hidden');
        }
    });

    $('.link').on('click', function () {
        browser.tabs.create({ active: true, url: $(this).attr('href') });
    });

    $('.tooltip').tooltip();

    $('#refresh').on('click', function () {
        pollforBidData();
    });

    $('#draw-chart').on('click', function () {
        createStatsChart();
    });

    $('#btn-agree').on('click', function () {
        browser.storage.local.set({ opted: true, opted_tracert: true});
        $('#send-bids').prop('checked', true);
        $('#send-tracert').prop('checked', true);
        $('.not-agreed').addClass('hidden');
        createStatsChart();
    })

    browser.storage.local.get({ opted: false, opted_tracert: false }, function (result) {
        if (result.opted)
            $('#send-bids').prop('checked', true);
        if (result.opted_tracert)
            $('#send-tracert').prop('checked', true);
    });

    $('#send-bids').click(function () {
        if ($(this).prop('checked'))
            browser.storage.local.set({ opted: true });
        else
            browser.storage.local.set({ opted: false });
    });
    $('#send-tracert').click(function () {
        if ($(this).prop('checked'))
            browser.storage.local.set({ opted_tracert: true });
        else
            browser.storage.local.set({ opted_tracert: false });
    });
});