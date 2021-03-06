Apply a function to the subject array (or array-like object), then delegate the return value to another assertion.

```js
function add(a, b) {
  return a + b;
}

expect([1, 2], 'when passed as parameters to', add, 'to equal', 3);
```

In case of a failing expectation you get the following output:

```js
expect([1, 2], 'when passed as parameters to', add, 'to equal', 9);
```

```output
expected [ 1, 2 ]
when passed as parameters to function add(a, b) { return a + b; } to equal 9
  expected 3 to equal 9
```

To call an node-style async function, use the `async` flag to automatically
add a callback to the parameter list and do further assertions on the value it
passes to the callback.

<!-- unexpected-markdown async:true -->

```js
function delayedAdd(a, b, cb) {
  setTimeout(function() {
    cb(null, a + b);
  }, 1);
}

return expect(
  [1, 2],
  'when passed as parameters to async',
  delayedAdd,
  'to equal',
  3
);
```

The assertion will fail if the async function passes an error to the callback.

You can also use the `constructor` flag to create an instance of a constructor
function (using the `new` operator):

```js
function Foo(value) {
  this.value = value;
}

expect([123], 'when passed as parameters to constructor', Foo, 'to be a', Foo);
```

If you don't provide an assertion to delegate to, the return value will be provided
as the fulfillment value of the promise:

<!-- unexpected-markdown async:true -->

```js
return expect([1, 3], 'passed as parameters to', add).then(function(result) {
  expect(result, 'to equal', 4);
});
```
