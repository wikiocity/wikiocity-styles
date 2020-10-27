//Copyright 2020, Wikiocity, all rights reserved.  
//Check out https://github.com/wikiocity/wikiocity-styles and https://api.wikiocity.com/legal for licenseing and terms

function addMarkers(markers, map, style) {
	var style = (style === undefined) ? 'default' : style;
	var markerFeature = [];
	hasPopupInfo = false;
	for (var i=0; i<markers.length;i++) {
		if (style == 'default') {
			markerFeature.push(createMarker([markers[i].data[1], markers[i].data[0]], markers[i].name, i, style));
		} else {
			var markerFeatures = createMarker([markers[i].data[1], markers[i].data[0]], markers[i].name, i, style);
			markerFeature.push(markerFeatures[0], markerFeatures[1]);
		}
		if (typeof markers[i].data[2] !== 'undefined') {
			if (markers[i].data[2] !== '') {
				hasPopupInfo = true;
			}
		}
	}
	markerVectorSource = new ol.source.Vector({features: markerFeature});
	markerVectorLayer = new ol.layer.Vector({source: markerVectorSource, className: 'ol-markers'});	
	map.once('postrender', function(event) {
		map.addLayer(markerVectorLayer);
	});

	
	if (hasPopupInfo) {
		var container = document.getElementById('popup');
		var content = document.getElementById('popup-content');
		var closer = document.getElementById('popup-closer');

		markerOverlay = new ol.Overlay({
			 element: container,
			 autoPan: true,
			 position: undefined,
			 autoPanAnimation: {
				 duration: 250
			 }
		 });
		 map.addOverlay(markerOverlay);

		closer.onclick = function() {
			markerOverlay.setPosition(undefined);
			closer.blur();
			return false;
		};
		 
		map.on('singleclick', function(evt) {
			var id = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
				
				return feature.getId();
			})
			markerIndex = id.replace('marker:', '') ;

			if (markerIndex >= 0) {
			  container.style.display="block";
			  content.innerHTML = markers[markerIndex].data[2];
			  markerOverlay.setPosition(ol.proj.fromLonLat([markers[markerIndex].data[1], markers[markerIndex].data[0]]));
			} else {
			  container.style.display="none";
			}
		});
	}
}

function highlightMarker(markerIndex) {
	if (typeof markerVectorLayer !== 'undefined') {
		var featureToHighlight = markerVectorLayer.getSource().getFeatureById('marker:'+markerIndex);
		if (featureToHighlight !== null) {
			var featureStyle = featureToHighlight.getStyle();
			var featureText = featureStyle.getText();
			featureText.setFill(new ol.style.Fill({color: '#0082c8'}));
			featureStyle.setText(featureText);
			featureStyle.setZIndex(1);
			featureToHighlight.setStyle(featureStyle);
		}
	}
}

function dehighlightMarker(markerIndex) {
	if (typeof markerVectorLayer !== 'undefined') {
		var featureToHighlight = markerVectorLayer.getSource().getFeatureById('marker:'+markerIndex);
		if (featureToHighlight !== null) {
			var featureStyle = featureToHighlight.getStyle();
			var featureText = featureStyle.getText();
			featureText.setFill(new ol.style.Fill({color: '#a11c25'}));
			featureStyle.setText(featureText);
			featureStyle.setZIndex(0);
			featureToHighlight.setStyle(featureStyle);
		}
	}
}

function removeMarker(markers, markerIndex) {
	var markerIndex = (markerIndex === undefined) ? -1 : markerIndex;
	if (markerIndex < 0) {
		markerIndex = 0;
	} 
	if (typeof markerVectorLayer !== 'undefined') {
		var featureToClose = markerVectorLayer.getSource().getFeatureById('marker:'+markerIndex);
		if (featureToClose !== null) {
			markerVectorSource.removeFeature(featureToClose);
		}
	}
	if (typeof markers[markerIndex]	!== 'undefined') {
		if (typeof markers[markerIndex].data[2] !== 'undefined') {
			if (markers[markerIndex].data[2] !== '') {
				var container = document.getElementById('popup');
				container.style.display="none";
			}
		}
	}
}
function createMarker(lonLat, name, id, style) {
	var markerFeature = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.fromLonLat(lonLat)), name: name
	});
	markerFeature.setId('marker:'+id);
	if (style == 'default') {
		var markerStyle = new ol.style.Style({
			text: new ol.style.Text({
			text: '\uf3c5',
			fill: new ol.style.Fill({
				color: '#a11c25'
			}),
			stroke: new ol.style.Stroke({
				color: '#fff',
				width: 4
			}),
			textBaseline: 'bottom',
			font: 'Normal 900 28px "Font Awesome 5 Free"'
			})
		});
		markerFeature.setStyle(markerStyle);
		return markerFeature;
	} else {
		var markerStyle = new ol.style.Style({
			text: new ol.style.Text({
			text: '\uf041',
			fill: new ol.style.Fill({
				color: '#a11c25'
			}),
			stroke: new ol.style.Stroke({
				color: '#fff',
				width: 4
			}),
			textBaseline: 'bottom',
			textAlign: 'center',
			font: 'Normal 900 28px "Font Awesome 5 Free"'
			})
		});
		var markerTextStyle = new ol.style.Style({
			text: new ol.style.Text({
			text: (id+1).toString(),
			fill: new ol.style.Fill({
				color: '#fff'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(0,0,0,0.1)',
				width: 1.5
			}),
			offsetY: -9,
			textBaseline: 'bottom',
			textAlign: 'center',
			font: 'Normal 700 12px "Open Sans", "Arial", "Verdana", "sans-serif"'
			})
		});
		var markerTextFeature = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.fromLonLat(lonLat)), name: name
		});
		markerTextFeature.setStyle(markerTextStyle);
		markerFeature.setStyle(markerStyle);
		return [markerFeature, markerTextFeature];
	}
	
	
}

function setMarkerOpen(markers, markerIndex) {
	var markerIndex = (markerIndex === undefined) ? -1 : markerIndex;
	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
	var closer = document.getElementById('popup-closer');
	if (markerIndex < 0) {markerIndex = 0;}
	container.style.display="block";
	content.innerHTML = markers[markerIndex].data[2];
	//openlayers throws error on autopan = true.  temporarily catching error for now.
	try{markerOverlay.setPosition(ol.proj.fromLonLat([markers[markerIndex].data[1], markers[markerIndex].data[0]]));}catch (e) {}	

}

function quickMarkersCenter(markers) {
	var lat=0, lng=0, latAr=[], lonAr=[];
	var num_coords = markers.length
	for(var i=0; i<num_coords; ++i) {
	   lat += Number(markers[i].data[0]);
	   lng += Number(markers[i].data[1]);
	   latAr.push(markers[i].data[0]);
	   lonAr.push(markers[i].data[1]);
	}
	var distance = distanceInKM(Math.max.apply(Math,latAr), Math.max.apply(Math,lonAr), Math.min.apply(Math,latAr), Math.min.apply(Math,lonAr));
	var zoom = 13;
	switch(true) {
	  case distance < 1:
		zoom = 14;
		break;
	  case distance < 4:
		zoom = 13;
		break;
	  case distance < 10:
		zoom = 12;
		break;
	  case distance < 20:
		zoom = 11;
		break;
	  case distance < 40:
		zoom = 10;
		break;
	  case distance < 100:
		zoom = 9;
		break;
	  case distance < 250:
		zoom = 8;
		break;
	  case distance < 400:
		zoom = 7;
		break;
	  case distance < 750:
		zoom = 6;
		break;
	  case distance < 2000:
		zoom = 5;
		break;
	  case distance < 4000:
		zoom = 4;
		break;
	  case distance >= 4000:
		zoom = 3;
		break;
	  default:
		break;
	} 
	lat /= num_coords;
	lng /= num_coords;
	return [lat,lng,zoom]
}

function flyTo(obj, view) {
	var startPoint = ol.proj.toLonLat(view.getCenter());
	var location = ol.proj.fromLonLat([obj.lon, obj.lat]);
	var distance = distanceInKM(obj.lat, obj.lon, startPoint[1], startPoint[0]);
	var accuracy =  obj.accuracy;
	var done = function () {};
	var duration = 5000;
	var zoom = view.getZoom();
	var parts = 2;
	var called = false;
	var topZoom = zoom - 1;
	switch(true) {
	  case distance < 1:
		if (zoom > 16) {topZoom = 16};
		duration = 1000;
		break;
	  case distance < 5:
		if (zoom > 15) {topZoom = 15}
		duration = 1000;
		break;
	  case distance < 10:
		if (zoom > 14) {topZoom = 14}
		duration = 1000;
		break;
	  case distance < 40:
		if (zoom > 13) {topZoom = 13}
		duration = 1000;
		break;
	  case distance < 50:
		if (zoom > 12) {topZoom = 12}
		duration = 2000;
		break;
	  case distance < 150:
		if (zoom > 11) {topZoom = 11}
		duration = 2000;
		break;
	  case distance < 250:
		if (zoom > 10) {topZoom = 10}
		duration = 2000;
		break;
	  case distance < 400:
		if (zoom > 9) {topZoom = 9}
		duration = 3000;
		break;
	  case distance < 700:
		if (zoom > 8) {topZoom = 8}
		duration = 3000;
		break;
	  case distance < 1000:
		if (zoom > 7) {topZoom = 7}
		duration = 3000;
		break;
	  case distance < 2000:
		if (zoom > 6) {topZoom = 6}
		duration = 4000;
		break;
	  case distance < 3500:
		if (zoom > 5) {topZoom = 5}
		duration = 4000;
		break;
	  case distance < 5000:
		if (zoom > 4) {topZoom = 4}
		duration = 4000;
		break;
	  case distance >= 5000:
		if (zoom > 3) {topZoom = 3}
		duration = 4000;
		break;
	  default:
		break;
	} 
	if (zoom < 13) {zoom = 13;}
	if (accuracy == 'boundary-administrative') { zoom = 8;}
	function callback(complete) {
	--parts;
	if (called) {
	  return;
	}
	if (parts === 0 || !complete) {
	  called = true;
	  done(complete);
	}
	}
	view.animate(
	{
	  center: location,
	  duration: duration,
	},
	callback
	);
	view.animate(
	{
	  zoom: topZoom,
	  duration: duration,
	},
	{
	  zoom: zoom,
	  duration: duration / 2,
	},
	callback
	);
}
		
function toRad(x) {return x * Math.PI / 180;}
function distanceInKM(lat1, lon1, lat2, lon2) {
	var R = 6371; // km
	var dLon = toRad(lon2 - lon1),
		lat1 = toRad(lat1),
		lat2 = toRad(lat2),
		d = Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2) * Math.cos(dLon)) * R;
	return d;
}
function distanceInMI(lat1, lon1, lat2, lon2) {
	var R = 3959; // miles
	var dLon = toRad(lon2 - lon1),
		lat1 = toRad(lat1),
		lat2 = toRad(lat2),
		d = Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2) * Math.cos(dLon)) * R;
	return d;
}
