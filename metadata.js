(function() {

	var METADATA = {
		CORE: {
			path: 'node_modules/monaco-editor-core/min/vs',
			srcPath: '/vscode/out/vs'
		},
		PLUGINS: [{
			contrib: 'vs/language/typescript/src/monaco.contribution',
			modulePrefix: 'vs/language/typescript',
			path: 'node_modules/monaco-typescript/release',
			srcPath: '/monaco-typescript/out'
		}]
	}

	if (typeof exports !== 'undefined') {
		exports.METADATA = METADATA
	} else {
		self.METADATA = METADATA;
	}
})();