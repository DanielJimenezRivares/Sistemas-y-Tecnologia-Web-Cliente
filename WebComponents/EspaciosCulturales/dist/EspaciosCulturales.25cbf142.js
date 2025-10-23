// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"eR7Ob":[function(require,module,exports,__globalThis) {
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "99910accb3488ccc";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "6b4bdf3c25cbf142";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"gREN8":[function(require,module,exports,__globalThis) {
const cloneTpl = (id)=>{
    const t = document.getElementById(id);
    if (!t) throw new Error(`Template no encontrado: #${id}`);
    return t.content.cloneNode(true);
};
const escapeHtml = (s)=>s == null ? "" : String(s);
/* ------------------ app-header ------------------ */ class AppHeader extends HTMLElement {
    static get observedAttributes() {
        return [
            'title'
        ];
    }
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-app-header'));
    }
    connectedCallback() {
        this._render();
    }
    attributeChangedCallback() {
        this._render();
    }
    _render() {
        const h1 = this.shadowRoot.querySelector('h1');
        h1.textContent = this.getAttribute('title') || 'Espacios Culturales';
    }
}
customElements.define('app-header', AppHeader);
/* ------------------ app-footer ------------------ */ class AppFooter extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-app-footer'));
    }
    connectedCallback() {
        const y = this.shadowRoot.querySelector('.y');
        if (y) y.textContent = String(new Date().getFullYear());
    }
}
customElements.define('app-footer', AppFooter);
/* ------------------ app-layout ------------------ */ class AppLayout extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-app-layout'));
    }
}
customElements.define('app-layout', AppLayout);
/* ------------------ espacio-card ------------------ */ class EspacioCard extends HTMLElement {
    constructor(){
        super();
        this._data = null;
        this._reviewsOpen = false;
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-espacio-card'));
    }
    connectedCallback() {
        this._btnReviews = this.shadowRoot.querySelector('#btn-reviews');
        if (this._btnReviews) this._btnReviews.addEventListener('click', (ev)=>{
            this._reviewsOpen = !this._reviewsOpen;
            this._syncReviewsButton();
            this.reviews = this.shadowRoot.querySelector('search-valoraciones');
            this.reviews._toggleReviews({
                id: String(this._data?.id),
                open: this._reviewsOpen
            });
        });
        if (this._data) this._render();
    }
    set data(obj) {
        this._data = obj || {};
        this._render();
    }
    get data() {
        return this._data;
    }
    _normalize(value) {
        return value === '_U' ? '-' : value || '-';
    }
    _render() {
        const d = this._data || {};
        const nombre = this._normalize(d.nombre);
        const direccion = this._normalize(d.direccion);
        const horario = this._normalize(d.horario);
        const telefono = this._normalize(d.telefono);
        const web = this._normalize(d.web);
        this.shadowRoot.querySelector('#title').textContent = escapeHtml(nombre);
        this.shadowRoot.querySelector('#dir').textContent = escapeHtml(direccion);
        const typesWrap = this.shadowRoot.querySelector('.types-wrap');
        typesWrap.innerHTML = '';
        if (Array.isArray(d.tipos) && d.tipos.length) {
            const span = document.createElement('div');
            span.className = 'types';
            span.textContent = d.tipos.join(', ');
            typesWrap.appendChild(span);
        }
        this.shadowRoot.querySelector('#horario').textContent = `Horario: ${escapeHtml(horario)}`;
        this.shadowRoot.querySelector('#tel').textContent = `Tel: ${escapeHtml(telefono)}`;
        const webEl = this.shadowRoot.querySelector('#web');
        webEl.innerHTML = '';
        if (web !== '-' && web !== '_U') {
            const a = document.createElement('a');
            a.className = 'link';
            a.target = '_blank';
            a.rel = 'noopener';
            a.href = escapeHtml(web);
            a.textContent = 'Visitar web';
            webEl.appendChild(a);
        } else webEl.textContent = 'Web: -';
    }
    _syncReviewsButton() {
        // Gestiona aria + rotación flecha vía atributo en el host
        if (this._btnReviews) this._btnReviews.setAttribute('aria-expanded', this._reviewsOpen ? 'true' : 'false');
        if (this._reviewsOpen) this.setAttribute('reviews-open', '');
        else this.removeAttribute('reviews-open');
    }
}
customElements.define('espacio-card', EspacioCard);
/* ------------------ search-form ------------------ */ class SearchForm extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-search-form'));
    }
    connectedCallback() {
        const form = this.shadowRoot.querySelector('form');
        form.addEventListener('submit', (e1)=>{
            e1.preventDefault();
            const fd = new FormData(form);
            const q = (fd.get('q') || '').toString().trim();
            const tipo = (fd.get('tipo') || '').toString();
            const detail = {
                q,
                tipo
            };
            this.dispatchEvent(new CustomEvent('search-espacios-event', {
                detail,
                bubbles: true,
                composed: true
            }));
        });
    }
}
customElements.define('search-form', SearchForm);
/* ------------------ search-espacios (orquestador) ------------------ */ class SearchEspacios extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-search-espacios'));
        this.apiBase = window.API_BASE || '';
        this._all = [];
    }
    connectedCallback() {
        this.shadowRoot.addEventListener('search-espacios-event', (e1)=>this._onSearch(e1.detail));
        this._list = this.shadowRoot.querySelector('espacios-list');
        this._info = this.shadowRoot.getElementById('info');
    }
    async _onSearch({ q, tipo }) {
        try {
            const qs = new URLSearchParams();
            if (tipo) qs.set('tipo', tipo);
            if (q) qs.set('q', q);
            qs.set('start', 0);
            qs.set('end', 4);
            const url = `${this.apiBase}/espacios${qs.toString() ? `?${qs.toString()}` : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('network');
            const body = await res.json();
            this._all = Array.isArray(body.data) ? body.data : [];
            this._render();
        } catch (err) {
            console.error(err);
            this._info.textContent = 'Error al obtener datos.';
            this._list.setItems([]);
        }
    }
    _render() {
        this._list.setItems(this._all);
        this._info.textContent = `Mostrando ${this._all.length} resultados`;
    }
}
customElements.define('search-espacios', SearchEspacios);
/* ------------------ espacios-list ------------------ */ class EspaciosList extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-espacios-list'));
        this.items = [];
    }
    setItems(items) {
        this.items = items || [];
        this._render();
    }
    appendItems(items) {
        this.items = [
            ...this.items,
            ...items || []
        ];
        this._render();
    }
    _render() {
        const ul = this.shadowRoot.getElementById('list');
        ul.innerHTML = '';
        (this.items || []).forEach((it)=>{
            const li = document.createElement('li');
            const card = document.createElement('espacio-card');
            card.data = it;
            li.appendChild(card);
            ul.appendChild(li);
        });
    }
}
customElements.define('espacios-list', EspaciosList);
/* ------------------ search-espacios (orquestador) ------------------ */ class SearchValoraciones extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-search-valoraciones'));
        this.apiBase = window.API_BASE || '';
        this._all = [];
    }
    connectedCallback() {
        this._list = this.shadowRoot.querySelector('valoraciones-list');
        this._write = this.shadowRoot.querySelector('valoraciones-write');
        this.shadowRoot.addEventListener('review-uploaded', ()=>{
            if (this._id) this._toggleReviews({
                e
            });
        });
        this.shadowRoot.addEventListener('review-uploaded', (ev)=>{
            const id = ev.detail?.id ?? null;
            if (id) this._toggleReviews({
                id: id,
                open: true
            });
        });
    }
    async _toggleReviews({ id, open }) {
        this._write._id = id;
        if (open) try {
            if (!id) {
                alert('No se ha seleccionado espacio.');
                return;
            }
            const qs = new URLSearchParams();
            qs.set('start', 0);
            qs.set('end', 4);
            const url = `${this.apiBase}/valoraciones/reviews/${id}?${qs.toString() ? `?${qs.toString()}` : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('network');
            const body = await res.json();
            this._all = Array.isArray(body.data) ? body.data : [];
            this._render();
            this.setAttribute('open', '');
        } catch (err) {
            console.error(err);
            this._info.textContent = 'Error al obtener datos.';
            this._list.setItems([]);
        }
        else {
            this._all = null;
            this._render();
            this.removeAttribute('open');
        }
    }
    _render() {
        this._list.setItems(this._all);
    }
}
customElements.define('search-valoraciones', SearchValoraciones);
/* ------------------ espacios-list ------------------ */ class ValoracionesList extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-valoraciones-list'));
        this.items = [];
    }
    setItems(items) {
        this.items = items || [];
        this._render();
    }
    appendItems(items) {
        this.items = [
            ...this.items,
            ...items || []
        ];
        this._render();
    }
    _render() {
        const ul = this.shadowRoot.getElementById('list');
        ul.innerHTML = '';
        (this.items || []).forEach((it)=>{
            const li = document.createElement('li');
            const card = document.createElement('valoraciones-card');
            card.data = it;
            li.appendChild(card);
            ul.appendChild(li);
        });
    }
}
customElements.define('valoraciones-list', ValoracionesList);
/* ------------------ valoraciones-card ------------------ */ class ValoracionesCard extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-valoraciones-card'));
        this._data = null;
    }
    set data(d) {
        this._data = d || {};
        this._render();
    }
    get data() {
        return this._data;
    }
    _fmtDate(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(+d)) return '';
        return d.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    _stars(n) {
        const v = Math.max(0, Math.min(5, Number(n) || 0));
        return "\u2605".repeat(v) + "\u2606".repeat(5 - v);
    }
    _render() {
        const d = this._data || {};
        // admite claves variadas del backend
        const user = d.username ?? d.user ?? "An\xf3nimo";
        const rating = d.rating ?? 0;
        const text = d.review ?? d.text ?? '';
        const when = d.timestamp ?? d.createdAt ?? d.date ?? d.fecha ?? '';
        this.shadowRoot.querySelector('.user').textContent = user;
        this.shadowRoot.querySelector('.stars').textContent = this._stars(rating);
        this.shadowRoot.querySelector('.date').textContent = this._fmtDate(when);
        const textEl = this.shadowRoot.querySelector('.text');
        if (text && text !== '-') {
            textEl.textContent = text;
            textEl.hidden = false;
        } else {
            textEl.textContent = '';
            textEl.hidden = true;
        }
        // A11y: describe con aria-label la puntuación
        this.shadowRoot.querySelector('.stars').setAttribute('aria-label', `Puntuaci\xf3n: ${Number(rating) || 0} de 5`);
    }
}
customElements.define('valoraciones-card', ValoracionesCard);
/* ------------------ valoraciones-write ------------------ */ class ValoracionesWrite extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.appendChild(cloneTpl('tpl-valoraciones-write'));
        this.apiBase = window.API_BASE || '';
    }
    set id(id) {
        this._id = id ? String(id) : null;
    }
    get id() {
        return this._id;
    }
    connectedCallback() {
        const form = this.shadowRoot.getElementById('form');
        form.addEventListener('submit', (e1)=>this.#onSubmit(e1));
    }
    async #onSubmit(e1) {
        e1.preventDefault();
        if (!this._id) {
            alert('No se ha seleccionado espacio.');
            return;
        }
        const form = e1.currentTarget;
        const fd = new FormData(form);
        const rating = Number(fd.get('rating') || 0);
        if (!rating) {
            alert('El rating es obligatorio.');
            return;
        }
        const payload = {
            espacio_cultural_id: this._id,
            rating,
            username: (fd.get('username') || '').toString().trim() || undefined,
            review: (fd.get('review') || '').toString().trim() || undefined
        };
        try {
            // Adjust if your endpoint differs:
            const url = `${this.apiBase}/valoraciones`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            console.log(res);
            if (!res.ok) throw new Error('network');
            form.reset();
            this.dispatchEvent(new CustomEvent('review-uploaded', {
                detail: {
                    id: this._id
                },
                bubbles: true,
                composed: true
            }));
        } catch (err) {
            console.error(err);
            alert("No se pudo enviar la rese\xf1a. Int\xe9ntalo de nuevo.");
        }
    }
}
customElements.define('valoraciones-write', ValoracionesWrite);

},{}]},["eR7Ob","gREN8"], "gREN8", "parcelRequire05b6", {})
let {"*": _, } = parcelRequire05b6("gREN8");
export {_ as default, };

//# sourceMappingURL=EspaciosCulturales.25cbf142.js.map
