import React, {useState} from 'react';
import MyInput from "./UI/input/myInput";
import MyButton from "./UI/button/MyButton";

const MyForm = ({create}) => {

    const [post,setPost] = useState({title:'',desc:''})


    const addNewPost = (e) =>{
        e.preventDefault()
        const newPost = {
            ...post,id:Date.now()
        }
        create(newPost)
        //setPosts([...posts,{...post,id:Date.now()}])
        setPost({title:'',desc: ''})
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
            <MyButton onClick={addNewPost}>Add new post</MyButton>
        </from>
    );
};

export default MyForm;