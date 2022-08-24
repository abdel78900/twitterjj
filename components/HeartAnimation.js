import React from 'react'


const HeartAnimation = ({liked}) => {
    return (
        <div className={`heart ${liked && "is-active"} icon overflow-visible`}></div>
    )
}

export default HeartAnimation
