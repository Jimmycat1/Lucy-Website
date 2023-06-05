import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CloseUpImage extends Component{
    constructor(){
        super()
        this.input = React.createRef();
        this.output = React.createRef();
        this.outputContainer = React.createRef();

        this.state = {
            offsetH_multiplier: 0,
            offsetW_multiplier: 0,
        }
    }

    //  ====================== LIFECYCLE =========================  //

    componentDidMount(){
        // Call after setState because elements will be rendered for sure 
        // by the time callback is invoked.
        this.setState({}, ()=>{

            this.addListeners()
            
        })
    }

    componentDidUpdate(prevProps){
        if (this.props !== prevProps){
            this.removeListeners()
            this.addListeners()
        }
    }

    componentWillUnmount(){
        this.removeListeners()
    }
    
    //  ====================== LISTENERS =========================  //
    addListeners = () => {
        // Calculate initial multipliers
        this.calculateNewMultipliers();

        // Show close up on hover
        this.input.current.addEventListener('mouseenter', this.mouseEnterListener)
        this.input.current.addEventListener('mouseleave', this.mouseLeaveListener)
    
        // Move close up when mouse moves
        this.input.current.addEventListener('mousemove', this.mouseMoveListener)

        // Recalculate multipliers
        window.addEventListener('resize', this.resizeListener)
    }

    removeListeners = () => {
        // Show close up on hover
        this.input.current.removeEventListener('mouseenter', this.mouseEnterListener)
        this.input.current.removeEventListener('mouseleave', this.mouseLeaveListener)
    
        // Move close up when mouse moves
        this.input.current.removeEventListener('mousemove', this.mouseMoveListener)
        
        // Recalculate multipliers
        window.removeEventListener('resize', this.resizeListener)
    }

    // All listeners
    mouseEnterListener = e => {
        this.outputContainer.current.style.visibility = 'visible';
    }
    mouseLeaveListener = e => {
        this.outputContainer.current.style.visibility = 'hidden';
    }
    mouseMoveListener = e => {
        let x = this.state.offsetW_multiplier * e.offsetX;
        let y = this.state.offsetH_multiplier * e.offsetY;
        this.output.current.style.left = `${x.toString()}px`;
        this.output.current.style.top = `${y.toString()}px`;
    }
    resizeListener = e => {
        this.calculateNewMultipliers();
    }

    //  ====================== USEFUL FUNCTIONS =========================  //

    // Also sets size of zoomed image
    calculateNewMultipliers = () => {
        let outputContainer = this.outputContainer.current;
        let input = this.input.current;
        let zoomLevel = this.props.zoomLevel;

        // Calculate new multipliers
        let outputH = outputContainer.clientHeight;
        let outputW = outputContainer.clientWidth;

        // >>> When window dimensions are different
        // let inputH = input.clientHeight;
        // let inputW = input.clientWidth;

        // let ratioH = outputH / inputH;
        // let ratioW = outputW / inputW;

        // let fullWidthRatio = zoomLevel * ratioW;

        // let offsetW_multiplier = ratioW - fullWidthRatio;
        // let offsetH_multiplier = ratioH - fullWidthRatio;

        // >>> When the window dimensions are the same
        let offsetW_multiplier = - (zoomLevel-1);
        let offsetH_multiplier = offsetW_multiplier;

        // Zoom close up image to correct size
        this.output.current.style.width = `${outputW * zoomLevel}px`;

        // Set new multipliers
        this.setState({
            offsetW_multiplier, 
            offsetH_multiplier
        })

    }

    //  ====================== RENDER =========================  //

    render(){
        return (<>
            <div className='closeUpImage'>
                <img alt='painting' src={this.props.imgSrc}></img>
                <div className='closeUpImage--outputWindow' ref={this.outputContainer}>
                    <img alt='close-up' src={this.props.imgSrc} ref={this.output}/>
                </div>
                <div className='closeUpImage--inputWindow' ref={this.input}>

                </div>
            </div>
        </>)
    }

}

CloseUpImage.propTypes = {
    imgSrc: PropTypes.string.isRequired,
    zoomLevel: PropTypes.number.isRequired
}


export default CloseUpImage;