import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'

class Menu extends Component {

  filterMarkers = (e) => {
    const match = new RegExp(escapeRegExp(e.target.value), 'i');
    for (let marker of this.props.markers)
      marker.hidden = !match.test(marker.id);

    this.props.updateMarkers(this.props.markers);
  }

  render() {
    return (
      <div id="side-menu">
        <input 
          placeholder="Filter Locations"
          onChange={this.filterMarkers}
          role="form"
          type="text"
        />
        <ul>
          {this.props.markers.map(marker => (
            <li
              role="button"
              tabIndex="0"
              key={marker.id}
              style={{display: marker.hidden ? 'none' : 'block'}}
              onClick={() => this.props.setOpenMarker(marker.id)}
              className={this.props.openMarker === marker.id ? 'selectedLocation' : ''}
            > 
              {marker.id}
            </li>
          ))}
        </ul>

        <footer> Location data provided by <a href="https://foursquare.com/">FOURSQUARE</a> </footer>
      </div>
    );
  }
}

export default Menu;