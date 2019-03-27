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

/* JS templates to render tables */

/******************************************************************************/

var TEMPL_AD_SLOT = `<tr >
                        <td align="center" style="width: 25%;" rowspan="{bids_count}">
                            <div class="clickable-row slot-rectangle" style="height: {height}px; width: {width}px;" data-label={slot_label}>
                            </div>
                            <p class="mb-0 slot-size">{width_px} x {height_px}</p>
                        </td>
                        {bids}
                    </tr>`
var TEMPL_NO_WINNER = `<p class="m-0 text-center tooltip-holder" data-toggle="tooltip" data-placement="bottom" title="{domain} displayed ad from an internal&#0010;source as these bids were not high enough">N/A</p>`
var TEMPL_BID_ROW_FIRST = `
                        <td style="width: 25%">{bidder}</td>
                        <td style="width: 25%">{cpm}</td>
                        <td style="width: 25%" rowspan="{bids_count}">{winner}</td>
                    </tr>`
var TEMPL_BID_ROW = `<tr class="clickable-row">
                        <td style="width: 25%">{bidder}</td>
                        <td style="width: 25%">{cpm}</td>
                    </tr>`


// This super nice function is from code that StackOverflow uses
// https://stackoverflow.com/a/18234317

String.prototype.format = function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};