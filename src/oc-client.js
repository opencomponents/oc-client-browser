/* globals define, exports, require */
/* eslint no-var: 'off' */
/* eslint prefer-arrow-callback: 'off' */

var oc = oc || {};

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['exports', 'jquery'], function (exports, $) {
      $.extend(exports, root.oc);
      factory((root.oc = exports), $, root.ljs, root.document, root.window);
    });
  } else if (
    typeof exports === 'object' &&
    typeof exports.nodeName !== 'string'
  ) {
    // Common JS
    factory(exports, require('jquery'), root.ljs, root.document, root.window);
  } else {
    // Browser globals
    factory((root.oc = oc), root.$, root.ljs, root.document, root.window);
  }
})(this, function (exports, $, ljs, $document, $window) {
  'use strict';
  // jshint ignore:line
  // public variables
  oc.conf = oc.conf || {};
  oc.cmd = oc.cmd || [];
  oc.renderedComponents = oc.renderedComponents || {};
  oc.status = oc.status || false;

  // If oc client is already inside the page, we do nothing.
  if (oc.status) {
    return oc;
  } else {
    oc.status = 'loading';
  }

  // constants
  var CDNJS_BASEURL = 'https://cdnjs.cloudflare.com/ajax/libs/',
    IE9_AJAX_POLYFILL_URL =
      CDNJS_BASEURL +
      'jquery-ajaxtransport-xdomainrequest/1.0.3/jquery.xdomainrequest.min.js',
    JQUERY_URL = CDNJS_BASEURL + 'jquery/3.6.0/jquery.min.js',
    RETRY_INTERVAL = oc.conf.retryInterval || 5000,
    RETRY_LIMIT = oc.conf.retryLimit || 30,
    RETRY_SEND_NUMBER = oc.conf.retrySendNumber || true,
    POLLING_INTERVAL = oc.conf.pollingInterval || 500,
    OC_TAG = oc.conf.tag || 'oc-component',
    JSON_REQUESTS = !!oc.conf.jsonRequests,
    MESSAGES_ERRORS_HREF_MISSING = 'Href parameter missing',
    MESSAGES_ERRORS_RETRY_FAILED =
      'Failed to load {0} component {1} times. Giving up'.replace(
        '{1}',
        RETRY_LIMIT
      ),
    MESSAGES_ERRORS_LOADING_COMPILED_VIEW = 'Error getting compiled view: {0}',
    MESSAGES_ERRORS_GETTING_DATA = 'Error getting data',
    MESSAGES_ERRORS_RENDERING = 'Error rendering component: {0}, error: {1}',
    MESSAGES_ERRORS_RETRIEVING =
      'Failed to retrieve the component. Retrying in {0} seconds...'.replace(
        '{0}',
        RETRY_INTERVAL / 1000
      ),
    MESSAGES_ERRORS_VIEW_ENGINE_NOT_SUPPORTED =
      'Error loading component: view engine "{0}" not supported',
    MESSAGES_LOADING_COMPONENT = oc.conf.loadingMessage || '',
    MESSAGES_RENDERED = "Component '{0}' correctly rendered",
    MESSAGES_RETRIEVING =
      'Unrendered component found. Trying to retrieve it...';

  var isRequired = function (name, value) {
    if (!value) {
      throw name + ' parameter is required';
    }
  };

  // The code
  var debug = oc.conf.debug || false,
    noop = function () {},
    nav = $window.navigator.userAgent,
    is9 = !!nav.match(/MSIE 9/),
    initialised = false,
    initialising = false,
    retries = {},
    isBool = function (a) {
      return typeof a === 'boolean';
    };

  var logger = {
    error: function (msg) {
      // eslint-disable-next-line no-console
      return console.log(msg);
    },
    info: function (msg) {
      // eslint-disable-next-line no-console
      return debug ? console.log(msg) : false;
    }
  };

  var registeredTemplates = __REGISTERED_TEMPLATES_PLACEHOLDER__;

  function registerTemplates(templates, overwrite) {
    templates = Array.isArray(templates) ? templates : [templates];
    templates.forEach(function (template) {
      if (overwrite || !registeredTemplates[template.type]) {
        registeredTemplates[template.type] = {
          externals: template.externals
        };
      }
    });
  }

  if (oc.conf.templates) {
    registerTemplates(oc.conf.templates, true);
  }

  var retry = function (component, cb, failedRetryCb) {
    if (retries[component] === undefined) {
      retries[component] = RETRY_LIMIT;
    }

    if (retries[component] <= 0) {
      return failedRetryCb();
    }

    setTimeout(function () {
      cb(RETRY_LIMIT - retries[component] + 1);
    }, RETRY_INTERVAL);
    retries[component]--;
  };

  var addParametersToHref = function (href, parameters) {
    if (href && parameters) {
      var param = oc.$.param(parameters);
      if (href.indexOf('?') > -1) {
        return href + '&' + param;
      } else {
        return href + '?' + param;
      }
    }

    return href;
  };

  var getHeaders = function () {
    var globalHeaders =
      typeof oc.conf.globalHeaders === 'function'
        ? oc.conf.globalHeaders()
        : oc.conf.globalHeaders;

    return oc.$.extend(
      { Accept: 'application/vnd.oc.unrendered+json' },
      globalHeaders
    );
  };

  oc.addStylesToHead = function (styles) {
    oc.$('<style>' + styles + '</style>').appendTo(document.head);
  };

  oc.registerTemplates = function (templates) {
    registerTemplates(templates);
    oc.ready(oc.renderUnloadedComponents);
    return registeredTemplates;
  };

  // A minimal require.js-ish that uses l.js
  oc.require = function (nameSpace, url, callback) {
    if (typeof url === 'function') {
      callback = url;
      url = nameSpace;
      nameSpace = undefined;
    }

    if (typeof nameSpace === 'string') {
      nameSpace = [nameSpace];
    }

    var needsToBeLoaded = function () {
      var base = $window;

      if (typeof nameSpace === 'undefined') {
        return true;
      }

      for (var i = 0; i < nameSpace.length; i++) {
        base = base[nameSpace[i]];
        if (!base) {
          return true;
        }
      }

      return false;
    };

    var getObj = function () {
      var base = $window;

      if (typeof nameSpace === 'undefined') {
        return undefined;
      }

      for (var i = 0; i < nameSpace.length; i++) {
        base = base[nameSpace[i]];
        if (!base) {
          return undefined;
        }
      }

      return base;
    };

    if (needsToBeLoaded()) {
      ljs.load(url, function () {
        callback(getObj());
      });
    } else {
      callback(getObj());
    }
  };

  var asyncRequireForEach = function (toLoad, loaded, callback) {
    if (typeof loaded === 'function') {
      callback = loaded;
      loaded = [];
    }

    if (toLoad.length === 0) {
      return callback();
    }

    var loading = toLoad[0];
    oc.require(loading.global, loading.url, function () {
      var justLoaded = loading;
      var nowLoaded = loaded.concat(justLoaded);
      var remainToLoad = toLoad.slice(1);
      asyncRequireForEach(remainToLoad, nowLoaded, callback);
    });
  };

  oc.requireSeries = asyncRequireForEach;

  var processHtml = function ($component, data, callback) {
    data.id = Math.floor(Math.random() * 9999999999);

    $component.html(data.html);
    $component.attr('id', data.id);
    $component.attr('data-rendered', true);
    $component.attr('data-rendering', false);
    $component.attr('data-version', data.version);

    if (data.key) {
      $component.attr('data-hash', data.key);
    }

    if (data.name) {
      $component.attr('data-name', data.name);
      oc.renderedComponents[data.name] = data.version;
      oc.events.fire('oc:rendered', data);
    }

    callback();
  };

  oc.getData = function (options, cb) {
    cb = cb || noop;
    isRequired('version', options.version);
    isRequired('baseUrl', options.baseUrl);
    isRequired('name', options.name);
    var jsonRequest =
      typeof options.json === 'boolean' ? options.json : JSON_REQUESTS;
    var data = {
      components: [
        {
          name: options.name,
          version: options.version,
          parameters: oc.$.extend(
            {},
            oc.conf.globalParameters,
            options.parameters
          )
        }
      ]
    };
    var headers = getHeaders();
    if (jsonRequest) {
      headers['Content-Type'] = 'application/json';
    }
    var ajaxOptions = {
      method: 'POST',
      url: options.baseUrl,
      data: jsonRequest ? JSON.stringify(data) : data,
      headers: headers,
      crossDomain: true,
      success: function (apiResponse) {
        if (apiResponse[0].response.renderMode === 'rendered') {
          return cb(MESSAGES_ERRORS_GETTING_DATA);
        }
        var error = apiResponse[0].response.error
          ? apiResponse[0].response.details || apiResponse[0].response.error
          : null;
        return cb(error, apiResponse[0].response.data, apiResponse[0]);
      },
      error: function (err) {
        return cb(err);
      }
    };
    if (jsonRequest) {
      ajaxOptions.dataType = 'json';
    }

    oc.$.ajax(ajaxOptions);
  };

  oc.build = function (options) {
    isRequired('baseUrl', options.baseUrl);
    isRequired('name', options.name);

    var withFinalSlash = function (s) {
      s = s || '';

      if (s.slice(-1) !== '/') {
        s += '/';
      }

      return s;
    };

    var href = withFinalSlash(options.baseUrl) + withFinalSlash(options.name);

    if (options.version) {
      href += withFinalSlash(options.version);
    }

    if (options.parameters) {
      href += '?';
      for (var parameter in options.parameters) {
        // eslint-disable-next-line no-prototype-builtins
        if (options.parameters.hasOwnProperty(parameter)) {
          var value = options.parameters[parameter];
          if (/[+&=]/.test(value)) {
            value = encodeURIComponent(value);
          }
          href += parameter + '=' + value + '&';
        }
      }
      href = href.slice(0, -1);
    }

    return '<' + OC_TAG + ' href="' + href + '"></' + OC_TAG + '>';
  };

  oc.events = {};

  oc.ready = function (callback) {
    if (initialised) {
      return callback();
    } else if (initialising) {
      oc.cmd.push(callback);
    } else {
      initialising = true;

      var requirePolyfills = function ($, cb) {
        if (is9 && !$.IE_POLYFILL_LOADED) {
          oc.require(IE9_AJAX_POLYFILL_URL, cb);
        } else {
          cb();
        }
      };

      var done = function () {
        initialised = true;
        initialising = false;

        oc.events = (function () {
          var obj = oc.$({});

          return {
            fire: function (key, data) {
              return obj.trigger(key, data);
            },
            on: function (key, cb) {
              return obj.on(key, cb || noop);
            },
            off: function (events, selectorOrHandler, handler) {
              return obj.off(events, selectorOrHandler, handler);
            },
            reset: function () {
              return obj.off();
            }
          };
        })();

        callback();

        oc.events.fire('oc:ready', oc);
        oc.status = 'ready';

        for (var i = 0; i < oc.cmd.length; i++) {
          oc.cmd[i](oc);
        }

        oc.cmd = {
          push: function (f) {
            f(oc);
          }
        };
      };

      var wasJqueryThereAlready = !!$window.jQuery;
      var wasDollarThereAlready = !!$window.$;

      oc.require('jQuery', JQUERY_URL, function (jQuery) {
        requirePolyfills(jQuery, function () {
          if (wasJqueryThereAlready || wasDollarThereAlready) {
            oc.$ = jQuery;
          } else {
            oc.$ = jQuery.noConflict();
          }
          done();
        });
      });
    }
  };

  oc.render = function (compiledViewInfo, model, callback) {
    oc.ready(function () {
      // TODO: integrate with oc-empty-response-handler module
      if (model && model.__oc_emptyResponse === true) {
        return callback(null, '');
      }

      var type = compiledViewInfo.type;
      if (type === 'jade') {
        type = 'oc-template-jade';
      }
      if (type === 'handlebars') {
        type = 'oc-template-handlebars';
      }
      var template = registeredTemplates[type];

      if (template) {
        oc.require(
          ['oc', 'components', compiledViewInfo.key],
          compiledViewInfo.src,
          function (compiledView) {
            if (!compiledView) {
              callback(
                MESSAGES_ERRORS_LOADING_COMPILED_VIEW.replace(
                  '{0}',
                  compiledViewInfo.src
                )
              );
            } else {
              asyncRequireForEach(template.externals, function () {
                if (type === 'oc-template-handlebars') {
                  try {
                    var linked = $window.Handlebars.template(compiledView, []);
                    callback(null, linked(model));
                  } catch (e) {
                    callback(e.toString());
                  }
                } else {
                  callback(null, compiledView(model));
                }
              });
            }
          }
        );
      } else {
        callback(
          MESSAGES_ERRORS_VIEW_ENGINE_NOT_SUPPORTED.replace(
            '{0}',
            compiledViewInfo.type
          )
        );
      }
    });
  };

  oc.renderNestedComponent = function (component, callback) {
    oc.ready(function () {
      var $component = oc.$(component),
        dataRendering = $component.attr('data-rendering'),
        dataRendered = $component.attr('data-rendered'),
        isRendering = isBool(dataRendering)
          ? dataRendering
          : dataRendering === 'true',
        isRendered = isBool(dataRendered)
          ? dataRendered
          : dataRendered === 'true';

      if (!isRendering && !isRendered) {
        logger.info(MESSAGES_RETRIEVING);
        $component.attr('data-rendering', true);
        $component.html(
          '<div class="oc-loading">' + MESSAGES_LOADING_COMPONENT + '</div>'
        );

        oc.renderByHref($component.attr('href'), function (err, data) {
          if (err || !data) {
            $component
              .attr('data-rendering', 'false')
              .attr('data-rendered', 'false')
              .attr('data-failed', 'true')
              .html('');
            oc.events.fire('oc:failed', {
              originalError: err,
              data: data,
              component: $component[0]
            });
            logger.error(err);
            return callback();
          }

          processHtml($component, data, callback);
        });
      } else {
        setTimeout(callback, POLLING_INTERVAL);
      }
    });
  };

  oc.renderByHref = function (href, retryNumberOrCallback, cb) {
    var callback = cb,
      retryNumber = retryNumberOrCallback;

    if (typeof retryNumberOrCallback === 'function') {
      callback = retryNumberOrCallback;
      retryNumber = 0;
    }

    oc.ready(function () {
      if (href !== '') {
        var extraParams = RETRY_SEND_NUMBER ? { __oc_Retry: retryNumber } : {};
        var finalisedHref = addParametersToHref(
          href,
          oc.$.extend({}, oc.conf.globalParameters, extraParams)
        );

        oc.$.ajax({
          url: finalisedHref,
          headers: getHeaders(),
          contentType: 'text/plain',
          crossDomain: true,
          success: function (apiResponse) {
            if (apiResponse.renderMode === 'unrendered') {
              oc.render(
                apiResponse.template,
                apiResponse.data,
                function (err, html) {
                  if (err) {
                    return callback(
                      MESSAGES_ERRORS_RENDERING.replace(
                        '{0}',
                        apiResponse.href
                      ).replace('{1}', err)
                    );
                  }
                  logger.info(
                    MESSAGES_RENDERED.replace('{0}', apiResponse.template.src)
                  );
                  callback(null, {
                    html: html,
                    key: apiResponse.template.key,
                    version: apiResponse.version,
                    name: apiResponse.name
                  });
                }
              );
            } else if (apiResponse.renderMode === 'rendered') {
              logger.info(MESSAGES_RENDERED.replace('{0}', apiResponse.href));

              if (apiResponse.html.indexOf('<' + OC_TAG) === 0) {
                var innerHtmlPlusEnding = apiResponse.html.slice(
                    apiResponse.html.indexOf('>') + 1
                  ),
                  innerHtml = innerHtmlPlusEnding.slice(
                    0,
                    innerHtmlPlusEnding.lastIndexOf('<')
                  );

                apiResponse.html = innerHtml;
              }
              callback(null, {
                html: apiResponse.html,
                version: apiResponse.version,
                name: apiResponse.name
              });
            }
          },
          error: function () {
            logger.error(MESSAGES_ERRORS_RETRIEVING);
            retry(
              href,
              function (requestNumber) {
                oc.renderByHref(href, requestNumber, callback);
              },
              function () {
                callback(MESSAGES_ERRORS_RETRY_FAILED.replace('{0}', href));
              }
            );
          }
        });
      } else {
        return callback(
          MESSAGES_ERRORS_RENDERING.replace('{1}', MESSAGES_ERRORS_HREF_MISSING)
        );
      }
    });
  };

  oc.renderUnloadedComponents = function () {
    oc.ready(function () {
      var $unloadedComponents = oc.$(
          OC_TAG + '[data-rendered!=true][data-failed!=true]'
        ),
        toDo = $unloadedComponents.length;

      var done = function () {
        toDo--;
        if (!toDo) {
          oc.renderUnloadedComponents();
        }
      };

      if (toDo > 0) {
        for (var i = 0; i < $unloadedComponents.length; i++) {
          oc.renderNestedComponent(oc.$($unloadedComponents[i]), done);
        }
      }
    });
  };

  oc.load = function (placeholder, href, callback) {
    oc.ready(function () {
      if (typeof callback !== 'function') {
        callback = noop;
      }

      if (oc.$(placeholder)) {
        oc.$(placeholder).html('<' + OC_TAG + ' href="' + href + '" />');
        var newComponent = oc.$(OC_TAG, placeholder);
        oc.renderNestedComponent(newComponent, function () {
          callback(newComponent);
        });
      }
    });
  };

  // render the components
  oc.ready(oc.renderUnloadedComponents);

  // expose public variables and methods
  exports = oc;
});
