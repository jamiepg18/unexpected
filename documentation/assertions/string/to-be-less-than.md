Asserts that a string is less than another string using the `<`
operator.

```js
expect('a', 'to be less than', 'b');
expect('a', 'to be below', 'b');
```

In case of a failing expectation you get the following output:

```js
expect('a', 'to be less than', 'a');
```

```output
expected 'a' to be less than 'a'
```

This assertion can be negated using the `not` flag:

```js
expect('a', 'not to be less than', 'a');
expect('a', 'not to be below', 'a');
```

In case of a failing expectation you get the following output:

```js
expect('a', 'not to be below', 'b');
```

```output
expected 'a' not to be below 'b'
```
