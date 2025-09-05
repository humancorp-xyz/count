

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const universal = {
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.DS3Wjp0E.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B2Glw-ra.js","_app/immutable/chunks/Ci9LmSVc.js"];
export const stylesheets = [];
export const fonts = [];
