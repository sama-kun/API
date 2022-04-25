import React from 'react';
import classes from "./MyForm.module.css";

const MyInput = React.forwardRef( (props,ref) => {
    return (
        <input ref={ref} className={classes.myInput} {...props}>

        </input>
    );
});

export default MyInput;