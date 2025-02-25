/* globals window */
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('oc-client : renderByHref', () => {
  test.beforeEach(async ({ page }) => {
    // Set up the responses and compiled view content on the page
    await page.evaluate(() => {
      window.unRenderedResponse = {
        href: 'http://my-registry.com/v3/a-component/1.2.X/?name=John',
        name: 'a-component',
        type: 'oc-component',
        version: '1.2.123',
        requestVersion: '1.2.X',
        data: {},
        template: {
          src: 'https://my-cdn.com/components/a-component/1.2.123/template.js',
          type: 'handlebars',
          key: '46ee85c314b371cac60471cef5b2e2e6c443dccf'
        },
        renderMode: 'unrendered'
      };

      window.renderedResponse = {
        href: 'http://my-registry.com/v3/a-component/1.2.X/?name=John',
        name: 'a-component',
        type: 'oc-component',
        version: '1.2.123',
        requestVersion: '1.2.X',
        html: '<oc-component href="http://my-registry.com/v3/a-component/1.2.X/?name=John" data-hash="46ee85c314b371cac60471cef5b2e2e6c443dccf" id="4709139819" data-rendered="true" data-version="1.2.123">Hello, world!!!</oc-component>',
        renderMode: 'rendered'
      };

      window.renderedNoContainerResponse = {
        href: 'http://my-registry.com/v3/a-component/1.2.X/?name=John',
        name: 'a-component',
        type: 'oc-component',
        version: '1.2.123',
        requestVersion: '1.2.X',
        html: 'Hello, world!!',
        renderMode: 'rendered'
      };

      window.route = 'http://my-registry.com/v3/a-component/1.2.X/?name=John';
      window.compiledViewContent =
        'oc.components=oc.components||{},oc.components["46ee85c314b371cac60471cef5b2e2e6c443dccf"]={compiler:[7,">= 4.0.0"],main:function(){return"Hello world!"},useData:!0};';
    });
  });

  test('should make a request to the registry with proper headers', async ({
    page
  }) => {
    // Setup mock and track the ajax call
    const ajaxResult = await page.evaluate(() => {
      // Save original ajax and ljs.load
      const originalAjax = oc.$.ajax;
      const originalLjsLoad = ljs.load;

      // Track ajax calls
      let ajaxCalls = [];
      oc.$.ajax = function (params) {
        ajaxCalls.push({
          url: params.url,
          method: params.method,
          contentType: params.contentType,
          headers: params.headers
        });
        params.success(window.unRenderedResponse);
      };

      // Mock ljs.load to prevent actual script loading
      ljs.load = function (url, cb) {
        cb(null, 'ok');
      };

      // Execute the compiled view content to register the component
      eval(window.compiledViewContent);

      // Call the method being tested
      return new Promise(resolve => {
        oc.renderByHref(window.route, () => {
          // Restore original functions
          oc.$.ajax = originalAjax;
          ljs.load = originalLjsLoad;

          // Return the captured ajax calls
          resolve(ajaxCalls);
        });
      });
    });

    // Verify the ajax request
    expect(ajaxResult[0].contentType).toEqual('text/plain');
    expect(ajaxResult[0].headers['Accept']).toEqual(
      'application/vnd.oc.unrendered+json'
    );
    expect(ajaxResult[0].url).toEqual(
      'http://my-registry.com/v3/a-component/1.2.X/?name=John&__oc_Retry=0'
    );
  });

  test('should include globalParameters in the URL', async ({ page }) => {
    // Setup mock and track the ajax call
    const ajaxResult = await page.evaluate(() => {
      // Save original ajax, ljs.load, and config
      const originalAjax = oc.$.ajax;
      const originalLjsLoad = ljs.load;
      const originalConf = Object.assign({}, oc.conf);

      // Set global parameters
      oc.conf.globalParameters = {
        test: 'hello world & friends?'
      };

      // Track ajax calls
      let ajaxCalls = [];
      oc.$.ajax = function (params) {
        ajaxCalls.push({
          url: params.url
        });
        params.success(window.unRenderedResponse);
      };

      // Mock ljs.load to prevent actual script loading
      ljs.load = function (url, cb) {
        cb(null, 'ok');
      };

      // Execute the compiled view content to register the component
      eval(window.compiledViewContent);

      // Call the method being tested
      return new Promise(resolve => {
        oc.renderByHref(window.route, () => {
          // Restore original functions and config
          oc.$.ajax = originalAjax;
          ljs.load = originalLjsLoad;
          oc.conf = originalConf;

          // Return the captured ajax calls
          resolve(ajaxCalls);
        });
      });
    });

    // Verify the URL contains the properly encoded global parameters
    expect(ajaxResult[0].url).toEqual(
      'http://my-registry.com/v3/a-component/1.2.X/?name=John&test=hello%20world%20%26%20friends%3F&__oc_Retry=0'
    );
  });

  test('should respond with the rendered html when registry returns unrendered component', async ({
    page
  }) => {
    // Setup mock and execute renderByHref
    const result = await page.evaluate(() => {
      // Save original ajax and ljs.load
      const originalAjax = oc.$.ajax;
      const originalLjsLoad = ljs.load;

      // First, make sure the component is registered
      eval(window.compiledViewContent);

      // Mock ajax to return unrendered response
      oc.$.ajax = function (params) {
        params.success({
          ...window.unRenderedResponse,
          template: window.unRenderedResponse.template,
          data: window.unRenderedResponse.data || {}
        });
      };

      // Mock ljs.load to prevent actual script loading
      ljs.load = function (url, cb) {
        cb(null, 'ok');
      };

      // Call the method being tested
      return new Promise(resolve => {
        oc.renderByHref(window.route, (err, data) => {
          // Restore original functions
          oc.$.ajax = originalAjax;
          ljs.load = originalLjsLoad;

          // Return the callback results
          resolve({
            error: err,
            data: data
          });
        });
      });
    });

    // Verify the callback data
    expect(result.error).toBeNull();
    expect(result.data.html).toEqual('Hello world!');
    expect(result.data.version).toEqual('1.2.123');
    expect(result.data.key).toEqual('46ee85c314b371cac60471cef5b2e2e6c443dccf');
  });

  test('should throw an error after multiple retries when getting component fails', async ({
    page
  }) => {
    // Setup mock with failure but with a low retry count to avoid timeout
    const result = await page.evaluate(() => {
      // Save original ajax and ljs.load
      const originalAjax = oc.$.ajax;
      const originalLjsLoad = ljs.load;
      const originalConsoleLog = console.log;
      let originalRetries;

      // Temporarily store and override the retry settings if they exist
      if (oc.conf && oc.conf.retries) {
        originalRetries = oc.conf.retries;
        oc.conf.retries = 3; // Use a lower retry count to avoid timeouts
      } else if (oc.conf) {
        oc.conf.retries = 3;
      } else {
        oc.conf = { retries: 3 };
      }

      // Suppress console logs
      console.log = function () {};

      // Count ajax calls
      let callCount = 0;

      // Mock ajax to always fail
      oc.$.ajax = function (params) {
        callCount++;
        params.error();
      };

      // Mock ljs.load to prevent actual script loading
      ljs.load = function (url, cb) {
        cb(null, 'ok');
      };

      // Call the method being tested
      return new Promise(resolve => {
        oc.renderByHref(window.route, err => {
          // Restore original functions and settings
          oc.$.ajax = originalAjax;
          ljs.load = originalLjsLoad;
          console.log = originalConsoleLog;

          // Restore original retries setting if it existed
          if (originalRetries !== undefined) {
            oc.conf.retries = originalRetries;
          }

          // Return the error and call count
          resolve({
            error: err,
            callCount: callCount
          });
        });
      });
    });

    // Verify an error was thrown after retries
    expect(result.error).toContain('Failed to load');
    expect(result.callCount).toBe(31);
  });

  // Additional helper test for detecting if oc namespace exists
  test('should expose the oc namespace', async ({ page }) => {
    const hasOcNamespace = await page.evaluate(() => {
      return typeof oc === 'object';
    });

    expect(hasOcNamespace).toBe(true);
  });
});
