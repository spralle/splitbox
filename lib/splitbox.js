var angular = require('angular');
var boxModule = angular.module('ui.splitbox');

var _makeDirective = function(direction, $rootScope) {
  var _modeHorizontal = direction === 'horizontal';
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="splitbox"><div class="splitter"><div class="splitter-mouse-trap"></div></div><div ui-transclude-replace/></div>',
    link: function(scope, element, attr) {
      var _isDragging = false;

      var splitter = element.children().eq(0);
      var boxOne = element.children().eq(1);
      var boxTwo = element.children().eq(2);

      var oneMinSize = attr.oneMinSize || 0;
      var twoMinSize = attr.twoMinSize || 0;
      var lastPct = 50;

      element.addClass(_modeHorizontal ? 'horizontal' : 'vertical');
      splitter.addClass(_modeHorizontal ? 'horizontal' : 'vertical');

      var _tick = function _tick(mousePos) {
        boxOne.addClass('splitboxbox');
        boxTwo.addClass('splitboxbox');

        var pct = 0;
        var bounds = element[0].getBoundingClientRect();

        if (_modeHorizontal) {
          var height = bounds.bottom - bounds.top;
          var pos = mousePos - bounds.top;
          if (pos < oneMinSize) return;
          if (height - pos < twoMinSize) return;
          lastPct = pct = pos / height * 100;
          splitter.css({top: pct + '%'});
          boxOne.css({height: pct + '%',  top: ''});
          boxTwo.css({height: (100 - pct) + '%',  top: pct + '%'});
          element.children().css({ width: '100%', left: '0%' });
        } else {
          var width = bounds.right - bounds.left;
          var pos = mousePos - bounds.left;
          if (pos < oneMinSize) return;
          if (width - pos < twoMinSize) return;
          lastPct = pct = pos / width * 100;
          splitter.css({left: pct + '%'});
          boxOne.css({left: '', width: pct + '%'});
          boxTwo.css({left: pct + '%', width: ''});
          element.children().css({height: '100%', top: '0%'});
        }
      }

      var _init = function _init() {
        var bounds = element[0].getBoundingClientRect();
        if (_modeHorizontal) {
          var height = (bounds.bottom - bounds.top);
          var pos = height * lastPct / 100;
          if (height > 0 ) {
            _tick(pos + bounds.top);
          }
        } else {
          var width = (bounds.right - bounds.left);
          var pos = width * lastPct/100;
          if (width > 0) {
            _tick(pos + bounds.left);
          }
        }
      }

      $rootScope.$on('ui.splitbox.redraw', function() { _init(); });

      element.bind('mousemove', function(event) {
        if (!_isDragging) return;
        if (_modeHorizontal) {
          _tick(event.clientY);
        } else {
          _tick(event.clientX);
        }
      });

      splitter.bind('mousedown', function(event) {
        _isDragging = true;
        event.preventDefault();
      });

      angular.element(document).bind('mouseup', function() {
        _isDragging = false;
      });

      _init();
    }
  }
}

boxModule.directive('hbox', ['$rootScope', function($rootScope) {
  return _makeDirective('horizontal', $rootScope);
}]);

boxModule.directive('vbox', ['$rootScope', function($rootScope) {
  return _makeDirective('vertical', $rootScope);
}]);
