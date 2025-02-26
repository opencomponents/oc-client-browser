import { createOc } from './oc-client';
import { LJS } from './loader';

let oc = window.oc || {};
let ljs = new LJS();
window.ljs = ljs;

window.oc = createOc(oc);
