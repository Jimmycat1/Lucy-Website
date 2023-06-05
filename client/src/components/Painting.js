import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link, Redirect} from 'react-router-dom';

import { getPainting } from '../actions/paintingsActions';


class Painting extends Component{

    constructor(props) {
        super(props);

        this.state = {
            painting: {},
            redirect: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        const paintingId = props.paintingId;
        const availableIds = Object.keys(props.paintingDict);
        if (!availableIds.includes(paintingId)){
            if (!props.allLoading){
                // Only does this if all paintings are not loading
                props.getPainting(paintingId);
            }
        } else {
            // Includes id needed
            return {...state,
                painting: props.paintingDict[paintingId]
            };
        }
        return {...state}; //If unreturned
    }

    linkClicked = () => {
        // Redirect to page with painting (painting popup)
        this.setState({redirect: true})
    }

    render(){
        const painting = this.state.painting;
        if (painting){
            const {_id,name,filename,date} = painting;
            const formattedDate = this.formatDate(date);

            if(painting.status === 'Draft' && this.props.displayDrafts!==true){
                return ('');
            }

            if ((this.props.displayFull === true) && filename){
              if (this.state.redirect === true){
                return (<>
                  <Redirect to={'/paintings/'+_id }/>
                </>)
              } else {
                return (
                    <React.Fragment>
                        {/* This is the main painting that shows up in a list */}
                        <div className = 'painting-photo--new' id={'CONTAINER'+_id} >
                        <a disabled onClick={this.linkClicked}>
                            <img src={`/images/${filename[0]}`} alt='painting' id={'IMG'+_id}/>
                            <div className='meta-data'>
                                <h4>{name}</h4>
                                <p>{formattedDate}</p>
                            </div>
                        </a>
                        </div>
                    </React.Fragment>
                );
              }
            }
            else if ((this.props.displayFull === false) && filename){
                return (
                    <>
                        <div className='painting-photo' style={{
                            'backgroundImage':`url('/images/${filename[0]}')`
                        }}>
                            <div className='meta-data'>
                                <h4>{name}</h4>
                                <p>{formattedDate}</p>
                            </div>
                            <a href={this.props.linkTo ? (this.props.linkTo): ('/paintings/'+_id)}></a>
                        </div>
                    </>
                );
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    componentDidMount = () => {
        if(this.props.displayFull===true){
            if (this.state.painting){
                //window.addEventListener("resize", this.calculateHeight(this.state.painting._id));
            }
        }
    }

    calculateHeight = id => () =>{
        try{
            if (this.state.painting){
                // Set META div height to image height.
                var id = this.state.painting._id;
                var img = document.querySelector('#IMG'+id);
                var container = document.querySelector('#CONTAINER'+id);
                container.style.height = img.clientHeight.toString()+'px';
            }
        } catch {
            return;
        }
    }


    formatDate = date => {
        if(date){
            const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            const month = parseInt(date.substring(5,7)-1);
            const formattedMonth = MONTHS[month];
            const year = date.substring(0,4);
            const formattedDate = `${formattedMonth} ${year}`;
            return formattedDate;
        }
        return '';
    }
}

Painting.propTypes = {
    paintingDict: PropTypes.object.isRequired,
    allLoading: PropTypes.bool.isRequired,

    getPainting: PropTypes.func.isRequired,

    paintingId: PropTypes.string.isRequired,
    displayFull: PropTypes.bool.isRequired,
    displayDrafts: PropTypes.bool,
    linkTo: PropTypes.string,
}

const mapStateToProps = state => ({
    paintingDict: state.paintings.paintingDict,
    allLoading: state.paintings.allLoading,
});

export default connect(mapStateToProps, {getPainting})(Painting);
