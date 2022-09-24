/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// @ts-nocheck TODO remove when fixed

let map: google.maps.Map;
let marker: google.maps.Marker;
let geocoder: google.maps.Geocoder;
let responseDiv: HTMLDivElement;
let response: HTMLPreElement;
var cache1 = new Map();
var cache2 = new Map();

function initMap(): void {
  map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 },
    mapTypeControl: false,
  });
  geocoder = new google.maps.Geocoder();

  const inputText = document.createElement('input');

  inputText.type = 'text';
  inputText.placeholder = 'Enter a location';

  const submitButton = document.createElement('input');

  submitButton.type = 'button';
  submitButton.value = 'Geocode';
  submitButton.classList.add('button', 'button-primary');

  const clearButton = document.createElement('input');

  clearButton.type = 'button';
  clearButton.value = 'Clear';
  clearButton.classList.add('button', 'button-secondary');

  response = document.createElement('pre');
  response.id = 'response';
  response.innerText = '';

  responseDiv = document.createElement('div');
  responseDiv.id = 'response-container';
  responseDiv.appendChild(response);

  const instructionsElement = document.createElement('p');

  instructionsElement.id = 'instructions';

  instructionsElement.innerHTML =
    '<strong>Instructions</strong>: Enter an address in the textbox to geocode or click on the map to reverse geocode.';

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);

  marker = new google.maps.Marker({
    map,
  });

  map.addListener('click', (e: google.maps.MapMouseEvent) => {
    geocode({ location: e.latLng });
  });

  submitButton.addEventListener('click', () =>
    geocode({ address: inputText.value })
  );

  clearButton.addEventListener('click', () => {
    clear();
  });

  clear();
}

function clear() {
  marker.setMap(null);
  responseDiv.style.display = 'none';
}

function geocode(request: google.maps.GeocoderRequest): void {
  clear();
  if (cache1.has(request.location)) {
    response.innerText = cache1.get(request.location);
    return cache2.get(request.location);
  }

  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      responseDiv.style.display = 'block';
      var res = result.results[0];
      var lat: string = JSON.stringify(
        result.results[0]['geometry']['location']
      );
      response.innerText = lat;
      cache1.set(request.location, lat);
      cache2.set(request.location, results);
      return results;
    })
    .catch((e) => {
      alert('Geocode was not successful for the following reason: ' + e);
    });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
