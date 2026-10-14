/** Historical editorial replay only. Never imported by application/publication code. */
import{readFileSync,readdirSync}from'node:fs';import{resolve,join}from'node:path';import{createHash}from'node:crypto';
import{loadPublication as loadLivePublication}from'../dist/publication/repository.js';
export{sourceDigest,assertApprovedWorks}from'../dist/publication/repository.js';
const folder=resolve(import.meta.dirname,'../content/sources/wrk_voltaire_micromegas'),root=join(folder,'publication-baseline-376');
export function verifyHistoricalBaseline376(){const manifest=JSON.parse(readFileSync(join(folder,'publication-baseline-376.json')));const files=[];const walk=dir=>{for(const e of readdirSync(join(root,dir),{withFileTypes:true})){const file=join(dir,e.name);if(e.isDirectory())walk(file);else files.push(file);}};walk('');if(files.length!==Object.keys(manifest.files).length)throw Error('Historical baseline file inventory changed');for(const file of files){const actual=createHash('sha256').update(readFileSync(join(root,file))).digest('hex');if(actual!==manifest.files[file])throw Error(`Historical baseline bytes changed: ${file}`);}return manifest;}
export function loadPublication(){verifyHistoricalBaseline376();return loadLivePublication(root);}
