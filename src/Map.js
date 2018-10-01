import React, { Component } from 'react';

class GoogleMap extends Component {

  state = {
    pos: {lat: 29.712512, lng: -98.126318},
    markers: {},
    infoWindows: {}
  }

  shouldComponentUpdate () {
    return false;
  }

  componentWillReceiveProps = (props) => {
    const {markers, openMarker} = props;

    // init new markers
    if (markers) {
      const currentMarkers = this.state.markers;
      for (let marker of markers)
        if (!currentMarkers[marker.id])
          this.newMarker(marker);
    }

    // pan to marker and open info window
    if (openMarker)
      this.openMarker(openMarker);

    this.renderMarkers();
  }

  openMarker = (markerId) => {
    const markersData = this.props.markers;
    const {markers, infoWindows} = this.state;

    for (let markerData of markersData) {
      const marker = markers[markerData.id];
      const infoWindow = infoWindows[markerData.id];
      if (markerData.id === markerId) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        infoWindow.open(this.map, marker);
      } else {
        marker.setAnimation(null);
        infoWindow.close();
      }
    }

  }

  newMarker = (newMarker) => {
    const {markers, infoWindows} = this.state;
    const marker = markers[newMarker.id] = new window.google.maps.Marker({ position: newMarker.location, map: this.map });
    
    marker.addListener('click', () => this.props.setOpenMarker(newMarker.id));

    const infoWindowContent = `
      <p>${newMarker.des}</p>
      <hr>
      <div class="footnote">Data provided by <a href="https://foursquare.com/">FORESQUARE</a></div>
    `;

    infoWindows[newMarker.id] = new window.google.maps.InfoWindow({
      content: infoWindowContent,
      maxWidth: 250
    });

    this.setState({ markers });
  }

  renderMarkers = () => {
    const currentMarkers = this.state.markers;
    const newMarkerData = this.props.markers

    for (let markerData of newMarkerData) {
      const marker = currentMarkers[markerData.id];
      if (markerData.hidden) {
        marker.setMap(null);
      } else if (!marker.map) {
        marker.setMap(this.map);
      }
    }
  }

  componentDidMount () {
    //render map
    this.map = new window.google.maps.Map(this.refs.map, {
      center: this.state.pos,
      zoom: 15
    });
  }

  render() {
    return (
      <div id="map" ref="map" role="application" aria-label="Interactive Map"></div>
    );
  }
}

export default GoogleMap;