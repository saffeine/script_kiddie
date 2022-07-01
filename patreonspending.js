var results = {};
var spans = document.getElementsByTagName("span");

var fetchCurrency = function(token){
  var tokenList = [];
  var tokenIndex = 0;
  var currencyTotal = 0;
  
  for(var i=0; i<spans.length; i++){
    if(spans[i].innerText.indexOf(token) != -1){
      tokenList[tokenIndex++] = spans[i];
    }
  }
  
  for(var i=0; i<tokenList.length; i++){
    var division = 1;
    if(tokenList[i].parentNode.innerText.indexOf("per year") >= 0){ division = 12; }
    if(tokenList[i].parentNode.innerText.indexOf("per month") >= 0){ division = 1; }
    currencyTotal += parseFloat(tokenList[i].innerText.replace(token, "")) / division;
  }
  
  currencyString = "";
  currencyStringT = String(Math.floor(currencyTotal*100));
  while(currencyStringT.length < 3){ currencyStringT = "0" + currencyStringT; }
  currencyStringT = currencyStringT;
  for(var i=0; i<currencyStringT.length; i++){
    if(i == currencyStringT.length - 2){ currencyString += "."; }
    currencyString += currencyStringT.charAt(i);
  }
  
  return currencyString;
}

var getSpending = function(){
  var url_ = "https://www.patreon.com/pledges";
  if(document.location.href != url_){
    alert("This bookmarklet doesn't work on pages that aren't the official Patreon Pledges pages.\nA new tab will be opened, taking you to the page. Please try again.");
    window.open(url_, "_blank");
    return;
  }

  var str_ = "";
  var currencies = ["£", "$", "KK"];
  for(var i=0; i<currencies.length; i++){
    var fetched = fetchCurrency(currencies[i]);
    if(fetched != "0.00"){ str_ += currencies[i] + fetchCurrency(currencies[i]) + " /mo\n"; }
  }
  
  alert("You are currently spending:\n" + str_ + "on Patreon.");
  return;
}

getSpending();