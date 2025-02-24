import { createOc } from './oc-client';

let oc = window.oc || {};

window.oc = createOc(oc);
