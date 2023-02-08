/*
    .toBe(value)
    Use .toBe(value) to compare the primitive values or to check referential identity of object instances
    It calls Object.is to compare values, which is even better for testing than === strict equality operator
    For example, this code will validate some properties of the can object:
*/

const can = {
    name: 'pamplemousse',
    ounces: 12
};

describe('the can', () => {
    test('has 12 ounces', () => {
        expect(can.ounces).toBe(12);
    });

    test('has a sophisticated name', () => {
        expect(can.name).toBe('pamplemousse');
    });
});

/*
    .toBe && Floating-Point Numbers
    Don't use .toBe with floating-point numbers. For example, due to rounding, in JavaScript 0.2 + 0.1 is not strictly equal to 0.3.
    If you have floating point numbers, try .toBeClosedTo instead

    Althought the .toBe matcher checks referential identity, it reports a deep comparison of values if the assertion fails
    If differences between properties do not help you to understand why a test fails, especially if the report is large, then you might move the 
    comparison into the expect function. For example, to assert whether or not elements are the same instance

    rewrite `expect(received).toBe(expected)` as `expect(Object.is(received, expected)).toBe(true)`
    rewrite `expect(received).not.toBe(expected)` as `expect(Object.is(received, expected)).toBe(false)`
*/

/*
    .toHaveBeenCalled()
    Also under the alias .toBeCalled()

    Use .toHaveBeenCalledWith to ensure that a mock function was called with specific arguments. 
    The arguments are checked with the same algorithm that .toEqual uses.

    For example, let's say you have a drinkAll(drink, flavour) function that takes a drink function
    and applies it to all available beverages. You might want to check that drink gets called for 
    'lemon', but not for 'octopus', because 'octopus' flavour is really weird and why would anything 
    be octopus-flavoured? You can do that with this test suite.
*/

function drinkAll(callback, flavour) {
    if (flavour !== 'octopus') {
        callback(flavour);
    }
}

describe('drinkAll', () => {
    test('drinks something lemon-flavoured', () => {
        const drink = jest.fn();
        drinkAll(drink, 'lemon');
        expect(drink).toHaveBeenCalled();
    });

    test('does not drink something octopus-flavoured', () => {
        const drink = jest.fn();
        drinkAll(drink, 'octopus');
        expect(drink).not.toHaveBeenCalled();
    });
});