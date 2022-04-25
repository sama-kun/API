import React from 'react';

const MySelect = ({opts,value,onChange}) => {
    return (
        <select
            value={value}
            onChange={e=> onChange(e.target.value)}
        >
            <option selected={true} disabled>Sort</option>
            {opts.map(opt=>
                <option key={opt.value} value={opt.value}>
                    {opt.name}
                </option>
            )}
        </select>
    );
};

export default MySelect;