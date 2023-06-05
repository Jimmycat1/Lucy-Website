import React from 'react';
import {Provider} from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './style/sass/App.css';
import store from './store.js';

import getCSRFToken from './utils/getCSRFToken.js';

import LandingPage from './pages/LandingPage';
import LandingPage2 from './pages/LandingPage2';
import Who_I_am from './pages/Who_I_am';
import GalleryPage from './pages/GalleryPage';
import ErrorBoundary from './pages/ErrorPage';
import Top from './components/Top';
import Basket from './components/Basket';

import ErrorPopupContainer from './components/ErrorPopupContainer';
import RequestPopupContainer from './components/RequestPopupContainer';
import Notification_Manager from './components/Notification_Manager';
import LoadSign from './components/LoadSign';
import Loader from './components/Loader';
import AdminRouter from './pages/admin/AdminRouter';

// import PaintingPopup from './components/PaintingPopup';
import PaintingPopup_functional from './components/PaintingPopup_functional';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

import { USE_BASKET } from './config.js';



function App() {
  const scrollToTop = () => {
    document.getElementById('topOfPage').scrollIntoView();
  }
  getCSRFToken();
  return (
    <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter onChange={scrollToTop}>
        <div className='main'>

          <ErrorPopupContainer />
          <RequestPopupContainer />
          <Notification_Manager />
          <LoadSign/>
          <Loader />
          <div id='topOfPage'></div>

          <Switch>

            {/* To /admin */}
            <Route onChange={scrollToTop} path='/admin' render={props => (
              <AdminRouter/>
            )}/>

            {/* ALL EXCEPT /admin */}
            <Route onChange={scrollToTop} path='/'>
              <Top/>
              {(USE_BASKET)
                ?(<Basket/>)
                :('')
              }
              <Switch>
                {/* A switch selects one from its children */}

                {/*    Home Page    */}
                <Route onChange={scrollToTop} exact path='/' render={props => (
                  <>
                  <div id='landingPage'>
                    <LandingPage/>
                    <div className='container section'>
                      <ContactForm/>
                    </div>
                    <Footer/>
                  </div>
                  </>
                )} />

                <Route exact path='/landing'>
                  <>
                  <LandingPage2/>
                  <Footer/>
                  </>
                </Route>

                <Route exact path='/about'>
                  <>
                  <Who_I_am/>
                  <Footer/>
                  </>
                </Route>

                {/*    Gallery    */}
                <Route onChange={scrollToTop} path='/paintings/gallery' render={props => (
                  <>
                  <div id='galleryPage'>
                    <GalleryPage/>
                    <div className='container section'>
                      <ContactForm/>
                    </div>
                    <Footer/>
                  </div>
                  </>
                )} />

                {/*    Painting    */}
                <Route onChange={scrollToTop} path='/paintings/:paintingId' render={props => (
                  <>
                  <PaintingPopup_functional painting_is_provided={false} paintingId={props.match.params.paintingId}/>
                  <div className='container section'>
                    <ContactForm/>
                  </div>
                  </>
                )}/>

                <Route onChange={scrollToTop} path='/paintings/buy' render={props => (
                  <>Buy</>
                )} />

                {/*    Contact Form    */}
                <Route onChange={scrollToTop} exact path='/contact'>
                  <ContactForm/>
                </Route>

                {/*    404 Not Found    */}
                <Route  onChange={scrollToTop} path='*' render={props => (
                  <>
                    <div className='container section'>
                      Sorry, this page does not exist.
                      Probably due to fluctuations in the space-time continuum...
                    </div>
                  </>
                )} />


              </Switch>
            </Route>

          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
    </ErrorBoundary>
  );
}

export default App;


// Use Context
// https://blog.logrocket.com/use-hooks-and-context-not-react-and-redux/

// Some react-router-dom hooks
// https://reactrouter.com/web/api/Hooks
