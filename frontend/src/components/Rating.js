function Rating(props){
    const {rating, numReviews} = props;
    return(
        <div className="rating">
        <span>
            <i className={rating>=1
             ?'fas fas-star':
            rating>=0.5 ?
            'fas fa-star-half-alt' 
            : 'far fa-star'}/>
        </span>

        <span>
            <i className={rating>=2
             ?'fas fas-star':
            rating>=1.5 ?
            'fas fa-star-half-alt' 
            : 'far fa-star'}/>
        </span>

        <span>
            <i className={rating>=3
             ?'fas fas-star':
            rating>=2.5 ?
            'fas fa-star-half-alt' 
            : 'far fa-star'}/>
        </span>

        <span>
            <i className={rating>=4
             ?'fas fas-star':
            rating>=3.5 ?
            'fas fa-star-half-alt' 
            : 'far fa-star'}/>
        </span>

        <span>
            <i className={rating>=5
             ?'fas fas-star':
            rating>=4.5 ?
            'fas fa-star-half-alt' 
            : 'far fa-star'}/>
        </span>
        <span>{numReviews} reviews</span>
        </div>
    )
}
export default Rating;