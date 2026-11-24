/* Soukbase seller forms: progressive enhancement. Without this file every form is a plain POST (see src/web/sell.ts).
 * Wallet contract with site/js/wallet-connect.js (cards 0712, 0798), looked up as window.SoukbaseWallet:
 *   connect({ anyChain }): Promise<{ address: string, chainId?: number, manual?: boolean }>
 *   signMessage(message: string, address: string, { quiet }): Promise<string>   // personal_sign, rejects when the person declines
 * Each connect() opens the wallet and asks for the account (T-0921); the account it returns is kept in memory here (walletAddr), never written into the hand-signing field #f-address.
 * When it is absent the form posts as plain HTML and the next page shows the message and a signature field. */
(function () {
  "use strict";
  /* T-0939: the country that owns a browser time zone, from the tz database (zone.tab and its aliases), one owner per zone. `countries` is the list the
   * caller allows (the select's options without the excluded ones); a zone whose owner is not in it, or an unknown zone, gives "". Pure: no network, nothing sent. */
  var ZONES = "AD Europe/Andorra;AE Asia/Dubai;AF Asia/Kabul;AG America/Antigua;AI America/Anguilla;AL Europe/Tirane;AM Asia/Yerevan;AO Africa/Luanda;AQ Antarctica/Casey Antarctica/Davis Antarctica/DumontDUrville Antarctica/Mawson Antarctica/McMurdo Antarctica/Palmer Antarctica/Rothera Antarctica/South_Pole Antarctica/Syowa Antarctica/Troll Antarctica/Vostok;AR America/Argentina/Buenos_Aires America/Argentina/Catamarca America/Argentina/ComodRivadavia America/Argentina/Cordoba America/Argentina/Jujuy America/Argentina/La_Rioja America/Argentina/Mendoza America/Argentina/Rio_Gallegos America/Argentina/Salta America/Argentina/San_Juan America/Argentina/San_Luis America/Argentina/Tucuman America/Argentina/Ushuaia America/Buenos_Aires America/Catamarca America/Cordoba America/Jujuy America/Mendoza America/Rosario;AS Pacific/Pago_Pago Pacific/Samoa;AT Europe/Vienna;AU Antarctica/Macquarie Australia/ACT Australia/Adelaide Australia/Brisbane Australia/Broken_Hill Australia/Canberra Australia/Currie Australia/Darwin Australia/Eucla Australia/Hobart Australia/LHI Australia/Lindeman Australia/Lord_Howe Australia/Melbourne Australia/NSW Australia/North Australia/Perth Australia/Queensland Australia/South Australia/Sydney Australia/Tasmania Australia/Victoria Australia/West Australia/Yancowinna;AW America/Aruba;AX Europe/Mariehamn;AZ Asia/Baku;BA Europe/Sarajevo;BB America/Barbados;BD Asia/Dacca Asia/Dhaka;BE Europe/Brussels;BF Africa/Ouagadougou;BG Europe/Sofia;BH Asia/Bahrain;BI Africa/Bujumbura;BJ Africa/Porto-Novo;BL America/St_Barthelemy;BM Atlantic/Bermuda;BN Asia/Brunei;BO America/La_Paz;BQ America/Kralendijk;BR America/Araguaina America/Bahia America/Belem America/Boa_Vista America/Campo_Grande America/Cuiaba America/Eirunepe America/Fortaleza America/Maceio America/Manaus America/Noronha America/Porto_Acre America/Porto_Velho America/Recife America/Rio_Branco America/Santarem America/Sao_Paulo;BS America/Nassau;BT Asia/Thimbu Asia/Thimphu;BW Africa/Gaborone;BY Europe/Minsk;BZ America/Belize;CA America/Atikokan America/Blanc-Sablon America/Cambridge_Bay America/Coral_Harbour America/Creston America/Dawson America/Dawson_Creek America/Edmonton America/Fort_Nelson America/Glace_Bay America/Goose_Bay America/Halifax America/Inuvik America/Iqaluit America/Moncton America/Montreal America/Nipigon America/Pangnirtung America/Rainy_River America/Rankin_Inlet America/Regina America/Resolute America/St_Johns America/Swift_Current America/Thunder_Bay America/Toronto America/Vancouver America/Whitehorse America/Winnipeg America/Yellowknife;CC Indian/Cocos;CD Africa/Kinshasa Africa/Lubumbashi;CF Africa/Bangui;CG Africa/Brazzaville;CH Europe/Zurich;CI Africa/Abidjan;CK Pacific/Rarotonga;CL America/Coyhaique America/Punta_Arenas America/Santiago Pacific/Easter;CM Africa/Douala;CN Asia/Chongqing Asia/Chungking Asia/Harbin Asia/Kashgar Asia/Shanghai Asia/Urumqi;CO America/Bogota;CR America/Costa_Rica;CU America/Havana;CV Atlantic/Cape_Verde;CW America/Curacao;CX Indian/Christmas;CY Asia/Famagusta Asia/Nicosia Europe/Nicosia;CZ Europe/Prague;DE Europe/Berlin Europe/Busingen;DJ Africa/Djibouti;DK Europe/Copenhagen;DM America/Dominica;DO America/Santo_Domingo;DZ Africa/Algiers;EC America/Guayaquil Pacific/Galapagos;EE Europe/Tallinn;EG Africa/Cairo;EH Africa/El_Aaiun;ER Africa/Asmara Africa/Asmera;ES Africa/Ceuta Atlantic/Canary Europe/Madrid;ET Africa/Addis_Ababa;FI Europe/Helsinki;FJ Pacific/Fiji;FK Atlantic/Stanley;FM Pacific/Chuuk Pacific/Kosrae Pacific/Pohnpei Pacific/Ponape Pacific/Truk Pacific/Yap;FO Atlantic/Faeroe Atlantic/Faroe;FR Europe/Paris;GA Africa/Libreville;GB Europe/Belfast Europe/London;GD America/Grenada;GE Asia/Tbilisi;GF America/Cayenne;GG Europe/Guernsey;GH Africa/Accra;GI Europe/Gibraltar;GL America/Danmarkshavn America/Godthab America/Nuuk America/Scoresbysund America/Thule;GM Africa/Banjul;GN Africa/Conakry;GP America/Guadeloupe;GQ Africa/Malabo;GR Europe/Athens;GS Atlantic/South_Georgia;GT America/Guatemala;GU Pacific/Guam;GW Africa/Bissau;GY America/Guyana;HK Asia/Hong_Kong;HN America/Tegucigalpa;HR Europe/Zagreb;HT America/Port-au-Prince;HU Europe/Budapest;ID Asia/Jakarta Asia/Jayapura Asia/Makassar Asia/Pontianak Asia/Ujung_Pandang;IE Europe/Dublin;IL Asia/Jerusalem Asia/Tel_Aviv;IM Europe/Isle_of_Man;IN Asia/Calcutta Asia/Kolkata;IO Indian/Chagos;IQ Asia/Baghdad;IR Asia/Tehran;IS Atlantic/Reykjavik;IT Europe/Rome;JE Europe/Jersey;JM America/Jamaica;JO Asia/Amman;JP Asia/Tokyo;KE Africa/Nairobi;KG Asia/Bishkek;KH Asia/Phnom_Penh;KI Pacific/Enderbury Pacific/Kanton Pacific/Kiritimati Pacific/Tarawa;KM Indian/Comoro;KN America/St_Kitts;KP Asia/Pyongyang;KR Asia/Seoul;KW Asia/Kuwait;KY America/Cayman;KZ Asia/Almaty Asia/Aqtau Asia/Aqtobe Asia/Atyrau Asia/Oral Asia/Qostanay Asia/Qyzylorda;LA Asia/Vientiane;LB Asia/Beirut;LC America/St_Lucia;LI Europe/Vaduz;LK Asia/Colombo;LR Africa/Monrovia;LS Africa/Maseru;LT Europe/Vilnius;LU Europe/Luxembourg;LV Europe/Riga;LY Africa/Tripoli;MA Africa/Casablanca;MC Europe/Monaco;MD Europe/Chisinau Europe/Tiraspol;ME Europe/Podgorica;MF America/Marigot;MG Indian/Antananarivo;MH Pacific/Kwajalein Pacific/Majuro;MK Europe/Skopje;ML Africa/Bamako Africa/Timbuktu;MM Asia/Rangoon Asia/Yangon;MN Asia/Choibalsan Asia/Hovd Asia/Ulaanbaatar Asia/Ulan_Bator;MO Asia/Macao Asia/Macau;MP Pacific/Saipan;MQ America/Martinique;MR Africa/Nouakchott;MS America/Montserrat;MT Europe/Malta;MU Indian/Mauritius;MV Indian/Maldives;MW Africa/Blantyre;MX America/Bahia_Banderas America/Cancun America/Chihuahua America/Ciudad_Juarez America/Ensenada America/Hermosillo America/Matamoros America/Mazatlan America/Merida America/Mexico_City America/Monterrey America/Ojinaga America/Santa_Isabel America/Tijuana;MY Asia/Kuala_Lumpur Asia/Kuching;MZ Africa/Maputo;NA Africa/Windhoek;NC Pacific/Noumea;NE Africa/Niamey;NF Pacific/Norfolk;NG Africa/Lagos;NI America/Managua;NL Europe/Amsterdam;NO Atlantic/Jan_Mayen Europe/Oslo;NP Asia/Kathmandu Asia/Katmandu;NR Pacific/Nauru;NU Pacific/Niue;NZ Pacific/Auckland Pacific/Chatham;OM Asia/Muscat;PA America/Panama;PE America/Lima;PF Pacific/Gambier Pacific/Marquesas Pacific/Tahiti;PG Pacific/Bougainville Pacific/Port_Moresby;PH Asia/Manila;PK Asia/Karachi;PL Europe/Warsaw;PM America/Miquelon;PN Pacific/Pitcairn;PR America/Puerto_Rico;PS Asia/Gaza Asia/Hebron;PT Atlantic/Azores Atlantic/Madeira Europe/Lisbon;PW Pacific/Palau;PY America/Asuncion;QA Asia/Qatar;RE Indian/Reunion;RO Europe/Bucharest;RS Europe/Belgrade;RU Asia/Anadyr Asia/Barnaul Asia/Chita Asia/Irkutsk Asia/Kamchatka Asia/Khandyga Asia/Krasnoyarsk Asia/Magadan Asia/Novokuznetsk Asia/Novosibirsk Asia/Omsk Asia/Sakhalin Asia/Srednekolymsk Asia/Tomsk Asia/Ust-Nera Asia/Vladivostok Asia/Yakutsk Asia/Yekaterinburg Europe/Astrakhan Europe/Kaliningrad Europe/Kirov Europe/Moscow Europe/Samara Europe/Saratov Europe/Ulyanovsk Europe/Volgograd;RW Africa/Kigali;SA Asia/Riyadh;SB Pacific/Guadalcanal;SC Indian/Mahe;SD Africa/Khartoum;SE Europe/Stockholm;SG Asia/Singapore;SH Atlantic/St_Helena;SI Europe/Ljubljana;SJ Arctic/Longyearbyen;SK Europe/Bratislava;SL Africa/Freetown;SM Europe/San_Marino;SN Africa/Dakar;SO Africa/Mogadishu;SR America/Paramaribo;SS Africa/Juba;ST Africa/Sao_Tome;SV America/El_Salvador;SX America/Lower_Princes;SY Asia/Damascus;SZ Africa/Mbabane;TC America/Grand_Turk;TD Africa/Ndjamena;TF Indian/Kerguelen;TG Africa/Lome;TH Asia/Bangkok;TJ Asia/Dushanbe;TK Pacific/Fakaofo;TL Asia/Dili;TM Asia/Ashgabat Asia/Ashkhabad;TN Africa/Tunis;TO Pacific/Tongatapu;TR Asia/Istanbul Europe/Istanbul;TT America/Port_of_Spain;TV Pacific/Funafuti;TW Asia/Taipei;TZ Africa/Dar_es_Salaam;UA Europe/Kiev Europe/Kyiv Europe/Simferopol Europe/Uzhgorod Europe/Zaporozhye;UG Africa/Kampala;UM Pacific/Midway Pacific/Wake;US America/Adak America/Anchorage America/Atka America/Boise America/Chicago America/Denver America/Detroit America/Fort_Wayne America/Indiana/Indianapolis America/Indiana/Knox America/Indiana/Marengo America/Indiana/Petersburg America/Indiana/Tell_City America/Indiana/Vevay America/Indiana/Vincennes America/Indiana/Winamac America/Indianapolis America/Juneau America/Kentucky/Louisville America/Kentucky/Monticello America/Knox_IN America/Los_Angeles America/Louisville America/Menominee America/Metlakatla America/New_York America/Nome America/North_Dakota/Beulah America/North_Dakota/Center America/North_Dakota/New_Salem America/Phoenix America/Shiprock America/Sitka America/Yakutat Pacific/Honolulu Pacific/Johnston;UY America/Montevideo;UZ Asia/Samarkand Asia/Tashkent;VA Europe/Vatican;VC America/St_Vincent;VE America/Caracas;VG America/Tortola;VI America/St_Thomas America/Virgin;VN Asia/Ho_Chi_Minh Asia/Saigon;VU Pacific/Efate;WF Pacific/Wallis;WS Pacific/Apia;YE Asia/Aden;YT Indian/Mayotte;ZA Africa/Johannesburg;ZM Africa/Lusaka;ZW Africa/Harare";
  var zoneOwner = null;
  function countryFromZone(zone, countries) {
    if (!zoneOwner) {
      zoneOwner = Object.create(null);
      ZONES.split(";").forEach(function (row) { var p = row.split(" "); p.slice(1).forEach(function (z) { zoneOwner[z] = p[0]; }); });
    }
    var c = zoneOwner[zone];
    return c && countries.indexOf(c) >= 0 ? c : "";
  }
  window.SoukbaseCountryFromZone = countryFromZone;
  var form = document.getElementById("sell-form");
  var $ = function (id) { return document.getElementById(id); };
  var qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  qa(".js-only").forEach(function (e) { if (e.id !== "wallet-connect" && !e.closest("#wallet-row")) e.hidden = false; });
  qa("[data-count-for]").forEach(function (c) {
    var el = $(c.getAttribute("data-count-for"));
    var max = c.textContent.split("/")[1].trim();
    /* T-0923: a counted field has no maxlength; over the limit the counter turns to the error colour and the server says by how much */
    var upd = function () { c.textContent = el.value.length + " / " + max; c.classList.toggle("over", el.value.length > Number(max)); };
    el.addEventListener("input", upd); upd();
  });

  /* ---- listing form v2 (T-0783; /#sell step 3 and the /manage listing pages) ----
   * Choosing a category preselects its delivery (the radio's data-delivery, from rules/categories.json) unless the seller
   * picked a delivery themselves; only the chosen mode's block, the chosen category's fields and, for a custom licence,
   * the terms box are shown; the delivery time select counts only for the webhook. Without this file every block shows
   * and the server applies the category's delivery when none is chosen. */
  var lform = document.querySelector(".lform");
  var gl = $("guide-link"), guideBase = gl ? gl.getAttribute("href").split("?")[0] : "";
  if (lform) listingForm(lform);
  /* T-0912: "How to fill this in" opens the guide in the named window soukbase-guide, a narrow one at the right edge beside the form; without a script it is a plain link with the same target.
   * T-0925: its address carries the chosen category (the guide shows that category's fields); the server sets it for a saved one, sync() follows the chips */
  if (gl) gl.addEventListener("click", function (ev) {
    var w = 460, l = Math.max(0, (screen.availLeft || 0) + screen.width - w);
    var win = window.open(gl.href, "soukbase-guide", "popup,width=" + w + ",height=" + Math.min(screen.availHeight || 800, 900) + ",left=" + l + ",top=" + (screen.availTop || 0));
    if (win) { ev.preventDefault(); win.focus(); }
  });
  function listingForm(root) {
    var host = root.closest("form");
    var radios = function (n) { return qa('input[name="' + n + '"]', host); };
    var picked = function (n) { var r = radios(n).filter(function (x) { return x.checked; })[0]; return r ? r.value : ""; };
    var time = host.elements.delivery_time;
    /* on an edit page the saved delivery is the seller's own choice */
    var touched = host.id !== "sell-form" && !!picked("delivery_mode");
    function sync() {
      var mode = picked("delivery_mode"), cat = picked("category");
      qa("[data-for]", root).forEach(function (b) { b.hidden = b.getAttribute("data-for") !== mode; });
      if (gl) gl.href = guideBase + (cat ? "?category=" + encodeURIComponent(cat) : "");
      qa(".catf", root).forEach(function (fs) { fs.hidden = fs.getAttribute("data-cat") !== cat; });
      /* licences: the chosen category's set (data-lic on its chip); a stored one (data-keep) stays; a choice that gets hidden is cleared and nothing is chosen in its place (T-0941) */
      var catEl = radios("category").filter(function (x) { return x.checked; })[0], lset = catEl ? catEl.getAttribute("data-lic") || "" : null;
      qa(".lic", root).forEach(function (l) {
        var s = l.getAttribute("data-set"), r = l.querySelector("input");
        l.hidden = lset !== null && s !== "" && s !== "x" && s !== lset && !r.hasAttribute("data-keep");
      });
      var on = radios("attr_licence").filter(function (x) { return x.checked; })[0];
      if (on && on.closest(".lic").hidden) on.checked = false;
      var cust = root.querySelector("[data-licence-custom]"); if (cust) cust.hidden = picked("attr_licence") !== "custom";
      /* Delivery time counts only for the webhook (T-0886: and is shown only then); the webhook block follows the chosen mode when it changes */
      if (time) { time.disabled = mode !== "webhook"; var tf = time.closest(".field"); if (tf) tf.hidden = mode !== "webhook"; }
      var adv = $("adv-webhook");
      if (adv && mode !== lastMode) { lastMode = mode; adv.open = mode === "webhook"; }
    }
    var lastMode;
    radios("delivery_mode").forEach(function (r) { r.addEventListener("change", function () { touched = true; sync(); }); });
    radios("category").forEach(function (r) {
      r.addEventListener("change", function () {
        var d = r.getAttribute("data-delivery");
        if (!touched) radios("delivery_mode").forEach(function (x) { x.checked = x.value === d; });
        sync();
      });
    });
    radios("attr_licence").forEach(function (r) { r.addEventListener("change", sync); });
    sync();
    /* T-0799: the price is written with two decimals ("3", "3.5", "3,50"); a refund window must be chosen (the page's data-error words; the server checks it too).
     * T-0866: the purpose is not copied from the description; left empty, the server takes the first sentence. */
    var price = host.elements.price_usdc;
    if (price) price.addEventListener("blur", function () {
      var m = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(price.value.trim());
      if (m) price.value = m[1] + "." + ((m[2] || "") + "00").slice(0, 2);
    });
    /* T-0941: the licence is a choice the seller makes, like the refund window: Send (and Preview) stops with the page's words (data-error of the box) in one role="alert" line under the cards */
    var must = ["attr_licence", "refund_window_days"].map(function (n) { return { n: n, box: $("seg-" + n), rs: radios(n) }; }).filter(function (m) { return m.box && m.rs.length; });
    if (must.length) {
      var clear = function (m) { var o = $("f-" + m.n + "-e"); if (o) o.remove(); };
      must.forEach(function (m) { m.rs.forEach(function (r) { r.addEventListener("change", function () { clear(m); }); }); });
      host.addEventListener("submit", function (ev) {
        if (host.id === "sell-form") return;
        var missing = must.filter(function (m) { return picked(m.n) === ""; });
        if (!missing.length) return;
        ev.preventDefault(); must.forEach(clear);
        missing.forEach(function (m) {
          var s = document.createElement("span"); s.className = "help err"; s.id = "f-" + m.n + "-e"; s.setAttribute("role", "alert");
          s.textContent = m.box.getAttribute("data-error") || ""; m.box.appendChild(s);
        });
        var first = missing[0].rs.filter(function (r) { var l = r.closest(".lic"); return !(l && l.hidden); })[0];
        if (first) first.focus();
      });
    }
    /* T-0941: a text that holds the two characters \" \n or \t is probably pasted from JSON: a note under the field (aria-live), never a block. The words are the field's data-esc-note. */
    var ESC = /\\["nt]/;
    qa("[data-esc-note]", host).forEach(function (t) {
      var after = $(t.id + "-h") || t, note = document.createElement("span");
      note.className = "help esc-note"; note.id = t.id + "-esc"; note.setAttribute("aria-live", "polite");
      after.parentNode.insertBefore(note, after.nextSibling);
      var upd = function () { note.textContent = ESC.test(t.value) ? t.getAttribute("data-esc-note") : ""; };
      t.addEventListener("input", upd); upd();
    });
  }

  if (!form) return;

  /* ---- seller form v3, step 1 (SELLER-FORM-1110 ruling-1 §2.2) ----
   * Every text comes from the page (data-texts, rendered from src/web/content.ts STEP1). The wallet button connects,
   * gets the bind message from /sell/message, asks for one signature and submits the form to /sell/send, which answers
   * 303 to the first-listing page. Without this file the button posts to /sell/message and the manual path follows. */
  var T = JSON.parse(form.getAttribute("data-texts"));
  var API = form.getAttribute("data-api");
  var CHAINS = form.getAttribute("data-chain-ids").split(",").map(Number);
  var f = function (n) { return form.elements[n]; };
  var val = function (n) { var e = f(n); if (!e) return ""; return e.type === "checkbox" ? (e.checked ? "yes" : "") : String(e.value).trim(); };
  var wallet = function () { return window.SoukbaseWallet || null; };
  var excluded = (f("country").getAttribute("data-excluded") || "").split(",");
  var manualBox = $("sell-manual");
  /* T-0939: the button label follows the step. The idle label is the one the page was sent with; a status text selects the label of its step. */
  var idleLabel = $("submit-label").textContent, labelOf = {};
  labelOf[T.status.choose] = labelOf[T.status.connect] = T.button.wallet; labelOf[T.status.sign] = T.button.sign; labelOf[T.status.creating] = T.button.creating;

  /* ---- messages: an error replaces the hint under the same field ---- */
  var ICON_WARN = '<svg class="ic" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v6M12 16v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  /* aria-describedby keeps the hint id and gains the error id while an error shows. */
  function describe(el, id, errId) {
    if (!el || !el.setAttribute || el.type === "radio" || !id) return;
    var ids = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter(function (x) { return x && x !== id + "-e"; });
    if (errId) ids.push(errId);
    if (ids.length) el.setAttribute("aria-describedby", ids.join(" ")); else el.removeAttribute("aria-describedby");
  }
  function setErr(name, msg) {
    var el = f(name); if (!el) return;
    var id = el.id, old = $(id + "-e"), hint = $(id + "-h");
    if (old) old.remove();
    if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
    describe(el, id, msg ? id + "-e" : "");
    if (hint && name !== "handle") hint.hidden = !!msg;
    if (!msg) return;
    var s = document.createElement("span"); s.className = "help err"; s.id = id + "-e"; s.setAttribute("role", "alert");
    s.innerHTML = ICON_WARN; var t = document.createElement("span"); t.textContent = msg; s.appendChild(t);
    if (msg === T.country.excluded) { var a = document.createElement("a"); a.href = "/legal/seller-requirements"; a.textContent = T.country.excludedLink; t.appendChild(document.createTextNode(" ")); t.appendChild(a); }
    var anchor = el.type === "checkbox" ? el.closest("label") : (hint || el);
    anchor.parentNode.insertBefore(s, anchor.nextSibling);
  }
  /* links: [{ text, href }] or [{ text, click }]; each text is a part of msg, in order, and becomes a link */
  var walletAddr = "", walletChain = ""; /* T-0921: the account the wallet gave and its chain; the hand field #f-address is never written */
  var existsFor = ""; /* T-0905: the address (lower case) a seller_exists answer was given for */
  function banner(msg, links, buttons) {
    var b = $("form-error"); b.textContent = ""; b.hidden = !msg; if (!msg) { existsFor = ""; return; }
    b.innerHTML = ICON_WARN; var t = document.createElement("span"); t.className = "banner-text"; b.appendChild(t);
    var rest = msg;
    (links || []).forEach(function (l) {
      var i = rest.indexOf(l.text); if (i < 0) return;
      t.appendChild(document.createTextNode(rest.slice(0, i)));
      var a = document.createElement("a"); a.href = l.href || "#"; a.textContent = l.text;
      if (l.click) a.addEventListener("click", function (ev) { ev.preventDefault(); l.click(); });
      t.appendChild(a); rest = rest.slice(i + l.text.length);
    });
    t.appendChild(document.createTextNode(rest));
    if (buttons) {
      var row = document.createElement("span"); row.className = "banner-btns"; b.appendChild(row);
      buttons.forEach(function (x) {
        var k = document.createElement("button"); k.type = "button"; k.id = x.id; k.className = x.cls; k.textContent = x.text;
        k.addEventListener("click", x.click); row.appendChild(k);
      });
    }
    b.scrollIntoView && b.scrollIntoView({ block: "center" });
  }
  /* the SIGN_NOTE line is hidden while a status shows a text (one line at a time) */
  function status(msg) {
    $("sell-status").textContent = msg || ""; var n = $("sign-note"); if (n) n.hidden = !!msg;
    if (labelOf[msg]) $("submit-label").textContent = labelOf[msg];
  }

  /* ---- validation: the words of ruling §2.2; the server checks the same and the API stays the authority ---- */
  var handleState = "";
  function validate(manual) {
    var e = {};
    var dn = val("display_name"); if (dn.length < 2 || dn.length > 60) e.display_name = T.name.error;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("contact_email")) || val("contact_email").length > 254) e.contact_email = T.email.error;
    if (!/^[a-z0-9-]{3,40}$/.test(val("handle"))) { if (handleOwn || !e.display_name) e.handle = T.handle.rule; }
    else if (handleState === "taken") e.handle = T.handle.taken;
    else if (handleState === "reserved") e.handle = T.handle.reserved;
    if (!val("country")) e.country = T.country.error;
    else if (excluded.indexOf(val("country")) >= 0) e.country = T.country.excluded;
    if (!val("consent")) e.consent = T.consentError;
    if (manual && !/^0x[0-9a-fA-F]{40}$/.test(val("address"))) e.address = "Wallet address must be 0x followed by 40 hex characters.";
    return e;
  }
  var FIELD_NAMES = ["display_name", "contact_email", "handle", "country", "consent", "address", "chain_id"];
  var shownErr = {};
  function showErrors(e) {
    FIELD_NAMES.forEach(function (n) {
      shownErr[n] = e[n] || "";
      if (n === "handle") { if (e[n]) { handleOpen = true; handleView(); handleHelp(e[n], "bad"); } } else setErr(n, e[n] || "");
    });
    if (e.address || e.chain_id) manualBox.open = true;
    var first = FIELD_NAMES.filter(function (n) { return e[n]; })[0]; if (first && f(first).focus) f(first).focus();
  }
  /* After a submit attempt a field that shows an error is re-checked as it changes; the others stay quiet. */
  function liveRevalidate(ev) {
    var n = ev.target && ev.target.name; if (!n || n === "handle" || !shownErr[n]) return;
    var e = validate(n === "address"); shownErr[n] = e[n] || ""; setErr(n, e[n] || "");
  }
  form.addEventListener("input", liveRevalidate);
  form.addEventListener("change", liveRevalidate);

  /* ---- page address: filled from the name until the seller edits it; live check, 300 ms debounce ---- */
  var timer = null, seq = 0, suggesting = false, handleOwn = !!val("handle");
  /* T-0939: with a script the address is one line under the name ("Your page: soukbase.com/s/<handle> · Change"); the input opens by Change, by a taken or
   * reserved address and by an error. Without a script the input shows as the server sent it. */
  var handleOpen = !!$("f-handle-e");
  function handleView() {
    var h = val("handle"), ok = /^[a-z0-9-]{3,40}$/.test(h);
    $("handle-field").hidden = !handleOpen; $("handle-line").hidden = handleOpen || !ok;
    $("handle-url").textContent = T.handle.prefix + h;
  }
  $("handle-change").addEventListener("click", function () { handleOpen = true; handleView(); f("handle").focus(); });
  /* an error is the same element as every field error (setErr: icon, .help.err, aria-invalid); the other states use the hint line */
  function handleHelp(msg, kind) {
    var h = $("f-handle-h");
    if (kind === "bad" && msg) { h.textContent = ""; h.className = "help"; setErr("handle", msg); return; }
    setErr("handle", ""); h.textContent = msg || T.handle.hint; h.className = "help" + (kind === "ok" ? " ok" : "");
  }
  function slug(s) { return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/, ""); }
  f("display_name").addEventListener("input", function () {
    if (handleOwn) return;
    suggesting = true; f("handle").value = slug(val("display_name")); f("handle").dispatchEvent(new Event("input")); suggesting = false;
  });
  f("handle").addEventListener("input", function () {
    if (!suggesting) handleOwn = !!this.value;
    var h = val("handle").toLowerCase(); this.value = h; handleState = ""; clearTimeout(timer); setErr("handle", ""); seq++;
    if (!h) { handleHelp(""); handleView(); return; }
    if (!/^[a-z0-9-]{3,40}$/.test(h)) { handleState = "invalid"; handleHelp(suggesting ? "" : T.handle.rule, "bad"); handleView(); return; }
    handleHelp(T.handle.checking); handleView();
    var my = seq;
    timer = setTimeout(function () {
      fetch(API + "/handles/" + encodeURIComponent(h)).then(function (r) { return r.json(); }).then(function (j) {
        if (my !== seq) return;
        if (j.available) { handleState = "available"; handleHelp(T.handle.available, "ok"); }
        else if (j.reason === "taken") { handleState = "taken"; handleOpen = true; handleView(); handleHelp(T.handle.taken, "bad"); }
        else if (j.reason === "reserved") { handleState = "reserved"; handleOpen = true; handleView(); handleHelp(T.handle.reserved, "bad"); }
        else { handleState = "invalid"; handleHelp(T.handle.rule, "bad"); }
      }).catch(function () { if (my === seq) { handleState = ""; handleHelp(T.handle.unchecked); } });
    }, 300);
  });

  handleView();

  /* ---- country: a suggestion from the browser's language region (en-GB -> GB) while none is chosen, never an excluded
   * country (the select then stays on "Choose a country", no hint, no error); the hint shows only while the value is the
   * suggestion; an excluded country the person picks is refused at once ---- */
  (function () {
    var c = f("country"); if (c.value) return;
    var allowed = qa("option", c).map(function (o) { return o.value; }).filter(function (v) { return v && excluded.indexOf(v) < 0; });
    /* T-0922: the first entry of navigator.languages that names a region (en, de-DE, en-GB: DE); no network lookup */
    var code = "";
    ((navigator.languages && navigator.languages.length) ? Array.prototype.slice.call(navigator.languages) : [navigator.language || ""]).some(function (l) {
      var m = /-([A-Za-z]{2})\b/.exec(l || ""); if (m) code = m[1].toUpperCase(); return !!m;
    });
    /* T-0939: that region when its country is in the list and not excluded; in every other case (no region, not in the list, excluded) the browser time zone
     * when it names one allowed country. Later language entries are not tried. */
    if (allowed.indexOf(code) < 0) {
      var zone = ""; try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (x) { zone = ""; }
      code = countryFromZone(zone, allowed);
    }
    if (code) { c.value = code; $("f-country-h").textContent = T.country.hint + " " + T.country.suggested; }
  })();
  f("country").addEventListener("change", function () {
    $("f-country-h").textContent = $("f-country-e") ? "" : T.country.hint;
    var bad = excluded.indexOf(val("country")) >= 0 ? T.country.excluded : "";
    if (bad || shownErr.country) { shownErr.country = bad; setErr("country", bad); }
  });

  /* ---- the button: connect, sign, submit ---- */
  var busy = false;
  function loading(on) {
    busy = on; var b = $("submit-btn"); b.setAttribute("aria-disabled", on ? "true" : "false"); b.setAttribute("aria-busy", on ? "true" : "false");
    qa(".spin", form).forEach(function (s) { s.hidden = !on; }); form.setAttribute("aria-busy", on ? "true" : "false");
    if (!on) $("submit-label").textContent = idleLabel;
  }
  function short(a) { return a.slice(0, 6) + "…" + a.slice(-4); }
  /* T-0899: the form is right however the page is shown. A form the server rendered fresh (data-state="fresh") is emptied of the wallet on every
   * pageshow, the first one and a return through the back-forward cache (event.persisted); a form rendered with errors or the manual block
   * open (data-state="error") stays as the server sent it. The network keeps its server value: the manual path posts it. */
  var chain0 = f("chain_id") && f("chain_id").type !== "select-one" ? f("chain_id").value : null;
  function forgetWallet() {
    if (form.getAttribute("data-state") !== "fresh") return;
    f("address").value = ""; walletAddr = ""; walletChain = "";
    var c = f("chain_id");
    if (c && c.options) qa("option", c).forEach(function (o) { o.selected = o.defaultSelected; }); else if (c && chain0 !== null) c.value = chain0;
    $("wallet-chosen").hidden = true; $("wallet-short").textContent = ""; $("wallet-short").removeAttribute("title");
    banner(""); status("");
    manualBox.open = false;
  }
  window.addEventListener("pageshow", forgetWallet);
  /* The hand field: typing another address removes what was said about the previous one. */
  f("address").addEventListener("input", function () {
    var a = val("address");
    if (a.toLowerCase() !== existsFor) { banner(""); shownErr.address = ""; setErr("address", ""); }
    if (/^0x[0-9a-fA-F]{40}$/.test(a)) { $("wallet-short").textContent = short(a); $("wallet-short").title = a; }
  });
  /* The wallet path keeps the account in walletAddr and shows it in #wallet-short. */
  function setAccount(a, chain) {
    if (a.toLowerCase() !== existsFor) { banner(""); shownErr.address = ""; setErr("address", ""); }
    walletAddr = a; if (chain) walletChain = String(chain);
    $("wallet-short").textContent = short(a); $("wallet-short").title = a; $("wallet-chosen").hidden = false;
  }
  function useWallet(r) { setAccount(r.address, CHAINS.indexOf(r.chainId) >= 0 ? r.chainId : CHAINS[0]); }
  /* An account switched in the wallet (accountsChanged) arrives as the event "account"; nothing is sent and no signature is asked: the next press of the button does that. */
  document.addEventListener("soukbase:wallet", function (ev) {
    var dt = ev.detail || {}, st = dt.state;
    if (st === "account") { if (/^0x[0-9a-fA-F]{40}$/.test(dt.address || "")) setAccount(dt.address); return; }
    if (!busy) return;
    if (st === "choosing") status(T.status.choose); else if (st === "accounts") status(""); else if (st === "connecting") status(T.status.connect); else if (st === "signing") status(T.status.sign);
  });
  function hidden(name, value) { var i = f(name); if (!i || i.type !== "hidden") { i = document.createElement("input"); i.type = "hidden"; i.name = name; form.appendChild(i); } i.value = value; }
  function formBody() { var o = {}; qa("input,select,textarea", form).forEach(function (e) { if (!e.name || e.type === "submit") return; if (e.type === "checkbox") { if (e.checked) o[e.name] = "yes"; } else o[e.name] = e.value; }); return o; }
  /* the wallet path: the form's fields with the account and chain from memory in place of the hand fields */
  function walletBody() { var o = formBody(); o.address = walletAddr; o.chain_id = walletChain; return o; }
  /* the banner of a wallet that has a seller page: the text, then its two buttons */
  function existsBanner(msg) {
    banner(msg, null, [{ id: "exists-signin", cls: "btn btn-primary", text: T.existsButtons.signIn, click: signInHere }, { id: "exists-other", cls: "btn btn-secondary", text: T.existsButtons.other, click: changeWallet }]);
    existsFor = walletAddr.toLowerCase();
  }
  function handled() { var e = new Error("handled"); e.handled = true; return e; }
  function fail(err) {
    if (err && err.handled) return;
    var c = err && err.code;
    if (c === "cancelled") return;
    if (c === 4001) banner(T.errors.declined);
    else if (c === "no_wallet") { manualBox.open = true; banner(T.errors.noWallet); }
    else if (c === "bad_signature") banner(T.errors.contract);
    else if (c === "network") banner(T.errors.network);
    else banner((err && err.userMessage) || T.errors.network);
  }
  function go() {
    loading(true); status(T.status.connect);
    Promise.resolve().then(function () { return wallet().connect({ anyChain: true }); }).then(function (r) {
      if (r.manual) { manualBox.open = true; banner(T.errors.noWallet); throw handled(); }
      useWallet(r);
      return fetch("/sell/message", { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(walletBody()) })
        .then(null, function () { var e = new Error("network"); e.code = "network"; throw e; })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (j) {
            if (res.status === 200 && typeof j.message === "string") return j;
            if (res.status === 422 && j.errors) { showErrors(j.errors); throw handled(); }
            if (j.code === "seller_exists") { existsBanner(T.errors.exists.replace("{a}", short(walletAddr))); throw handled(); }
            banner(j.error || T.errors.network); throw handled();
          });
        });
    }).then(function (m) {
      status(T.status.sign);
      return wallet().signMessage(m.message, walletAddr, { quiet: true }).then(function (sig) {
        status(T.status.creating);
        /* a form of its own carries the wallet's account; the hand-signing field stays as it is */
        var g = document.createElement("form"); g.method = "post"; g.action = "/sell/send";
        var body = walletBody(); body.stage = "bind"; body.message = m.message; body.signature = sig; body.via = "wallet";
        Object.keys(body).forEach(function (k) { var i = document.createElement("input"); i.type = "hidden"; i.name = k; i.value = body[k]; g.appendChild(i); });
        document.body.appendChild(g); HTMLFormElement.prototype.submit.call(g); /* the page moves on; the button stays busy */
      });
    }).catch(function (err) { status(""); loading(false); fail(err); });
  }
  /* T-0908: "Sign in with this wallet" (banner of a wallet that has a seller page): the session message for the same address, one quiet signature, then /manage/signin opens the seller page */
  function signInHere() {
    if (busy) return;
    var a = walletAddr; loading(true); status(T.status.sign);
    fetch("/sell/message", { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify({ stage: "session", address: a, chain_id: walletChain }) })
      .then(null, function () { var e = new Error("network"); e.code = "network"; throw e; })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (j) {
          if (res.status === 200 && typeof j.message === "string") return j;
          banner(j.error || T.errors.network); throw handled();
        });
      }).then(function (m) {
        return wallet().signMessage(m.message, a, { quiet: true }).then(function (sig) {
          status(T.status.creating);
          var g = document.createElement("form"); g.method = "post"; g.action = "/manage/signin";
          [["message", m.message], ["signature", sig], ["via", "wallet"]].forEach(function (p) { var i = document.createElement("input"); i.type = "hidden"; i.name = p[0]; i.value = p[1]; g.appendChild(i); });
          document.body.appendChild(g); HTMLFormElement.prototype.submit.call(g);
        });
      }).catch(function (err) { status(""); loading(false); fail(err); });
  }
  var via = "wallet";
  $("submit-btn").addEventListener("click", function () { via = "wallet"; });
  $("manual-btn").addEventListener("click", function () { via = "manual"; });
  /* the Change control and "Choose another account": the banner goes, the wallet opens and asks (the same connect() as the button); with the manual path (no wallet script) it puts the focus on the address field */
  function changeWallet() {
    if (busy) return;
    if (!wallet()) { manualBox.open = true; f("address").focus(); return; }
    var was = existsFor;
    banner(""); loading(true); status(T.status.connect);
    Promise.resolve().then(function () { return wallet().connect({ anyChain: true }); }).then(function (r) {
      status(""); loading(false);
      if (r.manual) return;
      useWallet(r);
      if (was && r.address.toLowerCase() === was) existsBanner(T.errors.sameAccount.replace("{a}", short(r.address)));
    }).catch(function (err) { status(""); loading(false); fail(err); });
  }
  $("wallet-change").addEventListener("click", changeWallet);
  form.addEventListener("submit", function (ev) {
    if (busy) { ev.preventDefault(); return; }
    var manual = via === "manual"; via = "wallet";
    banner(""); var e = validate(manual); showErrors(e);
    if (Object.keys(e).length) { ev.preventDefault(); return; }
    if (manual) return; /* plain POST: the next page shows the message and a signature field */
    ev.preventDefault();
    if (!wallet()) { manualBox.open = true; banner(T.errors.noWallet); return; }
    go();
  });
})();
