/* globals document */
// @ts-check
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test.describe("oc-client : addStylesToHead", () => {
	test("should append a style tag with the correct content in the head", async ({
		page,
	}) => {
		await page.evaluate(() => {
			oc.addStylesToHead("body: {background: red;}");
		});
		const style = await page.evaluate(() => {
			return document.getElementsByTagName("style")[0].textContent;
		});
		expect(style).toEqual("body: {background: red;}");
	});

	test("should set nonce on style tag when cspNonce is provided", async ({
		page,
	}) => {
		const result = await page.evaluate(() => {
			oc.conf.cspNonce = "test-style-nonce";
			oc.addStylesToHead("body { color: black; }");
			const styles = document.head.querySelectorAll("style");
			const last = styles[styles.length - 1];
			return {
				nonce: last.getAttribute("nonce"),
				content: last.textContent,
			};
		});

		expect(result.nonce).toBe("test-style-nonce");
		expect(result.content).toBe("body { color: black; }");
	});
});
