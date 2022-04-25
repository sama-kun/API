import React, {useState} from 'react';
import '../styles/App.css'
import MyButton from "./UI/button/MyButton";

const PostItem = (props) => {


    return (
        <div className='post'>
            <div className="post__title">
                <strong>{props.number}.{props.post.title}</strong>
                <div>{props.post.desc}</div>
            </div>
            <div className="post__btn">

                <MyButton onClick={()=>props.remove(props.post)}>Delete</MyButton>
            </div>
        </div>
    );
};

export default PostItem;