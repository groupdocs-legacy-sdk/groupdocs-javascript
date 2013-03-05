test-unit:
	@./node_modules/.bin/mocha -u tdd --recursive test/unit

test-integration:
	@./node_modules/.bin/mocha -u tdd --recursive test/integration

dist: 
	@./node_modules/.bin/browserify src/index.js -i xmlhttprequest -o dist/groupdocs-javascript.js

dist-min: 
	@./node_modules/.bin/browserify src/index.js -i xmlhttprequest -o dist/groupdocs-javascript.js 
	uglifyjs dist/groupdocs-javascript.js -c -m -v -o dist/groupdocs-javascript-min.js

browser-compat: 
	@./node_modules/.bin/browserify test/integration/test.browser-compat.js -i xmlhttprequest -o test/browser/assets/browser-compat.js
	sensible-browser test/browser/browser-compat.html

update:
	npm install
	mkdir -p test/browser/assets
	cp node_modules/mocha/mocha.js test/browser/assets/
	cp node_modules/mocha/mocha.css test/browser/assets/
	
	
.PHONY: test-unit test-integration dist dist-min