import {Router} from 'express'
import { getAlumnos, saveAlumnos,  updateAlumnos, deleteAlumnos} from '../Controllers/AlumnosController.js'
import { subirImagen } from '../Middleware/Storage.js'
import { verificar } from '../Middleware/Auth.js'

const rutas = Router()

rutas.get('/api/Alumnos',verificar, getAlumnos)
rutas.get('/api/Alumnos/:id', getAlumnos)
rutas.post('/api/Alumnos', subirImagen.single('foto'), saveAlumnos)
rutas.put('/api/Alumnos/:id', subirImagen.single('foto'), updateAlumnos)
rutas.delete('/api/Alumnos/:id', deleteAlumnos)


export default rutas