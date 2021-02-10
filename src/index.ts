import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import { APODResponse } from './APODResponse';

/**
 * Initialization data for the jupyterlab_apod extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_apod:plugin',
  autoStart: true,
  requires: [ICommandPalette],
  activate: async (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension jupyterlab_apod is activated!');


    const command: string = 'apod:open';
    app.commands.addCommand(command, {
      label: 'Random Astronomy Picture',
      execute: async () => {
        const content = new Widget();
        content.addClass('my-apodWidget');
        const widget = new MainAreaWidget({ content });
    
        let img = document.createElement('img');
        content.node.appendChild(img);
        
        let summary = document.createElement('p');
        content.node.appendChild(summary);
        
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${randomDate()}`);
        if (!response.ok) {
          const data = await response.json();
          if (data.error) {
            summary.innerText = data.error.message;
          } else {
            summary.innerText = response.statusText;
          }
        } else {
          const data = await response.json() as APODResponse;
      
          if (data.media_type === 'image') {
            // Populate the image
            img.src = data.url;
            img.title = data.title;
            summary.innerText = data.title;
            if (data.copyright) {
              summary.innerText += ` (Copyright ${data.copyright})`;
            }
          } else {
            summary.innerText = 'Random APOD fetched was not an image.';
          }
        }
    
        widget.id = 'apod-jupiterlab';
        widget.title.label = 'Astronomy Picture';
        widget.title.closable = true;

        if (!widget.isAttached) {
          app.shell.add(widget, 'main');
        }
        app.shell.activateById(widget.id);
      }
    });

    palette.addItem({ command, category: 'Tutorial' });
  }
};

function randomDate() {
  const start = new Date(2010, 1, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random()*(end.getTime() - start.getTime()));
  return randomDate.toISOString().slice(0, 10);
}

export default extension;
