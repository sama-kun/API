import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostService from "../API/PostService";
import EditForm from "../components/editForm";
// import editForm from "../components/editForm";


function PostIdItem() {
    const params = useParams();
    const [post, setPost] = useState({});

    useEffect(()=>{
        fetchPost(params.id)
    }, [])

    const fetchPost = async(id) => {
        const res = await PostService.getById(id);
        setPost(res)
    }

  return (
    <div>

        <h1>Title: {post.title} {post.id}</h1>
        <h1>Description: {post.desc}</h1>
        <EditForm todo={post} id={params.id}/>
    </div>
  );
}

export default PostIdItem;