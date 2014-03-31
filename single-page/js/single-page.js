
var currentUser = whoami();

//------------------------------------

/* SINGLE PAGE MICROSITE JS */

//------------------------------------

function initPage() {

	// smooth scroll
	$('#ms-nav').onePageNav({
		currentClass: 'current',
		changeHash: false,
		scrollSpeed: 750,
		scrollOffset: 30,
		scrollThreshold: 0.5,
		filter: '',
		easing: 'swing'
	});

	// check image paths
	$(contentWrapper + ' img').each(function() {
		var thisSRC = checkSRC($(this).attr('src'));
		$(this).attr('src', thisSRC);
	});

	// check anchor tags
	$(contentWrapper + ' a').each(function() {
		var thisHREF = checkHREF($(this).attr('href'));
		$(this).attr("href", thisHREF);																																	// update path
		if ($(this).hasClass('act')) {																																	// add click through event
			$(this).on('click', function () {
				createGAEvent(projectName, 'Click-Through', $(this).attr("href"), inSandbox);								// analytics clickthrough event
			});
		}
	});

	// analytics event - LoadModal
	//
	$(contentWrapper).on('click', '.ajax-fancybox', function (event) {
		createGAEvent(projectName, "View-Item", $(this).attr('id'), inSandbox);
	});

	var landingPage = querystring_lookup('p');
	landingPage = ((typeof landingPage !== "undefined" && landingPage !== null) ? landingPage : "home");
	createGAEvent(projectName, 'Landing-Page', landingPage, inSandbox);																// analytics landing event

}

//------------------------------------

// sticky navigation
var nav = $('#ms-nav');
var scrolled = false;
$(window).scroll(function () {
	if (0 < $(window).scrollTop() && !scrolled) {
		nav.addClass('sticky-nav');
		scrolled = true;
	}
	if (108 > $(window).scrollTop() && scrolled) {
		nav.removeClass('sticky-nav');
		scrolled = false;
	}
});

//------------------------------------

// utils

//------------------------------------

function checkHREF(thisHREF){

	var response;

	if (typeof thisHREF === "undefined" ) {
		response = '';
	}
	else {

		var aHREF = thisHREF;
		var cleanHREF = ie7fix(thisHREF,'href');
		var aHASH = '';
		var arrHREF;

		if (cleanHREF.indexOf('#') == 0) {																																				// link managed via assignment
			response = aHREF;
		}
		else {
			if (cleanHREF.indexOf('http') >= 0 && cleanHREF.indexOf('exertismicro-p') < 0) {						// external link - don't alter
				response = aHREF;
			}
			else {
				if (aHREF.indexOf('fnFile=') >= 0) {																											// repair relative file link (deals with iCom interference)
					arrHREF = aHREF.split('fnFile=');
					aHREF = arrHREF[1];
					$(this).attr('href', aHREF);
				}
				var qsDelimiter = "?";
				if (aHREF.indexOf('?') >= 0) { qsDelimiter = "&"; }																				// detemin appropriate QS delimiter
				if (aHREF.indexOf('#') >= 0) { 																														// does the HREF contain a # value?
					arrHREF = aHREF.split('#');
					aHREF = arrHREF[0];
					aHASH = '#' + arrHREF[1];
				}
				response = aHREF + qsDelimiter + 'mscssid=' + currentUser.mscssid + aHASH;								// maintain session & add the session ID, append any # value
			}
		}
	}

	return response;
}

function checkSRC(thisSRC){

	var imgSRC = thisSRC;
	imgSRC = ie7fix(imgSRC,'src');	

	if (inSandbox != true) {																																			// prefix image paths -  (deals with iCom interference)
		imgSRC = replaceAll(imgSRC, '/ImagesPortal/UK/localisation/4/', '');
		imgSRC = prefixURL + imgSRC;
	}
	else {																																												// standard prefix
		imgSRC = prefixURL + imgSRC;
	}

	var response = imgSRC;
	return response;
}

function ie7fix(addr, domtype) {
	
	var cleanAddr = addr;
	var cleanHash = '';
	var arrAddr;
	
	switch (domtype){
		case 'src':		
			if (cleanAddr.indexOf(document.domain) >= 0) { 																									// fix ie7 bug - remove domain from src value
				cleanAddr = cleanAddr.replace('http://' + document.domain + '/', '');
				cleanAddr = cleanAddr.replace('https://' + document.domain + '/', '');
			}
			break;
		
		case 'href':				
			var url = document.URL;
			var arrURL = url.split('#');			
			cleanAddr = cleanAddr.replace(arrURL[0], '');
			if (cleanAddr == '##') {
				cleanAddr = cleanAddr.replace('##', '#');
			}
			break;
	}
	
	return cleanAddr;
}

//------------------------------------
//# sourceURL=single-page.js