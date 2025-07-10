install:
	npm ci
publish:
	npm publish --dry-run
test:
	npx vitest run
lint:
	npx eslint .
