import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {USE_CAPTCHA, contact_email} from '../config';
import {generateCaptcha, generateCanvasFromCaptcha} from '../utils/captcha';

import {sendContactFormEmail} from '../actions/userMessageActions';

class ContactForm extends Component{
    constructor() {
        super();

        this.state = {
            name:'',
            email:'',
            message:'',
            messageFromServer: '',
        }

        if (USE_CAPTCHA){
          this.state.captchaLength = 5;
          this.state.correctCaptcha = generateCaptcha(5);
          this.state.captchaMessage = "Please enter these leters below. (unless you're a robot)";
        }
    }

    componentDidMount() {
      if (USE_CAPTCHA){
        generateCanvasFromCaptcha(this.state.correctCaptcha)
      }
    }

    render(){
        return (
            <div className='contact-form' id='contact'>
                <h3 className='heading-big' >Any questions?</h3>
                <form method='POST' onSubmit={this.onSubmit} id='CONTACTFORM'>
                    <input type='text'
                        placeholder='Your name...'
                        name='name'
                        onChange={this.handleChange('name')}
                        required={true}
                        value={this.state.name}>
                    </input>
                    <input type='email'
                        placeholder='Your email...'
                        name='email'
                        onChange={this.handleChange('email')}
                        required={true}
                        value={this.state.email}>
                    </input>
                    <textarea rows='5'
                        maxLength='2500'
                        placeholder='Your message...'
                        name='message'
                        onChange={this.handleChange('message')}
                        required={true}
                        value={this.state.message}>
                    </textarea>

                    {USE_CAPTCHA?
                      (<div className='captcha'
                          style={{ 'display': (this.readyForCaptcha())?'block':'none'}}
                      >
                          <h6>{this.state.captchaMessage}</h6>
                          <div className='captcha-canvas' id='captcha-canvas'>

                          </div>
                          <input name='enteredCaptcha' value={this.state.enteredCaptcha} onChange={this.handleChange('enteredCaptcha')}></input>
                      </div>)
                      :('')}

                    <input type='submit' value='Send Message &rarr;'/>
                </form>
            </div>
        );
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    }

    readyForCaptcha = () => {
        if ((this.state.name !== '')&&(this.state.email !== '')&&(this.state.message !== '')) {
            return true
        }
        return false
    }

    onSubmit = e => {
      if (USE_CAPTCHA){
        e.preventDefault();
        if(this.captchaValid()){
            this.props.sendContactFormEmail(this.state.name, this.state.email, this.state.message);
            this.resetCaptcha();
        } else {
            this.resetCaptcha();
            this.setCaptchaMessage('Try again...');
        }
      } else {
        e.preventDefault()
        this.props.sendContactFormEmail(this.state.name, this.state.email, this.state.message);
      }
    }

    captchaValid = () => {
        if(this.state.correctCaptcha === this.state.enteredCaptcha){
            return true
        } else {
            return false
        }
    }

    setCaptchaMessage = msg => {
        this.setState({
            captchaMessage: msg
        })
    }

    resetCaptcha = () => {
        let newCaptcha = generateCaptcha(this.state.captchaLength);
        this.setState({
            correctCaptcha: newCaptcha,
            enteredCaptcha: '',
            captchaMessage:"Please enter these leters below. (unless you're a robot)",
        });
        generateCanvasFromCaptcha(newCaptcha);
    }

    outputResponseMessage = () => {
        if (this.state.messageFromServer==='SENT'){
            return ("Your message has been sent. I'll get back to you as soon as possible.");
        } else if (this.state.messageFromServer==='NOT_SENT'){
            return (<p>Oops! Something went wrong... You can always email me yourself, though, at
                        <span style={{'fontWeight':'bold'}}>{contact_email}</span>
                    </p>);
        } else {
            return ('')
        }
    }
}

ContactForm.propTypes = {
    sendContactFormEmail: PropTypes.func.isRequired
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps,{sendContactFormEmail})(ContactForm);

// https://itnext.io/password-reset-emails-in-your-react-app-made-easy-with-nodemailer-bb27968310d7
