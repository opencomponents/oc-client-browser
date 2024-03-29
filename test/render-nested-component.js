'use strict';

describe('oc-client : renderNestedComponent', function () {
  var originalConsoleLog = console.log,
    originalRenderByHref = oc.renderByHref,
    htmlBeforeRendering,
    componentHref = '//oc-registry.com/my-component/',
    componentContainer =
      '<oc-component href="' + componentHref + '"></oc-component>';

  var initialise = function (component, fail) {
    htmlBeforeRendering = '';

    console.log = function () {};

    oc.renderByHref = function (href, cb) {
      htmlBeforeRendering = $(component).html();
      cb(fail, {
        html: '<div>this is the component content</div>',
        version: '1.0.0',
        name: 'my-component',
        key: '12345678901234567890'
      });
    };
  };

  var cleanup = function () {
    oc.renderByHref = originalRenderByHref;
    console.log = originalConsoleLog;
    delete oc.components;
    oc.renderedComponents = {};
    oc.events.reset();
  };

  describe('when passing a non-jquery html element', function () {
    var component = document.createElement('oc-component');
    component.setAttribute('href', componentHref);

    beforeEach(function (done) {
      initialise(component);
      oc.renderNestedComponent(component, done);
    });

    it('should work the same', function () {
      expect(component.innerHTML).toContain('this is the component content');
    });
  });

  describe('when rendering component successfully', function () {
    var $component;

    beforeEach(function (done) {
      $component = $(componentContainer);
      initialise($component);
      oc.renderNestedComponent($component, done);
    });

    afterEach(cleanup);

    it('should show loading message first', function () {
      expect(htmlBeforeRendering).toContain('Loading');
    });

    it('should inject component html when rendering is done', function () {
      expect($component.html()).toContain('this is the component content');
    });
  });

  describe('when rendering component does not succeed', function () {
    var $component;
    var failedEvent;

    beforeEach(function (done) {
      $component = $(componentContainer);
      initialise($component, 'An error!');
      oc.events.on('oc:failed', function (e, data) {
        failedEvent = data;
        done();
      });
      oc.renderNestedComponent($component, done);
    });

    afterEach(cleanup);

    it('should show loading message first', function () {
      expect(htmlBeforeRendering).toContain('Loading');
    });

    it('should remove loading message then', function () {
      expect($component.html()).toEqual('');
    });

    it('should set rendering meta to false', function () {
      expect($component.attr('data-rendering')).toBe('false');
      expect($component.attr('data-rendered')).toBe('false');
    });

    it('should set fail meta to true', function () {
      expect($component.attr('data-failed')).toBe('true');
    });

    it('should fire a failed event', function () {
      expect(failedEvent).toBeDefined();
      expect(failedEvent.component).toBe($component[0]);
    });
  });
});
