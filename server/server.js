const mongoose = require('mongoose')
const DocumentSchema = require('./DocumentSchema')

const dbURL = process.env.MONGOURI || 'mongodb://localhost/google-docs-clone'
const PORT = process.env.PORT || 3001

mongoose.connect(dbURL,{
    useUnifiedTopology: true,
    useNewUrlParser:true
}).then(()=> console.log('database connected'))
.catch(err => console.log(err));

const defaultValue = "";

const io = require("socket.io")(PORT,{
    cors: {
        origin: "http://localhost:3000",
        methods:["GET", "POST"],
    },
});

io.on("connection", socket => {
    socket.on('get-document', async documentId => {
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)     
        socket.emit('load-document', document.data)
        
        socket.on("send-changes", delta=>{
        
            //brodacast changes(delta) to specific room also except the current socket
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

        socket.on('save-document', async data =>{   
            await DocumentSchema.findByIdAndUpdate(documentId, {data})
        })
    })
})


async function findOrCreateDocument(id){
    if(id== null) return
    const document = await DocumentSchema.findById(id)
    if(document) return document
    return await DocumentSchema.create({_id: id, data: defaultValue})
}