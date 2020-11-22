function setDefault(a,b,c){void 0===c.properties[b].default||(a[b]=c.properties[b].default&&c.properties[b].default(a))}function remove(a,b){delete a[b]}function setCustomEqualsOverwrite(a,b,c){a[b]=c.equals[a[b]]}function setCustomIsTypeOverwrite(a,b,c){a[b]=c.isType[typeof a[b]]}function setCustomOverwrite(a,b,c){a[b]=c.custom(a)}function setString(a,b,c){const d=(a[b]+"").toString();a[b]=c[d]&&c[d].string!==void 0?c[d].string:d}function setInteger(a,b,c){const d=parseInt((a[b]+"").toString());a[b]=c[d]&&c[d].integer!==void 0?c[d].integer:d}function setNumber(a,b,c){const d=+a[b];a[b]=c[d]&&c[d].number!==void 0?c[d].number:d}function setBoolean(a,b,c){const d=!!a[b];a[b]=c[d]&&c[d].boolean!==void 0?c[d].boolean:d}function setArray(a,b){Array.isArray(a[b])||(a[b]=[a[b]])}function isRequired(a,b){return b.required&&Array.isArray(b.required)&&b.required.includes(a)}function setDefaultOverwrite(a,b,c,d){switch(c.properties[b].type){case"string":setString(a,b,d);break;case"integer":setInteger(a,b,d);break;case"number":setNumber(a,b,d);break;case"boolean":setBoolean(a,b,d);break;case"array":setArray(a,b,d);break;default:}}function apply(a,b,c,d,e){if(c.properties[b]){if(e){if(e.equals&&"object"==typeof e.equals&&void 0!==e.equals[a[b]])return setCustomEqualsOverwrite(a,b,e);if(e.isType&&"object"==typeof e.isType&&void 0!==e.isType[typeof a[b]])return setCustomIsTypeOverwrite(a,b,e);if(e.custom&&"function"==typeof e.custom)return setCustomOverwrite(a,b,e)}return setDefaultOverwrite(a,b,c,d)}}function jsonSchemaApplier(a,b,c={someProp:{equals:{null:null,undefined:void 0,0:0,"":""},isType:{number:a=>parseInt(a.someprop),string:a=>a.someProp.toString(),boolean:()=>!0},custom:a=>a.someProp}},d={NaN:{integer:0,number:0},undefined:{string:"",boolean:!0,integer:123,number:0}}){const e=JSON.parse(JSON.stringify(a));for(const e in b.properties)if(b.properties[e].default!==void 0&&"function"!=typeof b.properties[e].default){const a=b.properties[e].default;b.properties[e].default=()=>a}for(const f in e)b.properties[f]||b.additionalProperties||remove(e,f);for(const f in b.properties)void 0===e[f]&&setDefault(e,f,b);for(const f in e)e[f]&&"object"==typeof e[f]&&(e[f]=jsonSchemaApplier(e[f],b[f],c[f])),apply(e,f,b,d,c[f]);for(const f in b.properties)void 0===e[f]&&isRequired(f,b)&&apply(e,f,b,d,c[f]);return e}exports.jsonSchemaApplier=jsonSchemaApplier,module.exports=jsonSchemaApplier;