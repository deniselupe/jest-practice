const { default: expect } = require("expect");

// Use .toBe to test exact equality
test('object assignment', () => {
    const data = {one: 1};
    data['two'] = 2;
    expect(data).toEqual({one: 1, two: 2});
});

// If you want to check the value of an object {} , use toEqual or toStrictEqual instead.
// .toEqual simply ignores undefined values, so use .toStrictEqual because it takes them into account
// .toEqual and .toStrictEqual recursively checks every field of an object or array
test('object assignment toStrictEqual', () => {
    const data = {one: 1, three: undefined};
    data['two'] = 2;
    expect(data).toStrictEqual({one: 1, three: undefined, two: 2});
});

// You can also test for the opposite of a matcher using 'not'
test('adding positive numbers is not zero', () => {
    for (let a = 1; a < 10; a++) {
        for (let b = 1; b < 10; b++) {
            expect(a + b).not.toBe(0);
        }
    }
});

/*
    In tests, you sometimes need to distinguish between undefined, null, and false,
    but sometimes you do not want to treat these differently.

    Jest contains helpers tht let you be explicit about what you want:
    - toBeNull matches only null
    - toBeUndefined matches only undefined
    - toBeDefined matches the opposite of toBeUndefined
    - toBeTruthy matches anything that an if statement treats as true
    - toBeFalsy matches anything that an if statement treats as false
*/
test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
});

test('zero', () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
});

// Numbers: Most ways of comparing numbers have matcher equivalents
test('two plus two', () => {
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);
    expect(value).toBeGreaterThanOrEqual(3.5);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);

    // toBe and toEqual are equivalent for numbers
    expect(value).toBe(4);
    expect(value).toEqual(4);
});

// Floats: for floating point equality use toBeCloseTo instead of toEqual, because you dont want a test to depend on a tiny rounding error
test('adding floating point numbers', () => {
    const value = 0.1 + 0.2;
    // expect(value).toBe(0.3) This wont work because of rounding error
    expect(value).toBeCloseTo(0.3); // This works
});


// Strings: You can check strings against regular expressions with toMatch
test('there is no I in team', () => {
    expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
    expect('Christoph').toMatch(/stop/);
});

// Arras and Iterables: You can check if an array or iterable contains a particular item using toContain
const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'milk'
];

test('the shopping list has milk on it', () => {
    expect(shoppingList).toContain('milk');
    expect(new Set(shoppingList)).toContain('milk');
});

// Exceptions: If you want to test whether a particular function throws an error when it's called, use toThrow
const compileAndroidCode = () => {
    throw new Error('you are using the wrong JDK!');
};

test('compiling android goes as expected', () => {
    // Curried Function
    const returnedFunction = () => () => compileAndroidCode();
    expect(returnedFunction()).toThrow();
    expect(returnedFunction()).toThrow(Error);
    
    // You can also use a string that must be contained in the error message or a regexp
    expect(returnedFunction()).toThrow('you are using the wrong JDK');
    expect(returnedFunction()).toThrow(/JDK/);

    // Or you can match an exact error message using a regexp like below
    // expect(returnedFunction()).toThrow(/^you are using the wrong JDK$/); // Test fails
    expect(returnedFunction()).toThrow(/^you are using the wrong JDK!$/); // Test passes
});