import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';

import { APODWidget } from './APODWidget';

/**
 * Initialization data for the jupyterlab_apod extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_apod:plugin',
  autoStart: true,
  requires: [ICommandPalette],
  activate: activate
};


function activate(app: JupyterFrontEnd, palette: ICommandPalette) {
  console.log('JupyterLab extension jupyterlab_apod is activated!');

  const command: string = 'apod:open';
  app.commands.addCommand(command, {
    label: 'Random Astronomy Picture',
    execute: async () => {
      const content = new APODWidget();
      const widget = new MainAreaWidget({ content });
      widget.id = 'apod-jupiterlab';
      widget.title.label = 'Astronomy Picture';
      widget.title.closable = true;

      if (!widget.isAttached) {
        app.shell.add(widget, 'main');
      }
      content.update();
      app.shell.activateById(widget.id);
    }
  });

  palette.addItem({ command, category: 'Tutorial' });
}

export default extension;
