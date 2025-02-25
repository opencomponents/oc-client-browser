// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('oc-client : getData', () => {
  test('should throw when requesting data without baseUrl', async ({
    page
  }) => {
    const result = await page.evaluate(() => {
      try {
        oc.getData({ name: 'someName', version: '0.0.1' });
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message || error };
      }
    });

    expect(result.success).toBeFalsy();
    expect(result.message).toEqual('baseUrl parameter is required');
  });

  test('should throw when requesting data without name', async ({ page }) => {
    const result = await page.evaluate(() => {
      try {
        oc.getData({
          baseUrl: 'http://www.opencomponents.com',
          version: '0.0.1'
        });
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message || error };
      }
    });

    expect(result.success).toBeFalsy();
    expect(result.message).toEqual('name parameter is required');
  });

  test('should throw when requesting data without version', async ({
    page
  }) => {
    const result = await page.evaluate(() => {
      try {
        oc.getData({
          baseUrl: 'http://www.opencomponents.com',
          name: 'a-component'
        });
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message || error };
      }
    });

    expect(result.success).toBeFalsy();
    expect(result.message).toEqual('version parameter is required');
  });

  test('should make AJAX request with correct parameters', async ({ page }) => {
    const ajaxMockResult = await page.evaluate(() => {
      // Save original ajax
      const originalAjax = oc.$.ajax;

      // Create a mock that captures the request
      let requestData = null;
      oc.$.ajax = function (options) {
        requestData = {
          method: options.method,
          url: options.url,
          data: options.data,
          headers: options.headers
        };
        return options.success([
          { response: { renderMode: 'unrendered', data: 'hello' } }
        ]);
      };

      // Execute the function
      return new Promise(resolve => {
        oc.getData(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function (err, data) {
            // Restore original ajax
            oc.$.ajax = originalAjax;

            // Resolve with captured data and results
            resolve({
              requestData: requestData,
              callbackError: err,
              callbackData: data
            });
          }
        );
      });
    });

    // Verify the ajax request
    expect(ajaxMockResult.requestData.method).toEqual('POST');
    expect(ajaxMockResult.requestData.url).toEqual(
      'http://www.components.com/v2'
    );
    expect(ajaxMockResult.requestData.data.components[0].name).toEqual(
      'myComponent'
    );
    expect(ajaxMockResult.requestData.data.components[0].version).toEqual(
      '6.6.6'
    );
    expect(
      ajaxMockResult.requestData.data.components[0].parameters.name
    ).toEqual('evil');
    expect(ajaxMockResult.requestData.headers.Accept).toEqual(
      'application/vnd.oc.unrendered+json'
    );

    // Verify callback data
    expect(ajaxMockResult.callbackError).toEqual(null);
    expect(ajaxMockResult.callbackData).toEqual('hello');
  });

  test('should call the callback with server.js error details if available', async ({
    page
  }) => {
    const errorResult = await page.evaluate(() => {
      // Save original ajax
      const originalAjax = oc.$.ajax;

      // Create a mock that returns an error response
      oc.$.ajax = function (options) {
        return options.success([
          { response: { error: 'oups', details: 'details about oups' } }
        ]);
      };

      // Execute the function
      return new Promise(resolve => {
        oc.getData(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function (err, data) {
            // Restore original ajax
            oc.$.ajax = originalAjax;

            // Resolve with the error
            resolve({
              callbackError: err,
              callbackData: data
            });
          }
        );
      });
    });

    // Verify error was passed to callback
    expect(errorResult.callbackError).toEqual('details about oups');
  });

  test('should call the callback with server.js error if no details are available', async ({
    page
  }) => {
    const errorResult = await page.evaluate(() => {
      // Save original ajax
      const originalAjax = oc.$.ajax;

      // Create a mock that returns an error response without details
      oc.$.ajax = function (options) {
        return options.success([{ response: { error: 'oups' } }]);
      };

      // Execute the function
      return new Promise(resolve => {
        oc.getData(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function (err, data) {
            // Restore original ajax
            oc.$.ajax = originalAjax;

            // Resolve with the error
            resolve({
              callbackError: err,
              callbackData: data
            });
          }
        );
      });
    });

    // Verify error was passed to callback
    expect(errorResult.callbackError).toEqual('oups');
  });

  test('should handle JSON requests correctly', async ({ page }) => {
    const jsonResult = await page.evaluate(() => {
      // Save original ajax
      const originalAjax = oc.$.ajax;

      // Create a mock that captures the request
      let requestData = null;
      oc.$.ajax = function (options) {
        requestData = {
          data: options.data,
          headers: options.headers
        };
        return options.success([
          { response: { renderMode: 'unrendered', data: 'hello' } }
        ]);
      };

      // Execute the function
      return new Promise(resolve => {
        oc.getData(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            },
            json: true
          },
          function () {
            // Restore original ajax
            oc.$.ajax = originalAjax;

            // Resolve with captured data
            resolve({
              requestData: requestData
            });
          }
        );
      });
    });

    // Verify JSON request
    expect(jsonResult.requestData.data).toEqual(
      '{"components":[{"name":"myComponent","version":"6.6.6","parameters":{"name":"evil"}}]}'
    );
    expect(jsonResult.requestData.headers['Content-Type']).toEqual(
      'application/json'
    );
  });

  test('should include globalParameters in the request', async ({ page }) => {
    const globalParamsResult = await page.evaluate(() => {
      // Save original ajax and config
      const originalAjax = oc.$.ajax;
      const originalConf = Object.assign({}, oc.conf);

      // Set global parameters
      oc.conf.globalParameters = {
        test: 'value'
      };

      // Create a mock that captures the request
      let requestData = null;
      oc.$.ajax = function (options) {
        requestData = {
          data: options.data
        };
        return options.success([
          { response: { renderMode: 'unrendered', data: 'hello' } }
        ]);
      };

      // Execute the function
      return new Promise(resolve => {
        oc.getData(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function () {
            // Restore original ajax and config
            oc.$.ajax = originalAjax;
            oc.conf = originalConf;

            // Resolve with captured data
            resolve({
              requestData: requestData
            });
          }
        );
      });
    });

    // Verify global parameters were included
    expect(
      globalParamsResult.requestData.data.components[0].parameters.name
    ).toEqual('evil');
    expect(
      globalParamsResult.requestData.data.components[0].parameters.test
    ).toEqual('value');
  });

  test('should include global headers as data in the request', async ({
    page
  }) => {
    const globalHeadersResult = await page.evaluate(() => {
      // Save original ajax and config
      const originalAjax = oc.$.ajax;
      const originalConf = Object.assign({}, oc.conf);

      // Set global headers
      oc.conf.globalHeaders = {
        testHeader: 'headerValue'
      };

      // Create a mock that captures the request
      let requestData = null;
      oc.$.ajax = function (options) {
        requestData = {
          headers: options.headers
        };
        return options.success([
          { response: { renderMode: 'unrendered', data: 'hello' } }
        ]);
      };

      // Execute the function
      return new Promise(resolve => {
        oc.getData(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function () {
            // Restore original ajax and config
            oc.$.ajax = originalAjax;
            oc.conf = originalConf;

            // Resolve with captured data
            resolve({
              requestData: requestData
            });
          }
        );
      });
    });

    // Verify global headers were included
    expect(globalHeadersResult.requestData.headers.testHeader).toEqual(
      'headerValue'
    );
  });

  test('should support global headers as a function', async ({ page }) => {
    const globalHeadersFnResult = await page.evaluate(() => {
      // Save original ajax and config
      const originalAjax = oc.$.ajax;
      const originalConf = Object.assign({}, oc.conf);

      // Set global headers as a function
      oc.conf.globalHeaders = function () {
        return {
          testHeader: 'headerValue'
        };
      };

      // Create a mock that captures the request
      let requestData = null;
      oc.$.ajax = function (options) {
        requestData = {
          headers: options.headers
        };
        return options.success([
          { response: { renderMode: 'unrendered', data: 'hello' } }
        ]);
      };

      // Execute the function
      return new Promise(resolve => {
        oc.getData(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function () {
            // Restore original ajax and config
            oc.$.ajax = originalAjax;
            oc.conf = originalConf;

            // Resolve with captured data
            resolve({
              requestData: requestData
            });
          }
        );
      });
    });

    // Verify global headers from function were included
    expect(globalHeadersFnResult.requestData.headers.testHeader).toEqual(
      'headerValue'
    );
  });
});
