import Footer from "./Footer";
import {useEffect,useState} from "react"
export default function Todo(){

    const [title,setTitle]=useState("");
    const [description, setDescription]=useState("");
    const [todos,setTodos]=useState([]);
    const [error,setError]=useState("");
    const [message,setMessage]=useState("");
    const [editId,setEditId]=useState(-1);
    const [editTitle,setEditTitle]=useState("");
    const [editDescription,setEditDescription]=useState("");

    const apiUrl="http://localhost:8000";

    const handleSubmit = () => {
     setError("");

  if (title.trim() !== "" && description.trim() !== "") {
    fetch(apiUrl + "/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed");
        }
      })
      .then((newTodo) => {
        setTodos([...todos, newTodo]); 
        setTitle("");
        setDescription("");

        setMessage("Item added successfully");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => {
        setError("Failed to add todo item");
         setTimeout(() => setError(""), 4000);
      });
  }
  else{
    setError("Title and Description cannot be empty");
    setTimeout(() => setError(""), 3000);
  }
};

useEffect(()=>{
    getItems()
},[])  
const getItems =()=>{
    fetch(apiUrl+"/todos")
    .then((res)=>res.json())
    .then((res)=>{
        setTodos(res)
    })
}
const handleEdit=(item)=>{
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
}
const handleUpdate=()=>{
     setError("");
        if(editTitle.trim()!=='' && editDescription.trim()!==''){
            const oldTodo = todos.find(item => item._id === editId);

   if(oldTodo.title === editTitle && oldTodo.description === editDescription){
      setError("No changes made");
      setTimeout(()=>{
    setError("");
   },3000);
   return;
   }
         fetch(apiUrl+"/todos/"+editId,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({title:editTitle,description:editDescription})
         }).then((res)=>{
            if(res.ok){
               const updatedTodos=todos.map((item)=>{
                    if(item._id==editId){
                        item.title=editTitle;
                        item.description=editDescription;
                    }
                    return item;
                })
   setTodos(updatedTodos);
   setEditTitle("");
    setEditDescription("");
   setMessage("Item updated successfully");
   setTimeout(()=>{
    setMessage("");
   },3000);
   setEditId(-1);
}
   else{
   setError("Failed to add todo item");
    setTimeout(() => setError(""), 3000);
   }
}).catch((err)=>{
    setError("Unable to connect to the server");
})
}
else{
    setError("Update fields cannot be empty");
    setTimeout(() => setError(""), 3000);
}

} 
const handleEditCancel=()=>{
    setEditId(-1);
}
const handleDelete=(id)=>{
if(window.confirm("Are you sure to delete this item?")){
    fetch(apiUrl+"/todos/"+id,{
        method:"DELETE"
    }).then((res)=>{    
        const updatedTodos = todos.filter((item)=>item._id!==id)
        setTodos(updatedTodos);
    })
}
}
    return  <>
    <div className="app-wrapper">
      <div className="content">
    <div className="row p-3 bg-success text-light">
        <h1 style={{textAlign:'center'}}>Task Overview Dashboard </h1>
    </div>
    <div className="row">
       <h3>Add Items</h3>
       {message&&<p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
        <input placeholder="Enter Title here" className="form-control" onChange={(e)=>setTitle(e.target.value)} value={title} type="text" />
        <input  placeholder="Enter Description here" className="form-control" onChange={(e)=>setDescription(e.target.value)} value={description} type="text"/>
        <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
    </div>
   {error&&<p className="text-danger">{error}</p>}
    </div>
    <div className="row mt-3">
        <h3>Tasks</h3>
        <div className="col-md-6">
        <ul className="list-group">
            {
                todos.map((item)=>
               <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                <div className="d-flex flex-column">
                    {
                        editId== -1 || editId !== item._id ? <>
                <span style={{ fontSize: "19px", fontWeight: "600" }}>{item.title}</span>
                <span style={{ fontSize: "17px" }}>{item.description}</span>
                   </> : <>
                   <div className="form-group d-flex gap-2">
        <input placeholder="Enter Title here" className="form-control" onChange={(e)=>setEditTitle(e.target.value)} value={editTitle} type="text" />
        <input  placeholder="Enter Description here" className="form-control" onChange={(e)=>setEditDescription(e.target.value)} value={editDescription} type="text" />

    </div>
                    </>
                    }
                
                </div>
                <div className="d-flex gap-2">
                { editId==-1 ? <button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button>:<button className="btn btn-warning" onClick={handleUpdate}>Update</button>}
                { editId==-1 ? <button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>:<button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
                </div>
               </li>
                )
            }
            </ul>
            </div>
            
    </div>
    </div> 
    <Footer/>
    </div>
    </>
}