# Monaco Editor

The Monaco Editor is the code editor that powers [VS Code](https://github.com/Microsoft/vscode), a good page describing the code editor's features is [here](https://code.visualstudio.com/docs/editor/editingevolved).

![image](https://cloud.githubusercontent.com/assets/5047891/15751937/4267b918-28ec-11e6-9fbd-d6cd2973c770.png)

## Issues

This repository contains only the scripts to glue things together, please create issues against the actual repositories where the source code lives:
 * [monaco-editor-core](https://www.npmjs.com/package/monaco-editor-core) - [Issues](https://github.com/Microsoft/vscode)
 * [monaco-typescript](https://www.npmjs.com/package/monaco-typescript) - [Issues](https://github.com/alexandrudima/monaco-typescript)

## Known issues
In IE, the editor must be completely surrounded in the body element, otherwise the hit testing we do for mouse operations does not work. You can inspect this using F12 and clicking on the body element and confirm that visually it surrounds the editor.

## Installing

```
npm install monaco-editor
```

You will get:
* inside `dev`: bundled, not minified
* inside `min`: bundled, and minified
* inside `min-maps`: source maps for `min`
* `monaco.d.ts`: this specifies the API of the editor (this is what is actually versioned, everything else is considered private and might break with any release).

It is recommended to develop against the `dev` version, and in production to use the `min` version.

## Integrate

Here is the most basic HTML page that embeds the editor. More samples are available at [monaco-editor-samples](https://github.com/alexandrudima/monaco-editor-samples).

```html
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
</head>
<body>

<div id="container" style="width:800px;height:600px;border:1px solid grey"></div>

<script src="monaco-editor/min/vs/loader.js"></script>
<script>
	require.config({ paths: { 'vs': 'monaco-editor/min/vs' }});
	require(['vs/editor/editor.main'], function() {
		var editor = monaco.editor.create(document.getElementById('container'), {
			value: [
				'function x() {',
				'\tconsole.log("Hello world!");',
				'}'
			].join('\n'),
			language: 'javascript'
		});
	});
</script>
</body>
</html>
```

## Integrate cross domain

If you are hosting your `.js` on a different domain (e.g. on a CDN) than the HTML, you should know that the Monaco Editor creates web workers for smart language features. Cross-domain web workers are not allowed, but here is how you can proxy their loading and get them to work:

```html
<!--
	Assuming the HTML lives on www.mydomain.com and that the editor is hosted on www.mycdn.com
-->
<script type="text/javascript" src="http://www.mycdn.com/monaco-editor/vs/loader.js"></script>
<script>
	require.config({ paths: { 'vs': 'http://www.mycdn.com/monaco-editor/min/vs' }});

	// Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
	// the default worker url location (used when creating WebWorkers). The problem here is that
	// HTML5 does not allow cross-domain web workers, so we need to proxy the instantion of
	// a web worker through a same-domain script
	window.MonacoEnvironment = {
		getWorkerUrl: function(workerId, label) {
			return 'monaco-editor-worker-loader-proxy.js';
		}
	};

	require(["vs/editor/editor.main"], function () {
		// ...
	});
</script>

<!--
	Create http://www.mydomain.com/monaco-editor-worker-loader-proxy.js with the following content:
		self.MonacoEnvironment = {
			baseUrl: 'http://www.mycdn.com/monaco-editor/'
		};
		importScripts('www.mycdn.com/monaco-editor/vs/base/worker/workerMain.js');
	That's it. You're good to go! :)
-->
```

## License
MIT