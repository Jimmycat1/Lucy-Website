import {contact_instagram, contact_email, contact_facebook} from '../config.js';
import React, {Component} from 'react';
import SideButton from '../components/sidebutton';

class LandingPage2 extends Component {
  constructor(){
    super()
  }

  render(){ return(
    <div id='landingPage'>

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
              <div className='button-holder'>
                <SideButton props={{
                  text: 'See my paintings',
                  href: '/paintings/gallery',
                  text_color: 'rgb(220,255,200)',
                  background_color: 'rgb(50, 100, 50)'
                }}/>
                <SideButton props={{
                    text: 'Find out more about me',
                    href: '/about',
                    text_color: 'rgb(220,255,200)',
                    background_color: 'rgb(50, 100, 50)'
                  }}/>
                <SideButton props={{
                    text: 'Ways to get in touch',
                    href: '/contact',
                    text_color: 'rgb(220,255,200)',
                    background_color: 'rgb(50, 100, 50)'
                  }}/>
              </div>
          </div>
      </div>
    </div>

    <div className='section section-two-halves'>
    <div className='section-half'>
      <div className='stand-out-box' style={{'maxWidth': '50%'}}>
        <h3> How I add colour to walls </h3>
        <p> A story about one of my latest commissions </p>
        <div id='co1' style={{'maxWidth': '100%', 'overflow':'hidden'}}>
          <img id='img1' src='images/Magic_Light.jpg' alt='painting'/>
        </div>
        <SideButton props={{
          text: 'Read this',
          href: '',
          text_color: 'rgb(220,255,200)',
          background_color: 'rgb(50, 100, 50)'
        }}/>
      </div>

    </div>

    <div className='section-half'>

    </div>
    </div>

    </div>
  );
  /*document.onload = ()=>{
    console.log('Opened')
    imageResize_1('img1', 'co1')
  }*/
}
}


function imageResize_1(imgID, containerID){
  let vh = window.height;
  let p = 0.8;
  let maxContainerHeight = p * vh;
  let container = document.getElementById(containerID);
  container.style = {'max-height':  `${maxContainerHeight}`};
  let k = 0.8;
  let maxImageWidth = k * container.width;
  resizeImageInContainer(imgID, containerID, maxContainerHeight, maxImageWidth);
}

function resizeImageInContainer(imgID, containerID, maxContainerHeight, maxImageWidth){
  let container = document.getElementById(containerID);
  let image = document.getElementById(imgID);
  let originalHeight = container.height;
  let maxImageHeight = maxContainerHeight - originalHeight;
  let AspectRatio = image.height / image.width;
  let maxAspectRatio = maxImageHeight / maxImageWidth;
  if (maxAspectRatio > AspectRatio){
    // Set width to maximum
    image.width = maxImageWidth;
    image.height = maxImageWidth * AspectRatio;
  } else {
    // Set height to maximum
    image.height = maxImageHeight;
    image.width = maxImageHeight / AspectRatio;
  }
}

export default LandingPage2;
