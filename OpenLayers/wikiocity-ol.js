//Copyright 2020, Wikiocity, all rights reserved.  
//Check out https://github.com/wikiocity/wikiocity-styles and https://api.wikiocity.com/legal for licenseing and terms

//Default Changeable Openlayers mapping options.  
controlOpts = ol.control.defaults({rotate: true, rotateOptions: {autoHide: false}, zoom: true, zoomOptions: {zoomDuration:500}, attribution: true, attributionOptions: { collapsible: false}}); 
interactionOpts = ol.interaction.defaults({pinchRotate:false});
interactionOpts.extend([ new ol.interaction.MouseWheelZoom({ duration: 300, timeout: 25, maxDelta: 0.4})]);
maxUserZoom = 21;
ie9RasterFallback = false;  //Allow Internet Explorer 9 compatibility fallback by using Raster maps instead of Vector?  Please check credit cost differences.

//Required options.  Do not change.
tileDataSize = 512;
requiredAttribution = '©&nbsp;<a href="https://api.wikiocity.com">Wikiocity</a> ©&nbsp;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>&nbsp;contributors';

function getView (center) {
	return new ol.View({
		center: ol.proj.fromLonLat(center),
		zoom: startZoom,
		maxZoom: maxUserZoom
	})
}

//create Layer function
function getLayer (type, apiKey, div) {
	var myNav = navigator.userAgent.toLowerCase();
	var mapLang = (typeof mapLanguage === 'undefined') ? 'en' : mapLanguage;
	var isIE9 = false;
	
	//check for IE 9 fallback
	var showRasterIE9 = false;
	if (ie9RasterFallback && type != 'raster') {
		if (myNav.indexOf('msie') != -1) {
			if (parseInt(myNav.split('msie')[1]) == 9) {
				showRasterIE9 = true;
				isIE9 = true;
			}
		}
	} else if ( type == 'raster') {
		if (myNav.indexOf('msie') != -1) {
			if (parseInt(myNav.split('msie')[1]) == 9) {
				isIE9 = true;
			}
		}
	}
	
	if (showRasterIE9 || type == 'raster') {
		//raster layer
		var tilePixelRatioS = 2;
		if (isIE9) {
			 tilePixelRatioS = 1;
		}

		return new ol.layer.Tile({
			source: new ol.source.XYZ({
		      maxZoom: 19,
			  tileSize: tileDataSize,
			  tilePixelRatio: tilePixelRatioS,
			  attributions: requiredAttribution,
			  url: 'https://api.wikiocity.com/r/raster/'+mapLang+'/{z}/{x}/{y}.png?key=' + apiKey
		})
    });
	} else { 
		//vector layer
		return new ol.layer.VectorTile({
			  declutter: true,
			  source: new ol.source.VectorTile({
			  maxZoom: 14,
			  tileSize: tileDataSize,
			  renderMode: 'hybrid',
			  attributions: requiredAttribution,
			  format: new ol.format.MVT(),
				url: 'https://api.wikiocity.com/r/vector/'+mapLang+'/{z}/{x}/{y}.pbf?key=' + apiKey
			  }),
			  style: styleFunction(ol.style, view, div)
			});
	}
}

function setInteractionOnFocus(div) {
	var mapDivEl = document.getElementById(div);
	mapDivEl.style.position = "relative";
	mapDivEl.tabIndex = 1;
	mapDivEl.insertAdjacentHTML('afterbegin', '<p id="mapOverlayNotice" style="position:absolute;z-index:10;margin-top:20px;width:100%;height:100%;font-size:22px;display:none;text-align:center;justify-content: center; align-items: center;">Click the map to pan and zoom.</p>');
	var mapDivNotice = document.getElementById("mapOverlayNotice");
	interactionOpts = ol.interaction.defaults({pinchRotate:false,onFocusOnly: true});
	var timer = null;
	
	var handleMapTouch = function (event) {
		if (document.activeElement !== mapDivEl) {
			mapDivEl.style.opacity = "0.4";
			mapDivNotice.style.display = "flex"; 
			if(timer !== null) {
				clearTimeout(timer);        
			}
				timer = setTimeout(function() {
				mapDivNotice.style.display = "none"; 
				mapDivEl.style.opacity = "1"; 
			}, 500);
		}
	}
	
	mapDivEl.addEventListener("wheel", handleMapTouch, false);
	mapDivEl.addEventListener("touchmove", handleMapTouch, false);
}
