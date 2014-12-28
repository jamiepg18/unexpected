var expect = require('../');

describe('assertions/any/to-equal.md', function () {
    it('#1', function () {
        expect(function () {
            expect({ a: 'b' }, 'to equal', { a: 'b' });
            expect(1, 'not to equal', '1');
            expect({ one: 1 }, 'not to equal', { one: '1' });
            expect(null, 'not to equal', '1');
            var now = new Date();
            expect(now, 'to equal', now);
            expect(now, 'to equal', new Date(now.getTime()));
            expect({ now: now }, 'to equal', { now: now });
        }, 'not to throw');
    });
    it('#2', function () {
        expect(function () {
                        expect({ a: { b: 'c'} }, 'to equal', { a: { b: 'd'} });
        }, 'to throw', [
            'expected { a: { b: \'c\' } } to equal { a: { b: \'d\' } }',
            '',
            '{',
            '  a: {',
            '    b: \'c\' // should be \'d\'',
            '           // -c',
            '           // +d',
            '  }',
            '}'
        ].join('\n'));
    });
});