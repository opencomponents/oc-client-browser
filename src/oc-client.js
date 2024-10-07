/* globals define, exports, require, globalThis, __REGISTERED_TEMPLATES_PLACEHOLDER__, __DEFAULT_RETRY_INTERVAL__, __DEFAULT_RETRY_LIMIT__, __DEFAULT_DISABLE_LOADER__, __DISABLE_LEGACY_TEMPLATES__, __EXTERNALS__ */
/* eslint no-var: 'off' */
/* eslint prefer-arrow-callback: 'off' */

var oc = oc || {};

(function (root, factory) {
  'use strict';
  if (typeof define == 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['exports', 'jquery'], function (exports, $) {
      $.extend(exports, root.oc);
      factory((root.oc = exports), $, root.ljs, root.document, root.window);
    });
  } else if (
    typeof exports == 'object' &&
    typeof exports.nodeName != 'string'
  ) {
    // Common JS
    factory(exports, require('jquery'), root.ljs, root.document, root.window);
  } else {
    // Browser globals
    factory((root.oc = oc), root.$, root.ljs, root.document, root.window);
  }
})(this || globalThis, function (exports, _$, ljs, $document, $window) {
  'use strict';
  // jshint ignore:line
  // public variables
  oc.conf = oc.conf || {};
  oc.cmd = oc.cmd || [];
  oc.renderedComponents = oc.renderedComponents || {};

  // If oc client is already inside the page, we do nothing.
  if (oc.status) {
    return oc;
  }
  oc.status = 'loading';

  var isRequired = function (name, value) {
    if (!value) {
      throw name + ' parameter is required';
    }
  };

  // The code
  var $,
    noop = function () {},
    initialised = false,
    initialising = false,
    retries = {},
    isBool = function (a) {
      return typeof a == 'boolean';
    },
    timeout = setTimeout,
    ocCmd = oc.cmd,
    ocConf = oc.conf,
    renderedComponents = oc.renderedComponents,
    dataRenderedAttribute = 'data-rendered',
    dataRenderingAttribute = 'data-rendering',
    logError = function (msg) {
      console.log(msg);
    },
    logInfo = function (msg) {
      ocConf.debug && console.log(msg);
    };

  // constants
  var RETRY_INTERVAL = ocConf.retryInterval || __DEFAULT_RETRY_INTERVAL__,
    RETRY_LIMIT = ocConf.retryLimit || __DEFAULT_RETRY_LIMIT__,
    DISABLE_LOADER = isBool(ocConf.disableLoader)
      ? ocConf.disableLoader
      : __DEFAULT_DISABLE_LOADER__,
    RETRY_SEND_NUMBER = ocConf.retrySendNumber || true,
    POLLING_INTERVAL = ocConf.pollingInterval || 500,
    OC_TAG = ocConf.tag || 'oc-component',
    JSON_REQUESTS = !!ocConf.jsonRequests,
    MESSAGES_ERRORS_HREF_MISSING = 'Href parameter missing',
    MESSAGES_ERRORS_RETRY_FAILED =
      'Failed to load % component ' + RETRY_LIMIT + ' times. Giving up',
    MESSAGES_ERRORS_LOADING_COMPILED_VIEW = 'Error getting compiled view: %',
    MESSAGES_ERRORS_RENDERING = 'Error rendering component: %, error: ',
    MESSAGES_ERRORS_RETRIEVING =
      'Failed to retrieve the component. Retrying in ' +
      RETRY_INTERVAL / 1000 +
      ' seconds...',
    MESSAGES_ERRORS_VIEW_ENGINE_NOT_SUPPORTED =
      'Error loading component: view engine "%" not supported',
    MESSAGES_LOADING_COMPONENT = ocConf.loadingMessage || '',
    MESSAGES_RENDERED = "Component '%' correctly rendered",
    MESSAGES_RETRIEVING =
      'Unrendered component found. Trying to retrieve it...',
    interpolate = function (str, value) {
      return str.replace('%', value);
    };

  var registeredTemplates = __REGISTERED_TEMPLATES_PLACEHOLDER__,
    externals = __EXTERNALS__;

  function registerTemplates(templates, overwrite) {
    templates = Array.isArray(templates) ? templates : [templates];
    templates.map(function (template) {
      if (overwrite || !registeredTemplates[template.type]) {
        registeredTemplates[template.type] = {
          externals: template.externals
        };
      }
    });
  }

  if (ocConf.templates) {
    registerTemplates(ocConf.templates, true);
  }

  var retry = function (component, cb, failedRetryCb) {
    if (retries[component] == undefined) {
      retries[component] = RETRY_LIMIT;
    }

    if (retries[component] <= 0) {
      failedRetryCb();
    } else {
      timeout(function () {
        cb(RETRY_LIMIT - retries[component] + 1);
      }, RETRY_INTERVAL);
      retries[component]--;
    }
  };

  var addParametersToHref = function (href, parameters) {
    return href + (~href.indexOf('?') ? '&' : '?') + $.param(parameters);
  };

  var getHeaders = function () {
    var globalHeaders = ocConf.globalHeaders;
    return $.extend(
      { Accept: 'application/vnd.oc.unrendered+json' },
      typeof globalHeaders == 'function' ? globalHeaders() : globalHeaders
    );
  };

  oc.addStylesToHead = function (styles) {
    $('<style>' + styles + '</style>').appendTo($document.head);
  };

  function loadAfterReady() {
    oc.ready(oc.renderUnloadedComponents);
  }

  oc.registerTemplates = function (templates) {
    registerTemplates(templates);
    loadAfterReady();
    return registeredTemplates;
  };

  // A minimal require.js-ish that uses l.js
  oc.require = function (nameSpace, url, callback) {
    if (!callback) {
      callback = url;
      url = nameSpace;
      nameSpace = undefined;
    }

    if (typeof nameSpace == 'string') {
      nameSpace = [nameSpace];
    }

    var getObj = function () {
      var base = $window;

      if (nameSpace == undefined) {
        return undefined;
      }

      for (var i in nameSpace) {
        base = base[nameSpace[i]];
        if (!base) {
          return undefined;
        }
      }

      return base;
    };

    var cbGetObj = function () {
      callback(getObj());
    };

    if (!getObj()) {
      ljs.load(url, cbGetObj);
    } else {
      cbGetObj();
    }
  };

  var asyncRequireForEach = function (toLoad, loaded, callback) {
    if (!callback) {
      callback = loaded;
      loaded = [];
    }

    if (!toLoad.length) {
      callback(loaded);
    } else {
      var loading = toLoad[0];
      oc.require(loading.global, loading.url, function (resolved) {
        asyncRequireForEach(toLoad.slice(1), loaded.concat(resolved), callback);
      });
    }
  };

  oc.requireSeries = asyncRequireForEach;

  var processHtml = function ($component, data, callback) {
    var attr = $component.attr.bind($component),
      dataName = data.name,
      dataVersion = data.version;
    attr('id', data.id);
    attr(dataRenderedAttribute, true);
    attr(dataRenderingAttribute, false);
    attr('data-version', dataVersion);
    attr('data-id', data.ocId);
    $component.html(data.html);

    if (data.key) {
      attr('data-hash', data.key);
    }

    if (dataName) {
      attr('data-name', dataName);
      renderedComponents[dataName] = { version: dataVersion };
      if (data.baseUrl) {
        renderedComponents[dataName].baseUrl = data.baseUrl;
      }
      // Get raw element from jQuery object
      data.element = $component[0];
      oc.events.fire('oc:rendered', data);
    }

    callback();
  };

  function getData(options, cb) {
    cb = cb || noop;
    var version = options.version,
      baseUrl = options.baseUrl,
      name = options.name,
      json = options.json;
    isRequired('version', version);
    isRequired('baseUrl', baseUrl);
    isRequired('name', name);
    var jsonRequest = isBool(json) ? json : JSON_REQUESTS;
    var data = {
      components: [
        {
          action: options.action,
          name: name,
          version: version,
          parameters: $.extend({}, ocConf.globalParameters, options.parameters)
        }
      ]
    };
    var headers = getHeaders();
    var ajaxOptions = {
      method: 'POST',
      url: baseUrl,
      data: jsonRequest ? JSON.stringify(data) : data,
      headers: headers,
      crossDomain: true,
      success: function (apiResponse) {
        var response = apiResponse[0].response;
        var err = response.error ? response.details || response.error : null;
        cb(err, response.data, apiResponse[0]);
      },
      error: cb
    };
    if (jsonRequest) {
      headers['Content-Type'] = 'application/json';
    }

    $.ajax(ajaxOptions);
  }
  oc.getData = getData;
  oc.getAction = function (options) {
    return new Promise(function (resolve, reject) {
      var name = options.component;
      getData(
        $.extend(
          {
            json: true,
            name: name
          },
          renderedComponents[name],
          options
        ),

        function (err, data) {
          if (err) {
            reject(err);
          } else {
            var props = data.component.props;
            delete props._staticPath;
            delete props._baseUrl;
            delete props._componentName;
            delete props._componentVersion;

            resolve(props);
          }
        }
      );
    });
  };

  oc.build = function (options) {
    isRequired('baseUrl', options.baseUrl);
    isRequired('name', options.name);

    var withFinalSlash = function (s) {
      if (!s) return '';

      return s.match(/\/$/) ? s : s + '/';
    };

    var href =
      withFinalSlash(options.baseUrl) +
      withFinalSlash(options.name) +
      withFinalSlash(options.version);

    if (options.parameters) {
      href += '?';
      $.each(options.parameters, function (key, value) {
        if (/[+&=]/.test(value)) {
          value = encodeURIComponent(value);
        }
        href += key + '=' + value + '&';
      });

      href = href.slice(0, -1);
    }

    return '<' + OC_TAG + ' href="' + href + '"></' + OC_TAG + '>';
  };

  oc.ready = function (callback) {
    if (initialised) {
      callback();
    } else if (initialising) {
      ocCmd.push(callback);
    } else {
      initialising = true;

      var done = function () {
        initialised = true;
        initialising = false;

        oc.events = (function () {
          var obj = $({});

          return {
            fire: obj.trigger.bind(obj),
            on: obj.on.bind(obj),
            off: obj.off.bind(obj),
            reset: function () {
              obj.off();
            }
          };
        })();

        callback();

        oc.events.fire('oc:ready', oc);
        oc.status = 'ready';

        ocCmd.map(function (cmd) {
          cmd(oc);
        });

        oc.cmd = {
          push: function (f) {
            f(oc);
          }
        };
      };

      oc.requireSeries(externals, function (deps) {
        var jQuery = deps[0];
        if ($window.jQuery || $window.$) {
          $ = oc.$ = jQuery;
        } else {
          $ = oc.$ = jQuery.noConflict();
        }
        done();
      });
    }
  };

  oc.render = function (compiledViewInfo, model, callback) {
    oc.ready(function () {
      // TODO: integrate with oc-empty-response-handler module
      if (model && model.__oc_emptyResponse == true) {
        return callback(null, '');
      }

      var type = compiledViewInfo.type;
      if (!__DISABLE_LEGACY_TEMPLATES__) {
        if (type == 'jade' || type == 'handlebars') {
          type = 'oc-template-' + type;
        }
      }
      var template = registeredTemplates[type];

      if (template) {
        oc.require(
          ['oc', 'components', compiledViewInfo.key],
          compiledViewInfo.src,
          function (compiledView) {
            if (!compiledView) {
              callback(
                interpolate(
                  MESSAGES_ERRORS_LOADING_COMPILED_VIEW,
                  compiledViewInfo.src
                )
              );
            } else {
              asyncRequireForEach(template.externals, function () {
                try {
                  callback(
                    null,
                    !__DISABLE_LEGACY_TEMPLATES__ &&
                      type == 'oc-template-handlebars'
                      ? $window.Handlebars.template(compiledView, [])(model)
                      : compiledView(model)
                  );
                } catch (e) {
                  callback('' + e);
                }
              });
            }
          }
        );
      } else {
        callback(
          interpolate(
            MESSAGES_ERRORS_VIEW_ENGINE_NOT_SUPPORTED,
            compiledViewInfo.type
          )
        );
      }
    });
  };

  oc.renderNestedComponent = function (component, callback) {
    oc.ready(function () {
      var $component = $(component),
        attr = $component.attr.bind($component),
        dataRendering = attr(dataRenderingAttribute),
        dataRendered = attr(dataRenderedAttribute),
        isRendering = dataRendering == 'true',
        isRendered = dataRendered == 'true';

      if (!isRendering && !isRendered) {
        logInfo(MESSAGES_RETRIEVING);
        attr(dataRenderingAttribute, true);
        if (!DISABLE_LOADER) {
          $component.html(
            '<div class="oc-loading">' + MESSAGES_LOADING_COMPONENT + '</div>'
          );
        }

        oc.renderByHref(
          { href: attr('href'), id: attr('id'), element: $component[0] },
          function (err, data) {
            if (err || !data) {
              attr(dataRenderingAttribute, false);
              attr(dataRenderedAttribute, false);
              attr('data-failed', true);
              $component.html('');
              oc.events.fire('oc:failed', {
                originalError: err,
                data: data,
                component: $component[0]
              });
              logError(err);
              callback();
            } else {
              processHtml($component, data, callback);
            }
          }
        );
      } else {
        timeout(callback, POLLING_INTERVAL);
      }
    });
  };

  oc.renderByHref = function (hrefOrOptions, retryNumberOrCallback, callback) {
    callback = callback || retryNumberOrCallback;
    var ocId = Math.floor(Math.random() * 9999999999),
      retryNumber = hrefOrOptions.retryNumber || +retryNumberOrCallback || 0,
      href = hrefOrOptions.href || hrefOrOptions,
      id = hrefOrOptions.id || ocId,
      element = hrefOrOptions.element;

    oc.ready(function () {
      if (!href) {
        callback(MESSAGES_ERRORS_RENDERING + MESSAGES_ERRORS_HREF_MISSING);
      } else {
        $.ajax({
          url: addParametersToHref(
            href,
            $.extend(
              {},
              ocConf.globalParameters,
              RETRY_SEND_NUMBER && { __oc_Retry: retryNumber }
            )
          ),
          headers: getHeaders(),
          contentType: 'text/plain',
          crossDomain: true,
          success: function (apiResponse) {
            var template = apiResponse.template;
            apiResponse.data.id = id;
            apiResponse.data.element = element;
            oc.render(template, apiResponse.data, function (err, html) {
              if (err) {
                callback(
                  interpolate(MESSAGES_ERRORS_RENDERING, apiResponse.href) + err
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
                  name: apiResponse.name
                });
              }
            });
          },
          error: function (err) {
            if (err && err.status == 429) {
              retries[href] = 0;
            }
            logError(MESSAGES_ERRORS_RETRIEVING);
            retry(
              href,
              function (requestNumber) {
                oc.renderByHref(
                  {
                    href: href,
                    retryNumber: requestNumber,
                    id: id,
                    element: element
                  },
                  callback
                );
              },
              function () {
                callback(interpolate(MESSAGES_ERRORS_RETRY_FAILED, href));
              }
            );
          }
        });
      }
    });
  };

  oc.renderUnloadedComponents = function () {
    oc.ready(function () {
      var $unloadedComponents = $(
        OC_TAG + '[data-rendered!=true][data-failed!=true]'
      );

      $unloadedComponents.map(function (idx, unloadedComponent) {
        oc.renderNestedComponent(unloadedComponent, function () {
          if (idx == $unloadedComponents.length - 1) {
            oc.renderUnloadedComponents();
          }
        });
      });
    });
  };

  oc.load = function (placeholder, href, callback) {
    oc.ready(function () {
      callback = callback || noop;

      if (placeholder) {
        $(placeholder).html('<' + OC_TAG + ' href="' + href + '" />');
        var newComponent = $(OC_TAG, placeholder);
        oc.renderNestedComponent(newComponent, function () {
          callback(newComponent);
        });
      }
    });
  };
  // render the components
  loadAfterReady();

  // expose public variables and methods
  exports = oc;
});
