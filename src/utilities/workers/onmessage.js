import loader from 'util/workers/loaderWorker'
export default function onmessage() {
  debugger
  importScripts(loader)
  debugger
  this.loader = loader
  debugger
  self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
    if (!e) return;

    if (e.data) {
      if (e.data === 'load') {
        debugger
        this.loader.load(cache.META_DATA.manifest)

        postMessage('test');
      }
    }
  })
}
