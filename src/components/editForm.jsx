import React, {useEffect, useState} from 'react';
import MyInput from "./UI/input/myInput";
import MyButton from "./UI/button/MyButton";
import PostService from '../API/PostService';
import { useNavigate } from 'react-router-dom';

const EditForm = ({todo,id}) => {
    const router = useNavigate();
    const [post,setPost] = useState({})

    const fetchEditPost = async(e) =>{
        e.preventDefault()
        const newPost = {
            ...post
        }
        
        const edited = await PostService.edit(id,post);

        setPost(edited);
        router(-1);
    }

    return (
        <from>
            <MyInput
                type="text"
                placeholder='Title of post'
                value={post.title}
                onChange={e=> setPost({...post,title:e.target.value})}
            />
            <MyInput
                value = {post.desc}
                onChange={e=> setPost({...post,desc:e.target.value})}
                type="text"
                placeholder='Description of post'
            />
            <MyButton onClick={fetchEditPost}>Edit</MyButton>

        </from>
    );
};

export default EditForm;