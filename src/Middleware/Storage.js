import multer from "multer";

const guardar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        if(file !== null){
            const ext = file.originalname.split('.').pop();
            cb(null, Date.now() + '.' + ext);
        }
    }
})

const filtro = (req, file, cb) => {
    if (file && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')) {
        cb(null, true)
    } 
    else{
        cb(null, false)
    }
}

export const subirImagen = multer({ storage: guardar, fileFilter: filtro })
