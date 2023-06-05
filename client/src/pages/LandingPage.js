import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Painting from '../components/Painting';
import { getPaintings } from '../actions/paintingsActions';
import { showCasePaintingIds, contact_instagram, contact_facebook } from '../config';

class LandingPage extends Component {
    constructor() {
        super();

        this.state = {}
    }

    componentWillMount() {
        this.props.getPaintings();
    }

    render(){

        return (
            <React.Fragment>
                <div id='header' className='section'>
                    <div id='img_lucy_container'>
                        <div id='img_lucy_main' className='img_lucy'></div>
                    </div>

                    <div id='main_intro_container' className = 'align-center'>
                        <div id='main_intro'>
                            <h1 className='heading-big'>Lucy Silina</h1>
                            <h2 className='heading-sub'>Producing beautiful paintings with character</h2>
                            <div id='icons'>
                                <a id='facebook'    href={contact_facebook}
                                    className="fab fa-facebook-f"       target='_blank' rel='noopener noreferrer'></a>

                                <a id='instagram'   href={contact_instagram}
                                    className="fab fa-instagram"        target='_blank' rel='noopener noreferrer'></a>

                                <a id='mail'        href='#contact'
                                    className="fas fa-envelope-square"  target='_self'></a>
                            </div>
                        </div>
                    </div>
                </div>

                {
                (showCasePaintingIds.length > 0)
                    ?(  <div id='paintings' className='container section'>
                            <h3 className='heading-medium'>Latest Paintings</h3>
                            <p className='description'>Feel free to look closer by clicking on one.</p>
                            <div className='painting-photo-container'>
                                {/* Show the paintings referenced above.*/}
                                {showCasePaintingIds.map(id =>
                                    (<Painting key={id} paintingId={id} displayFull={false}/>)
                                )}
                            </div>
                            <a href='/paintings/gallery' className='button-regular'>Show All Artworks &rarr;</a>
                            <br/>
                        </div>)
                    :('')
                }

                <div className='container section full-screen-height'>
                    <div id='paintings-cta'>
                        <h3 className='heading-medium'>Want a painting for yourself?</h3>
                        <div className='two-columns'>
                            <div className='photo-selection'>
                                <img src='images/Painting7.jpg' alt='painting'></img>
                                <img src='images/Painting3.jpg' alt='painting'></img>
                                <img src='images/Painting2.jpeg' alt='painting'></img>
                            </div>
                            <div className='bulletpoints'>
                                <p className='description'>
                                    Get an amazing painting to hang in your bedroom, your living room or your kitchen and marvel at.
                                </p>
                                <ul>
                                    <li>Many Options</li>
                                    <li>Truly beautiful (a bit biast)</li>
                                    <li>Delivered right to your doorstep</li>
                                </ul>
                            </div>
                        </div>
                        <a href='/paintings/gallery/#top' className='button-regular'>Discover Paintings</a>
                        {/*<p style={{'textAlign':'center'}}>----- OR -----</p>*/}
                        {/*<div className='feature-card feature-card--2'>
                            <h3>Personalise your painting</h3>
                            <div className='photo-selection'>
                                <img src='images/IMG_5741.JPG'></img>
                            </div>
                            <ul>
                                <li>Your imagination is the only limit</li>
                                <li>A painting that fits your home</li>
                                <li>Also a perfect gift</li>
                                <li>Just send me a photo or description</li>
                            </ul>
                            <a href='#paintings' className='button-regular'>Custom Order</a>
                        </div>*/}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    getPainting = id => {
        const paintings =  this.props.paintings;
        for (var i=0;i<paintings.length; i++){
            const painting = paintings[i];
            if (painting.id === id){
                return {
                    found: true,
                    painting
                };
            }
        }
        return {
            found: false
        };
    }

};

LandingPage.propTypes = {
    paintings: PropTypes.object.isRequired,

    getPaintings: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    paintings: state.paintings,
});

export default connect(mapStateToProps, {getPaintings})(LandingPage);
