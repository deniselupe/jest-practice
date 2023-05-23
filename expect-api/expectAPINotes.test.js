/*
    .toBe(value)
    Use .toBe(value) to compare the primitive values or to check referential identity of object instances
    It calls Object.is to compare values, which is even better for testing than === strict equality operator
    For example, this code will validate some properties of the can object:
*/

describe('the can', () => {
    const can = {
        name: 'pamplemousse',
        ounces: 12
    };

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

describe('drinkAll', () => {
    function drinkAll(callback, flavour) {
        if (flavour !== 'octopus') {
            callback(flavour);
        }
    }

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

describe('drinkEach', () => {
    function drinkEach(callback, flavourArr) {
        flavourArr.forEach(flavour => callback(flavour));
    }

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

describe('applyToAll', () => {
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

describe('applyToAllFlavors', () => {
    function applyToAllFlavors(fn) {
        const flavors = ['grape', 'strawberry', 'orange', 'mango'];
    
        return flavors.map((flavor) => {
            return fn(flavor);
        });
    }

    test('applying to all flavors does mango last', () => {
        const drink = jest.fn();
        applyToAllFlavors(drink);
        expect(drink).toHaveBeenLastCalledWith('mango');
    });
});

/*
    .toHaveBeenNthCalledWith(nthCall, arg1, arg2, ...)
    Also under the alias: .nthCalledWith(nthCall, arg1, arg2, ...)

    If you have a mock function, you can use `.toHaveBeenNthCalledWith` to 
    test what arguments it was nth called with. 

    Note:
    The nth argument must be positive integer starting from 1.

    For example, let's say you have a `drinkEachTwo(drink, Array<flavor>)` function 
    that applies `f` to a bunch of flavors, and you want to ensure that when 
    you call it, the first flavor it operates on is `lemon` and the second one is 
    `octopus`. You can write:
*/

describe('drinkEachTwo', () => {
    function drinkEachTwo(fn, flavors) {
        flavors.forEach((flavor) => {
            fn(flavor);
        });
    }

    test('drinkEachTwo drinks lemon flavor first', () => {
        const drink = jest.fn();
        drinkEachTwo(drink, ['lemon', 'octopus']);
        expect(drink).toHaveBeenNthCalledWith(1, 'lemon');
    });

    test('drinkEachTwo drinks octopus flavor second', () => {
        const drink = jest.fn();
        drinkEachTwo(drink, ['lemon', 'octopus']);
        expect(drink).toHaveBeenNthCalledWith(2, 'octopus');
    });
});

/*
    .toHaveReturned()
    Also under the alias: .toReturn()

    If you have a mock function, you can use `.toHaveReturned` to test 
    that the mock function successfully returned (i.e., did not throw an error) 
    at least one time. 

    For example, let's say you have a mock `drinks` that returns `true`. 
    You can write:
*/

describe('drinks', () => {
    test('drinks returns', () => {
        const drinks = jest.fn(() => true);
        drinks();
        expect(drinks).toHaveReturned();
    });
});

/*
    .toHaveReturnedTimes(number)
    Also under the alias: .toReturnTimes(number)

    Use `.toHaveReturnedTimes` to ensure that a mock function returned 
    successfully (i.e., did not throw an error) an exact number of times.

    Any calls to the mock function that throw an error are not counted toward 
    the number of times the function returned.

    For example, let's say you have a mock `drinksTwo` function that returns `true`.
    You can write:
*/

describe('drinksTwo', () => {
    test('drinksTwo returns twice', () => {
        const drinksTwo = jest.fn(() => true);
        
        drinksTwo();
        drinksTwo();

        expect(drinksTwo).toHaveReturnedTimes(2);
    });
});

/*
    .toHaveReturnedWith(value)
    Also under the alias .toReturnWith(value)

    Use `.toHaveReturnedWith` to ensure that a mock function 
    returned a specific value.

    For example, let's say you have a mock `drinksThree` that 
    returns the name of the beverage that was consumed. You can 
    write:
*/

describe('drinksThree', () => {
    test('drinksThree returns La Croix', () => {
        const beverage = { name: 'La Croix' };
        const drinksThree = jest.fn((beverage) => beverage.name);
        
        drinksThree(beverage);
        
        expect(drinksThree).toHaveReturnedWith('La Croix');
    });
});

/*
    .toHaveLastReturnedWith(value)
    Also under the alias: .lastReturnedWith(value)

    Use `.toHaveLastReturnedWith` to test the specific value that a 
    mock function last returned. If the last call to the mock function threw 
    an error, then this matcher will fail no matter what value you provided as the 
    expected return value.

    For example, let's say you have a mock `drinksFour` that returns the 
    name of the beverage that was consumed. 

    You can write:
*/

describe('drinksFour', () => {
    test('drinksFour returns La Croix (Orange) last', () => {
        const beverage1 = { name: 'La Croix (Lemon)' };
        const beverage2 = { name: 'La Croix (Orange)' };
        const drinksFour = jest.fn((beverage) => beverage.name);

        drinksFour(beverage1);
        drinksFour(beverage2);

        expect(drinksFour).toHaveLastReturnedWith('La Croix (Orange)');
    });
});

/*
    .toHaveNthReturnedWith(nthCall, value)
    Also under the alias: .nthReturnedWith(nthCall, value)

    Use `.toHaveNthReturnedWith` to test the specific value that a mock 
    function returned for the nth call. If the nth call to the mock 
    function threw an error, then this matcher will fail no matter what 
    value you provided as the expected return value.

    Note:
    The nth argument must be positive integer starting from 1.

    For example, let's say you have a mock `drinksFive` function that 
    returns the name of the beverage that was consumed. You can 
    write:
*/

describe('drinksFive', () => {
    test('drinksFive returns expected nth calls', () => {
        const beverage1 = { name: 'La Croix (Lemon)' };
        const beverage2 = { name: 'La Croix (Orange)' };
        const drinksFive = jest.fn((beverage) => beverage.name);

        drinksFive(beverage1);
        drinksFive(beverage2);

        expect(drinksFive).toHaveNthReturnedWith(1, 'La Croix (Lemon)');
        expect(drinksFive).toHaveNthReturnedWith(2, 'La Croix (Orange)');
    });
});

/*
    .toHaveLength(number)

    Use .toHaveLength to check that an object has a `.length` property 
    and it is set to a certain numeric value.

    This is especially useful for checking arrays or string size.
*/

describe('.toHaveLength(number)', () => {
    test('test array size', () => {
        expect([1, 2, 3]).toHaveLength(3);
    });

    test('test string size', () => {
        expect('abc').toHaveLength(3);
    });

    test('test empty string size', () => {
        expect('').not.toHaveLength(5);
    });
});

/*
    .toHaveProperty(keyPath, value?)

    Use `.toHaveProperty` to check if property at provided reference `keyPath`
    exists for an object.

    For checking deeply nested properties in an object you may use dot notation
    or an array containing the `keyPath` for deep references.

    You can provide an optional `value` argument to compare the received property 
    value (recursively for all properties of object instances also known as deep 
    equaity, like the `.toEqual` matcher).

    The following example contains a `houseForSale` object with nested properties. 

    We are using `.toHaveProperty` to check for the existence and values of various 
    properties in the object.
*/

describe('.toHaveProperty(keyPath, value?)', () => {
    // Object containing house features to be tested
    const houseForSale = {
        bath: true,
        bedrooms: 4,
        kitchen: {
            amenities: ['oven', 'stove', 'washer'],
            area: 20,
            wallColor: 'white',
            'nice.oven': true
        },
        livingroom: {
            amenities: [
                {
                    couch: [
                        ['large', { dimensions: [20, 20] }],
                        ['small', { dimensions: [10, 10] }]
                    ]
                }
            ]
        },
        'ceiling.height': 2
    };

    test('this house has my desired features', () => {
        // Example referencing
        expect(houseForSale).toHaveProperty('bath');
        expect(houseForSale).toHaveProperty('bedrooms', 4);
        expect(houseForSale).not.toHaveProperty('pool');

        // Deep referencing using dot notation
        expect(houseForSale).toHaveProperty('kitchen.area', 20);
        expect(houseForSale).toHaveProperty('kitchen.amenities', ['oven', 'stove', 'washer']);
        expect(houseForSale).not.toHaveProperty('kitchen.open');


        // Deep referencing using an array containing the keyPath
        expect(houseForSale).toHaveProperty(['kitchen', 'area'], 20);
        expect(houseForSale).toHaveProperty(['kitchen', 'amenities'], ['oven', 'stove', 'washer']);
        expect(houseForSale).toHaveProperty(['kitchen', 'amenities', 0], 'oven');
        expect(houseForSale).toHaveProperty('livingroom.amenities[0].couch[0][1].dimensions[0]', 20);
        expect(houseForSale).toHaveProperty(['kitchen', 'nice.oven']);
        expect(houseForSale).not.toHaveProperty(['kitchen', 'open']);

        // Referencing keys with dot in the ket itself
        expect(houseForSale).toHaveProperty(['ceiling.height'], 2);
    });
});

/*
    .toBeCloseTo(number, numDigits?)

    Use `.toBeCloseTo` to compare floating point numbers for approximate 
    equality.

    The optional `numDigits` argument limits the number of digits to check after 
    the decimal point. For the default value 2, the test criterion is 
    `Math.abs(expected - received) < 0.005` (that is, `10 ** -2 / 2`).

    Intuitive equality comparisons often fail, because arithmetic on decimal 
    (base 10) values often have rounding errors in limited precision binary (base 2) 
    representation. 

    For example, this test fails:

        test('adding works sanely with decimals', () => {
            expect(0.2 + 0.1).toBe(0.3); // Fails!
        });

    It fails because in JavaScript, `0.2 + 0.1` is actually `0.30000000000000004`.

    For example, this test below passes with a precision of 5 digits.

    Because floating point errors are the problem that `.toBeCloseTo` solves,
    it does not support big integer values.
*/

describe('.toBeCloseTo(number, numDigits?)', () => {
    test('adding works sanely with decimals', () => {
        expect(0.2 + 0.1).toBeCloseTo(0.3, 5);
    });
});

/*
    .toBeDefined()

    Use `.toBeDefined` to check that a variable is not undefined. 

    Note:
    In the example below, you could write `expect(fetchNewFlavorIdea()).not.toBe(undefined)`,
    but it's better practice to avoid referring to `undefined` directly in your code.

    For example, if you want to check that a function `fetchNewFlavorIdea()` returns 
    something, you can write:
*/

describe('.toBeDefined()',  () => {
    const fetchNewFlavorIdea = () => "New flavor!";

    test('there is a new flavor idea',  () => {
        expect(fetchNewFlavorIdea()).toBeDefined();
    });
});

/*
    .toBeFalsy()

    Use `.toBeFalsy` when you don't care what a value is and you want 
    to ensure a value is false in a boolean context. 

    For example, let's say you have some application code that looks like:

        drinkSomeLaCroix();

        if (!getErrors()) {
            drinkMoreLaCroix();
        }

    You may not care what `getErrors` returns, specifically - it might return 
    `false`, `null`, or 0, and your code would still work. 

    Note:
    In JavaScript, there are six falsy values: false, 0, '', null, undefined, and NaN.
    Everything else is truthy.

    So if you want to test there are no errors after drinking some La Croix, 
    you could write:
*/

describe('.toBeFalsy()', () => {
    const drinkSomeLaCroix = jest.fn();
    const getErrors = () => false;

    test('drinking La Croix does not lead to errors',  () => {
        drinkSomeLaCroix();
        expect(getErrors()).toBeFalsy();
    });
});

/*
    .toBeGreaterThan(number | bigint)

    Use `.toBeGreaterThan` to compare `received > expected` for number or big 
    integer values.  

    For example, test that `ouncesPerCan()` returns a value of more than 
    10 ounces:
*/

describe('.toBeGreaterThan(number | bigint)', () => {
    const ouncesPerCan = jest.fn(() => 11);

    test('ounces per can is more than 10', () => {
        expect(ouncesPerCan()).toBeGreaterThan(10);
    });
});

/*
    .toBeGreaterThanOrEqual(number | bigint)

    Use `.toBeGreaterThanOrEqual` to compare `received >= expected` for 
    number of big integer values. 

    For example, test that `ouncesPerCan()` returns a value of at least 12 ounces:
*/

describe('.toBeGreaterThanOrEqual(number | bigint)', () => {
    const ouncesPerCan = jest.fn(() => 12);

    test('ounces per can is at least 12', () => {
        expect(ouncesPerCan()).toBeGreaterThanOrEqual(12);
    });
});

/*
    .toBeLessThan(number | bigint)

    Use `.toBeLessThan` to compare `received < expected` for number or
    big integer values. 

    For example, test that ouncesPerCan() returns a value of less than 20 ounces:
*/

describe('.toBeLessThan(number | bigint)', () => {
    const ouncesPerCan = jest.fn(() => 19);

    test('ounces per can is less than 20',  () => {
        expect(ouncesPerCan()).toBeLessThan(20);
    });
});

/*
    .toBeLessThanOrEqual(number | bigint)

    Use `.toBeLessThanOrEqual` to compare `received <= expected` for number 
    or big integer values. 

    For example, test that ouncesPerCan() returns a value of at most 12 ounces:
*/

describe('.toBeLessThanOrEqual(number | bigint)', () => {
    const ouncesPerCan = jest.fn(() => 12);

    test('ounces per can is at most 12',  () => {
        expect(ouncesPerCan()).toBeLessThanOrEqual(12);
    });
});

/*
    .toBeInstanceOf(Class)

    Use `.toBeInstanceOf(Class)` to check that an object is an instance 
    of a class. 

    This matcher uses `instanceof` underneath.
*/

describe('.toBeInstanceOf(Class)', () => {
    class A {}

    test('checking for instance of A class', () => {
        expect(new A()).toBeInstanceOf(A);
    });

    test('check for instance of Function class', () => {
        expect(() => {}).toBeInstanceOf(Function);
    });

    test('instanceof A is not instanceof Function', () => {
        expect(new A()).not.toBeInstanceOf(Function);
    });
});