/**
 *  In dieser Datei konfigurieren wir einen Express Webserver, der es uns ermöglicht,
 *  verschiedene Routen anzugeben und zu programmieren.
 *  Hier verzichten wir auf die Klassendefinition, da diese nicht nötig ist.
 *
 *  Weiterführende Links:
 *  https://expressjs.com/en/starter/basic-routing.html
 */

import errorHandler from 'errorhandler';
import express, {Express} from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// created by us
import ApiController from './Controller/api';
import session from 'express-session';

import ProductController from './Controller/productCon';
import OrderController from './Controller/orderCon';
import { MongoDBController } from './Controller/mongoDB';

import { IUser } from './Models/User';
import AuthController from './Controller/auth';
import multer from 'multer';
import { ImageController } from './Controller/imageCon';
import {
    asyncHandler,
    isValidAppointment,
    isValidAvailability,
    ValidatorGroup,
    ValidatorGroups,
    Validators
} from './Controller/validator';
import { CategoryController } from './Controller/category';
import RatingController from './Controller/rating';
import { AppOptions, PaymentType } from './types';
import { PaymentController } from './Controller/payment';
import { ActivityController } from './Controller/activity';

// Damit im request.session user exisitiert
declare global {
  interface Session {
    user?: IUser,
    paymentAccount?:{
      account:string,
      paymentType:PaymentType
    }
  }
}
class App
{
  app:Express;
  constructor(options:Partial<AppOptions>)
  {
    console.log('Hallo wie gehts');
    // Express server instanziieren
    this.app = express();

    // Express Konfiguration
    this.app.set('port', 80);

    // "JSON" Daten verarbeiten falls der Request zusätzliche Daten im Request hat
    this.app.use(express.json());
    // "UrlEncoded" Daten verarbeiten falls in der Request URL zusätzliche Daten stehen (normalerweise nicht nötig für Angular)
    this.app.use(express.urlencoded({ extended: true }));
    // Wir erlauben alle "Cross-Origin Requests". Normalerweise ist man hier etwas strikter, aber für den Softwareprojekt Kurs
    // erlauben wir alles um eventuelle Fehler zu vermeiden.
    this.app.use(cors({ origin: true, credentials: true }));
    this.app.use(cookieParser('6MJ*PEpJ8]@[!Z~rI(/vz=!8"0N}pB'));

    this.app.set('trust proxy', 1); // trust first proxy
    this.app.use(session({
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
    const mongodb = new MongoDBController(options.testing);

    const auth = new AuthController();
    // information about the creator of this api
    // const about = new AboutController();

    const product = new ProductController();
    const rating = new RatingController();
    const order = new OrderController();

    const activity = ActivityController.getInstance();

    const payment = new PaymentController(order);

    const image = new ImageController();

    const category = new CategoryController();

    this.app.get('/api', api.getInfo);
    this.app.get('/api/about/profile-list', api.getProfileList);
    this.app.get('/api/about/:nameID', api.getNameInfo);
    this.app.post('/api/name/:id', api.postNameInfo);

    // aboutController endpoints
    //app.get('/api/nameinfo-list',about.getNameInfoList);

    // AuthController endpoints

    // register
    this.app.post('/api/auth/register', ValidatorGroups.UserRegister, auth.register);
    // login
    this.app.post('/api/auth/login', ValidatorGroups.UserLogin, auth.login);
    this.app.get('/api/auth/logintest', ValidatorGroups.UserAuthorized, auth.getUser);

    this.app.get('/api/getUserById/:id', auth.getUserById);
    // logout ...
    // logout
    this.app.get('/api/auth/logout', ValidatorGroups.UserAuthorized, auth.logout);
    // update
    this.app.post('/api/auth/update', ValidatorGroups.UserUpdate, auth.update);

    // ProductController endpoints

    // 10-products ...
    this.app.get('/api/product/list', product.getList.bind(product));

    // product details ...
    this.app.get('/api/product/:id', product.getProductDetail.bind(product));

    // similar product
    this.app.get('/api/product/similar/:id', product.getSimilarProduct);

    // reset appointment

    // add product
    this.app.post('/api/product/add', ValidatorGroups.ProductAdd, product.addProduct);

    //  delete product
    this.app.delete('/api/product/delete/:id', ValidatorGroups.UserAuthorized, product.removeProduct);

    // add availability to product
    this.app.post('/api/product/:id/availability/add', asyncHandler(isValidAvailability), product.addAvailability);

    // get availability of product
    this.app.get('/api/product/:id/availability/list', ValidatorGroup([Validators.hasValidObjectId('id')]), product.getAvailabilityList);

    // rating controller endpoints
    // add a rating between 1 and 5 with a comment
    this.app.post('/api/product/:id/rate', ValidatorGroups.ValidRating ,rating.addRating.bind(rating));

    this.app.get('/api/product/:id/canRate',ValidatorGroups.UserAuthorized, rating.canRate);

    this.app.get('/api/product/:id/hasRated', ValidatorGroups.UserAuthorized, rating.hasRated);

    this.app.post('/api/product/:id/updateRating',rating.updateRating.bind(rating));
    // Imager Controller endpoints
    // Add Images
    this.app.post('/api/img/upload', upload.single('img'), image.postImage);

    // Removed Images
    this.app.get('/api/img/:id', image.getImage);

    // OrderController endpoints

    // validate order
    this.app.post('/api/order/validate', asyncHandler(isValidAppointment), order.validateOrder);

    // add a new Order
    this.app.post('/api/order/add', ValidatorGroups.OrderRegister, asyncHandler(isValidAppointment), order.addOrder);

    // delete an order
    this.app.delete('/api/order/delete/:id', ValidatorGroups.UserAuthorized, order.deleteOrder);

    // list all orders for the admin page
    this.app.get('/api/admin/order/list', ValidatorGroups.AdminAuthorized, order.listAllOrders);

    // list all orders by user
    this.app.get('/api/order/list', ValidatorGroups.UserAuthorized, order.listAllOrdersByUser);
    // list all orders by the product creator
    this.app.get('/api/order/listByCreator', ValidatorGroups.UserAuthorized, order.listOrdersByCreator);
    // toggle the confirmation status of an order
    this.app.post('/api/order/:id/setStatus',ValidatorGroups.CanConfirm, order.setStatus);

    // Category

    this.app.get('/api/category/list', category.listCategory);

    // Admin
    this.app.use('/api/admin',ValidatorGroups.AdminAuthorized);

    // all orders for the admin page
    this.app.get('/api/admin/order/list', order.listAllOrders);
    //
    this.app.post('/api/admin/category/add', ValidatorGroup([Validators.isRequired('name'), Validators.isRequired('image_id'), Validators.isRequired('color'),Validators.isRequired('icon'),Validators.isRequired('custom')]),category.addCategory);
    //
    this.app.get('/api/admin/activity/list',activity.getList);



    // Falls ein Fehler auftritt, gib den Stack trace aus

    // Payment

    this.app.post('/api/payment/country',ValidatorGroups.CountryPayment,payment.IsFromGermany.bind(payment));

    this.app.post('/api/payment/pay',ValidatorGroups.PayPayment, asyncHandler(isValidAppointment), payment.payment.bind(payment));

    if (process.env.NODE_ENV === 'development') {
      this.app.use(errorHandler());
    }

    /**
     *  Dateien aus dem "public" Ordner werden direkt herausgegebn.
     *  D.h. falls eine Datei "myFile.txt" in dem "public" Ordner liegt, schickt der Server
     *  diese Datei wenn die "http://localhost/myFile.txt" URL aufgerufen wird.
     *  In diesem Projekt ist das Frontend Projekt so eingestellt, dass die finalen Dateien hier
     *  in dem "public" Ordner abgelegt werden.
     */
    this.app.use('/', express.static('public'));



    /**
     *  Hier wird die "default Route" angegeben, d.h. falls der Server nicht weiß wie er auf "/random-request" antworten soll
     *  wird diese Methode aufgerufen. Das Frontend Angular hat selbst ein eigenes Routing, weswegen wir immer die "index" Seite
     *  von Angular schicken müssen. Falls eine der zuvor angegebenen Routen passt, wird diese Methode nicht aufgerufen.
     */
    this.app.use((req, res) => {
      res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });
  }

  public getExpressInstance()
  {
    return this.app;
  }

  public disconnect()
  {

  }
}

// Wir machen den konfigurierten Express Server für andere Dateien verfügbar, die diese z.B. Testen oder Starten können.
export default App;
