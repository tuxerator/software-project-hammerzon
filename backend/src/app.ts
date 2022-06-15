/**
 *  In dieser Datei konfigurieren wir einen Express Webserver, der es uns ermöglicht,
 *  verschiedene Routen anzugeben und zu programmieren.
 *  Hier verzichten wir auf die Klassendefinition, da diese nicht nötig ist.
 *
 *  Weiterführende Links:
 *  https://expressjs.com/en/starter/basic-routing.html
 */

import errorHandler from 'errorhandler';
import express, { application } from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// created by us
import ApiController from './Controller/api';
import AboutController from './Controller/about';
import session from 'express-session';

import ProductController from './Controller/productCon';
import OrderController from './Controller/orderCon';
import { MongoDBController } from './Controller/mongoDB';

import { Order } from './Models/Order';

import { IUser } from './Models/User';
import AuthController from './Controller/auth';
import multer from 'multer';
import { ImageController } from './Controller/imageCon';
import { ValidatorGroup, ValidatorGroups, Validators } from './Controller/validator';
import RatingController from './Controller/rating';

// Damit im request.session user exisitiert
declare global {
  interface Session {
    user?: IUser,
  }
}


// Express server instanziieren
const app = express();

// Express Konfiguration
app.set('port', 80);

// "JSON" Daten verarbeiten falls der Request zusätzliche Daten im Request hat
app.use(express.json());
// "UrlEncoded" Daten verarbeiten falls in der Request URL zusätzliche Daten stehen (normalerweise nicht nötig für Angular)
app.use(express.urlencoded({ extended: true }));
// Wir erlauben alle "Cross-Origin Requests". Normalerweise ist man hier etwas strikter, aber für den Softwareprojekt Kurs
// erlauben wir alles um eventuelle Fehler zu vermeiden.
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser('6MJ*PEpJ8]@[!Z~rI(/vz=!8"0N}pB'));

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: '6MJ*PEpJ8]@[!Z~rI(/vz=!8"0N}pB',
    resave: true,
    saveUninitialized: true,
    name: 'guid'
  }
));


/**
 *  API Routen festlegen
 *  Hier legen wir in dem "Express" Server neue Routen fest. Wir übergeben die Methoden
 *  unseres "ApiControllers", die dann aufgerufen werden sobald jemand die URL aufruft.
 *  Beispiel
 *  app.get('/api', api.getInfo);
 *       ↑     ↑          ↑
 *       |     |     Diese Methode wird aufgerufen, sobald ein Nutzer die angebene
 *       |     |     URL über einen HTTP GET Request aufruft.
 *       |     |
 *       |   Hier definieren sie die "Route", d.h. diese Route
 *       |   ist unter "http://localhost/api" verfügbar
 *       |
 *   Für diese Route erwarten wir einen GET Request.
 *   Auf derselben Route können wir auch einen POST
 *   Request angeben, für den dann eine andere Methode
 *   aufgerufen wird.
 *
 *  Weiterführende Links:
 *  - Übersicht über verschiedene HTTP Request methoden (GET / POST / PUT / DELETE) https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 *  - REST Architektur: https://de.wikipedia.org/wiki/Representational_State_Transfer
 *
 *  Bitte schaut euch das Tutorial zur Backend-Entwicklung an für mehr Infos bzgl. REST
 */

// Wird für das Photouploaden verwendet
const upload = multer({ dest: './uploads/' });


// important information about this api
const api = new ApiController();
// const database = new DatabaseController();
const mongodb = new MongoDBController();

const auth = new AuthController();
// information about the creator of this api
// const about = new AboutController();

const product = new ProductController();
const rating = new RatingController();
const order = new OrderController();

const image = new ImageController();

app.get('/api', api.getInfo);
app.get('/api/about/profile-list', api.getProfileList);
app.get('/api/about/:nameID', api.getNameInfo);
app.post('/api/name/:id', api.postNameInfo);

// aboutController endpoints
//app.get('/api/nameinfo-list',about.getNameInfoList);

// AuthController endpoints

// register
app.post('/api/auth/register', ValidatorGroups.UserRegister, auth.register);
// login
app.post('/api/auth/login', ValidatorGroups.UserLogin, auth.login);
app.get('/api/auth/logintest', ValidatorGroups.UserAuthorized, auth.getUser);

app.get('/api/getUserById/:id', auth.getUserById);
// logout ...
// logout
app.get('/api/auth/logout', ValidatorGroups.UserAuthorized, auth.logout);
// update
app.post('/api/auth/update', ValidatorGroups.UserUpdate, auth.update);

// ProductController endpoints

// 10-products ...
app.get('/api/product/list', product.getList.bind(product));

// product details ...
app.get('/api/product/:id', product.getProductDetail.bind(product));

// reset appointment

// add product
app.post('/api/product/add', ValidatorGroups.ProductAdd, product.addProduct);

app.post('/api/product/delete', ValidatorGroup([Validators.isAuthorized('user'),Validators.isRequired('id')]) ,product.removeProduct);

app.post('/api/resetAppointment',ValidatorGroups.OrderRegister, product.resetAppointment);

// rating controller endpoints
app.post('/api/product/:id/rate', rating.addRating);
// Imager Controller endpoints
// Add Images
app.post('/api/img/upload', upload.single('img'), image.postImage);

// Removed Images
app.get('/api/img/:id', image.getImage);

// OrderController endpoints

// register a new Order
app.post('/api/order/register', ValidatorGroups.OrderRegister, order.registerOrder);

// delete an order
app.delete('/api/order/delete/:id', ValidatorGroups.UserAuthorized, order.deleteOrder);

// list all orders for the admin page
app.get('/api/admin/order/list', ValidatorGroups.AdminAuthorized, order.listAllOrders);

// list all orders by user
app.get('/api/order/list', ValidatorGroups.UserAuthorized, order.listAllOrdersByUser);
// list all orders by the product creator
app.get('/api/order/listByCreator', ValidatorGroups.UserAuthorized, order.listOrdersByCreator);
// toggle the confirmation status of an order
app.post('/api/order/:id/setStatus',ValidatorGroups.CanConfirm, order.setStatus);

// Falls ein Fehler auftritt, gib den Stack trace aus
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

/**
 *  Dateien aus dem "public" Ordner werden direkt herausgegebn.
 *  D.h. falls eine Datei "myFile.txt" in dem "public" Ordner liegt, schickt der Server
 *  diese Datei wenn die "http://localhost/myFile.txt" URL aufgerufen wird.
 *  In diesem Projekt ist das Frontend Projekt so eingestellt, dass die finalen Dateien hier
 *  in dem "public" Ordner abgelegt werden.
 */
app.use('/', express.static('public'));

/**
 *  Hier wird die "default Route" angegeben, d.h. falls der Server nicht weiß wie er auf "/random-request" antworten soll
 *  wird diese Methode aufgerufen. Das Frontend Angular hat selbst ein eigenes Routing, weswegen wir immer die "index" Seite
 *  von Angular schicken müssen. Falls eine der zuvor angegebenen Routen passt, wird diese Methode nicht aufgerufen.
 */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Wir machen den konfigurierten Express Server für andere Dateien verfügbar, die diese z.B. Testen oder Starten können.
export default app;
