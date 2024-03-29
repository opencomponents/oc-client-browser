'use strict';

describe('oc-client : getData', function () {
  var execute = function (options, cb) {
    return oc.getData(options, cb);
  };

  describe('when not providing the mandatory parameters', function () {
    describe('when asking for data without baseUrl', function () {
      var throwingFunction = function () {
        return execute({ name: 'someName', version: '0.0.1' });
      };

      it('should throw an error', function () {
        expect(throwingFunction).toThrow('baseUrl parameter is required');
      });
    });

    describe('when asking for data without name', function () {
      var throwingFunction = function () {
        return execute({
          baseUrl: 'http://www.opencomponents.com',
          version: '0.0.1'
        });
      };

      it('should throw an error', function () {
        expect(throwingFunction).toThrow('name parameter is required');
      });
    });

    describe('when asking for data without version', function () {
      var throwingFunction = function () {
        return execute({
          baseUrl: 'http://www.opencomponents.com',
          name: 'a-component'
        });
      };

      it('should throw an error', function () {
        expect(throwingFunction).toThrow('version parameter is required');
      });
    });
  });

  describe('when providing the mandatory parameters', function () {
    describe('when requesting data', function () {
      it('should call the $.ajax method correctly', function (done) {
        var spy = sinon.stub(oc.$, 'ajax').callsFake(function (options) {
          return options.success([
            { response: { renderMode: 'unrendered', data: 'hello' } }
          ]);
        });

        execute(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function () {
            expect(spy.args[0][0].method).toEqual('POST');
            expect(spy.args[0][0].url).toEqual('http://www.components.com/v2');
            expect(spy.args[0][0].data.components[0].name).toEqual(
              'myComponent'
            );
            expect(spy.args[0][0].data.components[0].version).toEqual('6.6.6');
            expect(spy.args[0][0].data.components[0].parameters.name).toEqual(
              'evil'
            );
            expect(spy.args[0][0].headers.Accept).toEqual(
              'application/vnd.oc.unrendered+json'
            );
            oc.$.ajax.restore();
            done();
          }
        );
      });

      it('should call the callback correctly', function (done) {
        oc.$.ajax = function (options) {
          return options.success([
            { response: { renderMode: 'unrendered', data: 'hello' } }
          ]);
        };

        execute(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function (err, data) {
            expect(err).toEqual(null);
            expect(data).toEqual('hello');
            done();
          }
        );
      });

      it('should call the callback with server.js errors details if available', function (done) {
        oc.$.ajax = function (options) {
          return options.success([
            { response: { error: 'oups', details: 'details about oups' } }
          ]);
        };

        execute(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function (err) {
            expect(err).toEqual('details about oups');
            done();
          }
        );
      });

      it('should call the callback with server.js error if no details are available', function (done) {
        oc.$.ajax = function (options) {
          return options.success([{ response: { error: 'oups' } }]);
        };

        execute(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function (err) {
            expect(err).toEqual('oups');
            done();
          }
        );
      });

      it('should call the callback with an error if the registry responds with a rendered component', function (done) {
        oc.$.ajax = function (options) {
          return options.success([
            { response: { renderMode: 'rendered', data: 'hello' } }
          ]);
        };

        execute(
          {
            baseUrl: 'http://www.components.com/v2',
            name: 'myComponent',
            version: '6.6.6',
            parameters: {
              name: 'evil'
            }
          },
          function (err, data) {
            expect(err).toEqual('Error getting data');
            expect(data).toEqual(undefined);
            done();
          }
        );
      });

      describe('when json is requested', function () {
        it('should call the $.ajax method correctly', function (done) {
          var spy = sinon.spy(oc.$, 'ajax');

          execute(
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
              expect(spy.args[0][0].data).toEqual(
                '{"components":[{"name":"myComponent","version":"6.6.6","parameters":{"name":"evil"}}]}'
              );
              expect(spy.args[0][0].dataType).toEqual('json');
              expect(spy.args[0][0].headers['Content-Type']).toEqual(
                'application/json'
              );
              oc.$.ajax.restore();
              done();
            }
          );
        });
      });

      describe('when globalParameters are provided', function () {
        it('should call the $.ajax method with the global parameters', function (done) {
          var spy = sinon.spy(oc.$, 'ajax');

          oc.conf.globalParameters = {
            test: 'value'
          };

          execute(
            {
              baseUrl: 'http://www.components.com/v2',
              name: 'myComponent',
              version: '6.6.6',
              parameters: {
                name: 'evil'
              }
            },
            function () {
              expect(spy.args[0][0].data.components[0].parameters.name).toEqual(
                'evil'
              );
              expect(spy.args[0][0].data.components[0].parameters.test).toEqual(
                'value'
              );
              delete oc.conf.globalParameters;
              oc.$.ajax.restore();
              done();
            }
          );
        });
      });

      describe('When global haders are provided', function () {
        it('should call the $.ajax method with the global headers as data', function (done) {
          var spy = sinon.spy(oc.$, 'ajax');

          oc.conf.globalHeaders = {
            testHeader: 'headerValue'
          };

          execute(
            {
              baseUrl: 'http://www.components.com/v2',
              name: 'myComponent',
              version: '6.6.6',
              parameters: {
                name: 'evil'
              }
            },
            function () {
              expect(spy.args[0][0].headers.testHeader).toEqual('headerValue');
              delete oc.conf.globalHeaders;
              oc.$.ajax.restore();
              done();
            }
          );
        });

        it('should call the $.ajax method with the global headers as function', function (done) {
          var spy = sinon.spy(oc.$, 'ajax');

          oc.conf.globalHeaders = function () {
            return {
              testHeader: 'headerValue'
            };
          };

          execute(
            {
              baseUrl: 'http://www.components.com/v2',
              name: 'myComponent',
              version: '6.6.6',
              parameters: {
                name: 'evil'
              }
            },
            function () {
              expect(spy.args[0][0].headers.testHeader).toEqual('headerValue');
              delete oc.conf.globalHeaders;
              oc.$.ajax.restore();
              done();
            }
          );
        });
      });
    });
  });
});
