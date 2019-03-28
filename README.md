[![License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/waqaraqeel/myadprice/blob/master/LICENSE.txt)


<h1 align="center">
<img  src="https://www.myadprice.com/static/images/icon.png" height="30" width="30">
MyAdPrice
</h1>
<p align="center">
<sup> 
      Track Prebid.js Activity
</sup>


**An ad-tracking extension for Chrome and Firefox**

MyAdPrice utilizes hooks in the [Prebid.js](https://github.com/prebid/Prebid.js/) library to track ad activity on websites. By default, it sends out __no data__ from the user's device. However, users can *opt-in* to send specific, anonymized statistics to our servers detailed [here](https://www.myadprice.com/terms), to help in our research.



## Installation
Please use these links to install the extension for your browser:
- [Google Chrome](https://bit.ly/myadprice-ch)
- [Mozilla Firefox](https://bit.ly/myadprice-fx)

MyAdPrice is not currently offered for Safari and Edge. Please make sure you don't have ad blockers enabled because there will be no ad activity on websites in that case.

MyAdPrice works on thousands of websites, some of which are listed [here](https://www.myadprice.com/websites). Please also note that many websites avoid using header bidding techniques, especially if you are in Europe, unless you explicity accept cookies.

We recommend that after you install the extension, click the "_I agree_" button in the _History_ and let it sit for a while as you browse the web so that it accumulates data (on your browser's _local storage_) about what revenues websites make from your visits and how bids for your views compare with those of other users.

## Technical Notes
MyAdPrice is a very simple browser extension. There are only a few UI-related dependencies that you can fetch by running `./getdeps.sh`. This script uses `curl`.

Besides utilizing prebid.js functions, the extension also has fallback mechanisms that include inspecting outgoing network requests to ad servers to infer data about the ads. In its attempt to show you as much information as it can, MyAdPrice may sometimes encounter false positives such as tracking pixels registering as ad slots of unknown size.

## About
This study is being carried out by researchers at _Duke University_, _Max Plank Institute for Informatics_, _University of Illinois at Urbana Champaign_, and _ETH Zurich_. Please refer to the [group's webpage](cspeed.net) for more details.

The aim of this study is to investigate the [header bidding](https://adexchanger.com/publishers/the-rise-of-header-bidding-and-the-end-of-the-publisher-waterfall/) infrastructure, the network and geographic attributes of the 50+ ad exchanges and the thousands of publishers that take part in header bidding [today](https://adzerk.com/hbix/), and how they interact with the user's browser, which affects website load time and publisher revenue. We believe it is the first study of its kind.

## License
[GPLv3](https://github.com/waqaraqeel/myadprice/blob/master/LICENSE.txt)
