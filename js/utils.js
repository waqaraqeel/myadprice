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

/* Various utilities to interface with the browser and draw graphs */

/******************************************************************************/

var URL = 'https://www.myadprice.com/'
if (!browser)
    var browser = chrome;
// var URL = 'http://localhost:8000/'

function putBidDataInLocalStorage(pbjs, tabId) {
    if (Object.keys(pbjs.slots).length == 0)
        return;
    var sum = 0;
    var count = 0;
    var money_made = 0;
    $.each(pbjs.slots, function (label, item) {
        for (var bid of item.bids) {
            if (bid.cpm > 0) {
                sum += bid.cpm;
                count++;
                if (bid.winner)
                    money_made += bid.cpm;
            }
        }
    });

    key = 'bid-means-' + pbjs.domain;
    query = { domains: [] };
    query[key] = [0, 0];
    query['money-made-' + pbjs.domain] = [];
    browser.storage.local.get(query, function (result) {
        result[key][0] += sum;
        result[key][1] += count;
        result['money-made-' + pbjs.domain].push([money_made, new Date().toDateString()]);

        if (!result.domains.includes(pbjs.domain))
            result.domains.push(pbjs.domain);
        browser.storage.local.set(result, function () {
            browser.runtime.sendMessage({ msg: 'stored', tabId: tabId });
        });
    });
}

function summarizeSlotsBiddersAuctionTime(pbjs) {
    $('#number-slots').html(Object.keys(pbjs.slots).length);
    var bidders = new Set();
    $.each(pbjs.slots, function (l, e) {
        for (var b of e.bids) {
            if (b.cpm > 0)
                bidders.add(b.bidderCode);
        }
    });
    bidders.delete('');
    $('#number-bidders').html(bidders.size);
}

function showAndHideElements(pbjs) {
    switch (pbjs) {
        case undefined:
        case null:
            $('.nopbjs').addClass('hidden');
            $('.reload').removeClass('hidden');
            break;
        case 'loading':
            $('.nopbjs').addClass('hidden');
            $('.loading').removeClass('hidden');
            break;
        case 'nopbjs':
            $('.nopbjs').removeClass('hidden');
            $('.loading').addClass('hidden');
            break;
        default:
            $('.yespbjs').removeClass('hidden');
            $('.nopbjs').addClass('hidden');
            $('.loading').addClass('hidden');
    }
}

function getBidHTML(slot, slot_number, label, bid_count) {
    var bids = '';
    if (slot.bids.length > 0 && slot.bids[0].cpm > 0) {
        bids += TEMPL_BID_ROW_FIRST.format({
            bids_count: Math.min(5, bid_count),
            slot_number: slot_number,
            bidder: slot.bids[0].bidderCode,
            cpm: slot.bids[0].cpm.toFixed(3)
        })
    }
    else {
        bids += TEMPL_BID_ROW_FIRST.format({
            slot_label: label,
            bids_count: 1,
            slot_number: slot_number,
            bidder: '',
            cpm: ''
        })
    }
    for (var bid of slot.bids.slice(1, 5)) {
        if (bid.cpm > 0) {
            bids += TEMPL_BID_ROW.format({
                bidder: bid.bidderCode,
                cpm: bid.cpm.toFixed(3)
            });
        }
    }
    return bids;
}


function sortLabelsByCpm(pbjs, labels) {
    labels.sort(function (a, b) {
        if (pbjs.slots[b].winner && pbjs.slots[a].winner)
            return pbjs.slots[b].winner.cpm - pbjs.slots[a].winner.cpm;

        if (pbjs.slots[b].winner)
            return 1;

        if (pbjs.slots[a].winner)
            return -1;

        var b_cpm = pbjs.slots[b].bids.reduce(function (prev, curr) {
            return prev.cpm > curr.cpm ? prev : curr;
        }, 0).cpm || 0;

        var a_cpm = pbjs.slots[a].bids.reduce(function (prev, curr) {
            return prev.cpm > curr.cpm ? prev : curr;
        }, 0).cpm || 0;

        return b_cpm - a_cpm;
    });
}

function initBidsTable() {
    $('#ad-slots-container').html(`<thead>
                            <th class='text-center borderless'>
                                <p class="tooltip" style="left: 13%" data-toggle="tooltip" data-placement="bottom" title="Move mouse over the rectangles below to highlight ad slots on page">Slot</p>
                                <span class="tooltip-holder">Slot</span>
                            </th>
                            <th class='borderless'>Bidder</th>
                            <th class='borderless'>
                                <p class="tooltip" data-toggle="tooltip" data-placement="bottom" title="Cost Per Mille: The cost of showing you 1000 ads">CPM</p>
                                <span class="tooltip-holder">CPM</span>
                            </th>
                            <th class='borderless'>Winner</th>
                        </thead>
                        <tbody>
                        </tbody>`
    );
}

function displayAllSlots(pbjs, labels) {
    var max_size = 0;
    if (Object.keys(pbjs.slots).length == 0) {
        $('#noslots').removeClass('hidden');
        return;
    }
    $.each(pbjs.slots, function (_, slot) {
        if (slot.width > max_size)
            max_size = slot.width;
        if (slot.height > max_size)
            max_size = slot.height;
    });
    var slot_number = 1;
    for (var label of labels) {
        var slot = pbjs.slots[label];
        var bid_count = slot.bids.filter(function (b) { return b.cpm > 0 }).length || 1;
        if (slot.height == 1 && slot.width == 1)
            continue;
        slot.bids.sort(function (a, b) { return b.cpm - a.cpm })
        var bids = getBidHTML(slot, slot_number, label, bid_count);

        $('#ad-slots-container').append(
            TEMPL_AD_SLOT.format({
                slot_label: label,
                height: slot.height ? slot.height / max_size * 100 : 5,
                width: slot.width ? slot.width / max_size * 100 : 5,
                bids: bids,
                height_px: slot.height || '?',
                width_px: slot.width || '?',
                win_class: slot.winner ? 'won' : 'lost',
                winner: slot.winner ? '$' + slot.winner.cpm.toFixed(3) + ' CPM by ' + slot.winner.bidderCode : TEMPL_NO_WINNER.format({ domain: window.domain }),
                bids_count: Math.min(5, bid_count),
                slot_number: slot_number
            })
        );
        slot_number += 1;
    }
}

function pollforBidData() {
    $('#pbjs_info').empty();
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.runtime.sendMessage({ msg: 'fetch', tabId: tabs[0].id }, function (pbjs) {
            showAndHideElements(pbjs);
            if (pbjs == 'loading') {
                setTimeout(pollforBidData, 500);
                return
            }
            if (!pbjs || !pbjs.slots)
                return;

            var labels = Object.keys(pbjs.slots);
            sortLabelsByCpm(pbjs, labels);
            initBidsTable();
            displayAllSlots(pbjs, labels);
            addHoverOnSlots(tabs[0].id);
            summarizeSlotsBiddersAuctionTime(pbjs);
            createTimeChart(pbjs);
            if (!pbjs.stored) {
                putBidDataInLocalStorage(pbjs, tabs[0].id);
                createStatsChart();
            }
        });
    });
}

function createTimeChart(pbjs) {
    if (pbjs.performanceEntries.length < 1) {
        $('.no-timing').removeClass('hidden');
        return;
    }
    var labels = [],
        stall = [],
        dns = [],
        tcp = [],
        tls = [],
        ttfb = [],
        content = [];

    var earliest_start = 999999;
    var latest_finish = 0;
    for (var e of pbjs.performanceEntries) {
        if (e.startTime < earliest_start)
            earliest_start = Math.floor(e.startTime);
        if (e.responseEnd > latest_finish)
            latest_finish = e.responseEnd;
    }
    $('#number-seconds').html(((latest_finish) / 1000).toFixed(2));

    for (var i = 0; i < pbjs.performanceEntries.length; i++) {
        var e = pbjs.performanceEntries[i];
        labels.push(e.bidder);
        stall.push(Math.round(e.startTime));
        dns.push(Math.round(e.domainLookupEnd - e.domainLookupStart));
        tcp.push(Math.round(e.secureConnectionStart > 0 ? e.secureConnectionStart - e.connectStart : e.connectEnd - e.connectStart));
        tls.push(Math.round(e.secureConnectionStart > 0 ? e.connectEnd - e.secureConnectionStart : 0));
        ttfb.push(Math.round(e.responseStart - e.requestStart));
        content.push(Math.round(e.responseEnd - e.responseStart));
    }

    var barChartData = {
        labels: labels,
        datasets: [{
            label: 'Waiting',
            backgroundColor: '#ffffff',
            data: stall
        }, {
            label: 'DNS Lookup',
            backgroundColor: '#ef5350',
            data: dns
        }, {
            label: 'TCP Handshake',
            backgroundColor: '#42A5F5',
            data: tcp
        }, {
            label: 'TLS Handshake',
            backgroundColor: '#66BB6A',
            data: tls
        }, {
            label: 'TTFB',
            backgroundColor: '#FFCA28',
            data: ttfb
        }, {
            label: 'Content Download',
            backgroundColor: '#8D6E63',
            data: content
        }]
    };
    var ctx = document.getElementById('time-graph').getContext('2d');
    new Chart(ctx, {
        type: 'horizontalBar',
        data: barChartData,
        options: {
            title: {
                display: true,
                text: 'Ad Networks and Request Timing'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    ticks: {
                        min: Math.floor(earliest_start / 100) * 100,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Time since navigation (ms)'
                    }
                }],
                yAxes: [{
                    ticks: {
                        display: false
                    },
                    stacked: true,
                    barPercentage: 0.4
                }]
            },
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
    $('#time-graph-wrapper').css({ height: (labels.length * 8 + 10) + '%' });
}

function createStatsChart() {
    browser.storage.local.get({ 'domains': [] }, function (result) {
        var domains = Array.from(result.domains);
        if (domains.length) {
            $('.stats-content').removeClass('hidden');
        }
        else {
            $('.no-history').removeClass('hidden');
            return;
        }

        var cpm_keys = [];
        var money_keys = [];
        for (var domain of domains) {
            cpm_keys.push('bid-means-' + domain);
            money_keys.push('money-made-' + domain);
        }
        $('#number-sites').html(money_keys.length);
        browser.storage.local.get(cpm_keys.concat(money_keys), function (result) {
            user_averages = [];
            money_made = [];
            for (var key of cpm_keys) {
                user_averages.push((result[key][0] / result[key][1]).toFixed(3));
            }
            var all_below_dollar = true;
            var total_revenue = 0;
            for (var key of money_keys) {
                var sum = 0;
                for (var entry of result[key])
                    sum += entry[0];
                if (sum > 1000)
                    all_below_dollar = false;
                total_revenue += sum;
                money_made.push(sum);
            }
            total_revenue = total_revenue / (all_below_dollar ? 10 : 1000);
            $('#number-revenue').html(total_revenue.toFixed(2) + (all_below_dollar ? ' cents' : ' dollars'))
            for (var i = 0; i < money_made.length; i++) {
                if (all_below_dollar)
                    money_made[i] /= 10;
                else
                    money_made[i] /= 1000;
                money_made[i] = money_made[i].toFixed(2);
            }

            $.get(URL + 'averages/', { domains: domains }, function (result) {
                var global_averages = [];
                for (var domain of domains)
                    global_averages.push(result[domain] || 0);
                var ctx = document.getElementById('cpm-chart').getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: domains,
                        datasets: [
                            {
                                label: 'Your average',
                                fill: false,
                                backgroundColor: '#dc3912',
                                pointRadius: 5,
                                cubicInterpolationMode: 'default',
                                data: user_averages,
                            },
                            {
                                label: 'Other users',
                                fill: false,
                                backgroundColor: '#607d8b',
                                pointRadius: 5,
                                cubicInterpolationMode: 'default',
                                data: global_averages,
                            }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                display: false
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'CPM ($)'
                                },
                                ticks: {
                                    beginAtZero: true,
                                }
                            }],
                        },
                        layout: {
                            padding: {
                                right: 5,
                                left: 5,
                                top: 5,
                                bottom: 5,
                            }
                        },
                        maintainAspectRatio: false
                    }
                });

                ctx = document.getElementById('money-chart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: domains,
                        datasets: [
                            {
                                steppedLine: 'after',
                                label: all_below_dollar ? 'cents' : '$',
                                fill: false,
                                backgroundColor: '#109618',
                                pointRadius: 5,
                                data: money_made,
                            }
                        ]
                    },
                    options: {
                        bezierCurve: false,
                        scales: {
                            xAxes: [{
                                display: false
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Revenue (' + (all_below_dollar ? 'cents' : '$') + ')',
                                },
                                ticks: {
                                    maxTicksLimit: 8,
                                    beginAtZero: true,
                                    precision: 2
                                }
                            }],
                        },
                        layout: {
                            padding: {
                                right: 10,
                                left: 5,
                                top: 5,
                                bottom: 5,
                            }
                        },
                        legend: {
                            display: false
                        },
                        maintainAspectRatio: false
                    }
                });
            })

        });
    })
}

function addHoverOnSlots(tabId) {
    $('.clickable-row').each(function (i, obj) {
        var id = $(obj).data('label');
        $(obj).hover(function () {
            browser.tabs.sendMessage(tabId, { type: 'focus_div', id: id });
        }, function () {
            browser.tabs.sendMessage(tabId, { type: 'unfocus_div', id: id });
        })
    });
}

browser.runtime.onMessage.addListener(function () {
});