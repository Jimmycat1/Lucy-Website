import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Painting from '../../components/Painting';

import { getPaintingIds } from '../../actions/paintingsActions';

class AdminPaintingsSelector extends Component {
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
                <div id='AdminPaintingsSelector'>
                    {/*<p>{loading?'True':'False'}</p>*/}
                    <div className='container'>
                        <div className='twoColumns margin-top-B'>
                            <h3>My Paintings</h3>
                            <div style={{'display':'flex','justifyContent':'flex-end','alignItems':'flex-end'}}>
                                <a href='/admin/paintings/add' target='_self' className='ADMIN-button'>
                                    <i className='fas fa-plus'></i> Add painting
                                </a>
                            </div>
                        </div>
                        <div className='painting-photo-container'>

                            {paintingIdList.map((id) =>
                                (
                                    <Painting key={id} paintingId={id} displayFull={false} displayDrafts={true} linkTo={`/admin/paintings/${id}/edit`}/>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

};

AdminPaintingsSelector.propTypes = {
    paintings: PropTypes.object.isRequired,

    getPaintingIds: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    paintings: state.paintings,
});

export default connect(mapStateToProps, { getPaintingIds })(AdminPaintingsSelector);
