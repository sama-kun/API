import React, {useMemo} from "react";
import {useState} from "react";
import PostList from './components/postList'
import MyForm from "./components/myForm";
import PostFilter from "./components/PostFilter";

function App() {

    const [posts,setPosts] = useState([
        {title:'JavaScript',desc:'Programming language',id:1},
        {title:'C++',desc: 'High level programming language',id: 2},
        {title:'Java',desc: 'Low level programming language for software',id: 3}
    ])

    const createPost =(newPost)=>{
        setPosts([...posts,newPost])
    }
    const removePost = (post)=>{
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
        <MyForm create={createPost}/>
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

export default App;
