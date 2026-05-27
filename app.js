import 'dotenv/config.js';

import authApiRoutes from './routes/api/authApiRoute.js';
import clientApiRoutes from './routes/api/sales/clientApiRoute.js';
import productApiRoutes from './routes/api/warehouse/productApiRoute.js';
import supplierApiRoutes  from './routes/api/warehouse/supplierApiRoute.js';
import goodsReceiptApiRoutes from './routes/api/warehouse/goodsReceiptApiRoute.js';
import purchaseRequisitionApiRoutes from './routes/api/warehouse/purchaseRequisitionApiRoute.js';
import goodsIssueApiRoutes from './routes/api/warehouse/goodsIssueApiRoute.js';
import notificationApiRoutes from './routes/api/warehouse/notificationApiRoute.js';
import reportApiRoutes from './routes/api/warehouse/reportApiRoute.js';
import unitMeasuresApiRoutes from './routes/api/warehouse/unitMeasureApiRoute.js';
import presentationApiRoutes from './routes/api/warehouse/presentationApiRoute.js';
import departmentApiRoutes from './routes/api/admin/departmentApiRoute.js';
import profileApiRoutes from './routes/api/admin/profileApiRoute.js';
import reasonApiRoutes from './routes/api/warehouse/reasonApiRoute.js';
import fulfillmentStatusApiRoutes from './routes/api/warehouse/fulfillmentStatusApiRoute.js';

import loginWebRoutes from './routes/web/auth/loginWebRoute.js';
import logoutWebRoutes from './routes/web/auth/logoutWebRoute.js';
import refreshWebRoutes from './routes/web/auth/refreshWebRoute.js';
import homeWebRoutes from './routes/web/homeWebRoute.js';
import productWebRoutes from './routes/web/warehouse/productWebRoute.js';
import wasteWebRoutes from './routes/web/warehouse/wasteWebRoute.js';
import supplierWebRoutes from './routes/web/warehouse/supplierWebRoute.js';
import purchaseRequisitionWebRoutes from './routes/web/warehouse/purchaseRequisitionWebRoute.js';
import goodsReceiptWebRoutes from './routes/web/warehouse/goodsReceiptWebRoute.js';
import goodsIssueWebRoutes from './routes/web/warehouse/goodsIssueWebRoute.js';
import profileWebRoutes from './routes/web/admin/profileWebRoute.js';
import clientWebRoutes from './routes/web/sales/clientWebRoute.js';

import { checkTypeContentJson, checkTypeContentFile, checkContentTypePlainText } from './middleware/contentTypeMiddleware.js';
import cookieParser from 'cookie-parser';

import express from 'express';
import http from 'node:http';
import expressEjsLayouts from 'express-ejs-layouts';
import { Server } from 'socket.io';
import { publicDir, viewsDir } from './utils/pathsUtils.js';
import { errorMap } from './messages/codeMessages.js';
import { initSocket } from './utils/socketUtils.js';
import { AppError } from './errors/AppError.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
initSocket(io);

const rootRoute = '/';
const apiRoute = '/api';
const textRoute = '/text';
const uploadRoute = '/upload';
const authRoute = '/auth';
const warehouse = '/warehouse';
const admin = '/admin';
const sales = '/sales';

app.set('views', viewsDir);
app.set('view engine', 'ejs');

app.use(expressEjsLayouts);
app.set('layout', 'layout/base');
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(rootRoute, express.static(publicDir));

app.use(apiRoute, express.json());
app.use(textRoute, express.text({ type: 'text/plain' }));
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

//middleware
app.use(apiRoute, checkTypeContentJson);
app.use(uploadRoute, checkTypeContentFile);
app.use(textRoute, checkContentTypePlainText);

app.use((req, res, next) => {
    res.locals.flash = req.cookies.flash || null;
    res.clearCookie('flash');
    next();
});

// web routes
app.use(rootRoute, homeWebRoutes);
app.use('/inicio-sesion', loginWebRoutes);
app.use('/revocar-sesion', refreshWebRoutes);
app.use('/cerrar-sesion', logoutWebRoutes);
app.use('/productos', productWebRoutes);
app.use('/mermas', wasteWebRoutes);
app.use('/requisiciones', purchaseRequisitionWebRoutes);
app.use('/compras', goodsReceiptWebRoutes);
app.use('/salidas-almacen', goodsIssueWebRoutes);
app.use('/perfiles', profileWebRoutes);
app.use('/clientes', clientWebRoutes);
app.use('/proveedores', supplierWebRoutes);

// api routes
app.use(apiRoute + authRoute, authApiRoutes);
app.use(apiRoute + sales + '/clients', clientApiRoutes);
app.use(apiRoute + warehouse + '/products', productApiRoutes);
app.use(apiRoute + warehouse + '/suppliers', supplierApiRoutes);
app.use(apiRoute + warehouse + '/goods-receipts', goodsReceiptApiRoutes);
// app.use(apiRoute + warehouse + '/purchase-requisitions', purchaseRequisitionApiRoutes);
app.use(apiRoute + warehouse + '/goods-issues', goodsIssueApiRoutes);
app.use(apiRoute + warehouse + '/notifications', notificationApiRoutes);
app.use(apiRoute + warehouse + '/reports', reportApiRoutes);
app.use(apiRoute + warehouse + '/unit-measures', unitMeasuresApiRoutes);
app.use(apiRoute + warehouse + '/presentations', presentationApiRoutes);
app.use(apiRoute + admin + '/departments', departmentApiRoutes);
app.use(apiRoute + admin + '/profiles', profileApiRoutes);
app.use(apiRoute + warehouse + '/reasons', reasonApiRoutes);
app.use(apiRoute + warehouse + '/fulfillment-statuses', fulfillmentStatusApiRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada.' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof AppError) return res.status(err.statusCode).json({
        code: err.code,
        meta: err.meta
    });
    
    res.status(500).json({ code: errorMap.message.SERVER_ERROR });
});

io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Socket desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

process.on('warning', (warning) => {
    console.log('⚠️ WARNING DETECTADO');
    console.log(warning.stack);
});
