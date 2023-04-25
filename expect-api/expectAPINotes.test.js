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

    For example, letes say you have a drinkAll(drink, flavour) function that takes a drink function and 
    applies it to all available beverages. You might want to check that drink gets called for 'lemon', but not for 
    'octopus', because 'octopus' flavour is really weird and why would anything be octopus-flavoured? 

    You can do that with this test suite:
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

/*
    .toHaveBeenCalledTimes(number)
    Also under the alias .toBeCalledTimes(number)

    Use .toHaveBeenCalledTimes to ensure that a mock function got called exact number of times.

    For example, let's say you have a drinkEach(drink, Array<flavor>) function that takes a drink function
    and applies it to array of passed beverages. You might want to check that drink function was called exact 
    number of times.

    You can do that with this test suite:
*/
function drinkEach(callback, flavourArr) {
    flavourArr.forEach(flavour => callback(flavour));
}

describe('drinkEach', () => {
    test('drinkEach drinks each drink', () => {
        const drink = jest.fn();
        drinkEach(drink, ['lemon', 'octopus']);
        expect(drink).toHaveBeenCalledTimes(2);
    });
});

/*
    .toHaveBeenCalledWith(arg1, arg2, ...)
    Also under the alias .toBeCalledWith()

    Use .toHaveBeenCalledWith to ensure that a mock function was called with specific arguments.
    The arguments are checked with the same algorithm that .toEqual uses.

    For example, let's say that you can register a beverage with a 'register' function, and 
    'applyToAll(f)' should apply the function 'f' to all registered beverages. 

    To make sure this works, you could write:
*/

const registeredDrinks = [];

class LaCroix {
    #_flavor;
    #_registered;

    constructor(flavor) {
        this.#_flavor = flavor;
        this.#_registered = false;
    }

    get flavor() {
        return this.#_flavor;
    }

    get registered() {
        return this.#_registered;
    }

    set registered(value) {
        if (typeof(value) === 'boolean') {
            this.#_registered = value;
        } else {
            throw new Error('Value is not a boolean!');
        }
    }
}

function register(drink) {
    drink.registered = true;
    registeredDrinks.push(drink);
}

function applyToAll(f) {
    if (!!registeredDrinks.length) {
        return registeredDrinks.map((drink) => {
            return f(drink);
        });
    }

    return [];
}

describe('applyToAll', () => {
    test('registration applies correctly to orange La Croix', () => {
        const beverage = new LaCroix('orange');
        register(beverage);
        const f = jest.fn();
        applyToAll(f);
        expect(f).toHaveBeenCalledWith(beverage);
    });
});

/*
    .toHaveBeenLastCalledWith(arg1, arg2, ...);
    Also under the alias: .lastCalledWith(arg1, arg2, ...)

    If you have a mock function, you can use .toHaveBeenLastCalledWith to test
    what arguments it was last called with. 

    For example, let's say you have a `applyToAllFlavors(f)` function 
    that applies `f` to a bunch of flavors, and you want to 
    ensure that when you call it, the last flavor it operates on is 'mango'.

    You can write:
*/

function applyToAllFlavors(fn) {
    const flavors = ['grape', 'strawberry', 'orange', 'mango'];

    return flavors.map((flavor) => {
        return fn(flavor);
    });
}

describe('applyToAllFlavors', () => {
    test('applying to all flavors does mango last', () => {
        const drink = jest.fn();
        applyToAllFlavors(drink);
        expect(drink).toHaveBeenLastCalledWith('mango');
    });
});