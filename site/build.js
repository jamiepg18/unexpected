var metalSmith = require('metalsmith');

function idToName(id) {
    return id.replace(/-/g, ' ');
}

metalSmith(__dirname)
    .destination('../site-build')
    .source('src')
    .use(require('metalsmith-collections')({
        assertions: {
            pattern: 'assertions/*/*.md'
        },
        apiPages: {
            pattern: 'api/*.md'
        },
        pages: {
            pattern: '*.md'
        }
    }))
    .use(require('./lib/include-static-assets')({ path: require('path').resolve(__dirname, 'static') }))
    // Dynamicly generate metadata for assertion files
    .use(function (files, metalsmith, next) {
        Object.keys(files).filter(function (file) {
            return /\.md$/.test(file);
        }).forEach(function (file) {
            var id = file.match(/([^\/]+)\.md$/)[1];
            var name = idToName(id);

            if (!files[file].title) {
                files[file].title = name;
            }

            if (files[file].collection.indexOf('apiPages') !== -1) {
                files[file].template = 'api.ejs';
            } else if (files[file].collection.indexOf('assertions') !== -1) {
                var type = file.match(/^assertions\/([^\/]+)/)[1];

                files[file].template = 'assertion.ejs';
                files[file].windowTitle = type + ' - ' + name;
                files[file].type = type;
            }

            if (!files[file].windowTitle) {
                files[file].windowTitle = files[file].title;
            }

            files[file].url = '/' + file.replace(/\.md$/, '/');
        });
        next();
    })
    .use(function (files, metalsmith, next) {
        var metadata = metalsmith.metadata();

        var assertionsByType = {};
        metadata.collections.assertions.forEach(function (assertion) {
            assertionsByType[assertion.type] = assertionsByType[assertion.type] || [];
            assertionsByType[assertion.type].push(assertion);
        });
        Object.keys(assertionsByType).forEach(function (type) {
            assertionsByType[type].sort(function (a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
        });
        metadata.assertionsByType = assertionsByType;
        next();
    })
    .use(function (files, metalsmith, next) {
        var metadata = metalsmith.metadata();
        var indexData = [];

        metadata.collections.apiPages.forEach(function (assertion) {
            indexData.push({
                label: assertion.title + ' (api)',
                url: assertion.url
            });
        });

        metadata.collections.assertions.forEach(function (assertion) {
            indexData.push({
                label: assertion.title + ' (' + assertion.type + ')',
                url: assertion.url
            });
        });
        files['searchIndex.json'] = { contents: JSON.stringify(indexData, null, 2) };
        next();
    })
    .use(require('./metalsmith-unexpected-markdown')())
    // permalinks with no options will just make pretty urls...
    .use(require('metalsmith-permalinks')({ relative: false }))
    .use(require('metalsmith-relative')())
    .use(function (files, metalsmith, next) {
        // Useful for debugging ;-)
        // require('uninspected').log(files);
        next();
    })
    .use(require('metalsmith-less')())
    .use(require('metalsmith-templates')('ejs'))
    .use(require('metalsmith-autoprefixer')({ browsers: 'last 2 versions', cascade: false }))
    .use(require('./lib/delete-less-files')())
    .build(function (err) {
        if (err) { throw err; }
        console.log('wrote site to site-build');
    });