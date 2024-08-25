/* globals define, exports, require, globalThis, __REGISTERED_TEMPLATES_PLACEHOLDER__, __DEFAULT_RETRY_INTERVAL__, __DEFAULT_RETRY_LIMIT__, __DEFAULT_DISABLE_LOADER__, __EXTERNALS__ */
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
  oc.status = oc.status || false;

  // If oc client is already inside the page, we do nothing.
  if (oc.status) {
    return oc;
  } else {
    oc.status = 'loading';
  }

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
    isFunction = function (a) {
      return typeof a == 'function';
    },
    ocCmd = oc.cmd,
    ocConf = oc.conf,
    renderedComponents = oc.renderedComponents,
    firstPlaceholder = '{0}',
    secondPlaceholder = '{1}',
    dataRenderedAttribute = 'data-rendered',
    dataRenderingAttribute = 'data-rendering';

  var logger = {
    error: function (msg) {
      // eslint-disable-next-line no-console
      return console.log(msg);
    },
    info: function (msg) {
      // eslint-disable-next-line no-console
      return ocConf.debug ? console.log(msg) : false;
    }
  };

  // constants
  var JQUERY_URL =
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
    RETRY_INTERVAL = ocConf.retryInterval || __DEFAULT_RETRY_INTERVAL__,
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
      'Failed to load {0} component ' + RETRY_LIMIT + ' times. Giving up',
    MESSAGES_ERRORS_LOADING_COMPILED_VIEW = 'Error getting compiled view: {0}',
    MESSAGES_ERRORS_GETTING_DATA = 'Error getting data',
    MESSAGES_ERRORS_RENDERING = 'Error rendering component: {0}, error: {1}',
    MESSAGES_ERRORS_RETRIEVING =
      'Failed to retrieve the component. Retrying in ' +
      RETRY_INTERVAL / 1000 +
      ' seconds...',
    MESSAGES_ERRORS_VIEW_ENGINE_NOT_SUPPORTED =
      'Error loading component: view engine "{0}" not supported',
    MESSAGES_LOADING_COMPONENT = ocConf.loadingMessage || '',
    MESSAGES_RENDERED = "Component '{0}' correctly rendered",
    MESSAGES_RETRIEVING =
      'Unrendered component found. Trying to retrieve it...';

  var registeredTemplates = __REGISTERED_TEMPLATES_PLACEHOLDER__,
    externals = __EXTERNALS__;

  function registerTemplates(templates, overwrite) {
    templates = Array.isArray(templates) ? templates : [templates];
    for (var i in templates) {
      var template = templates[i],
        type = template.type;
      if (overwrite || !registeredTemplates[type]) {
        registeredTemplates[type] = {
          externals: template.externals
        };
      }
    }
  }

  if (ocConf.templates) {
    registerTemplates(ocConf.templates, true);
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
      var param = $.param(parameters);
      if (href.indexOf('?') > -1) {
        return href + '&' + param;
      } else {
        return href + '?' + param;
      }
    }

    return href;
  };

  var getHeaders = function () {
    var globalHeaders = isFunction(ocConf.globalHeaders)
      ? ocConf.globalHeaders()
      : ocConf.globalHeaders;

    return $.extend(
      { Accept: 'application/vnd.oc.unrendered+json' },
      globalHeaders
    );
  };

  oc.addStylesToHead = function (styles) {
    $('<style>' + styles + '</style>').appendTo($document.head);
  };

  oc.registerTemplates = function (templates) {
    registerTemplates(templates);
    oc.ready(oc.renderUnloadedComponents);
    return registeredTemplates;
  };

  // A minimal require.js-ish that uses l.js
  oc.require = function (nameSpace, url, callback) {
    if (isFunction(url)) {
      callback = url;
      url = nameSpace;
      nameSpace = undefined;
    }

    if (typeof nameSpace == 'string') {
      nameSpace = [nameSpace];
    }

    var needsToBeLoaded = function () {
      var base = $window;

      if (nameSpace == undefined) {
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

      if (typeof nameSpace == 'undefined') {
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

    var cbGetObj = function () {
      callback(getObj());
    };

    if (needsToBeLoaded()) {
      ljs.load(url, cbGetObj);
    } else {
      cbGetObj();
    }
  };

  var asyncRequireForEach = function (toLoad, loaded, callback) {
    if (isFunction(loaded)) {
      callback = loaded;
      loaded = [];
    }

    if (toLoad.length == 0) {
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
    var attr = $component.attr.bind($component),
      dataName = data.name,
      dataVersion = data.version;
    $component.html(data.html);
    attr('id', data.id);
    attr(dataRenderedAttribute, true);
    attr(dataRenderingAttribute, false);
    attr('data-version', dataVersion);

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
    if (jsonRequest) {
      headers['Content-Type'] = 'application/json';
    }
    var ajaxOptions = {
      method: 'POST',
      url: baseUrl,
      data: jsonRequest ? JSON.stringify(data) : data,
      headers: headers,
      crossDomain: true,
      success: function (apiResponse) {
        var response = apiResponse[0].response;
        if (response.renderMode === 'rendered') {
          return cb(MESSAGES_ERRORS_GETTING_DATA);
        }
        var error = response.error ? response.details || response.error : null;
        return cb(error, response.data, apiResponse[0]);
      },
      error: function (err) {
        return cb(err);
      }
    };
    if (jsonRequest) {
      ajaxOptions.dataType = 'json';
    }

    $.ajax(ajaxOptions);
  }
  oc.getData = getData;
  oc.getAction = function (options) {
    return new Promise(function (resolve, reject) {
      var renderedComponent = renderedComponents[options.component],
        baseUrl = options.baseUrl || renderedComponent.baseUrl,
        version = options.version || renderedComponent.version;

      getData(
        {
          json: true,
          action: options.action,
          name: options.component,
          version: version,
          baseUrl: baseUrl,
          parameters: options.parameters
        },
        function (err, data) {
          if (err) {
            return reject(err);
          }
          var props = data.component.props;
          delete props._staticPath;
          delete props._baseUrl;
          delete props._componentName;
          delete props._componentVersion;

          resolve(props);
        }
      );
    });
  };

  oc.build = function (options) {
    isRequired('baseUrl', options.baseUrl);
    isRequired('name', options.name);

    var withFinalSlash = function (s) {
      s = s || '';

      if (s.slice(-1) != '/') {
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

        for (var i = 0; i < ocCmd.length; i++) {
          ocCmd[i](oc);
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
        oc.requireSeries(externals, function () {
          if (wasJqueryThereAlready || wasDollarThereAlready) {
            $ = oc.$ = jQuery;
          } else {
            $ = oc.$ = jQuery.noConflict();
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
      if (type == 'jade' || type == 'handlebars') {
        type = 'oc-template-' + type;
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
                  firstPlaceholder,
                  compiledViewInfo.src
                )
              );
            } else {
              asyncRequireForEach(template.externals, function () {
                if (type == 'oc-template-handlebars') {
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
            firstPlaceholder,
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
        isRendering = isBool(dataRendering)
          ? dataRendering
          : dataRendering == 'true',
        isRendered = isBool(dataRendered)
          ? dataRendered
          : dataRendered == 'true';

      if (!isRendering && !isRendered) {
        logger.info(MESSAGES_RETRIEVING);
        attr(dataRenderingAttribute, true);
        if (!DISABLE_LOADER) {
          $component.html(
            '<div class="oc-loading">' + MESSAGES_LOADING_COMPONENT + '</div>'
          );
        }

        oc.renderByHref(
          { href: attr('href'), id: attr('id') },
          function (err, data) {
            if (err || !data) {
              attr(dataRenderingAttribute, 'false');
              attr(dataRenderedAttribute, 'false');
              attr('data-failed', 'true');
              $component.html('');
              oc.events.fire('oc:failed', {
                originalError: err,
                data: data,
                component: $component[0]
              });
              logger.error(err);
              return callback();
            }

            processHtml($component, data, callback);
          }
        );
      } else {
        setTimeout(callback, POLLING_INTERVAL);
      }
    });
  };

  oc.renderByHref = function (hrefOrOptions, retryNumberOrCallback, cb) {
    var callback = cb,
      retryNumber = retryNumberOrCallback,
      href = hrefOrOptions,
      id = Math.floor(Math.random() * 9999999999);

    if (isFunction(retryNumberOrCallback)) {
      callback = retryNumberOrCallback;
      retryNumber = 0;
    }
    if (typeof hrefOrOptions != 'string') {
      href = hrefOrOptions.href;
      retryNumber = hrefOrOptions.retryNumber || retryNumber || 0;
      id = hrefOrOptions.id || id;
    }

    oc.ready(function () {
      if (href !== '') {
        var extraParams = RETRY_SEND_NUMBER ? { __oc_Retry: retryNumber } : {};
        var finalisedHref = addParametersToHref(
          href,
          $.extend({}, ocConf.globalParameters, extraParams)
        );

        $.ajax({
          url: finalisedHref,
          headers: getHeaders(),
          contentType: 'text/plain',
          crossDomain: true,
          success: function (apiResponse) {
            if (apiResponse.renderMode === 'unrendered') {
              apiResponse.data.id = id;
              oc.render(
                apiResponse.template,
                apiResponse.data,
                function (err, html) {
                  if (err) {
                    return callback(
                      MESSAGES_ERRORS_RENDERING.replace(
                        firstPlaceholder,
                        apiResponse.href
                      ).replace(secondPlaceholder, err)
                    );
                  }
                  logger.info(
                    MESSAGES_RENDERED.replace(
                      firstPlaceholder,
                      apiResponse.template.src
                    )
                  );
                  callback(null, {
                    id: id,
                    html: html,
                    baseUrl: apiResponse.baseUrl,
                    key: apiResponse.template.key,
                    version: apiResponse.version,
                    name: apiResponse.name
                  });
                }
              );
            } else if (apiResponse.renderMode === 'rendered') {
              logger.info(
                MESSAGES_RENDERED.replace(firstPlaceholder, apiResponse.href)
              );

              if (apiResponse.html.indexOf('<' + OC_TAG) == 0) {
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
          error: function (error) {
            var status = error && error.status;
            if (status === 429) retries[href] = 0;
            logger.error(MESSAGES_ERRORS_RETRIEVING);
            retry(
              href,
              function (requestNumber) {
                oc.renderByHref(href, requestNumber, callback);
              },
              function () {
                callback(
                  MESSAGES_ERRORS_RETRY_FAILED.replace(firstPlaceholder, href)
                );
              }
            );
          }
        });
      } else {
        return callback(
          MESSAGES_ERRORS_RENDERING.replace(
            secondPlaceholder,
            MESSAGES_ERRORS_HREF_MISSING
          )
        );
      }
    });
  };

  oc.renderUnloadedComponents = function () {
    oc.ready(function () {
      var $unloadedComponents = $(
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
        $.each($unloadedComponents, function (_idx, unloadedComponent) {
          oc.renderNestedComponent(unloadedComponent, done);
        });
      }
    });
  };

  oc.load = function (placeholder, href, callback) {
    oc.ready(function () {
      if (!isFunction(callback)) {
        callback = noop;
      }

      if ($(placeholder)) {
        $(placeholder).html('<' + OC_TAG + ' href="' + href + '" />');
        var newComponent = $(OC_TAG, placeholder);
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
