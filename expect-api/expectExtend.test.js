/*
    expect.extend(matchers): You can use expect.extend to add your own matchers to Jest

    Example: Let's say that you're testing a number utility library and you're frequently
    asserting that numbers appear within particular ranges of other numbers. You could abstract
    that into a toBeWithinRange matcher
*/

function toBeWithinRange(actual, floor, ceiling) {
    if (
        typeof actual !== 'number' ||
        typeof floor !== 'number' ||
        typeof ceiling !== 'number'
    ) {
        throw new Error('Parameters must be of type number!');
    }

    const pass = actual >= floor && actual <= ceiling;

    if (pass) {
        return {
            message: () => `expected ${this.utils.printReceived(actual)} not to be within range ${this.utils.printExpected(`${floor} - ${ceiling}`)}`,
            pass: true
        };
    } else {
        return {
            message: () => `expected ${this.utils.printReceived(actual)} to be within range ${this.utils.printExpected(`${floor} - ${ceiling}`)}`,
            pass: false
        };
    }
}

expect.extend({toBeWithinRange,});

// Now, you will be using your newly created matcher to test whether numbers are within specified range or not
test('is within range', () => {
    expect(100).toBeWithinRange(90, 110);
});

test('is NOT within range', () => {
    expect(101).not.toBeWithinRange(0, 100);
});

// You can test the values of each key inside a object literal
test('asymmetric ranges', () => {
    expect({apples: 6, bananas: 3}).toStrictEqual({
        apples: expect.toBeWithinRange(1, 10),
        bananas: expect.not.toBeWithinRange(11, 20)
    });
});

// --------------------------------------------------------------------------

/*
    Async Matchers:
    expect.extend also supports async matchers. Async matchers return a Promise so you will need to 
    await the returned value. 

    Example:
    Let's use an example matcher to illustrate the usage of them. We are going to implement a matcher 
    called toBeDivisibleByExternalValue, where the divisible number is going to be pulled from an 
    external source.

    Code:
    expect.extend({
        async toBeDivisibleByExternalValue(received) {
            const externalValue = await getExternalValueFromRemoteSource();
            const pass = received % externalValue == 0;

            if (pass) {
                return {
                    message: () => `expected ${received} not to be divisible by ${externalValue}`,
                    pass: true
                };
            } else {
                return {
                    message: () => `expected ${received} to be divisible by ${externalValue}`,
                    pass: false
                };
            }
        }
    });

    test('is divisible by external value', async () => {
        await expect(100).toBeDivisibleByExternalValue();
        await expect(101).not.toBeDivisibleByExternalValue();
    });
*/

// --------------------------------------------------------------------------

/*
    Customer Matcher API:
    Matches should return an object (or a Promise of an object) with two keys.
    'pass' indicates whether there was a match or not, and 'message' provides a 
    function with no arguments that returns an error message in case of a failure. 

    -----

    When 'pass' is false:
    'message' should return the error message for when expect(x).yourMatcher() fails.

    When 'pass' is true:
    'message' should return the error message for when expect(x).not.yourMatcher() fails.

    -----

    Matchers are called with the argument passed to expect(x) followed by the arguments 
    passed to .yourMatcher(y, z):
    expect.extend({
        yourMatcher(x, y, z) {
            return {
                pass: true,
                message: () => ``
            };
        }
    });

    -----

    These helper functions and properties can be found on 'this' inside a customer matcher:
    - this.isNot
    - this.promise
    - this.equals(a, b)
    - this.expand
    - this.utils

    this.isNot:
    A boolean to let you know this matcher was called with the negated '.not' modifier 
    allowing you to display a clear and correct matcher hint

    this.promise:
    A string allowing you to display a clear and correct matcher hint:
        - rejects: if matcher was called with the promise '.rejects' modifier
        - resolves: if matcher was called with the promise '.resolves' modifier
        - '': if matcher was not called with a promise modifier

    this.equals(a, b):
    This is a deep-equality function that will return true if two objects have the same 
    values (recursively)

    this.expand:
    A boolean to let you know this matcher was called with an expand option. When Jest is called 
    with the '--expand' flag, 'this.expand' can be used to determine if Jest is expected to show 
    full diffs and errors.

    this.utils:
    There are a number of helpful tools exposed on this.utils, primarily consisting of the 
    exports from 'jest-matcher-utils'. The most useful ones are 'matcherHint', 'printExpected', 
    and 'printReceived' to format the error messages nicely. For example, take a look at the 
    implementation for the toBe matcher:

    const diff = require('jest-diff');

    expect.extend({
        toBe(received, expected) {
            const options = {
                comment: 'Object.is.equality',
                isNot: this.isNot,
                promise: this.promise
            };

            const pass = Object.is(received, expected);

            const message = pass 
                ?
                () => 
                    this.utils.matcherHint('toBe', undefined, undefined, options) + 
                    '\n\n' +
                    `Expected: not ${this.utils.printExpected(expected)} \n` +
                    `Received: ${this.utils.printReceived(received)}`
                :
                () => {
                    const diffString = diff(expected, received, {expand: this.expand});
                    
                    return (
                        this.utils.matcherHint('toBe', undefined, undefined, options) +
                        '\n\n' +
                        (diffString && diffString.includes('- Expect')
                            ? `Difference: \n\n${diffString}`
                            : `Expected: ${this.utils.printExpected(expected)} \n Received: ${this.utils.printReceived(received)}`)
                    );
                };
            
            return {actual: received, message, pass};
        }
    });

    This will print something like:
    expect(received).toBe(expected)

    Expected value to be (using Object.is):
        "banana"
    Received:
        "apple"

    -----

    
*/