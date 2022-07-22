import App from './app';
/* Test Server is only used for testing App and it's subcomponents like auth.
 * it creates an app-Instance with a connection to a in-memory-MongoDatabase
 */
export const appInstance = new App({testing:true}).getExpressInstance();


