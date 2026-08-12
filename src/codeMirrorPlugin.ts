import { ViewPlugin, EditorView } from '@codemirror/view';

export default (context: { contentScriptId: string; postMessage: any }) => {
	return {
		plugin: async (codeMirrorWrapper: any) => {
			const navigationPlugin = ViewPlugin.fromClass(class {
				constructor(view: EditorView) {
					const mousedownHandler = (event: MouseEvent) => {
						if (event.button === 3 || event.button === 4) {
							event.preventDefault();
							event.stopPropagation();
							event.stopImmediatePropagation();
							
							if (event.button === 3) {
								context.postMessage({ type: 'navigateBack' });
							} else if (event.button === 4) {
								context.postMessage({ type: 'navigateForward' });
							}
						}
					};

					const mouseupHandler = (event: MouseEvent) => {
						if (event.button === 3 || event.button === 4) {
							event.preventDefault();
							event.stopPropagation();
							event.stopImmediatePropagation();
						}
					};

					const auxclickHandler = (event: MouseEvent) => {
						if (event.button === 3 || event.button === 4) {
							event.preventDefault();
							event.stopPropagation();
							event.stopImmediatePropagation();
						}
					};

					view.dom.addEventListener('mousedown', mousedownHandler, true);
					view.dom.addEventListener('mouseup', mouseupHandler, true);
					view.dom.addEventListener('auxclick', auxclickHandler, true);
				}
			});
			
			codeMirrorWrapper.addExtension([navigationPlugin]);
		},
	};
};
