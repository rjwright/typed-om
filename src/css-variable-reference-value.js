(function(internal, scope) {

  function CSSVariableReferenceValue(variable, fallback) {
    if (arguments.length != 2) {
      throw new TypeError('CSSVariableReferenceValue constructor should get two parameters');
    }
    if (typeof variable != 'string') {
      throw new TypeError('Variable of CSSVariableReferenceValue must be a string');
    }
    if (!(fallback instanceof CSSTokenStreamValue)) {
      throw new TypeError('Fallback of CSSVariableReferenceValue must be a CSSTokenStreamValue');
    }
    this.variable = variable;
    this.fallback = fallback;
  }

  scope.CSSVariableReferenceValue = CSSVariableReferenceValue;
    
})(typedOM.internal, window);
