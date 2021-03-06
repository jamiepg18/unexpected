Asserts that a value matches a given specification.

All properties and nested objects mentioned in the right-hand side object are
required to be present. Primitive values are compared with `to equal` semantics:

```js
expect({ hey: { there: true } }, 'to satisfy', { hey: {} });
```

To disallow additional properties in the subject, use `to exhaustively satisfy`:

```js
expect({ hey: { there: true } }, 'to exhaustively satisfy', {
  hey: { there: true }
});
```

Regular expressions and functions in the right-hand side object will be run
against the corresponding values in the subject:

```js
expect({ bar: 'quux', baz: true }, 'to satisfy', { bar: /QU*X/i });
```

Arrays in the right-hand side will require all the items to be present:

```js
expect([0, 1, 2], 'to satisfy', [0, 1]);
```

```output
expected [ 0, 1, 2 ] to satisfy [ 0, 1 ]

[
  0,
  1,
  2 // should be removed
]
```

If you want to make assertions about the individual indexes in an array, you can
do it the following way:

```js
expect([0, 1, 2, 3], 'to satisfy', { 1: 2, 2: 1 });
```

```output
expected [ 0, 1, 2, 3 ] to satisfy { 1: 2, 2: 1 }

[
  0,
  1, // should equal 2
  2, // should equal 1
  3
]
```

`to satisfy` can be combined with `expect.it` or functions to create complex
specifications that delegate to existing assertions:

```js
expect({ foo: 123, bar: 'bar', baz: 'bogus', qux: 42 }, 'to satisfy', {
  foo: expect.it('to be a number').and('to be greater than', 10),
  baz: expect.it('not to match', /^boh/),
  qux: expect
    .it('to be a string')
    .and('not to be empty')
    .or('to be a number')
    .and('to be positive')
});
```

In case of a failing expectation you get the following output:

```js
expect({ foo: 9, bar: 'bar', baz: 'bogus', qux: 42 }, 'to satisfy', {
  foo: expect.it('to be a number').and('to be greater than', 10),
  baz: expect.it('not to match', /^bog/),
  qux: expect
    .it('to be a string')
    .and('not to be empty')
    .or('to be a number')
    .and('to be positive')
});
```

```output
expected { foo: 9, bar: 'bar', baz: 'bogus', qux: 42 } to satisfy
{
  foo: expect.it('to be a number')
               .and('to be greater than', 10),
  baz: expect.it('not to match', /^bog/),
  qux: expect.it('to be a string')
               .and('not to be empty')
             .or('to be a number')
               .and('to be positive')
}

{
  foo: 9, // ✓ should be a number and
          // ⨯ should be greater than 10
  bar: 'bar',
  baz: 'bogus', // should not match /^bog/
                //
                // bogus
                // ^^^
  qux: 42
}
```
