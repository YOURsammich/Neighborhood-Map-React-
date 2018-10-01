import React, { Component } from 'react';
import Menu from './Menu';
import GoogleMap from './Map';
import './App.css';

class App extends Component {

  state = {
    pos: {lat: 29.712512, lng: -98.126318},
    locations: [],
    openMarker: null,
    menuOpen: true
  }

  foursquareIds = [
    '4db317b90437fa536a0c0363',// comal river
    '4a935574f964a520941f20e3',// texas tubes
    '4c322c2c452620a183a8210f',// Surfenburg
    '4bc3a0f1dce4eee16aaf719d',// schlitterbahn
    '4c37357adfb0e21e184daca8' // Blastenhoff Beach
  ]

  updateMarkers = newMarkers => this.setState({ markers: newMarkers })

  setOpenMarker = openMarkerId => this.setState({ openMarker: openMarkerId })

  addLocation = (foursquareId) => {
    const clientId = 'PARQ3IC2VSYCHN1FKFSECLN5LYH0RSV4ZS1HY3BI2LYHFGXB';
    const secret = 'UDRDA4ZIR5FLHOKNQDSQDJCLXL2OJD2F1YIFBH3VLFH0YFCB';
    const apiLink = 'https://api.foursquare.com/v2/venues/' + foursquareId + '?v=20182809&client_id=' + clientId + '&client_secret=' + secret;

    fetch(apiLink)
      .then(res => res.json())
      .then(json => {
        if (!json.meta.errorType) {
          const venue = json.response.venue;

          if (venue) {
            const {lat, lng} = venue.location;
            this.setState({ locations: [...this.state.locations, {
              id: venue.name,
              location: {lat, lng},
              des: venue.description
            }] })
          }
        } else {
          alert(json.meta.errorMessage || 'Something went wrong. Please contact site owner or try again later.');
        }
      })
      .catch(() => alert('FOURSQUARE API timedout'))
  }

  requestLocations = () => {
    const foursquareIds = this.foursquareIds;
    for (let foursquareId of foursquareIds)
      this.addLocation(foursquareId);

    this.setState({ apiLoaded: true });
  }

  toggleMenu = () => {
    const menuState = this.state.menuOpen;
    this.setState({ menuOpen: !menuState });
  }

  componentDidMount () {
    window.initMap = this.requestLocations;
    window.gm_authFailure = gm_authFailure;
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBcVXDEFTGZyJq9R4mrzu-DgZC7wqSz_Rc&callback=initMap');
  }

  render() {
    return (
      <div className="App">
        {this.state.menuOpen && (
          <Menu 
            markers={this.state.locations}
            updateMarkers={this.updateMarkers}
            openMarker={this.state.openMarker}
            setOpenMarker={this.setOpenMarker}
          />
        )}
        <div id="main-content">
          <header
            onClick={this.toggleMenu}
          > 
            <span className="hamburger">&#9776;</span> 
          </header>
          {this.state.apiLoaded ? (
            <GoogleMap 
              markers={this.state.locations}
              openMarker={this.state.openMarker}
              setOpenMarker={this.setOpenMarker}
            />
          ) : (
            <h3>Google Maps is loading</h3>
          )}
        </div>
      </div>
    );
  }
}

function gm_authFailure() {
  alert('Google Maps API authentication error');
}

function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

export default App;