import React, {useEffect, useMemo} from "react";
import {useState} from "react";
import PostList from '../components/postList'
import MyForm from "../components/myForm";
import PostFilter from "../components/PostFilter";
import PostService from "../API/PostService";
import '../styles/App.css';




function Posts() {

    const [posts,setPosts] = useState([

    ])

    useEffect(()=>{
        fetchPosts()
    }, []);

    const fetchPosts = async () =>{
        const posts = await PostService.getAll();
        setPosts(posts);
    }

    const createPost = async(newPost)=>{
        const newP = await PostService.create({
            title: newPost.title,
            desc: newPost.desc
        })
        console.log(newP)
        setPosts([...posts,newPost])
    }
    const removePost = async (post)=>{
        const deleted = await PostService.delete(post.id)
        setPosts(posts.filter(p=>p.id !== post.id))
    }


    const [filter,setFilter] = useState({
        sort:'',query:''
    })

    const sortedPosts = useMemo(()=>{
        console.log('Called function')

        if(filter.sort){
            return [...posts].sort((a,b)=>a[filter.sort].localeCompare(b[filter.sort]))
        }
        return posts;
    },[filter.sort,posts])

    const sortedAndSearchedPosts = useMemo(()=>{
        return sortedPosts.filter(post=> post.title.toLowerCase().includes(filter.query.toLowerCase()))
    },[filter.query,sortedPosts])


  return (
    <div className="App">
        <MyForm create={createPost} />
        <hr style={{margin:'15px 0'}}/>
        <PostFilter filter={filter} setFilter={setFilter}/>
        {sortedAndSearchedPosts.length
            ?   <PostList remove={removePost} posts={sortedAndSearchedPosts} title={'JavaScript'}/>
            :   <h1 style={{textAlign:"center"}}>List of empty</h1>
        }


        {/*<PostList posts={posts} title={'ToDoList'}/>*/}
    </div>
  );
}

export default Posts;
