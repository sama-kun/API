import React from "react";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import About from "./pages/About";
import Posts from "./pages/Posts";
import PostIdItem from "./pages/PostIdItem";


function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/about" element={<About/>}/>
        <Route exact path="/posts" element={<Posts/>}/>
        <Route exact path="/posts/:id" element={<PostIdItem/>}/>

    </Routes>
    </BrowserRouter>
  );
}

export default App;
