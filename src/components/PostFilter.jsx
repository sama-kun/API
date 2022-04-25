import React from 'react';
import MyInput from "./UI/input/myInput";
import MySelect from "./UI/select/MySelect";

const PostFilter = ({filter,setFilter}) => {
    return (

            <div>
                <MyInput
                    value = {filter.query}
                    onChange = {e=>setFilter({...filter, query:e.target.value})}
                    placeholder = 'search'

                />
                <MySelect
                    value={filter.sort}
                    onChange={selectedSort=>setFilter({...filter,sort: selectedSort})}
                    opts={[
                        {value :'title',name:'Sort by title'},
                        {value: 'desc', name:'Sort by description'},
                    ]}/>
            </div>

    );
};

export default PostFilter;