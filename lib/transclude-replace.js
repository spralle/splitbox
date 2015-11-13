var angular = require('angular');

angular.module('ui.splitbox')
.directive('uiTranscludeReplace', ['$log', function($log) {
  return {
    terminal: true,
    restrict: 'EA',
    link: function($scope, $element, $attr, ctrl, transclude) {
      if (!transclude) {
        $log.error('orphan',
                   'Illegal use of uiTranscludeReplace directive in the template! ' +
                   'No parent directive that requires a transclusion found. ');
        return;
      }

      transclude($element.scope(), function(clone) {
        if (clone.length) {
          $element.replaceWith(clone);
        } else {
          $element.remove();
        }
      });
    }
  };
}]);
