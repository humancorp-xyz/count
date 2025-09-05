export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","svelte.svg","tauri.svg","vite.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.B8DgeUD-.js",app:"_app/immutable/entry/app.CttPZW9Y.js",imports:["_app/immutable/entry/start.B8DgeUD-.js","_app/immutable/chunks/Ch_pufix.js","_app/immutable/chunks/BObhh2XM.js","_app/immutable/chunks/B2Glw-ra.js","_app/immutable/chunks/9tIc4D_R.js","_app/immutable/chunks/Ci9LmSVc.js","_app/immutable/entry/app.CttPZW9Y.js","_app/immutable/chunks/B2Glw-ra.js","_app/immutable/chunks/9tIc4D_R.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/BObhh2XM.js","_app/immutable/chunks/Ci9LmSVc.js","_app/immutable/chunks/Dyf42WhF.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
