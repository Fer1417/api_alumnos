import mongoose from "mongoose"
import * as fs from "fs"

const esquema = new mongoose.Schema({
    escuela: String, matricula: String, alumno: String, carrera: String, semestre: String, fecha_nacimiento: Date, foto: String
}, {versionKey:false})
const AlumnosModel = mongoose.model('Alumnos', esquema)

export const getAlumnos = async (req, res) => {
    try {
        const { id } = req.params;
        let rows;

        if (id === undefined) {
            rows = await AlumnosModel.find();
        } else {
            rows = await AlumnosModel.findById(id);
        }

        return res.status(200).json({ status: true, data: rows });
    } catch(error) {
        return res.status(500).json({ status: false, errors: [error] });
    }
};


export const saveAlumnos = async (req, res) => {
    try {
        const { escuela, matricula, alumno, carrera, semestre, fecha_nacimiento } = req.body;
        const validacion = validar(escuela, matricula, alumno, carrera, semestre, fecha_nacimiento, req.file, 'Y');
        if (validacion == '') {
            const nuevoAlumno = new AlumnosModel({
                escuela:escuela,matricula:matricula,alumno:alumno,carrera:carrera,semestre:semestre,fecha_nacimiento:fecha_nacimiento,
                foto: '/uploads/' + req.file.filename
            })
            return await nuevoAlumno.save().then(
                () => {res.status(200).json({ status: true, message: 'Alumno guardado' })}
            )
        }
        else {
            return res.status(400).json({ status: false, errors: validacion });
        }
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error.message] });
    }
};

export const updateAlumnos = async (req, res) => {
    try {
        const {id} = req.params
        const {escuela, matricula, alumno, carrera, semestre, fecha_nacimiento} = req.body
        let foto = ''
        let valores = {escuela:escuela, matricula:matricula, alumno:alumno, carrera:carrera, semestre:semestre, fecha_nacimiento:fecha_nacimiento}
        if(req.file != null){
            foto = '/uploads/'+req.file.filename
            valores = {escuela:escuela, matricula:matricula, alumno:alumno, carrera:carrera, semestre:semestre, fecha_nacimiento:fecha_nacimiento, foto:foto}
            await eliminarImagen(id)
        }
        const validacion = validar(escuela,matricula,alumno,carrera,semestre,fecha_nacimiento)
        if (validacion == '') {
            await AlumnosModel.updateOne({_id:id},{$set: valores})
            return res.status(200).json({ status: true, message: 'Alumno actualizado' })
        }
        else {
            return res.status(400).json({ status: false, errors: validacion });
        }
    }
    catch(error){
        return res.status(500).json({ status: false, errors: [error.message] })
    }
}

export const deleteAlumnos = async (req,res) => {
    try {
        const {id} = req.params
        await eliminarImagen(id)
        await AlumnosModel.deleteOne({_id:id})
        return res.status(200).json({ status: true, message: 'Alumno eliminado' })
    }
    catch (error) {
        return res.status(500).json({ status: false, errors: [error.message] });
    }
}

const eliminarImagen = async(id) => {
    const alumnos = await AlumnosModel.findById(id)
    const foto = alumnos.foto
    fs.unlinkSync('./public/'+foto)
}

const validar = (escuela, matricula, alumno, carrera, semestre, fecha_nacimiento, foto, sevalida) => {
    var errors = []
    if (escuela === undefined || escuela.trim() === '') {
        errors.push('La escuela no debe estar vacía');
    }
    if (matricula === undefined || matricula.trim() === '') {
        errors.push('La matrícula no debe estar vacía');
    }
    if (alumno === undefined || alumno.trim() === '') {
        errors.push('El nombre del alumno no debe estar vacío');
    }
    if (carrera === undefined || carrera.trim() === '') {
        errors.push('La carrera no debe estar vacía');
    }
    if (semestre === undefined || semestre.trim() === '') {
        errors.push('El semestre no debe estar vacío');
    }
    if (fecha_nacimiento === undefined || fecha_nacimiento.trim() === '' || isNaN(Date.parse(fecha_nacimiento))) {
        errors.push('La fecha de nacimiento no debe estar vacía y debe ser válida');
    }
    if (sevalida === 'Y' && foto === undefined) {
        errors.push('Selecciona una imagen jpg, jpeg o png');
    } 
    else{
        if(errors != ''){
            fs.unlinkSync('./public/uploads/' + foto.filename);
        }
    }
    return errors;
};
