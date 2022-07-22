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
import { api } from './Controller/api';
import session from 'express-session';



import { IUser } from './Models/User';
import {auth} from './Controller/auth';
import multer from 'multer';
import { image } from './Controller/imageCon';
import {
    isValidAppointment,
    isValidAvailability,
    ValidatorGroup,
    ValidatorGroups,
    Validators
} from './Controller/validator';

import {rating} from './Controller/rating';
import { AppOptions, PaymentType } from './types';
import { payment } from './Controller/payment';
import { activity } from './Controller/activity';
import { category } from './Controller/category';
import {product} from './Controller/productCon';
import {order} from './Controller/orderCon';
import { mongodb, MongoDBController } from './Controller/mongoDB';
import {asyncError} from './Utils/asyncError';

// So request.session.user exists
declare global {
  interface Session {
    user?: IUser,
    paymentAccount?:{
      account:string,
      paymentType:PaymentType
    }
  }
}

/**
 * App instantiates every Controller an manages thier routes
 */
class App
{
  app:Express;

  database: MongoDBController;

  constructor(options:Partial<AppOptions>)
  {
    console.log('Hallo wie gehts');
    // Express server instanziieren
    this.app = express();

    // Express Konfiguration
    this.app.set('port', 80);
    // initialise most middleware used like express-session and json-parser
    this.initMiddleware();

    // Initalise mongoDb if App is in test mode also create a in memorydb
    this.database = mongodb.getValue(options);

    // used for uploading image to server-filesystem ('uploads') and removed after uploading to database
    const upload = multer({ dest: './uploads/' });

    // About endpoints
    this.app.get('/api', api.getInfo);
    this.app.get('/api/about/profile-list', api.getProfileList);
    this.app.get('/api/about/:nameID',api.getNameInfo);
    this.app.post('/api/name/:id', api.postNameInfo);

    // AuthController endpoints

    // register
    this.app.post('/api/auth/register', ValidatorGroups.UserRegister, asyncError(auth.register));
    // login
    this.app.post('/api/auth/login', ValidatorGroups.UserLogin, asyncError(auth.login));
    this.app.get('/api/auth/logintest', ValidatorGroups.UserAuthorized, auth.getUser);

    this.app.get('/api/getUserById/:id', asyncError(auth.getUserById));
    // logout ...
    // logout
    this.app.get('/api/auth/logout', ValidatorGroups.UserAuthorized, auth.logout);
    // update
    this.app.post('/api/auth/update', ValidatorGroups.UserUpdate, asyncError(auth.update));

    // ProductController endpoints

    // 10-products ...
    this.app.get('/api/product/list', asyncError(product.getList.bind(product)));

    // product details ...
    this.app.get('/api/product/:id', asyncError(product.getProductDetail.bind(product)));

    // similar product
    this.app.get('/api/product/similar/:id', asyncError(product.getSimilarProduct));

    // reset appointment

    // add product
    this.app.post('/api/product/add', ValidatorGroups.ProductAdd, asyncError(product.addProduct));

    //  delete product
    this.app.delete('/api/product/delete/:id', ValidatorGroups.UserAuthorized, asyncError(product.removeProduct));

    // add availability to product
    this.app.post('/api/product/:id/availability/add', ValidatorGroup([isValidAvailability]), asyncError(product.addAvailability));

    // get availability of product
    this.app.get('/api/product/:id/availability/list', ValidatorGroup([Validators.hasValidObjectId('id')]), asyncError(product.getAvailabilityList));

    // rating controller endpoints
    // add a rating between 1 and 5 with a comment
    this.app.post('/api/product/:id/rate', ValidatorGroups.ValidRating ,asyncError(rating.addRating.bind(rating)));

    this.app.get('/api/product/:id/canRate',ValidatorGroups.UserAuthorized, asyncError(rating.canRate));

    this.app.get('/api/product/:id/hasRated', ValidatorGroups.UserAuthorized, asyncError(rating.hasRated));

    this.app.post('/api/product/:id/updateRating',asyncError(rating.updateRating.bind(rating)));
    // Imager Controller endpoints
    // Add Images                   handles image upload to uploads folder
    this.app.post('/api/img/upload', upload.single('img'), image.postImage);

    // Removed Images
    this.app.get('/api/img/:id', asyncError(image.getImage));

    // OrderController endpoints

    // validate order
    this.app.post('/api/order/validate', ValidatorGroup([isValidAppointment]), asyncError(order.validateOrder));

    // add a new Order
    this.app.post('/api/order/add', ValidatorGroups.OrderRegister, ValidatorGroup([isValidAppointment]), asyncError(order.addOrder));

    // delete an order
    this.app.delete('/api/order/delete/:id', ValidatorGroups.UserAuthorized, asyncError(order.deleteOrder));

    // list all orders for the admin page
    this.app.get('/api/admin/order/list', ValidatorGroups.AdminAuthorized, asyncError(order.listAllOrders));

    // list all orders by user
    this.app.get('/api/order/list', ValidatorGroups.UserAuthorized, asyncError(order.listAllOrdersByUser));
    // list all orders by the product creator
    this.app.get('/api/order/listByCreator', ValidatorGroups.UserAuthorized, asyncError(order.listOrdersByCreator));
    // toggle the confirmation status of an order
    this.app.post('/api/order/:id/setStatus',ValidatorGroup([Validators.isRequired('status')]), asyncError(order.setStatus));

    // Category

    this.app.get('/api/category/list', asyncError(category.listCategory));

    // Admin
    this.app.use('/api/admin',ValidatorGroups.AdminAuthorized);

    // all orders for the admin page
    this.app.get('/api/admin/order/list', asyncError(order.listAllOrders));
    //
    this.app.post('/api/admin/category/add', ValidatorGroup([Validators.isRequired('name'), Validators.isRequired('image_id'), Validators.isRequired('color'),Validators.isRequired('icon'),Validators.isRequired('custom')]),asyncError(category.addCategory));
    //
    this.app.get('/api/admin/activity/list',asyncError(activity.getList));



    // Falls ein Fehler auftritt, gib den Stack trace aus

    // Payment

    this.app.post('/api/payment/country',ValidatorGroups.CountryPayment,asyncError(payment.isFromGermany.bind(payment)));

    this.app.post('/api/payment/pay',ValidatorGroups.PayPayment, ValidatorGroup([isValidAppointment]), asyncError(payment.payment.bind(payment)));

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
      res.sendFile(path.join(__dirname, '..','..', 'public', 'index.html'));
    });
  }

  public initMiddleware():void
  {
    // "JSON" Daten verarbeiten falls der Request zusätzliche Daten im Request hat
    this.app.use(express.json());
    // "UrlEncoded" Daten verarbeiten falls in der Request URL zusätzliche Daten stehen (normalerweise nicht nötig für Angular)
    this.app.use(express.urlencoded({ extended: true }));
    // Wir erlauben alle "Cross-Origin Requests". Normalerweise ist man hier etwas strikter, aber für den Softwareprojekt Kurs
    // erlauben wir alles um eventuelle Fehler zu vermeiden.
    this.app.use(cors({ origin: true, credentials: true }));
    //                                     secret
    this.app.use(cookieParser('6MJ*PEpJ8]@[!Z~rI(/vz=!8"0N}pB'));

    this.app.set('trust proxy', 1); // trust first proxy so angular works + cors issue
    this.app.use(session({
        secret: '6MJ*PEpJ8]@[!Z~rI(/vz=!8"0N}pB',
        resave: true,
        saveUninitialized: true,
        name: 'guid'
      }
    ));
  }


  public getExpressInstance():Express
  {
    return this.app;
  }

  public disconnect():void
  {
    this.database.disconnectDB();
  }
}

// Wir machen den konfigurierten Express Server für andere Dateien verfügbar, die diese z.B. Testen oder Starten können.
export default App;
