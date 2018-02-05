'use strict';

describe('oc-client : addStylesToHead', function() {
  describe('when providing a css string', function() {
    var css = 'body: {background: red;}';
    it('should append a style tag with the correct content in the head', function() {
      oc.addStylesToHead(css);
      console.log(document.getElementsByTagName('style'));
      expect(document.getElementsByTagName('style')[0].textContent).toEqual(
        css
      );
    });
  });
});
