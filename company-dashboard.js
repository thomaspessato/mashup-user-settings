(function() {

	const xrfkey = '123456789abcdefg';
	window.settings = {};
	
	//function to upload file to content library as json (QRS API)
	function uploadToContentLibrary(contentlib, filename, json) {
		return new Promise((resolve, reject) => {
			 const jsonse = JSON.stringify(json);
			 const fileBlob = new Blob([jsonse], { type: "application/json" });
			 fetch(`/qrs/contentlibrary/${contentlib}/uploadfile?overwrite=true&externalpath=${filename}.json&xrfkey=${xrfkey}`, {
				method: 'POST',
				cache: 'no-cache',
				headers: { 'X-qlik-xrfkey': xrfkey, 'Content-Type': 'application/json' },
				redirect: 'follow',
				referrerPolicy: 'no-referrer',
				body: fileBlob
			}).then(response => response.json())
				.then((e) => {
				resolve();
				console.log('done! saved file:', e);
			})
		})
	 }

	 //getting the user with QPS API
	 function getUser() {
		return new Promise((resolve, reject) => {
			fetch("/qps/user").then((res) => res.json()).then((user) => {
				resolve(user)
			})	
		})
	 }

	 //usual GET request for a file inside a content library
	 function loadSettings() {
		getUser().then((user) => {
			fetch("/content/"+user.userId+"-settings/settings.json?xrfkey="+xrfkey,{
				method: 'GET',
				headers: { 'X-qlik-xrfkey': xrfkey, 'Content-Type': 'application/json' },
				})
				.then(response => response.json())
				.then((settings) => {
				console.log('Here are your settings!', settings);
				window.settings = settings;
				loadTheme(settings.theme, settings.navColor);
			})
		})
	 }
	 
	 function loadTheme(theme, navColor) {
	 	document.body.classList.add(theme);
		document.querySelector('.navbar').style.backgroundColor = navColor;
	 }

	 function saveSettings() {
		getUser().then((user) => {
			uploadToContentLibrary(user.userId+'-settings', 'settings', window.settings);
		})
	 }


	$( "#load" ).on( 'click', () => {
		loadSettings();		
	});	

	$( "#save" ).on( 'click', () => {
		saveSettings();
	});	

	loadSettings();

	
})();
