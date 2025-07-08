/* globals window */
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test.describe("oc-client : events", () => {
	test.beforeEach(async ({ page }) => {
		// Set up the test environment
		await page.evaluate(() => {
			// Store original console log to suppress it
			window.originalConsoleLog = console.log;
			console.log = () => {};
		});
	});

	test.afterEach(async ({ page }) => {
		// Clean up after each test
		await page.evaluate(() => {
			// Restore original functions
			console.log = window.originalConsoleLog;

			// Clean up oc state
			oc.events.reset();

			// Clean up test variables
			delete window.originalConsoleLog;
			delete window.eventData;
		});
	});

	test("should fire events with correct event object structure", async ({
		page,
	}) => {
		const result = await page.evaluate(() => {
			return new Promise((resolve) => {
				// Track event data
				window.eventData = [];

				// Set up event listeners
				oc.events.on("test:event", (event, data) => {
					window.eventData.push({
						eventType: event.type,
						eventObject: event,
						data: data,
					});
				});

				oc.events.on("another:event", (event, data) => {
					window.eventData.push({
						eventType: event.type,
						eventObject: event,
						data: data,
					});
				});

				// Fire events
				oc.events.fire("test:event", { message: "Hello World" });
				oc.events.fire("another:event", { status: "success" });

				// Resolve after a short delay to ensure events are processed
				setTimeout(() => {
					resolve({
						eventCount: window.eventData.length,
						events: window.eventData,
					});
				}, 10);
			});
		});

		// Verify the results
		expect(result.eventCount).toBe(2);

		// Check first event
		expect(result.events[0].eventType).toBe("test:event");
		expect(result.events[0].eventObject).toEqual({ type: "test:event" });
		expect(result.events[0].data).toEqual({ message: "Hello World" });

		// Check second event
		expect(result.events[1].eventType).toBe("another:event");
		expect(result.events[1].eventObject).toEqual({ type: "another:event" });
		expect(result.events[1].data).toEqual({ status: "success" });
	});

	test("should handle multiple listeners for the same event", async ({
		page,
	}) => {
		const result = await page.evaluate(() => {
			return new Promise((resolve) => {
				// Track event data
				window.eventData = [];

				// Set up multiple listeners for the same event
				oc.events.on("multi:event", (event, data) => {
					window.eventData.push({
						listener: "first",
						eventType: event.type,
						data: data,
					});
				});

				oc.events.on("multi:event", (event, data) => {
					window.eventData.push({
						listener: "second",
						eventType: event.type,
						data: data,
					});
				});

				// Fire event
				oc.events.fire("multi:event", { count: 42 });

				// Resolve after a short delay to ensure events are processed
				setTimeout(() => {
					resolve({
						eventCount: window.eventData.length,
						events: window.eventData,
					});
				}, 10);
			});
		});

		// Verify the results
		expect(result.eventCount).toBe(2);

		// Check both listeners were called
		expect(result.events[0].listener).toBe("first");
		expect(result.events[0].eventType).toBe("multi:event");
		expect(result.events[0].data).toEqual({ count: 42 });

		expect(result.events[1].listener).toBe("second");
		expect(result.events[1].eventType).toBe("multi:event");
		expect(result.events[1].data).toEqual({ count: 42 });
	});

	test("should handle events with no data", async ({ page }) => {
		const result = await page.evaluate(() => {
			return new Promise((resolve) => {
				// Track event data
				window.eventData = null;

				// Set up event listener
				oc.events.on("empty:event", (event, data) => {
					window.eventData = {
						eventType: event.type,
						eventObject: event,
						data: data,
					};
				});

				// Fire event with no data
				oc.events.fire("empty:event");

				// Resolve after a short delay to ensure events are processed
				setTimeout(() => {
					resolve(window.eventData);
				}, 10);
			});
		});

		// Verify the results
		expect(result.eventType).toBe("empty:event");
		expect(result.eventObject).toEqual({ type: "empty:event" });
		expect(result.data).toBeUndefined();
	});

	test("should handle events with null data", async ({ page }) => {
		const result = await page.evaluate(() => {
			return new Promise((resolve) => {
				// Track event data
				window.eventData = null;

				// Set up event listener
				oc.events.on("null:event", (event, data) => {
					window.eventData = {
						eventType: event.type,
						eventObject: event,
						data: data,
					};
				});

				// Fire event with null data
				oc.events.fire("null:event", null);

				// Resolve after a short delay to ensure events are processed
				setTimeout(() => {
					resolve(window.eventData);
				}, 10);
			});
		});

		// Verify the results
		expect(result.eventType).toBe("null:event");
		expect(result.eventObject).toEqual({ type: "null:event" });
		expect(result.data).toBeNull();
	});
});
