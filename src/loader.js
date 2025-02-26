// @ts-check

export class LJS {
  loaded = new Set();
  errors = new Set();

  parse(url) {
    let [path, hash] = url.split('#');
    let isModule = path.startsWith('module:');
    let src = path.replace(/^module:/, '');
    let [fallback, id] = (hash?.split('=') || []).reduce(
      (a, p) => (p.startsWith('=') ? [p.slice(1), a[1]] : [a[0], p]),
      []
    );
    return { src, isModule, fallback, id };
  }

  async load(...args) {
    for (const arg of args) {
      Array.isArray(arg)
        ? await Promise.all(arg.map(a => this._load(a)))
        : typeof arg === 'function'
        ? await arg()
        : await this._load(arg);
    }
    return this;
  }

  async _load(url) {
    if (this.loaded.has(url)) return;

    try {
      url.endsWith('.css') ? await this.css(url) : await this.js(url);
      this.loaded.add(url);
    } catch (err) {
      this.errors.forEach(fn => fn(url));
      throw err;
    }
  }

  js(url) {
    let { src, isModule, fallback } = this.parse(url);
    return new Promise((resolve, reject) => {
      let script = document.createElement('script');
      script.type = isModule ? 'module' : 'text/javascript';
      script.src = src;

      script.onload = resolve;
      script.onerror = () =>
        fallback ? this._load(fallback).then(resolve).catch(reject) : reject();

      document.head.append(script);
    });
  }

  css(url) {
    let { src } = this.parse(url);
    return new Promise((resolve, reject) => {
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = src;
      link.onload = resolve;
      link.onerror = reject;
      document.head.append(link);
    });
  }

  onError(fn) {
    this.errors.add(fn);
    return this;
  }
}
