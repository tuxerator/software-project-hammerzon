import { app } from './app';

/**
 *  Zeige TypeScript Zeile in Fehlernachrichten
 */
import SourceMap from 'source-map-support';
import { SocketServer } from './Controller/socketServer';

SourceMap.install();
/**
 *  Hier starten wir den Express-Server, indem wir den Server an einen Netzwerkport (Standard: 80) binden
 */
const appInstance = app(false);

const server = appInstance.listen(appInstance.get('port'), () => {
    console.log(
        'Server running at http://localhost:%d in %s mode',
        appInstance.get('port'),
        appInstance.get('env')
    );
    console.log('Press CTRL-C to stop\n');
});


const socketServer = new SocketServer(server);
