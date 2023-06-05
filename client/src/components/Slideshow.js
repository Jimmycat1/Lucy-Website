import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import CloseUpImage from './CloseUpImage';
import {zoom} from '../config';

function Slideshow ({filenames}){
  const slideCount = filenames.length;
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <>
    <div className='image-slideshow'>
        {filenames.map((imagename, index) => {
            let isTheOne = (slideIndex === index);
            return (
                <div key={index} className='image-slideshow--slide fade'
                style={{"display":isTheOne?"block":"none"}}>
                    <CloseUpImage zoomLevel={zoom} imgSrc={`/images/${imagename}`} visible={isTheOne}/>
                </div>
            )
        })}

        <button className="image-slideshow--prev" type='button' onClick={() => {
          setSlideIndex((slideIndex - 1) % (slideCount))
        }}>
            &#10094;
        </button>
        <button className="image-slideshow--next" type='button' onClick={() => {
          setSlideIndex((slideIndex + 1) % (slideCount))
        }}>
            &#10095;
        </button>

        <div className='image-slideshow--dots'>
            {filenames.map((imagename, index)=>(
                <span key={index} className={`image-slideshow--dot ${((index===slideIndex)?"active":"")}`}
                onClick={()=>{setSlideIndex(index)}}></span>
            ))}
        </div>
    </div>
    </>
  )
}

/*
class Slideshow extends Component{
    constructor(props){
        super(props)
        this.container = React.createRef();
        this.state = {
            slideIndex: 1,
        }
    }

    componentDidMount = () => {
        this.showSlide(1);
    }

    render(){
        const filenames = this.props.filenames;
        if(filenames){
            return (
                <>
                <div className='image-slideshow' ref={this.container}>
                    {filenames.map((imagename, index) => {
                        let visible = (this.state.slideIndex===index);

                        return (
                            <div key={index} className='image-slideshow--slide fade'>
                                <CloseUpImage zoomLevel={3} imgSrc={`/images/${imagename}`} visible={visible}/>
                                {/*<img src={`/images/${imagename}`} alt='painting'></img>*//*}
                            </div>
                        )
                    })}

                    <button className="image-slideshow--prev" onClick={this.plusSlides(-1)} type='button'>
                        &#10094;
                    </button>
                    <button className="image-slideshow--next" onClick={this.plusSlides(1)} type='button'>
                        &#10095;
                    </button>

                    <div className='image-slideshow--dots'>
                        {filenames.map((imagename, index)=>(
                            <span key={index} className="image-slideshow--dot" onClick={this.currentSlide(index+1)}></span>
                        ))}
                    </div>
                </div>
                </>
            );
        } else {
            debugger;
            return ('');
        }
    }

    plusSlides = (amount) => () => {
        var newIndex = this.changeStateSlideIndex(this.state.slideIndex + amount);
        this.showSlide(newIndex);
    }

    currentSlide = (index) => () => {
        var newIndex = this.changeStateSlideIndex(index);
        this.showSlide(newIndex);
    }

    showSlide = (n) => {
        var i;
        var container = this.container.current;
        debugger;
        var slides = container.getElementsByClassName("image-slideshow--slide");
        var dots = container.getElementsByClassName("image-slideshow--dot");

        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[n-1].style.display = "block";
        dots[n-1].className += " active";
    }

    changeStateSlideIndex = (n) => {
        var container = this.container.current;
        var slides = container.getElementsByClassName("image-slideshow--slide");
        var newIndex;
        if (n > slides.length) {
            newIndex = 1;
        } else if (n < 1) {
            newIndex = slides.length;
        } else {
            newIndex = n;
        }
        this.setState({
            slideIndex: newIndex,
        })
        return newIndex;
    }
}
Slideshow.propTypes = {
    filenames: PropTypes.array.isRequired,
}
*/

export default Slideshow;
