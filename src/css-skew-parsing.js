// Copyright 2016 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License.

(function(internal) {
  var parsing = internal.parsing;

  function skewXorY(type, angles, remaining, string) {
    if (angles.length != 1) {
      return null;
    }
    switch (type) {
      case 'x':
        var result = [new CSSSkew(angles[0], new CSSAngleValue(0, 'deg')), remaining];
        result[0].cssText = 'skewx' + '(' + result[0]._ax.cssText + ')';
        return result;
      case 'y':
        var result = [new CSSSkew(new CSSAngleValue(0, 'deg'), angles[0]), remaining];
        result[0].cssText = 'skewy' + '(' + result[0]._ay.cssText + ')';
        return result;
    }
  }

  function consumeSkew(string) {
    var params = parsing.consumeList([
        parsing.ignore(parsing.consumeToken.bind(null, /^skew/i)),
        parsing.optional(parsing.consumeToken.bind(null, /^(x|y)/i)),
        parsing.ignore(parsing.consumeToken.bind(null, /^\(/)),
        parsing.consumeRepeated.bind(null, parsing.consumeAngleValue, /^,/),
        parsing.ignore(parsing.consumeToken.bind(null, /^\)/))
    ], string);
    if (!params) {
      return null;
    }
    string = string.toLowerCase();

    var remaining = params[1];
    var type = params[0][0];
    var angles = params[0][1];

    if (type == 'x' || type == 'y') {
      return skewXorY(type, angles, remaining, string);
    }
    if (angles.length == 1) {
      var result = [new CSSSkew(angles[0], new CSSAngleValue(0, 'deg')), remaining];
      result[0].cssText = 'skew' + '(' + result[0]._ax.cssText + ')';
      return result;
    }
    if (angles.length == 2) {
      var result = [new CSSSkew(angles[0], angles[1]), remaining];
      result[0].cssText = 'skew' + '(' + result[0]._ax.cssText + ', ' + result[0]._ay.cssText + ')';
      return result;
    }
    return null;
  }

  internal.parsing.consumeSkew = consumeSkew;

})(typedOM.internal);