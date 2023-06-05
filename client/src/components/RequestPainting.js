
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { placeMessageOrder } from '../actions/userMessageActions';
import Checkbox from './small/checkbox';
import { connect } from 'react-redux';


class RequestPainting extends Component{
    constructor(props){
        super(props)

        // What form should reset to
        this.formDataTemplate = {
            questions: false,
            purchase: false,
            firstName: '',
            email: '',
            message: `Hi, I'd like to order this lovely "${props.paintingName}" painting...`,
        };

        this.state = {
            formData: this.formDataTemplate
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.formData)
        this.props.placeMessageOrder({
            questions: this.state.formData.questions,
            purchase: this.state.formData.purchase,
            name: this.state.formData.firstName,
            email:this.state.formData.email,
            message: this.state.formData.message,
            paintingID: this.props.paintingID,
        })
    }

    handleChange = (e) => {
        this.setState({
            formData: {...this.state.formData,
                [e.target.name]: e.target.value
            }
        });
    }

    // // For changing nested values
    // setField = (keyStack) => (value) => {
    //     let newFormData = setNestedField(this.state.formData, keyStack, value);
    //     this.setState({
    //         formData: newFormData
    //     })
    // }

    // Set form Data field
    setField = (key) => (value) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [key]:value
            }
        })
    }


    render(){
        return (<div className='container'>
            <div className='contact-form'>
                <h3 className='heading-big'>Request this painting</h3>
                <form ref={this.requestForm}
                    method='POST'
                    onSubmit={this.onSubmit}>


                    <input type='text'
                        placeholder='Your name...'
                        name='firstName'
                        required={false}
                        value={this.state.formData.firstName}
                        onChange={this.handleChange}
                    />
                    <input type='email'
                        placeholder='Your email...'
                        required={true}
                        name='email'
                        value={this.state.formData.email}
                        onChange={this.handleChange}
                    />
                    <textarea rows='5'
                        maxLength='2500'
                        placeholder='Your message... (optional)'
                        name='message'
                        value={this.state.formData.message}
                        onChange={this.handleChange}
                        required={false}
                    ></textarea>
                    <Checkbox
                        check={this.state.formData.questions}
                        setCheck={this.setField('questions')}
                    >I have some questions...</Checkbox>
                    <Checkbox
                        check={this.state.formData.purchase}
                        setCheck={this.setField('purchase')}
                    >I'd like to buy this artwork...</Checkbox>

                    <input type='submit' value='Send Request &rarr;'/>
                </form>
            </div>
        </div>)
    }
}

RequestPainting.propTypes = {
    paintingID: PropTypes.string.isRequired,
    paintingName: PropTypes.string.isRequired,
    placeMessageOrder: PropTypes.func.isRequired,
}

const mapStateToProps = () => ({

})

export default connect(mapStateToProps, {placeMessageOrder})(RequestPainting);
