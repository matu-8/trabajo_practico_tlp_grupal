//Archivo de definicion de rutas - instanciacion

import { Router } from 'express'
const libraryRouter = Router();
libraryRouter.get('/resources');
libraryRouter.get('resource/:id');
libraryRouter.post('/resource');
libraryRouter.put('/resource/:id');
libraryRouter.delete('/resource/:id');
