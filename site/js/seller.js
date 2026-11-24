(function(){var d=document,m=/(?:^|; )sb_seller=([^;]*)/.exec(d.cookie),c=m&&m[1].split("|"),h=c&&c[0],n,p,b,i,f,a,o,s,g=function(n,c){n=d.createElement(n);n.className=c;return n};
var l=d.getElementById("legal-change");if(l&&new Date().toISOString().slice(0,10)>=l.getAttribute("data-until"))l.hidden=1;
if(!h||!/^[a-z0-9-]{3,40}$/.test(h))return;
try{n=decodeURIComponent(c[1]||"")}catch(e){n=""}
p="/s/"+h+"/manage";b=d.querySelector(".acct");i=d.getElementById("sell-in");f=d.getElementById("sell-form");
if(b){a=g("a","acct-page");o=g("form","acct-out");s=g("button","");a.href=p;a.textContent=n||"Your seller page";o.method="post";o.action="/manage/signout";s.textContent="Sign out";o.append(s);b.className="acct acct-seller";b.textContent="";b.append(a,o)}
if(i&&f){d.getElementById("sell-in-page").href=p;d.getElementById("sell-in-new").href=p+"/listings/new";f.hidden=!(i.hidden=0)}})();
