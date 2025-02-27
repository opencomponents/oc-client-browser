/* globals __REGISTERED_TEMPLATES_PLACEHOLDER__, __DEFAULT_RETRY_INTERVAL__, __DEFAULT_RETRY_LIMIT__, __DEFAULT_DISABLE_LOADER__, __DISABLE_LEGACY_TEMPLATES__, __EXTERNALS__ */
/* eslint prefer-arrow-callback: 'off' */

export function createOc(oc) {
	// If oc client is already inside the page, we do nothing.
	if (oc.status) {
		return oc;
	}
	oc.status = "loading";
	oc.conf = oc.conf || {};
	oc.cmd = oc.cmd || [];
	oc.renderedComponents = oc.renderedComponents || {};

	const isRequired = (name, value) => {
		if (!value) {
			throw name + " parameter is required";
		}
	};

	// The code
	let $,
		$document = document,
		$window = window,
		noop = () => {},
		initialised = false,
		initialising = false,
		retries = {},
		isBool = (a) => typeof a == "boolean",
		timeout = setTimeout,
		ocCmd = oc.cmd,
		ocConf = oc.conf,
		renderedComponents = oc.renderedComponents,
		dataRenderedAttribute = "data-rendered",
		dataRenderingAttribute = "data-rendering",
		logError = (msg) => console.log(msg),
		logInfo = (msg) => ocConf.debug && console.log(msg);

	// constants
	const RETRY_INTERVAL =
			ocConf.retryInterval || Number(__DEFAULT_RETRY_INTERVAL__),
		RETRY_LIMIT = ocConf.retryLimit || Number(__DEFAULT_RETRY_LIMIT__),
		DISABLE_LOADER = isBool(ocConf.disableLoader)
			? ocConf.disableLoader
			: __DEFAULT_DISABLE_LOADER__,
		RETRY_SEND_NUMBER = ocConf.retrySendNumber || true,
		POLLING_INTERVAL = ocConf.pollingInterval || 500,
		OC_TAG = ocConf.tag || "oc-component",
		JSON_REQUESTS = !!ocConf.jsonRequests,
		MESSAGES_ERRORS_HREF_MISSING = "Href parameter missing",
		MESSAGES_ERRORS_RETRY_FAILED =
			"Failed to load % component " + RETRY_LIMIT + " times. Giving up",
		MESSAGES_ERRORS_LOADING_COMPILED_VIEW = "Error getting compiled view: %",
		MESSAGES_ERRORS_RENDERING = "Error rendering component: %, error: ",
		MESSAGES_ERRORS_RETRIEVING =
			"Failed to retrieve the component. Retrying in " +
			RETRY_INTERVAL / 1000 +
			" seconds...",
		MESSAGES_ERRORS_VIEW_ENGINE_NOT_SUPPORTED =
			'Error loading component: view engine "%" not supported',
		MESSAGES_LOADING_COMPONENT = ocConf.loadingMessage || "",
		MESSAGES_RENDERED = "Component '%' correctly rendered",
		MESSAGES_RETRIEVING =
			"Unrendered component found. Trying to retrieve it...",
		interpolate = (str, value) => str.replace("%", value);

	const registeredTemplates = __REGISTERED_TEMPLATES_PLACEHOLDER__;
	const externals = __EXTERNALS__;

	const registerTemplates = (templates, overwrite) => {
		templates = Array.isArray(templates) ? templates : [templates];
		templates.map((template) => {
			if (overwrite || !registeredTemplates[template.type]) {
				registeredTemplates[template.type] = {
					externals: template.externals,
				};
			}
		});
	};

	if (ocConf.templates) {
		registerTemplates(ocConf.templates, true);
	}

	const retry = (component, cb, failedRetryCb) => {
		if (retries[component] == undefined) {
			retries[component] = RETRY_LIMIT;
		}

		if (retries[component] <= 0) {
			failedRetryCb();
		} else {
			timeout(() => {
				cb(RETRY_LIMIT - retries[component] + 1);
			}, RETRY_INTERVAL);
			retries[component]--;
		}
	};

	const addParametersToHref = (href, parameters) => {
		return href + (~href.indexOf("?") ? "&" : "?") + $.param(parameters);
	};

	const getHeaders = () => {
		const globalHeaders = ocConf.globalHeaders;
		return $.extend(
			{ Accept: "application/vnd.oc.unrendered+json" },
			typeof globalHeaders == "function" ? globalHeaders() : globalHeaders,
		);
	};

	oc.addStylesToHead = (styles) => {
		$("<style>" + styles + "</style>").appendTo($document.head);
	};

	const loadAfterReady = () => {
		oc.ready(oc.renderUnloadedComponents);
	};

	oc.registerTemplates = (templates) => {
		registerTemplates(templates);
		loadAfterReady();
		return registeredTemplates;
	};

	// A minimal require.js-ish that uses l.js
	oc.require = (nameSpace, url, callback) => {
		if (!callback) {
			callback = url;
			url = nameSpace;
			nameSpace = undefined;
		}

		if (typeof nameSpace == "string") {
			nameSpace = [nameSpace];
		}

		const getObj = () => {
			let base = $window;

			if (nameSpace == undefined) {
				return undefined;
			}

			for (const i in nameSpace) {
				base = base[nameSpace[i]];
				if (!base) {
					return undefined;
				}
			}

			return base;
		};

		const cbGetObj = () => {
			callback(getObj());
		};

		if (!getObj()) {
			ljs.load(url, cbGetObj);
		} else {
			cbGetObj();
		}
	};

	const asyncRequireForEach = (toLoad, loaded, callback) => {
		if (!callback) {
			callback = loaded;
			loaded = [];
		}

		if (!toLoad.length) {
			callback(loaded);
		} else {
			const loading = toLoad[0];
			oc.require(loading.global, loading.url, (resolved) => {
				asyncRequireForEach(toLoad.slice(1), loaded.concat(resolved), callback);
			});
		}
	};

	oc.requireSeries = asyncRequireForEach;

	const processHtml = ($component, data, callback) => {
		const attr = $component.attr.bind($component);
		const dataName = data.name;
		const dataVersion = data.version;
		attr("id", data.id);
		attr(dataRenderedAttribute, true);
		attr(dataRenderingAttribute, false);
		attr("data-version", dataVersion);
		attr("data-id", data.ocId);
		$component.html(data.html);

		if (data.key) {
			attr("data-hash", data.key);
		}

		if (dataName) {
			attr("data-name", dataName);
			renderedComponents[dataName] = { version: dataVersion };
			if (data.baseUrl) {
				renderedComponents[dataName].baseUrl = data.baseUrl;
			}
			// Get raw element from jQuery object
			data.element = $component[0];
			oc.events.fire("oc:rendered", data);
		}

		callback();
	};

	const getData = (options, cb) => {
		cb = cb || noop;
		const version = options.version;
		const baseUrl = options.baseUrl;
		const name = options.name;
		const json = options.json;
		isRequired("version", version);
		isRequired("baseUrl", baseUrl);
		isRequired("name", name);
		const jsonRequest = isBool(json) ? json : JSON_REQUESTS;
		const data = {
			components: [
				{
					action: options.action,
					name: name,
					version: version,
					parameters: $.extend({}, ocConf.globalParameters, options.parameters),
				},
			],
		};
		const headers = getHeaders();
		const ajaxOptions = {
			method: "POST",
			url: baseUrl,
			data: jsonRequest ? JSON.stringify(data) : data,
			headers: headers,
			crossDomain: true,
			success: (apiResponse) => {
				const response = apiResponse[0].response;
				const err = response.error ? response.details || response.error : null;
				cb(err, response.data, apiResponse[0]);
			},
			error: cb,
		};
		if (jsonRequest) {
			headers["Content-Type"] = "application/json";
		}

		$.ajax(ajaxOptions);
	};
	oc.getData = getData;
	oc.getAction = (options) => {
		return new Promise((resolve, reject) => {
			const name = options.component;
			getData(
				$.extend(
					{
						json: true,
						name: name,
					},
					renderedComponents[name],
					options,
				),

				(err, data) => {
					if (err) {
						reject(err);
					} else {
						if (data.component) {
							const props = data.component.props;
							delete props._staticPath;
							delete props._baseUrl;
							delete props._componentName;
							delete props._componentVersion;

							resolve(props);
						} else {
							resolve();
						}
					}
				},
			);
		});
	};

	oc.build = (options) => {
		isRequired("baseUrl", options.baseUrl);
		isRequired("name", options.name);

		const withFinalSlash = (s) => {
			if (!s) return "";

			return s.match(/\/$/) ? s : s + "/";
		};

		let href =
			withFinalSlash(options.baseUrl) +
			withFinalSlash(options.name) +
			withFinalSlash(options.version);

		if (options.parameters) {
			href += "?";
			$.each(options.parameters, (key, value) => {
				if (/[+&=]/.test(value)) {
					value = encodeURIComponent(value);
				}
				href += key + "=" + value + "&";
			});

			href = href.slice(0, -1);
		}

		return "<" + OC_TAG + ' href="' + href + '"></' + OC_TAG + ">";
	};

	oc.ready = (callback) => {
		if (initialised) {
			callback();
		} else if (initialising) {
			ocCmd.push(callback);
		} else {
			initialising = true;

			const done = () => {
				initialised = true;
				initialising = false;

				oc.events = (() => {
					const obj = $({});

					return {
						fire: obj.trigger.bind(obj),
						on: obj.on.bind(obj),
						off: obj.off.bind(obj),
						reset: () => {
							obj.off();
						},
					};
				})();

				callback();

				oc.events.fire("oc:ready", oc);
				oc.status = "ready";

				ocCmd.map((cmd) => {
					cmd(oc);
				});

				oc.cmd = {
					push: (f) => f(oc),
				};
			};

			oc.requireSeries(externals, (deps) => {
				const jQuery = deps[0];
				if ($window.jQuery || $window.$) {
					$ = oc.$ = jQuery;
				} else {
					$ = oc.$ = jQuery.noConflict();
				}
				done();
			});
		}
	};

	oc.render = (compiledViewInfo, model, callback) => {
		oc.ready(() => {
			// TODO: integrate with oc-empty-response-handler module
			if (model && model.__oc_emptyResponse == true) {
				return callback(null, "");
			}

			let type = compiledViewInfo.type;
			if (!__DISABLE_LEGACY_TEMPLATES__) {
				if (type == "jade" || type == "handlebars") {
					type = "oc-template-" + type;
				}
			}
			const template = registeredTemplates[type];

			if (template) {
				oc.require(
					["oc", "components", compiledViewInfo.key],
					compiledViewInfo.src,
					(compiledView) => {
						if (!compiledView) {
							callback(
								interpolate(
									MESSAGES_ERRORS_LOADING_COMPILED_VIEW,
									compiledViewInfo.src,
								),
							);
						} else {
							asyncRequireForEach(template.externals, () => {
								try {
									callback(
										null,
										!__DISABLE_LEGACY_TEMPLATES__ &&
											type == "oc-template-handlebars"
											? $window.Handlebars.template(compiledView, [])(model)
											: compiledView(model),
									);
								} catch (e) {
									callback("" + e);
								}
							});
						}
					},
				);
			} else {
				callback(
					interpolate(
						MESSAGES_ERRORS_VIEW_ENGINE_NOT_SUPPORTED,
						compiledViewInfo.type,
					),
				);
			}
		});
	};

	oc.renderNestedComponent = (component, callback) => {
		oc.ready(() => {
			const $component = $(component);
			const attr = $component.attr.bind($component);
			const dataRendering = attr(dataRenderingAttribute);
			const dataRendered = attr(dataRenderedAttribute);
			const isRendering = dataRendering == "true";
			const isRendered = dataRendered == "true";

			if (!isRendering && !isRendered) {
				logInfo(MESSAGES_RETRIEVING);
				attr(dataRenderingAttribute, true);
				if (!DISABLE_LOADER) {
					$component.html(
						'<div class="oc-loading">' + MESSAGES_LOADING_COMPONENT + "</div>",
					);
				}

				oc.renderByHref(
					{ href: attr("href"), id: attr("id"), element: $component[0] },
					(err, data) => {
						if (err || !data) {
							attr(dataRenderingAttribute, false);
							attr(dataRenderedAttribute, false);
							attr("data-failed", true);
							$component.html("");
							oc.events.fire("oc:failed", {
								originalError: err,
								data: data,
								component: $component[0],
							});
							logError(err);
							callback();
						} else {
							processHtml($component, data, callback);
						}
					},
				);
			} else {
				timeout(callback, POLLING_INTERVAL);
			}
		});
	};

	oc.renderByHref = (hrefOrOptions, retryNumberOrCallback, callback) => {
		callback = callback || retryNumberOrCallback;
		const ocId = Math.floor(Math.random() * 9999999999);
		const retryNumber =
			hrefOrOptions.retryNumber || +retryNumberOrCallback || 0;
		const href = hrefOrOptions.href || hrefOrOptions;
		const id = hrefOrOptions.id || ocId;
		const element = hrefOrOptions.element;

		oc.ready(() => {
			if (!href) {
				callback(MESSAGES_ERRORS_RENDERING + MESSAGES_ERRORS_HREF_MISSING);
			} else {
				$.ajax({
					url: addParametersToHref(
						href,
						$.extend(
							{},
							ocConf.globalParameters,
							RETRY_SEND_NUMBER && { __oc_Retry: retryNumber },
						),
					),
					headers: getHeaders(),
					contentType: "text/plain",
					crossDomain: true,
					success: (apiResponse) => {
						const template = apiResponse.template;
						apiResponse.data.id = ocId;
						apiResponse.data.element = element;
						oc.render(template, apiResponse.data, (err, html) => {
							if (err) {
								callback(
									interpolate(MESSAGES_ERRORS_RENDERING, apiResponse.href) +
										err,
								);
							} else {
								logInfo(interpolate(MESSAGES_RENDERED, template.src));
								callback(null, {
									id: id,
									ocId: ocId,
									html: html,
									baseUrl: apiResponse.baseUrl,
									key: template.key,
									version: apiResponse.version,
									name: apiResponse.name,
								});
							}
						});
					},
					error: (err) => {
						if (err && err.status == 429) {
							retries[href] = 0;
						}
						logError(MESSAGES_ERRORS_RETRIEVING);
						retry(
							href,
							(requestNumber) => {
								oc.renderByHref(
									{
										href: href,
										retryNumber: requestNumber,
										id: id,
										element: element,
									},
									callback,
								);
							},
							() => {
								callback(interpolate(MESSAGES_ERRORS_RETRY_FAILED, href));
							},
						);
					},
				});
			}
		});
	};

	oc.renderUnloadedComponents = () => {
		oc.ready(() => {
			const $unloadedComponents = $(
				OC_TAG + "[data-rendered!=true][data-failed!=true]",
			);

			$unloadedComponents.map((idx, unloadedComponent) => {
				oc.renderNestedComponent(unloadedComponent, () => {
					if (idx == $unloadedComponents.length - 1) {
						oc.renderUnloadedComponents();
					}
				});
			});
		});
	};

	oc.load = (placeholder, href, callback) => {
		oc.ready(() => {
			callback = callback || noop;

			if (placeholder) {
				$(placeholder).html("<" + OC_TAG + ' href="' + href + '" />');
				const newComponent = $(OC_TAG, placeholder);
				oc.renderNestedComponent(newComponent, () => {
					callback(newComponent);
				});
			}
		});
	};
	// render the components
	loadAfterReady();

	return oc;
}
