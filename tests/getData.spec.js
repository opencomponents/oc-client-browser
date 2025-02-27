// @ts-check
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test.describe("oc-client : getData", () => {
	test("should throw when requesting data without baseUrl", async ({
		page,
	}) => {
		const result = await page.evaluate(() => {
			try {
				oc.getData({ name: "someName", version: "0.0.1" });
				return { success: true };
			} catch (error) {
				return { success: false, message: error.message || error };
			}
		});

		expect(result.success).toBeFalsy();
		expect(result.message).toEqual("baseUrl parameter is required");
	});

	test("should throw when requesting data without name", async ({ page }) => {
		const result = await page.evaluate(() => {
			try {
				oc.getData({
					baseUrl: "http://www.opencomponents.com",
					version: "0.0.1",
				});
				return { success: true };
			} catch (error) {
				return { success: false, message: error.message || error };
			}
		});

		expect(result.success).toBeFalsy();
		expect(result.message).toEqual("name parameter is required");
	});

	test("should throw when requesting data without version", async ({
		page,
	}) => {
		const result = await page.evaluate(() => {
			try {
				oc.getData({
					baseUrl: "http://www.opencomponents.com",
					name: "a-component",
				});
				return { success: true };
			} catch (error) {
				return { success: false, message: error.message || error };
			}
		});

		expect(result.success).toBeFalsy();
		expect(result.message).toEqual("version parameter is required");
	});

	test("should make fetch request with correct parameters", async ({
		page,
	}) => {
		const fetchMockResult = await page.evaluate(() => {
			// Save original fetch
			const originalFetch = window.fetch;

			// Create a mock that captures the request
			let requestData = null;

			window.fetch = (url, options) => {
				requestData = {
					method: options.method,
					url: url,
					body: options.body,
					headers: options.headers,
				};

				// Create a response object that mimics fetch Response
				const mockResponse = {
					ok: true,
					headers: {
						get: (name) => (name === "Content-Type" ? null : null),
					},
					json: () =>
						Promise.resolve([
							{ response: { renderMode: "unrendered", data: "hello" } },
						]),
				};

				return Promise.resolve(mockResponse);
			};

			// Execute the function
			return new Promise((resolve) => {
				oc.getData(
					{
						baseUrl: "http://www.components.com/v2",
						name: "myComponent",
						version: "6.6.6",
						parameters: {
							name: "evil",
						},
					},
					(err, data) => {
						// Restore original fetch
						window.fetch = originalFetch;

						// Resolve with captured data and results
						resolve({
							requestData: requestData,
							callbackError: err,
							callbackData: data,
						});
					},
				);
			});
		});

		// Verify the fetch request
		expect(fetchMockResult.requestData.method).toEqual("POST");
		expect(fetchMockResult.requestData.url).toEqual(
			"http://www.components.com/v2",
		);

		// Parse body data (assuming it's URL-encoded or JSON)
		const bodyData = fetchMockResult.requestData.body.includes("{")
			? JSON.parse(fetchMockResult.requestData.body)
			: new URLSearchParams(fetchMockResult.requestData.body);

		if (bodyData instanceof URLSearchParams) {
			// Handle URL-encoded body
			const componentsParam = JSON.parse(bodyData.get("components"));
			expect(componentsParam[0].name).toEqual("myComponent");
			expect(componentsParam[0].version).toEqual("6.6.6");
			expect(componentsParam[0].parameters.name).toEqual("evil");
		} else {
			// Handle JSON body
			expect(bodyData.components[0].name).toEqual("myComponent");
			expect(bodyData.components[0].version).toEqual("6.6.6");
			expect(bodyData.components[0].parameters.name).toEqual("evil");
		}

		expect(fetchMockResult.requestData.headers.Accept).toEqual(
			"application/vnd.oc.unrendered+json",
		);

		// Verify callback data
		expect(fetchMockResult.callbackError).toEqual(null);
		expect(fetchMockResult.callbackData).toEqual("hello");
	});

	test("should call the callback with server.js error details if available", async ({
		page,
	}) => {
		const errorResult = await page.evaluate(() => {
			// Save original fetch
			const originalFetch = window.fetch;

			// Create a mock that returns an error response
			window.fetch = () => {
				// Create a response object with error details
				const mockResponse = {
					ok: true,
					headers: {
						get: () => null,
					},
					json: () =>
						Promise.resolve([
							{ response: { error: "oups", details: "details about oups" } },
						]),
				};

				return Promise.resolve(mockResponse);
			};

			// Execute the function
			return new Promise((resolve) => {
				oc.getData(
					{
						baseUrl: "http://www.components.com/v2",
						name: "myComponent",
						version: "6.6.6",
						parameters: {
							name: "evil",
						},
					},
					(err, data) => {
						// Restore original fetch
						window.fetch = originalFetch;

						// Resolve with the error
						resolve({
							callbackError: err,
							callbackData: data,
						});
					},
				);
			});
		});

		// Verify error was passed to callback
		expect(errorResult.callbackError).toEqual("details about oups");
	});

	test("should call the callback with server.js error if no details are available", async ({
		page,
	}) => {
		const errorResult = await page.evaluate(() => {
			// Save original fetch
			const originalFetch = window.fetch;

			// Create a mock that returns an error response without details
			window.fetch = () => {
				// Create a response object with error but no details
				const mockResponse = {
					ok: true,
					headers: {
						get: () => null,
					},
					json: () => Promise.resolve([{ response: { error: "oups" } }]),
				};

				return Promise.resolve(mockResponse);
			};

			// Execute the function
			return new Promise((resolve) => {
				oc.getData(
					{
						baseUrl: "http://www.components.com/v2",
						name: "myComponent",
						version: "6.6.6",
						parameters: {
							name: "evil",
						},
					},
					(err, data) => {
						// Restore original fetch
						window.fetch = originalFetch;

						// Resolve with the error
						resolve({
							callbackError: err,
							callbackData: data,
						});
					},
				);
			});
		});

		// Verify error was passed to callback
		expect(errorResult.callbackError).toEqual("oups");
	});

	test("should handle JSON requests correctly", async ({ page }) => {
		const jsonResult = await page.evaluate(() => {
			// Save original fetch
			const originalFetch = window.fetch;

			// Create a mock that captures the request
			let requestData = null;
			window.fetch = (url, options) => {
				requestData = {
					body: options.body,
					headers: options.headers,
				};

				// Create a response object
				const mockResponse = {
					ok: true,
					headers: {
						get: () => null,
					},
					json: () =>
						Promise.resolve([
							{ response: { renderMode: "unrendered", data: "hello" } },
						]),
				};

				return Promise.resolve(mockResponse);
			};

			// Execute the function
			return new Promise((resolve) => {
				oc.getData(
					{
						baseUrl: "http://www.components.com/v2",
						name: "myComponent",
						version: "6.6.6",
						parameters: {
							name: "evil",
						},
						json: true,
					},
					() => {
						// Restore original fetch
						window.fetch = originalFetch;

						// Resolve with captured data
						resolve({
							requestData: requestData,
						});
					},
				);
			});
		});

		// Verify JSON request
		expect(jsonResult.requestData.body).toEqual(
			'{"components":[{"name":"myComponent","version":"6.6.6","parameters":{"name":"evil"}}]}',
		);
		expect(jsonResult.requestData.headers["Content-Type"]).toEqual(
			"application/json",
		);
	});

	test("should include globalParameters in the request", async ({ page }) => {
		const globalParamsResult = await page.evaluate(() => {
			// Save original fetch and config
			const originalFetch = window.fetch;
			const originalConf = Object.assign({}, oc.conf);

			// Set global parameters
			oc.conf.globalParameters = {
				test: "value",
			};

			// Create a mock that captures the request
			let requestData = null;
			window.fetch = (url, options) => {
				// Parse the body data (assuming it's URL-encoded or JSON)
				let bodyData;
				if (typeof options.body === "string" && options.body.startsWith("{")) {
					bodyData = JSON.parse(options.body);
				} else {
					// Create a simple parser for url-encoded data
					const params = new URLSearchParams(options.body);
					bodyData = { components: JSON.parse(params.get("components")) };
				}

				requestData = {
					data: bodyData,
				};

				// Create a response object
				const mockResponse = {
					ok: true,
					headers: {
						get: () => null,
					},
					json: () =>
						Promise.resolve([
							{ response: { renderMode: "unrendered", data: "hello" } },
						]),
				};

				return Promise.resolve(mockResponse);
			};

			// Execute the function
			return new Promise((resolve) => {
				oc.getData(
					{
						baseUrl: "http://www.components.com/v2",
						name: "myComponent",
						version: "6.6.6",
						parameters: {
							name: "evil",
						},
					},
					() => {
						// Restore original fetch and config
						window.fetch = originalFetch;
						oc.conf = originalConf;

						// Resolve with captured data
						resolve({
							requestData,
						});
					},
				);
			});
		});

		// Verify global parameters were included
		expect(
			globalParamsResult.requestData.data.components[0].parameters.name,
		).toEqual("evil");
		expect(
			globalParamsResult.requestData.data.components[0].parameters.test,
		).toEqual("value");
	});

	test("should include global headers in the request", async ({ page }) => {
		const globalHeadersResult = await page.evaluate(() => {
			// Save original fetch and config
			const originalFetch = window.fetch;
			const originalConf = Object.assign({}, oc.conf);

			// Set global headers
			oc.conf.globalHeaders = {
				testHeader: "headerValue",
			};

			// Create a mock that captures the request
			let requestData = null;
			window.fetch = (url, options) => {
				requestData = {
					headers: options.headers,
				};

				// Create a response object
				const mockResponse = {
					ok: true,
					headers: {
						get: () => null,
					},
					json: () =>
						Promise.resolve([
							{ response: { renderMode: "unrendered", data: "hello" } },
						]),
				};

				return Promise.resolve(mockResponse);
			};

			// Execute the function
			return new Promise((resolve) => {
				oc.getData(
					{
						baseUrl: "http://www.components.com/v2",
						name: "myComponent",
						version: "6.6.6",
						parameters: {
							name: "evil",
						},
					},
					() => {
						// Restore original fetch and config
						window.fetch = originalFetch;
						oc.conf = originalConf;

						// Resolve with captured data
						resolve({
							requestData: requestData,
						});
					},
				);
			});
		});

		// Verify global headers were included
		expect(globalHeadersResult.requestData.headers.testHeader).toEqual(
			"headerValue",
		);
	});

	test("should support global headers as a function", async ({ page }) => {
		const globalHeadersFnResult = await page.evaluate(() => {
			// Save original fetch and config
			const originalFetch = window.fetch;
			const originalConf = Object.assign({}, oc.conf);

			// Set global headers as a function
			oc.conf.globalHeaders = () => ({
				testHeader: "headerValue",
			});

			// Create a mock that captures the request
			let requestData = null;
			window.fetch = (url, options) => {
				requestData = {
					headers: options.headers,
				};

				// Create a response object
				const mockResponse = {
					ok: true,
					headers: {
						get: () => null,
					},
					json: () =>
						Promise.resolve([
							{ response: { renderMode: "unrendered", data: "hello" } },
						]),
				};

				return Promise.resolve(mockResponse);
			};

			// Execute the function
			return new Promise((resolve) => {
				oc.getData(
					{
						baseUrl: "http://www.components.com/v2",
						name: "myComponent",
						version: "6.6.6",
						parameters: {
							name: "evil",
						},
					},
					() => {
						// Restore original fetch and config
						window.fetch = originalFetch;
						oc.conf = originalConf;

						// Resolve with captured data
						resolve({
							requestData: requestData,
						});
					},
				);
			});
		});

		// Verify global headers from function were included
		expect(globalHeadersFnResult.requestData.headers.testHeader).toEqual(
			"headerValue",
		);
	});

	test("should handle fetch errors correctly", async ({ page }) => {
		const errorResult = await page.evaluate(() => {
			// Save original fetch
			const originalFetch = window.fetch;

			// Create a mock that returns a failed response
			window.fetch = () => Promise.reject(new Error("Network error"));

			// Execute the function
			return new Promise((resolve) => {
				oc.getData(
					{
						baseUrl: "http://www.components.com/v2",
						name: "myComponent",
						version: "6.6.6",
					},
					(err) => {
						// Restore original fetch
						window.fetch = originalFetch;

						// Resolve with the error
						resolve({
							callbackError: err instanceof Error ? err.message : err,
						});
					},
				);
			});
		});

		// Verify error was passed to callback
		expect(errorResult.callbackError).toEqual("Network error");
	});
});
