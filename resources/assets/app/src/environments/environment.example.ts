// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   api:'http://inspectmite.net/api/',
//   apiSite:'http://inspectmite.net/',
//   oldSite:'http://twinhouse.net/',
//   doSpace:'https://twininspection-development.nyc3.digitaloceanspaces.com',
// };


	const parsedUrl = new URL(window.location.href);
	const baseUrl = parsedUrl.origin;
  
  	var constArray = {
    	production: false,
    	api:'http://app.napm.inspectmite.com/api/',
    	apiSite:'http://app.napm.inspectmite.com/',
    	oldSite:'http://napm.inspectmite.com/',
    	doSpace:'https://twininspection-development.nyc3.digitaloceanspaces.com',
  	};

  	if(baseUrl == 'http://localhost:4200') {
    	constArray = {
      		production: false,
      		api:'http://app.finley.inspectmite.com/api/',
    		apiSite:'http://app.finley.inspectmite.com/',
    		oldSite:'http://finley.inspectmite.com/',
      		doSpace:'https://twininspection-development.nyc3.digitaloceanspaces.com',
    	};
  	}
  	export const environment = constArray;


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
