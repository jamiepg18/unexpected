var fs = require('fs');
var Path = require('path');

module.exports = function buildDocumentationTests(files, metalsmith, next) {
    // Find assertions files and file names.
    var assertions = Object.keys(files).filter(function (file) {
        return /^assertions\//.test(file) ? file : false;
    }).map(function (file) {
        var obj = {};
        obj.content = files[file].contents.toString();
        obj.filename = file;
        return obj;
    });

    var tests = assertions.map(function (assertion) {
        return {
        	filename: assertion.filename,
        	// find test subjects in the file content
        	tests: (assertion.content.match(/(?:<!-- ?evaluate ?-->)[\s\S]*?<!-- ?\/evaluate ?-->/gm) || []).map(function (match) {
	            var cleaned = match.replace(/^<!-- ?\/?evaluate ?-->/gm, '')
	                               .replace(/^[\n]+|[\n]+$/g, '');

	            return (cleaned.match(/```[\s\S]*?```/gm) || []).map(function (part) {
            		var result = {};
            		result.type = part.match(/^```[a-z]+/);
            		
            		if (result.type) {
            			result.type = result.type[0].substr(3);
            		}

            		result.content = part.replace(/^```.*[\n]/m, '')
            							 .replace(/\n```$/m, '');

            		return result;
	            });
	        })
        }
    });

    tests = tests.filter(function (test) {
    	return test.tests.length > 0;
    });

    tests = tests.map(function (test) {
    	var result = ["describe('" + test.filename + "', function () {"];

    	var n = 0;
    	test.tests.forEach(function (tests) {
    		n += 1;
    		result.push("    it('#" + n + "', function () {");

    		if (tests.length === 1) {
    			var testContent;

    			if (tests[0].type === 'javascript') {
    				testContent = tests[0].content.split('\n');
    				testContent = testContent.filter(function (line) { return line.length > 0; });
    				testContent = '            ' + testContent.join('\n            ');
    			} else {
    				throw new Error('Invalid test case');
    			}

    			result.push("        expect(function () {");
    			result.push(testContent);
    			result.push("        }, 'not to throw');");
    		} else if (tests.length === 2) {
       			var testSubject;
       			var testValue;

    			if (tests[0].type === 'javascript') {
    				testSubject = tests[0].content.split('\n');
    				testSubject = testSubject.filter(function (line) { return line.length > 0; });
    				testSubject = '            ' + testSubject.join('\n            ');
    			} else {
    				throw new Error('Invalid test case');
    			}

				if (!tests[1].type) {
    				testValue = tests[1].content.split('\n');
    				testValue = testValue.map(function (line) {
    					return "            '" + line.replace(/'/g, "\\'") + "'";
    				});
    				testValue = testValue.join(',\n');
    			} else {
    				throw new Error('Invalid test case');
    			}

    			result.push("        expect(function () {");
    			result.push("            " + testSubject);
    			result.push("        }, 'to throw', [");
    			result.push(testValue);
    			result.push("        ].join('\\n'));");
    		} else {
    			throw new Error('Invalid test case');
    		}

    		result.push("    });")
    	});

    	result.push('});');

    	return result.join('\n');
    }).join('\n');

	tests = "var expect = require('../');\n\n" + tests;

    fs.writeFile(Path.resolve(__dirname, '..', 'test', 'documentation.spec.js'), tests, next);
};
