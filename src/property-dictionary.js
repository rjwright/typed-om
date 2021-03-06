// Copyright 2015 Google Inc. All rights reserved.
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

(function(internal, testing) {

  function PropertyDictionary() {
    this._validProperties = {
      'animation-iteration-count': [NumberValue],
      'border-top-width': [LengthValue],
      'height': [LengthValue],
      'opacity': [NumberValue],
      'pitch-range': [NumberValue],
      'transform': [TransformValue]
    };

    this._validKeywords = {
      'animation-iteration-count': ['infinite'],
      'border-top-width': ['inherit'],
      'height': ['auto', 'inherit'],
      'opacity': ['initial', 'inherit'],
      'pitch-range': ['inherit'],
      'transform': ['none', 'initial', 'inherit']
    };

    this._allowsPercentage = {
      'height': true
    };

    this._listSeparator = {
      'animation-iteration-count': ', '
    };
  }

  PropertyDictionary.prototype.isSupportedProperty = function(property) {
    return (this._validProperties.hasOwnProperty(property));
  };

  PropertyDictionary.prototype.isListValuedProperty = function(property) {
    return (this._listSeparator.hasOwnProperty(property));
  };

  PropertyDictionary.prototype.getValidStyleValuesArray = function(property) {
    if (!this.isSupportedProperty(property)) {
      throw new TypeError(property + ' is not a supported CSS property');
    }
    return this._validProperties[property];
  };

  PropertyDictionary.prototype.getListValueSeparator = function(property) {
    if (this.isListValuedProperty(property)) {
      return this._listSeparator[property];
    }
    throw new TypeError(property + ' does not support lists of StyleValues');
  };

  PropertyDictionary.prototype.
      _lengthValueHasPercentage = function(lengthValue) {
    if (!(lengthValue instanceof LengthValue)) {
      throw new TypeError(
        'The input to _lengthValueHasPercentage must be a LengthValue');
    }

    if (lengthValue instanceof CalcLength) {
      return (lengthValue.percent != null);
    }

    return (lengthValue.type == 'percent');
  };

  PropertyDictionary.prototype.
      isValidKeyword = function(property, styleValueString) {
    return this._validKeywords[property].indexOf(styleValueString) > -1;
  };

  PropertyDictionary.prototype.isValidInput = function(property, styleValue) {
    if (!this.isSupportedProperty(property)) {
      return false;
    }

    if (styleValue instanceof KeywordValue) {
      if (this._validKeywords.hasOwnProperty(property)) {
        return this.isValidKeyword(property, styleValue.keywordValue);
      }
      return false;
    }

    for (var i = 0; i < this._validProperties[property].length; i++) {
      var styleValueType = this._validProperties[property][i];
      if (styleValue instanceof styleValueType) {
        if (styleValueType != LengthValue) {
          return true;
        }
        return (!this._lengthValueHasPercentage(styleValue) ||
          this._allowsPercentage.hasOwnProperty(property));
      }
    }
    return false;
  };

  PropertyDictionary.prototype
      .throwInvalidInputError = function(property, value) {
    if (value instanceof KeywordValue) {
      throw new TypeError(property +
        ' does not take the keyword ' + value.cssString);
    }
    throw new TypeError(property +
      ' does not take values of type ' + value.constructor.name);
  };

  var instance;
  var propertyDictionary = function() {
    if (!instance) {
      instance = new PropertyDictionary();
    }
    return instance;
  };

  internal.propertyDictionary = propertyDictionary;
  if (TYPED_OM_TESTING) {
    testing.propertyDictionary = propertyDictionary;
  }

})(typedOM.internal, window, typedOMTesting);
