import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useParams } from "react-router-dom"
import './TextEditor.css'

const SAVE_INTERVAL_MS = 2000

const TOOLBAR_OPTIONS = [
    ['bold', 'italic', 'underline', 'strike'],        
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],               
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],  
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      
    [{ 'indent': '-1'}, { 'indent': '+1' }],          
    [{ 'direction': 'rtl' }],                         
    [{ 'color': [] }, { 'background': [] }],          
    ['clean']                                         
]

const TextEditor = () => {
    //state variable so that sync changes b/w user
    const [socket, setSocket] = useState()
    const [quill, setQuill]= useState();
    
    //getting id from router parameters in App.js
    const {id: documentId} = useParams()

    //creating and diconnecting socket
    useEffect(() => {
        const s= io("http://localhost:3001")
        setSocket(s);
        return()=>{
            s.disconnect()
        }
    },[]);

    //to setup a room
    useEffect(() => {
        if (socket == null || quill == null) return
        
        //listen response once from server and then clean up the event
        socket.once("load-document", document => {
          quill.setContents(document)
          quill.enable() 
        })
        //tells server which document we are part of so that room can be setup
        socket.emit("get-document", documentId)
    }, [socket, quill, documentId])

    //auto save document after 2 sec
    useEffect(() => {
        if (socket == null || quill == null) return

        const interval = setInterval(()=>{
            socket.emit('save-document', quill.getContents())
        }, SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval)
        }
    })
    //detect changes in socket and quill
    useEffect(() => {
        //makes sure we have socket and quill
        if(socket==null || quill == null)  return

        const handler = (delta, oldDelta, source)=> {
            //check to prevent changes made by api to send them to server
            if(source!=='user') return

            //emit message from client to sever
            socket.emit("send-changes", delta) // delta- small subset that is changing, it is not the whole documnent
        }
        quill.on('text-change', handler)

        //remove fucntion if we don't need it
        return() => {
            quill.ofF('text-change',handler)
        }
    },[socket, quill])

    //receive changes from a socket
    useEffect(() => {
        if(socket==null || quill == null)  return
        const handler = (delta)=> {
            quill.updateContents(delta)
        }
        socket.on("receive-changes", handler)

        return() => {
            socket.ofF('text-change',handler)
        }
    },[socket, quill])


    const wrapperRef = useCallback((wrapper) => {
        if(wrapper == null) return
        wrapper.innerHTML = '';
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {theme: 'snow' , modules: { toolbar: TOOLBAR_OPTIONS}})
        q.disable()
        q.setText("Loading...")
        setQuill(q);
    },[])   


    return (
        <div className="container" ref={wrapperRef}></div>
    )
}

export default TextEditor
