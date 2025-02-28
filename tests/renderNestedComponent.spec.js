/* globals window, document */
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test.describe("oc-client : renderNestedComponent", () => {
	const componentHref = "//oc-registry.com/my-component/";

	test.beforeEach(async ({ page }) => {
		// Set up the test environment
		await page.evaluate(
			(config) => {
				// Store original functions to restore later
				window.originalRenderByHref = oc.renderByHref;
				window.originalConsoleLog = console.log;
				window.componentHref = config.componentHref;

				// Suppress console logs
				console.log = () => {};
			},
			{ componentHref },
		);
	});

	test.afterEach(async ({ page }) => {
		// Clean up after each test
		await page.evaluate(() => {
			// Restore original functions
			oc.renderByHref = window.originalRenderByHref;
			console.log = window.originalConsoleLog;

			// Clean up oc state
			delete oc.components;
			oc.renderedComponents = {};
			oc.events.reset();

			// Clean up test variables
			delete window.originalRenderByHref;
			delete window.originalConsoleLog;
			delete window.htmlBeforeRendering;
			delete window.componentHref;
			delete window.failedEvent;
		});
	});

	test("should work the same when passing a non-jquery html element", async ({
		page,
	}) => {
		const result = await page.evaluate(
			(config) => {
				return new Promise((resolve) => {
					// Create a DOM element
					const component = document.createElement("oc-component");
					component.setAttribute("href", config.componentHref);

					// Mock renderByHref
					oc.renderByHref = (href, cb) => {
						window.htmlBeforeRendering = component.innerHTML;
						cb(null, {
							html: "<div>this is the component content</div>",
							version: "1.0.0",
							name: "my-component",
							key: "12345678901234567890",
						});
					};

					// Call the function being tested
					oc.renderNestedComponent(component, () => {
						resolve({
							innerHTML: component.innerHTML,
						});
					});
				});
			},
			{ componentHref },
		);

		// Verify the result
		expect(result.innerHTML).toContain("this is the component content");
	});

	test("should show loading message and inject component html when rendering successfully", async ({
		page,
	}) => {
		const successResult = await page.evaluate(
			(config) => {
				return new Promise((resolve) => {
					// Create jQuery component
					const component = document.createElement("oc-component");
					component.setAttribute("href", config.componentHref);
					document.body.appendChild(component);

					// Mock renderByHref
					oc.renderByHref = (href, cb) => {
						window.htmlBeforeRendering = component.innerHTML;
						cb(null, {
							html: "<div>this is the component content</div>",
							version: "1.0.0",
							name: "my-component",
							key: "12345678901234567890",
						});
					};

					// Call the function being tested
					oc.renderNestedComponent(component, () => {
						const data = {
							htmlBeforeRendering: window.htmlBeforeRendering,
							finalHtml: component.innerHTML,
						};

						// Clean up DOM
						component.remove();

						resolve(data);
					});
				});
			},
			{ componentHref },
		);

		// Verify the results
		expect(successResult.htmlBeforeRendering).toContain("Loading");
		expect(successResult.finalHtml).toContain("this is the component content");
	});

	test("should handle component rendering failure correctly", async ({
		page,
	}) => {
		const failureResult = await page.evaluate(
			(config) => {
				return new Promise((resolve) => {
					const component = document.createElement("oc-component");
					component.setAttribute("href", config.componentHref);
					document.body.appendChild(component);

					// Set up event listener for failed event
					window.failedEvent = null;
					oc.events.on("oc:failed", (e, data) => {
						window.failedEvent = data;
					});

					// Mock renderByHref with error
					oc.renderByHref = (href, cb) => {
						window.htmlBeforeRendering = component.innerHTML;
						cb("An error!", null);
					};

					// Call the function being tested
					oc.renderNestedComponent(component, () => {
						const data = {
							htmlBeforeRendering: window.htmlBeforeRendering,
							finalHtml: component.innerHTML,
							dataRendering: component.getAttribute("data-rendering"),
							dataRendered: component.getAttribute("data-rendered"),
							dataFailed: component.getAttribute("data-failed"),
							failedEvent: window.failedEvent,
						};

						// Clean up DOM
						component.remove();

						resolve(data);
					});
				});
			},
			{ componentHref },
		);

		// Verify the results
		expect(failureResult.htmlBeforeRendering).toContain("Loading");
		expect(failureResult.finalHtml).toEqual("");
		expect(failureResult.dataRendering).toBe("false");
		expect(failureResult.dataRendered).toBe("false");
		expect(failureResult.dataFailed).toBe("true");
		expect(failureResult.failedEvent).toBeDefined();
		expect(failureResult.failedEvent.component).toBeDefined();
	});
});
