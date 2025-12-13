import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

function Pin({ item }) {
  return (
    <>
      <Marker position={[item.latitude, item.longitude]}>
        <Popup>
          <div className="flex gap-3">
            <img
              src={item.images[0].Image_URL}
              alt=""
              className="w-16 h-12 object-cover rounded-sm flex-shrink-0"
            />
            <div className="flex flex-col justify-between">
              <Link className="m-0" to={`/${item.id}`}>
                {item.Title}
              </Link>
              <span>{item.Bedrooms} bedroom</span>
              <span>{item.Price}</span>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
}

export default Pin;
