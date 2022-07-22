import App from './app';

/**
 *  Zeige TypeScript Zeile in Fehlernachrichten
 */
import SourceMap from 'source-map-support';
import { SocketServer } from './Controller/socketServer';

SourceMap.install();

// create an app-instance with a normal connection to a
const appInstance = new App({}).getExpressInstance();
// Start server on port 80
const server = appInstance.listen(appInstance.get('port'), () => {
    console.log(
        'Server running at http://localhost:%d in %s mode',
        appInstance.get('port'),
        appInstance.get('env')
    );
    console.log('Press CTRL-C to stop\n');
});

// Socket for Aktivity-Channels + Appointment-Channels
new SocketServer(server);
