module.exports = {
	root: true,
	env: {
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
	},
	plugins: [
		'n8n-nodes-base',
		'@typescript-eslint',
	],
	extends: [
		'plugin:n8n-nodes-base/nodes',
		'plugin:n8n-nodes-base/credentials',
		'plugin:n8n-nodes-base/community',
	],
	rules: {
		// Możesz tutaj dodać własne reguły lub nadpisać istniejące
	},
	ignorePatterns: [
		'.eslintrc.js',
		'dist/**/*',
		'node_modules/**/*',
	],
};
