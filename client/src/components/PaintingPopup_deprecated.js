import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { getPainting } from '../actions/paintingsActions';
import { basket_item_add } from '../actions/basketActions';

import Slideshow from './Slideshow';
import RequestPainting from './RequestPainting';


class PaintingPopup extends Component{
    constructor(props){
        super(props);

        this.state = {
            refreshPreview: false, //Switch that flips to rerender component
            painting: undefined,
        }
    }

    componentDidUpdate(prevProps, prevState){
        // Handling refresh
        if (this.props.refreshPreview !== prevProps.refreshPreview){
            this.setState({ refreshPreview: !this.state.refreshPreview, painting: this.props.painting })
        }
    }

    static getDerivedStateFromProps(props, state) {

        // Getting painting into state.
        if(!state.painting){
            if(props.painting){
                // Painting in props
                state = {...state, painting: props.painting}; // Check if painting actually in props
            } else {
                // Painting not in props
                const paintingId = props.paintingId;
                if(paintingId){
                    const availableIds = Object.keys(props.paintingDict);
                    if (!availableIds.includes(paintingId)){
                        // Start loading picture
                        if (!props.allLoading){
                            // Only does this if all paintings are not loading
                            props.getPainting(paintingId);
                        }
                    } else {
                        // Includes id needed
                        state = {...state,
                            painting: props.paintingDict[paintingId]
                        };
                    }
                }
            }
        }

        // END WITH RETURNING STATE
        return state; //Have to return something.
    }

    On_Add_Item_To_Basket = (e) => {
      this.props.basket_item_add( this.state.painting._id );
    }

    render() {
        if (this.state.painting){
            const {_id,name,filename,description} = this.state.painting;
            //const formattedDate = this.formatDate(date);
            return (
                <React.Fragment>
                    {/* This is the section that shows when the main painting is clicked. */}
                    <div className='painting-photo-popup' id={_id}>
                        <div className='oneColumn'>
                            <Slideshow filenames={filename}></Slideshow>

                            <div className='meta-data'>
                                <h4 className='painting-title'>{name}</h4>
                                <div className='painting-description'>
                                    {description}
                                </div>
                                {this.genFeatures()}
                                <p>You can purchase this artwork by emailing luda.silina@gmail.com or by writing below.</p>
                            </div>
                        </div>
                    </div>
                    {/* Form to order this painting (by message) */}
                    <RequestPainting paintingID={_id} paintingName={name}/>

                </React.Fragment>
            )
        }
        else {
            return '';
        }
    }

    formatDate = date => {
        if (date){
            const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            const month = parseInt(date.substring(5,7)-1);
            const formattedMonth = MONTHS[month];
            const year = date.substring(0,4);
            const formattedDate = `${formattedMonth} ${year}`;
            return formattedDate;
        } else {
            return '';
        }
    }

    genFeatures = () =>{
        if (this.state.painting){
            const {materials,size,price,status} = this.state.painting;
            const featureList = [];
            if (materials){
                let value = materials;
                let insert = (
                    <>
                        <i className='fas fa-palette'></i><p>{value}</p>
                    </>
                );
                featureList.push(insert);
            }

            if (status==='Available'){
                if (price){
                    let value = '£'+parseFloat(price).toFixed(2).toString()
                    let insert = (
                        <>
                            <i className='fas fa-money-bill-wave'></i><p>{value}</p>
                        </>
                    );
                    featureList.push(insert);
                }
            }


            if (size){
                let value = size;
                let insert = (
                    <>
                        <i className='fas fa-pencil-ruler'></i><p>{value}</p>
                    </>
                )
                featureList.push(insert);
            }

            // Display if features present
            if (featureList.length > 0){
                const insert = (
                    <div className='painting-features'>
                        <ul>
                            {featureList.map(feature => {
                                return (<li key={featureList.indexOf(feature)}>{feature}</li>);
                            })}
                        </ul>
                    </div>
                );

                return insert;
            } else {
                return '';
            }
        }
    }

    genButton = status => {
        if (status){

            switch(status){
                /*case 'Available':
                    const price = this.props.painting.price;
                    if(price){
                        return (<button type='button'>Add to Cart - {'£'+price.toString()}</button>);
                    } else {
                        return (<button type='button'>Request this Painting</button>);
                    }
                */

                case 'Available':
                    return (<button type='button'>Request this Painting</button>);

                case 'Reserved':
                    return (<button type='button' disabled>This Painting is Reserved.</button>);

                case 'Sold':
                    return (<button type='button' disabled>This Painting Already has a Home</button>);

                default:
                    return '';
            }


        } else {
            return '';
        }
    }
}


PaintingPopup.propTypes = {
    paintingDict: PropTypes.object.isRequired,
    allLoading: PropTypes.bool.isRequired,

    getPainting: PropTypes.func.isRequired,
    basket_item_add: PropTypes.func.isRequired,

    paintingId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    paintingDict: state.paintings.paintingDict,
    allLoading: state.paintings.allLoading,
});

export default connect(mapStateToProps, { getPainting, basket_item_add })(PaintingPopup);
