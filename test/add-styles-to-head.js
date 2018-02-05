'use strict';

describe('oc-client : addStylesToHead', function() {
  describe('when providing a css string', function() {
    var styles = 'body: {background: red;}';
    it('should append a style tag with the correct content in the head', function() {
      oc.addStylesToHead(styles);
      console.log(document.getElementsByTagName('style'));
      expect(document.getElementsByTagName('style')[0].textContent).toEqual(
        styles
      );
    });
  });
});
