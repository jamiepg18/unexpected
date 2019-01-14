/* global expect */
describe('installTheme', () => {
  var clonedExpect;
  beforeEach(() => {
    clonedExpect = expect.clone();
  });

  it('is chainable (returns the expect function, not the magicpen instance)', () => {
    clonedExpect.installTheme('html', { comment: 'gray' })(
      'bar',
      'to equal',
      'bar'
    );
  });
});
