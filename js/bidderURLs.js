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

/* Ad exchange URL patterns */

/******************************************************************************/

var bidderURLs = {
    "33across": [
        "ssc.33across.com/api/v1/hb"
    ],
    "aardvark": [
        "thor.rtk.io/*/*/aardvark"
    ],
    "ad4game": [
        "ads.ad4game.com/v1/bid"
    ],
    "adblade": [
        "rtb.adblade.com/prebidjs/bid"
    ],
    "adbund": [
        "us-east-engine.adbund.xyz/prebid/ad/get",
        "us-west-engine.adbund.xyz/prebid/ad/get"
    ],
    "adbutler": [
        "servedbyadbutler.com/adserve/;type=hbr;"
    ],
    "adequant": [
        "rex.adequant.com/rex/c2s_prebid?"
    ],
    "adform": [
        "adx.adform.net/adx/?rp=4"
    ],
    "adkernel": [
        "cpm.metaadserving.com/rtbg"
    ],
    "adkerneladn": [
        "tag.adkernel.com/",
        "dsp-staging.adkernel.com/"
    ],
    "admedia": [
        "b.admedia.com/banner/prebid/bidder/?"
    ],
    "admixer": [
        "inv-nets.admixer.net/prebid.aspx"
    ],
    "adocean": [
        "myao.adocean.pl/ad.json"
    ],
    "adsupply": [
        "engine.4dsply.com/banner.engine?id="
    ],
    "adxcg": [
        ".adxcg.net/get/adi"
    ],
    "adyoulike": [
        "hb-api.omnitagjs.com/hb-api/prebid"
    ],
    "aerserv": [
        ".aerserv.com/as"
    ],
    "amazon": [
        ".amazon-adsystem.com/e/dtb/bid"
    ],
    "aol": [
        ".adtechus.com/pubapi*cmd=bid",
        ".adtech.advertising.com/pubapi*cmd=bid",
        ".adtech.de/pubapi*cmd=bid",
        ".adtechjp.com/pubapi*cmd=bid"
    ],
    "appnexus": [
        ".adnxs.com/jpt",
        ".adnxs.com/ut*/prebid"
    ],
    "arteebee": [
        "bidder.mamrtb.com/rtb/bid/arteebee?type=json&register=0"
    ],
    "atomx": [
        "p.ato.mx/placement"
    ],
    "audiences": [
        ".revsci.net/pql"
    ],
    "beachfront": [
        "reachms.bfmio.com/bid.json?exchange_id="
    ],
    "bidfluence": [
        "bidfluence.azureedge.net/forge.js"
    ],
    "bridgewell": [
        "rec.scupio.com/recweb/prebid.aspx"
    ],
    "brightcom": [
        "hb.iselephant.com/auc/ortb"
    ],
    "c1x": [
        "ht-integration.c1exchange.com/ht"
    ],
    "carambola": [
        "hb.carambo.la/hb"
    ],
    "centro": [
        ".brand-server.com/hb"
    ],
    "conversant": [
        "media.msg.dotomi.com/s2s/header"
    ],
    "cox": [
        "ad.afy11.net/ad"
    ],
    "criteo": [
        ".criteo.com/delivery/rta/rta.js",
        "bidder.criteo.com/"
    ],
    "dfp": [
        ".doubleclick.net/gampad/ads"
    ],
    "districtm": [
        "prebid.districtm.ca/lib.js"
    ],
    "eplanning": [
        ".e-planning.net/layers/t_pbjs_"
    ],
    "essens": [
        "bid.essrtb.com/bid/prebid_call"
    ],
    "facebook": [
        "an.facebook.com/v2/placementbid.json"
    ],
    "featureforward": [
        "prmbdr.featureforward.com/newbidder/bidder1_prm.php?"
    ],
    "fidelity": [
        "x.fidelity-media.com/delivery/hb.php?"
    ],
    "getintent": [
        "cdn.adhigh.net/adserver/hb.js"
    ],
    "gumgum": [
        "g2.gumgum.com/hbid/imp"
    ],
    "hiro Media": [
        "hb-rtb.ktdpublishers.com/bid/get"
    ],
    "huddledmasses": [
        "huddledmassessupply.com/?banner_id="
    ],
    "imonomy": [
        "b.imonomy.com/openrtb/hb"
    ],
    "improvedigital": [
        "ad.360yield.com/hb"
    ],
    "indexExchange": [
        ".casalemedia.com/cygnus",
        ".casalemedia.com/headertag"
    ],
    "inneractive": [
        "ad-tag.inner-active.mobi/simpleM2M/requestJsonAd"
    ],
    "innity": [
        "as.innity.com/synd/?cb="
    ],
    "jcm": [
        "media.adfrontiers.com/pq?t=hb&bids="
    ],
    "justpremium": [
        "cdn-cf.justpremium.com/js"
    ],
    "kargo": [
        "krk.kargo.com/api/v1/bid"
    ],
    "komoona": [
        "bidder.komoona.com/v1/GetSBids"
    ],
    "kumma": [
        "hb.kumma.com/"
    ],
    "lifestreet": [
        "ads.lfstmedia.com/getad?"
    ],
    "mantis": [
        "mantodea.mantisadnetwork.com/"
    ],
    "marsmedia": [
        "bid306.rtbsrv.com/bidder/?bid=3mhdom"
    ],
    "meme Global": [
        "stinger.memeglobal.com/api/v1/services/prebid"
    ],
    "mobfox": [
        "my.mobfox.com/request.php"
    ],
    "nanointeractive": [
        "tmp.audiencemanager.de/hb"
    ],
    "nginad": [
        "server.nginad.com/bid/rtb?"
    ],
    "openx": [
        ".servedbyopenx.com/w/1.0/acj",
        ".openx.net/w/1.0/acj",
        ".openx.net/w/1.0/arj"
    ],
    "optimatic": [
        "mg-bid.optimatic.com/adrequest/"
    ],
    "orbitsoft": [
        "adserver.com/ads/show/hb"
    ],
    "piximedia": [
        "static.adserver.pm/prebid"
    ],
    "platform.io": [
        "js.adx1.com/pb_ortb.js?cb="
    ],
    "pollux": [
        "adn.plxnt.com/prebid"
    ],
    "prebid Server": [
        "prebid.adnxs.com/pbs/v1/auction"
    ],
    "proximic": [
        ".zqtk.net/"
    ],
    "pubgears": [
        "b.pubgears.com/nucleus/request"
    ],
    "pubmatic": [
        ".pubmatic.com/AdServer/AdCallAggregator",
        ".pubmatic.com/AdServer/AdServerServlet",
        ".pubmatic.com/translator"
    ],
    "pulsepoint": [
        "bid.contextweb.com/header"
    ],
    "quantcast": [
        "global.qc.rtb.quantserve.com/qchb"
    ],
    "realvu": [
        "ac.realvu.net/realvu_boost.js"
    ],
    "rhythmone": [
        "tag.1rx.io/rmp/*/*/mvo"
    ],
    "roxot": [
        "r.rxthdr.com/"
    ],
    "rtbdemand": [
        "bidding.rtbdemand.com/hb"
    ],
    "rubicon": [
        ".rubiconproject.com/a/api/fastlane.json",
        ".rubiconproject.com/a/api/ads.json"
    ],
    "sekindo": [
        "hb.sekindo.com/live/liveView.php?"
    ],
    "serverbid": [
        "e.serverbid.com/api/v2"
    ],
    "sharethrough": [
        "btlr.sharethrough.com/header-bid/v1?"
    ],
    "smartrtb+": [
        "prg.smartadserver.com/prebid"
    ],
    "smartyads": [
        "ssp-nj.webtradehub.com/?"
    ],
    "somoaudience": [
        "publisher-east.mobileadtrading.com/rtb/bid?s="
    ],
    "sonobi": [
        ".sonobi.com/trinity.js"
    ],
    "sovrn": [
        ".lijit.com/rtb/bid"
    ],
    "spotx": [
        "search.spotxchange.com/openrtb"
    ],
    "springserve": [
        "bidder.springserve.com/display/hbid?"
    ],
    "stickyadstv": [
        "cdn.stickyadstv.com/mustang/mustang.min.js",
        "cdn.stickyadstv.com/prime-time/intext-roll.min.js",
        "cdn.stickyadstv.com/prime-time/screen-roll.min.js"
    ],
    "tapsense": [
        "ads04.tapsense.com/ads/headerad"
    ],
    "thoughtleadr": [
        "cdn.thoughtleadr.com/v4"
    ],
    "tremor": [
        ".ads.tremorhub.com/ad/tag"
    ],
    "trion": [
        "in-appadvertising.com/api/bidRequest?"
    ],
    "triplelift": [
        "tlx.3lift.com/header/auction?"
    ],
    "trustx": [
        "sofia.trustx.org/hb"
    ],
    "twenga": [
        "rtb.t.c4tw.net/Bid?"
    ],
    "ucfunnel": [
        "agent.aralego.com/header?"
    ],
    "underdog Media": [
        "udmserve.net/udm/img.fetch?tid=1;dt=9;"
    ],
    "undertone": [
        "hb.undertone.com/hb"
    ],
    "unruly": [
        "targeting.unrulymedia.com/prebid"
    ],
    "vertamedia": [
        "rtb.vertamedia.com/hb"
    ],
    "vertoz": [
        "banner.vrtzads.com/vzhbidder/bid?"
    ],
    "wideorbit": [
        ".atemda.com/JSAdservingMP.ashx"
    ],
    "widespace": [
        "engine.widespace.com/"
    ],
    "xhb": [
        "ib.adnxs.com/jpt?"
    ],
    "yieldbot": [
        ".yldbt.com/m/"
    ],
    "yieldmo": [
        "bid.yieldmo.com/exchange/prebid"
    ]
}


var URLsToBidders = {},
    requestURLs = [];

for (var bidder in bidderURLs) {
    for (var url of bidderURLs[bidder]) {
        URLsToBidders[url] = bidder;
        if (url.startsWith('.'))
            url = '*' + url;
        requestURLs.push('*://' + url + '*');
    }
}


function getBidder(pattern) {
    if (!pattern) return;
    for (var p in URLsToBidders) {
        if (pattern.indexOf(p) != -1) {
            return URLsToBidders[p];
        } else if (p.indexOf('*') !== -1) {
            var position = p.indexOf('*');
            var urlRegex = new RegExp(p.slice(0, position) + '.' + p.slice(position));
            if (urlRegex.test(pattern))
                return URLsToBidders[p];
        }
    }
}