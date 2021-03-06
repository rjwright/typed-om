suite('SimpleLength', function() {
  test('SimpleLength is a SimpleLength, LengthValue and StyleValue', function() {
    var simpleLength = new SimpleLength(3, 'px');
    assert.instanceOf(simpleLength, SimpleLength, 'A new SimpleLength should be an instance of SimpleLength');
    assert.instanceOf(simpleLength, LengthValue, 'A new SimpleLength should be an instance of LengthValue');
    assert.instanceOf(simpleLength, StyleValue, 'A new SimpleLength should be an instance of StyleValue');
  });

  test('SimpleLength constructor throws exception for invalid types', function() {
    assert.throws(function() {new SimpleLength(3, 'pxp')});
    assert.throws(function() {new SimpleLength({})});
    assert.throws(function() {new SimpleLength({}, 'px')});
  });

  test('SimpleLength constructor works correctly for (number, type)',
      function() {
    var result;
    assert.doesNotThrow(function() {result = new SimpleLength(10, 'px')});
    assert.strictEqual(result.type, 'px');
    assert.strictEqual(result.value, 10);
  });

  test('SimpleLength constructor works correctly for (SimpleLength)',
      function() {
    var original;
    var copy;
    assert.doesNotThrow(function() {original = new SimpleLength(10, 'px')});
    assert.doesNotThrow(function() {copy = new SimpleLength(original)});
    assert.strictEqual(copy.type, original.type);
    assert.strictEqual(copy.value, original.value);
    assert.strictEqual(copy.cssString, original.cssString);
    assert.deepEqual(copy, original);

    // Ensure that the copied object is not tied to the original.
    assert.doesNotChange(function() {original.value = 15}, copy, 'value');
    assert.doesNotChange(function() {original.type = 'em'}, copy, 'type');
  });

  test('SimpleLength cssString is correctly defined for different values and types', function() {
    var pixValue;
    assert.doesNotThrow(function() {pixValue = new SimpleLength(10, 'px')});
    assert.strictEqual(pixValue.cssString, '10px');

    var percentValue;
    assert.doesNotThrow(function() {percentValue = new SimpleLength(10, 'percent')});
    assert.strictEqual(percentValue.cssString, '10%');

    var negativeValue;
    assert.doesNotThrow(function() {negativeValue = new SimpleLength(-3.2, 'px')});
    assert.strictEqual(negativeValue.cssString, '-3.2px');
  });

  test('Multiplication of a SimpleLength produces a new SimpleLength object', function() {
    var simpleLength = new SimpleLength(3, 'px');
    var result = simpleLength.multiply(3);
    assert.strictEqual(result.type, 'px');
    assert.strictEqual(result.value, 9);
  });

  test('Multiplication of a SimpleLength that contains decimals produces correct output value', function() {
    var simpleLength = new SimpleLength(5.3, 'px');
    var result = simpleLength.multiply(3);
    assert.strictEqual(result.type, 'px');
    assert.strictEqual(result.value, (5.3 * 3));
  });

  test('Division of a SimpleLength produces a new SimpleLength object', function() {
    var simpleLength = new SimpleLength(27, 'px');
    var result = simpleLength.divide(3);
    assert.strictEqual(result.type, 'px');
    assert.strictEqual(result.value, 9);
  });

  test('Division of a SimpleLength that contains decimals produces correct output value', function() {
    var simpleLength = new SimpleLength(33.2, 'px');
    var result = simpleLength.divide(5);
    assert.strictEqual(result.type, 'px');
    assert.strictEqual(result.value, (33.2 / 5));
  });

  test('Adding two SimpleLengths of the same type returns a new SimpleLength of the same kind', function() {
    var simpleLength1 = new SimpleLength(10, 'em');
    var simpleLength2 = new SimpleLength(5, 'em');
    var result = simpleLength1.add(simpleLength2);
    assert.instanceOf(result, SimpleLength, 'Two added SimpleLengths of same type should return an instance of SimpleLength');
    assert.strictEqual(result.type, 'em');
    assert.strictEqual(result.value, 15);
  });

  test('Adding two SimpleLengths of different types returns a new CalcLength', function() {
    var simpleLength1 = new SimpleLength(10, 'em');
    var simpleLength2 = new SimpleLength(5, 'px');
    var result = simpleLength1.add(simpleLength2);
    var expectedResult = new CalcLength({em: 10, px: 5});
    assert.instanceOf(result, CalcLength, 'Two added SimpleLengths of different types should return an instance of CalcLength');
    assert.isTrue(expectedResult.equals(result));
  });

  test('Subtracting two SimpleLengths of the same type returns a new SimpleLength of the same kind', function() {
    var simpleLength1 = new SimpleLength(10, 'em');
    var simpleLength2 = new SimpleLength(5, 'em');
    var result = simpleLength1.subtract(simpleLength2);
    assert.instanceOf(result, SimpleLength, 'Two subtracted SimpleLengths of same type should return an instance of SimpleLength');
    assert.strictEqual(result.type, 'em');
    assert.strictEqual(result.value, 5);
  });

  test('Subtracting two SimpleLengths of different types returns a new CalcLength', function() {
    var simpleLength1 = new SimpleLength(10, 'em');
    var simpleLength2 = new SimpleLength(5, 'px');
    var result = simpleLength1.subtract(simpleLength2);
    var expectedResult = new CalcLength({em: 10, px: -5});
    assert.instanceOf(result, CalcLength, 'Two subtracted SimpleLengths of different types should return an instance of CalcLength');
    assert.isTrue(expectedResult.equals(result));
  });

  test('_asCalcLength method returns a CalcLength with single value', function() {
    var simpleLength = new SimpleLength(10, 'em');
    var result = simpleLength._asCalcLength();
    var expectedResult = new CalcLength({em: 10});
    assert.isTrue(result.equals(expectedResult));
  });

  test('equals method should return true for equal SimpleLengths', function() {
    var simpleLength1 = new SimpleLength(10, 'em');
    var simpleLength2 = new SimpleLength(10, 'em');
    assert.isTrue(simpleLength1.equals(simpleLength2));
  });

  test('equals method should return false if a CalcLength is compared to a simple length even if they have the same value', function() {
    var simpleLength1 = new SimpleLength(10, 'em');
    var simpleLength2 = new CalcLength({em: 10});
    assert.isFalse(simpleLength1.equals(simpleLength2));
  });
});
