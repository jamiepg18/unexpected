/* global expectWithUnexpectedMagicPen */
describe('stringDiff', () => {
  var expect = expectWithUnexpectedMagicPen;

  var actual = 'abc\ndef\nghi\njkl\nmno';
  var expected = 'ghi\njkl\nmno\npqr\nstu\nvwx';

  describe('in text mode', () => {
    it('outputs leading + and - in text mode', () => {
      var pen = expect.createOutput('text').stringDiff(actual, expected);
      expect(
        pen.toString(),
        'to equal',
        '-abc\n' +
          '-def\n' +
          ' ghi\n' +
          ' jkl\n' +
          '...\n' +
          '-mno\n' +
          '+mno\n' +
          '+pqr\n' +
          '+stu\n' +
          '+vwx'
      );

      expect(
        pen,
        'to equal',
        expect
          .createOutput('text')
          .raw('-')
          .diffRemovedLine('abc')
          .nl()
          .raw('-')
          .diffRemovedLine('def')
          .nl()
          .raw(' ')
          .text('ghi')
          .nl()
          .raw(' ')
          .text('jkl')
          .nl()
          .jsComment('...')
          .nl()
          .raw('-')
          .diffRemovedLine('mno')
          .nl()
          .raw('+')
          .diffAddedLine('mno')
          .nl()
          .raw('+')
          .diffAddedHighlight('pqr')
          .nl()
          .raw('+')
          .diffAddedHighlight('stu')
          .nl()
          .raw('+')
          .diffAddedHighlight('vwx')
      );
    });

    it('should support a string ending with a newline', () => {
      expect(
        expect.createOutput('text').stringDiff('foo\n', 'foo'),
        'to equal',
        expect
          .createOutput('text')
          .raw('-')
          .diffRemovedHighlight('foo')
          .diffRemovedLine('\\n')
          .nl()
          .raw('+')
          .diffAddedHighlight('foo')
      );
    });

    it('should show an empty removed line', () => {
      expect(
        expect.createOutput('text').stringDiff('foo\n\nbar', 'foo\nbar'),
        'to equal',
        expect
          .createOutput('text')
          .raw(' ')
          .text('foo')
          .nl()
          .raw('-')
          .nl()
          .raw(' ')
          .text('bar')
      );
    });
  });

  describe('in ansi mode', () => {
    it('does not output leading + and -', () => {
      expect(
        expect.createOutput('ansi').stringDiff(actual, expected),
        'to equal',
        expect
          .createOutput('ansi')
          .diffRemovedLine('abc')
          .nl()
          .diffRemovedLine('def')
          .nl()
          .text('ghi')
          .nl()
          .text('jkl')
          .nl()
          .jsComment('...')
          .nl()
          .diffRemovedHighlight('mno')
          .nl()
          .diffAddedHighlight('mno')
          .nl()
          .diffAddedHighlight('pqr')
          .nl()
          .diffAddedHighlight('stu')
          .nl()
          .diffAddedHighlight('vwx')
      );
    });

    it('renders escaped newlines when a line has been removed', () => {
      expect(
        expect.createOutput('ansi').stringDiff('\n', ''),
        'to equal',
        expect
          .createOutput('ansi')
          .diffRemovedSpecialChar('\\n')
          .nl()
      );
    });

    it('renders escaped newlines when a line has been added', () => {
      expect(
        expect.createOutput('ansi').stringDiff('', '\n'),
        'to equal',
        expect
          .createOutput('ansi')
          .diffAddedSpecialChar('\\n')
          .nl()
      );
    });

    it('highlights trailing whitespace in an added line', () => {
      expect(
        expect.createOutput('ansi').stringDiff('  \n', ''),
        'to equal',
        expect
          .createOutput('ansi')
          .diffRemovedHighlight('  ')
          .diffRemovedSpecialChar('\\n')
          .nl()
      );
    });

    it('highlights trailing whitespace in a removed line', () => {
      expect(
        expect.createOutput('ansi').stringDiff('', '  \n'),
        'to equal',
        expect
          .createOutput('ansi')
          .diffAddedHighlight('  ')
          .diffAddedSpecialChar('\\n')
          .nl()
      );
    });

    it('does not highlight trailing whitespace in an unchanged line', () => {
      expect(
        expect.createOutput('ansi').stringDiff('foo  \nbar', 'foo  \nquux'),
        'to equal',
        expect
          .createOutput('ansi')
          .text('foo  ')
          .nl()
          .diffRemovedHighlight('bar')
          .nl()
          .diffAddedHighlight('quux')
      );
    });

    it('should escape an added newline immediately following a replaced chunk', () => {
      expect(
        expect.createOutput('ansi').stringDiff('aa );', '\n);'),
        'to equal',
        expect
          .createOutput('ansi')
          .diffRemovedHighlight('aa );')
          .nl()
          .diffAddedSpecialChar('\\n')
          .nl() // FIXME: should not be rendered
          .nl() // FIXME: should not be rendered
          .diffAddedHighlight(');')
      );
    });

    it('should support a string ending with a newline', () => {
      expect(
        expect.createOutput('ansi').stringDiff('foo\n', 'foo'),
        'to equal',
        expect
          .createOutput('ansi')
          .diffRemovedHighlight('foo')
          .diffRemovedSpecialChar('\\n')
          .nl()
          .diffAddedHighlight('foo')
      );
    });

    it('should support rendering regular expressions', () => {
      expect(
        expect.createOutput('ansi').stringDiff(String(/foq/i), String(/fob/i)),
        'to equal',
        expect
          .createOutput('ansi')
          .diffRemovedHighlight('/foq/i')
          .nl()
          .diffAddedHighlight('/fob/i')
      );
    });
  });

  describe('stringDiffFragment', () => {
    // This case is not directly exercised by the stringDiff style as special chars
    // are not marked up in unchanged chunks:
    it('should render a special char in an unchanged string', () => {
      expect(
        expect
          .createOutput('text')
          .stringDiffFragment(' ', '\ufffd', 'text', true),
        'to equal',
        expect
          .createOutput('text')
          .raw(' ')
          .text('\ufffd')
      );
    });
  });
});
