var quote = {};

var createDom = function(pair) {
	var wrapper = document.getElementById("content");
	var div = document.createElement("div");
	div.className = "col-xs-4";
	var html = '<div class="wrapper open">';
	html += '<h1><span id="fsym_'+ pair +'"></span> - <span id="tsym_'+ pair +'"></span>   <strong><span class="price" id="price_'+ pair +'"></span></strong></h1>';
	html += '<div class="lable-holder">';
	html += '<div class="lable">24h Change: <span class="value" id="change_'+ pair +'"></span> (<span class="value" id="changepct_'+ pair +'"></span>)</div>';
	html += '<div class="lable">Last Market: <span class="market" id="market_'+ pair +'"></span></div>';
	html += '<div class="lable">Last Trade Id: <span class="value" id="tradeid_'+ pair +'"></span></div>';
	html += '<div class="lable">Last Trade Volume: <span class="value" id="volume_'+ pair +'"></span></div>';
	html += '<div class="lable">Last Trade VolumeTo: <span class="value" id="volumeto_'+ pair +'"></span></div>';
	html += '<div class="lable">24h Volume: <span class="value" id="24volume_'+ pair +'"></span></div>';
	html += '<div class="lable">24h VolumeTo: <span class="value" id="24volumeto_'+ pair +'"></span></div>';
	html += '</div>';
	html += '<div class="lable-opener"><i class="fa fa-chevron-down" aria-hidden="true"></i></div>'
	html += '</div>';
	div.innerHTML = html;
	wrapper.appendChild(div);
	
};

var displayQuote = function(_quote) {

	var fsym = CCC.STATIC.CURRENCY.SYMBOL[_quote.FROMSYMBOL];
	var tsym = CCC.STATIC.CURRENCY.SYMBOL[_quote.TOSYMBOL];
	var pair = _quote.FROMSYMBOL + _quote.TOSYMBOL;
	console.log(_quote);
	console.log(pair);
	
	document.getElementById("market_" + pair).innerHTML = _quote.LASTMARKET;
	document.getElementById("fsym_" + pair).innerHTML = _quote.FROMSYMBOL;
	document.getElementById("tsym_" + pair).innerHTML = _quote.TOSYMBOL;
	document.getElementById("price_" + pair).innerHTML = _quote.PRICE;
	document.getElementById("volume_" + pair).innerHTML = CCC.convertValueToDisplay(fsym, _quote.LASTVOLUME);
	document.getElementById("volumeto_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.LASTVOLUMETO);
	document.getElementById("24volume_" + pair).innerHTML = CCC.convertValueToDisplay(fsym, _quote.VOLUME24HOUR);	
	document.getElementById("24volumeto_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.VOLUME24HOURTO);
	document.getElementById("tradeid_" + pair).innerHTML = _quote.LASTTRADEID.toFixed(0);
	document.getElementById("tradeid_" + pair).innerHTML = _quote.LASTTRADEID.toFixed(0);
	document.getElementById("change_" + pair).innerHTML = CCC.convertValueToDisplay(tsym, _quote.CHANGE24H);
	document.getElementById("changepct_" + pair).innerHTML = _quote.CHANGEPCT24H.toFixed(2) + "%";

	if (quote.FLAGS === "1"){
		document.getElementById("price").className = "up";
	} 
	else if (quote.FLAGS === "2") {
		document.getElementById("price").className = "down";
	}
	else if (quote.FLAGS === "4") {
		document.getElementById("price").className = "";
	}

}

var updateQuote = function(result) {

	var keys = Object.keys(result);
	var pair = result.FROMSYMBOL + result.TOSYMBOL;
	if (!quote.hasOwnProperty(pair)) {
		quote[pair] = {}
		createDom(pair);
	}
	for (var i = 0; i <keys.length; ++i) {
		quote[pair][keys[i]] = result[keys[i]];
	}
	quote[pair]["CHANGE24H"] = quote[pair]["PRICE"] - quote[pair]["OPEN24HOUR"];
	quote[pair]["CHANGEPCT24H"] = quote[pair]["CHANGE24H"]/quote[pair]["OPEN24HOUR"] * 100;
	displayQuote(quote[pair]);
}

var socket = io.connect('https://streamer.cryptocompare.com/');

//Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
//Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
//For aggregate quote updates use CCCAGG as market
var subscription = ['5~CCCAGG~BTC~EUR','5~CCCAGG~ETH~EUR','5~CCCAGG~NEO~USD'];

socket.emit('SubAdd', {subs:subscription} );

socket.on("m", function(message){
	var messageType = message.substring(0, message.indexOf("~"));
	var res = {};
	if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
		res = CCC.CURRENT.unpack(message);
		console.log(res);
		updateQuote(res);
	}		
				
});

$(".wrapper").each(function() {
		$(this).find(".lable-opener").click(function() {
			$(this).toggleClass('selector');
		});
	});	