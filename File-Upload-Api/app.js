const { response } = require("express");
const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

//mongodb save code............................
const fs = require('fs');
require("./db/db");
const imgModel= require("./db/schema");

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//mongo save code..............................

//storage
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    
    storage:storage,
    limits: {fileSize:100000}
})
   

app.use('/profile', express.static('upload/image'));

app.post("/upload", upload.single('profile'), (req, res)=>{
    // console.log(req.file)
    const obj = new imgModel({ //image db save
                name: req.body.name,
                desc: req.body.desc,
                img: {
                    data: fs.readFileSync(path.join(__dirname + '/upload/images/' + req.file.filename)),
                    contentType: 'image/png'
                }
    })
    obj.save() //img db save
    
    res.json({
        success:1,
        profile_url: `http://localhost:4000/profile/${req.file.filename}`,
        msg:"image upload"
    })
})

// app.post("/upload", upload.array()) //for multiple
function errHandller(err, req, res, next){
    if(err instanceof multer.MulterError){
        res.json({
        success: 0,
        message: err.message
    })
    }
}
app.use(errHandller);    

// //mongo save ......................
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
 
// var upload = multer({ storage: storage });

// app.post('/image', upload.single('image'), (req, res, next) => {
//     var obj = {
//         name: req.body.name,
//         desc: req.body.desc,
//         img: {
//             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//             contentType: 'image/png'
//         }
//     }
//     imgModel.create(obj, (err, item) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             // item.save();
//             res.redirect('/');
//         }
//     });
// });
// //mongo save ...............................

app.listen(4000, ()=>{
    console.log("server running...")
})