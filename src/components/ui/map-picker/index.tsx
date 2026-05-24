"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";

type MapPickerProps = {
  onChange?: (lat: number, lng: number) => void;
  initialLat?: number | null;
  initialLng?: number | null;
};

const customIcon = L.icon({
  iconUrl: "/images/marker.png",
  iconSize: [24, 32],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const ClickHandler: React.FC<{
  onClick: (lat: number, lng: number) => void;
}> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};

const MapPicker: React.FC<MapPickerProps> = ({
  onChange,
  initialLat,
  initialLng,
}) => {
  const [position, setPosition] = useState<LatLngExpression | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition([initialLat, initialLng]);
    }
  }, [initialLat, initialLng]);

  const handleClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onChange?.(lat, lng);
  };

  return (
    <MapContainer
      center={position ?? [35.6892, 51.389]}
      zoom={12}
      style={{ height: 400 }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        attribution="© Stadia Maps"
      />
      <ClickHandler onClick={handleClick} />
      {position && <Marker position={position} icon={customIcon} />}
    </MapContainer>
  );
};

export default MapPicker;
