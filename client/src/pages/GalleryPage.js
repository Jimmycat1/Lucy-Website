import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Painting from '../components/Painting';

import { getPaintingIds } from '../actions/paintingsActions';

class Gallery extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    componentWillMount() {
        this.props.getPaintingIds();
    }

    render() {
        const paintingIdList = this.props.paintings.paintingIdList;
        return (
            <React.Fragment>
                <div id='gallery'>
                    {/*<p>{loading?'True':'False'}</p>*/}
                    <div className='container'>

                        <h3 className='heading-medium'>My Gallery</h3>
                        <p className='heading-sub'>My paintings through the years...</p>
                        <div className='painting-photo-container--flex'>

                            {paintingIdList.map((id) => 
                                (<Painting key={id} paintingId={id} displayFull={true}/>)
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

};

Gallery.propTypes = {
    paintings: PropTypes.object.isRequired,

    getPaintingIds: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    paintings: state.paintings,
});

export default connect(mapStateToProps, { getPaintingIds })(Gallery);
