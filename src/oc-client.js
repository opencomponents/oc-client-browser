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
    isFunction = function (a) {
      return typeof a == 'function';
    },
    timeout = setTimeout,
    ocCmd = oc.cmd,
    ocConf = oc.conf,
    renderedComponents = oc.renderedComponents,
    dataRenderedAttribute = 'data-rendered',
    dataRenderingAttribute = 'data-rendering',
    error = function (msg) {
      console.log(msg);
    },
    info = function (msg) {
      ocConf.debug && console.log(msg);
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
      'Failed to load $0 component ' + RETRY_LIMIT + ' times. Giving up',
    MESSAGES_ERRORS_LOADING_COMPILED_VIEW = 'Error getting compiled view: $0',
    MESSAGES_ERRORS_GETTING_DATA = 'Error getting data',
    MESSAGES_ERRORS_RENDERING = 'Error rendering component: $1, error: $0',
    MESSAGES_ERRORS_RETRIEVING =
      'Failed to retrieve the component. Retrying in ' +
      RETRY_INTERVAL / 1000 +
      ' seconds...',
    MESSAGES_ERRORS_VIEW_ENGINE_NOT_SUPPORTED =
      'Error loading component: view engine "$0" not supported',
    MESSAGES_LOADING_COMPONENT = ocConf.loadingMessage || '',
    MESSAGES_RENDERED = "Component '$0' correctly rendered",
    MESSAGES_RETRIEVING =
      'Unrendered component found. Trying to retrieve it...',
    interpolate = function (str, value, value2) {
      return str.replace('$0', value).replace('$1', value2);
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
    return $.extend(
      { Accept: 'application/vnd.oc.unrendered+json' },
      isFunction(ocConf.globalHeaders)
        ? ocConf.globalHeaders()
        : ocConf.globalHeaders
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
    if (isFunction(url)) {
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
    if (isFunction(loaded)) {
      callback = loaded;
      loaded = [];
    }

    if (!toLoad.length) {
      callback();
    } else {
      var loading = toLoad[0];
      oc.require(loading.global, loading.url, function () {
        asyncRequireForEach(toLoad.slice(1), loaded.concat(loading), callback);
      });
    }
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
        if (response.renderMode == 'rendered') {
          return cb(MESSAGES_ERRORS_GETTING_DATA);
        }
        var err = response.error ? response.details || response.error : null;
        cb(err, response.data, apiResponse[0]);
      },
      error: cb
    };
    if (jsonRequest) {
      ajaxOptions.dataType = 'json';
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
      return s.match(/\/$/) ? s : s + '/';
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

      oc.require('jQuery', JQUERY_URL, function (jQuery) {
        oc.requireSeries(externals, function () {
          if ($window.jQuery || $window.$) {
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
      if (model && model.__oc_emptyResponse == true) {
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
                interpolate(
                  MESSAGES_ERRORS_LOADING_COMPILED_VIEW,
                  compiledViewInfo.src
                )
              );
            } else {
              asyncRequireForEach(template.externals, function () {
                if (type == 'oc-template-handlebars') {
                  try {
                    callback(
                      null,
                      $window.Handlebars.template(compiledView, [])(model)
                    );
                  } catch (e) {
                    callback('' + e);
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
        isRendering = '' + dataRendering == 'true',
        isRendered = '' + dataRendered == 'true';

      if (!isRendering && !isRendered) {
        info(MESSAGES_RETRIEVING);
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
              attr(dataRenderingAttribute, false);
              attr(dataRenderedAttribute, false);
              attr('data-failed', true);
              $component.html('');
              oc.events.fire('oc:failed', {
                originalError: err,
                data: data,
                component: $component[0]
              });
              error(err);
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
      if (!href) {
        callback(
          interpolate(MESSAGES_ERRORS_RENDERING, MESSAGES_ERRORS_HREF_MISSING)
        );
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
            if (apiResponse.renderMode == 'unrendered') {
              apiResponse.data.id = id;
              oc.render(template, apiResponse.data, function (err, html) {
                if (err) {
                  callback(
                    interpolate(
                      MESSAGES_ERRORS_RENDERING,
                      err,
                      apiResponse.href
                    )
                  );
                } else {
                  info(interpolate(MESSAGES_RENDERED, template.src));
                  callback(null, {
                    id: id,
                    html: html,
                    baseUrl: apiResponse.baseUrl,
                    key: template.key,
                    version: apiResponse.version,
                    name: apiResponse.name
                  });
                }
              });
            } else if (apiResponse.renderMode == 'rendered') {
              info(interpolate(MESSAGES_RENDERED, apiResponse.href));

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
          error: function (err) {
            if (err && err.status == 429) {
              retries[href] = 0;
            }
            error(MESSAGES_ERRORS_RETRIEVING);
            retry(
              href,
              function (requestNumber) {
                oc.renderByHref(href, requestNumber, callback);
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
        ),
        toDo = $unloadedComponents.length;

      if (toDo > 0) {
        $.each($unloadedComponents, function (_idx, unloadedComponent) {
          oc.renderNestedComponent(unloadedComponent, function () {
            toDo--;
            if (!toDo) {
              oc.renderUnloadedComponents();
            }
          });
        });
      }
    });
  };

  oc.load = function (placeholder, href, callback) {
    oc.ready(function () {
      if (!isFunction(callback)) {
        callback = noop;
      }

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
