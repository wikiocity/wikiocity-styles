//Wikiocity styles are copyright 2020, Wikiocity, all rights reserved.  
//Check out https://github.com/wikiocity/wikiocity-styles and https://api.wikiocity.com/legal for licenseing and terms

//Function for creating Openlayers Style

function styleFunction(olStyle, View, div) {
	
	var Style  = olStyle.Style;
	var Fill   = olStyle.Fill;
	var Stroke = olStyle.Stroke;
	var Icon   = olStyle.Icon;
	var Text   = olStyle.Text;
	
	var fill = new Fill({color: ''});
	var stroke = new Stroke({color: '', width: 1});
	
	var line_casing_stroke = new Stroke({color : '', width : 1, lineDash: null, lineDashOffset: 0});
	var line_fill_stroke = 	new Stroke({color : '', width : 1, lineDash: null, lineDashOffset: 0});
	var line_casing = new Style({stroke: line_casing_stroke, zIndex: 1});
	var line_fill = new Style({stroke: line_fill_stroke, zIndex: 2});

	var polygon = new Style({fill: fill});
	var strokedPolygon = new Style({fill: fill, stroke: stroke});
	var line = new Style({stroke: stroke, zIndex: 1});
	var text = new Style({text: new Text({
	text: '', fill: fill, stroke: stroke, placement: ''
	})});
	
	var lineText = new Style({text: new Text({
	text: '', fill: fill, placement: 'line'
	}), zIndex: 1});


	var mapFilters = (typeof mapFilter === 'undefined') ? '' : mapFilter;

	function wordWrap(text,boundary) {
		return text.split("\n").map(function(line) {
			var pos = 0;
			return line.split(/\b/).map(function(word) {
				pos += word.length;
				if(pos > boundary) {
					pos = 0;
					return "\n" + word.trimStart();
				}
				return word;
			}).join("");
		}).join("\n");
	}
	
  function hexToRgb(hex) {
        // long version
        r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (r) {
                return r.slice(1,4).map(function(x) { return parseInt(x, 16); });
        }
        // short version
        r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (r) {
                return r.slice(1,4).map(function(x) { return 0x11 * parseInt(x, 16); });
        }
        return null;
  }
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}
	var addressNumber = {};
	function addaddressnum(addressnum, font) {
		var Address = addressNumber[addressnum];
			if (!Address) {
				Address = new Style({
				text: new Text({
				text: addressnum, 
				overflow:true,
				fill: new Fill({
						color: '#bbb'
					}), 
					font: font,
					placement: '', 
					stroke: new Stroke({
						color: '#fff',
						width: 0.1
					}),
				}), zIndex: 0});

				addressNumber[addressnum] = Address;
			}
			return Address;
	}
	
	var StreetCache = {};
	function getLineText(color, name, font, zIndex) {
		var overflow = false;
		if (zIndex > 0) {overflow = false;};
		var StreetStyle = StreetCache[color+name+font+zIndex];
			if (!StreetStyle) {
				StreetStyle = new Style({ text: new Text({
				text: name, fill: new Fill({color: color}), placement: 'line', font: font, overflow: overflow, rotateWithView: false
				}), zIndex: zIndex});
				StreetCache[color+name+font+zIndex] = StreetStyle;
				
			}
			return StreetStyle;
	}

	var IconCache = {};
	function getIcon(iconName, color, name, textcolor, font, zoomLevel, zIndex) {
		var scale = 0.7;
		var strokeWidth = 1.75;
		var icon = false;
		if (zoomLevel >= 15) {scale = 0.6; if (textcolor == protected_area) { strokeWidth = 1;}} 
		if (name != undefined && name != '') {
			icon = IconCache[color+" "+iconName+" "+zoomLevel.toFixed(0)];
		}
		if (!icon) {
			if (iconName != '') {
				if (name != '' && name != undefined) {
					icon = new Style({
						text: new Text({
						text: iconName,
						//text: name,
						offsetY: -12,
						fill: new Fill({
							color: color
						}),
						stroke: new Stroke({
							color: '#fff',
							width: 4.1
						}),
						textBaseline: 'top',
						font: font, padding: [-1,-1,-3,-1]
						})
						, zIndex: zIndex
					});
				} else {
					icon = new Style({
						text: new Text({
						text: iconName,
						//text: name,
						offsetY: -4,
						fill: new Fill({
							color: color
						}),
						stroke: new Stroke({
							color: '#fff',
							width: 4.1
						}),
						textBaseline: 'top',
						font: font, padding: [-1,-1,-1,-1]
						})
						, zIndex: zIndex
					});
				}
			} else {
				icon = new Style({text: new Text({
						text: name,
						fill: new Fill({
							color: textcolor
						}),
						stroke: new Stroke({
							color: '#fff',
							width: 1.75
						}),
						font: font
						})
						, zIndex: zIndex
					}); 
			}
			IconCache[color+" "+iconName+" "+zoomLevel.toFixed(0)] = icon;
		}
		return icon;
	}

	function getcityDot() {
	cityDot = new Style({image: new Icon({
		src: 'https://api.wikiocity.com/symbols/place/place-4.svg',
		crossOrigin: 'anonymous',
		imgSize: ((window.document.documentMode) ? [4,4] : null )
	})});
	return cityDot;
	}
	
	var ShieldCache = {};
	function getShield(ShieldName, point, name, type_, opacity, zoomLevel) {
		var scale= 1;
		var zindex = 4;
		var opacity = 1.1;
		var text_size = 10;
		var pointname1 = 0;
		var pointname2 = 0;
		
		if (zoomLevel >= 15) {
			if (type_ == 'other') {
				 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%7500))/7500) / 2);
				 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%7500))/7500)/ 2);
				 
			} else {
				 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%1000))/1000) / 2);
				 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%1000))/1000)/ 2);
				 var zindex = 5;
			}
			scale = 0.75;
			text_size = 8;
		} else if (zoomLevel >= 13) {
			if (type_ == 'other') {
				 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%7500))/7500) / 2);
				 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%7500))/7500)/ 2);
				 var zindex = 3;
			} else {
				 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%3000))/3000) / 2);
				 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%3000))/3000)/ 2);
				 
			}
			scale = 0.8;
			text_size = 9;
		} else if (zoomLevel >= 12) {
			if (type_ == 'other') {
				 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%12500))/12500) / 2);
				 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%12500))/12500)/ 2);
				 var zindex = 3;
			} else {
				 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%7500))/7500) / 2);
				 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%7500))/7500)/ 2);
				 
			}
			scale = 0.75;
			opacity = 0.8;
			text_size = 9;
		} else if (zoomLevel >= 11) {
			if (type_ == 'other') {
				 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%20000))/20000) / 2);
				 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%20000))/20000)/ 2);
				 var zindex = 3;
			} else {
				 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%15000))/15000) / 2);
				 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%15000))/15000)/ 2);
				
			}
			zindex = 1;
			scale = 0.75;
			opacity = 0.8;
			text_size = 9;
		} else if (zoomLevel >= 10) {
			if (type_ == 'other') {
				 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%45000))/45000) / 2);
				 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%45000))/45000)/ 2);
				 zindex = 0;
			} else {
				 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%20000))/20000) / 2);
				 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%20000))/20000)/ 2);
				 zindex = 1;
			}
			
			scale = 0.75;
			opacity = 0.8;
			text_size = 9;
		} else if (zoomLevel >= 9) {
			 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%35000))/35000) / 2);
			 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%35000))/35000)/ 2);
			zindex = 1;
			scale = 0.75;
			opacity = 0.8;
			text_size = 9;
		} else if (zoomLevel >= 8) {
			 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%60000))/60000) / 2);
			 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%60000))/60000)/ 2);
			zindex = 0;
			scale = 0.75;
			opacity = 0.8;
			text_size = 9;
		} else {
			 pointname1 = 2 * Math.round(((point[0].toFixed(0)-(point[0].toFixed(0)%100000))/100000) / 2);
			 pointname2 = 2 * Math.round(((point[1].toFixed(0)-(point[1].toFixed(0)%100000))/100000)/ 2);
			zindex = 0;
			scale = 0.7;
			opacity = 0.7;
			text_size = 8;
		}
		var Shield = ShieldCache[name+" "+pointname1+" "+pointname2+" "+zoomLevel.toFixed(0)];

		if (!Shield) {
			if (type_ == 'interstate') {
				Shield = new Style({
				geometry: new ol.geom.Point([point[0],point[1]]),
				image: new Icon({
				src: 'https://api.wikiocity.com/symbols/shields/' + ShieldName,
				crossOrigin: 'anonymous',
				opacity: (opacity - 0.1),
				scale: scale,
				imgSize: ((window.document.documentMode) ? [24.9,24.9] : null )
				}),
				text: new Text({
				text: name,
				offsetY: 1.5,
				fill: new Fill({
					color: '#FFF'
				}),
				font: 'Bold '+text_size+'px "Open Sans", "Arial", "Verdana", "sans-serif"'
				})
				, zIndex: zindex});
			} else if (type_ == 'us') {
				Shield = new Style({
				geometry: new ol.geom.Point([point[0],point[1]]),
				image: new Icon({
				src: 'https://api.wikiocity.com/symbols/shields/' + ShieldName,
				crossOrigin: 'anonymous',
				opacity: (opacity - 0.2),
				scale: scale,
				imgSize: ((window.document.documentMode) ? [24.9,24.9] : null )
				}),
				text: new Text({
				text: name,
				offsetY: 1.5,
				fill: new Fill({
					color: '#555'
				}),
				font: 'Bold '+text_size+'px "Open Sans", "Arial", "Verdana", "sans-serif"'
				})
				, zIndex: zindex});
			} else {
				Shield = new Style({
				geometry: new ol.geom.Point([point[0],point[1]]),
				image: new Icon({
				src: 'https://api.wikiocity.com/symbols/shields/' + ShieldName,
				crossOrigin: 'anonymous',
				opacity: (opacity - 0.2),
				scale: scale-0.04,
				imgSize: ((window.document.documentMode) ? [name.length*7.1,18.9] : null )
				}),
				text: new Text({
				text: name,
				offsetY: 1,
				fill: new Fill({
					color: '#555'
				}),
				font: 'Normal '+text_size+'px "Open Sans", "Arial", "Verdana", "sans-serif"'
				})
				, zIndex: zindex-1});
			}
				ShieldCache[name+" "+pointname1+" "+pointname2+" "+zoomLevel.toFixed(0)] = Shield;
		} else {


		}
	return Shield;
	}

	
	
	
	var styles = [];
	
	//tone down OSM colors, contrast, saturation, and use natural or USA sign based colors
	
	var land_color = '#f7f6f3';
	var water_color = '#97d4f2';
	var admin_boundaries = '#a3a3a3'; // Lch(47,30,327)
	var admin_boundaries_narrow = '#c3c3c3'; // Lch(42,35,327)
	var admin_boundaries_wide = '#e2e2e2'; // Lch(57,25,327)
	var halo = '#fff';
	var state_labels = '#987796';
	
	var water_text = '#8aabcd';
	var glacier = '#ddecec';
	var glacier_line = '#9cf';
	
	var forest = '#e4edd5';  
	var forest_low_zoom = '#ebf1e2';
	var park = '#d5eecb';
	var park_low_zoom = '#def0d2';
	var playground = '#d9f2cf';
	var national_park = '#f2f6f0';
	var cemetery = '#f3f7f3';
	var commercial = '#f5f5f5'; 
	var school = '#f9f3e1'; 
	var medical = '#e8f5f9'; 
	var parking = '#f8f8f8';
	var military = '#fcf6f5';
	var protected_area = '#8fa386';
	var aboriginal = '#b88d6f';
	var natural_brown = '#f8f4ee';
	
	var marina_text = '#576ddf'; // also swimming_pool
	var shop_icon = '#ac39ac';
	var shop_text = '#939';
	var transportation_icon = '#0092da';
	var transportation_text = '#0066ff';
	var airtransport = '#8461C4'; //also ferry_terminal
	var health_color = '#BF0000';
	var amenity_brown = '#aca9a3';
	var amenity_purple = '#bea0bb';
	var gastronomy_icon = '#C77400';
	var office = '#4863A0';
	
	var runway_fill = '#e1e1e9';
	var taxiway_fill = '#e1e1e9';
	var bridge_casing = '#fff';
	
	var building_fill = '#e9e9e9';
	var building_line = '#d1d1d1';
	
	var motorway_casing = '#a06b00';
	var trunk_casing = '#c84e2f';
	var primary_casing = '#af8229';
	var secondary_casing = '#8f993b';
	var motorway_fill = '#fcd6a4';
	var motorway_fill_low_zoom = '#fde0bb';
	var trunk_fill = '#f9b29c';
	var trunk_fill_low_zoom = '#dddddd';
	var primary_fill = '#fad19b';
	var secondary_fill = '#f9f8d8';
	var motorway_low_zoom = '#fad19b';
	var trunk_low_zoom = '#f6967a';
	var primary_low_zoom = '#f4c37d';
	var secondary_low_zoom = '#e4e4e4';
	var motorway_low_zoom_casing = '#c24e6b';
	var trunk_low_zoom_casing = '#d1684a';
	var primary_low_zoom_casing = '#c78d2b';
	var secondary_low_zoom_casing = '#a4b329';
	var motorway_shield = '#620728';
	var trunk_shield = '#5f1c0c';
	var primary_shield = '#503000';
	var secondary_shield = '#364000';
	
	
	var motorway_width_z7 =			 0.8;
	var trunk_width_z7 =				0.6;

	var motorway_width_z8 =			 1;
	var trunk_width_z8 =				1;
	var primary_width_z8 =				1;

	var motorway_width_z9 =			 1.4;
	var trunk_width_z9 =				1.4;
	var primary_width_z9 =				1.4;
	var secondary_width_z9 =			1;

	var motorway_width_z10 =			1.9;
	var trunk_width_z10 =				 1.9;
	var primary_width_z10 =			 1.8;
	var secondary_width_z10 =			 1.1;
	var tertiary_width_z10 =			0.7;

	var motorway_width_z11 =			2.0;
	var trunk_width_z11 =				 1.9;
	var primary_width_z11 =			 1.8;
	var secondary_width_z11 =			 1.1;
	var tertiary_width_z11 =			0.7;

	var motorway_width_z12 =			3.5;
	var motorway_link_width_z12 =		 1.5;
	var trunk_width_z12 =				 3.5;
	var trunk_link_width_z12 =			1.5;
	var primary_width_z12 =			 3.5;
	var primary_link_width_z12 =		1.5;
	var secondary_width_z12 =			 3.5;
	var secondary_link_width_z12 =		1.5;
	var tertiary_width_z12 =			2.5;
	var tertiary_link_width_z12 =		 1.5;
	var residential_width_z12 =		 0.5;
	var unclassified_width_z12 =		0.8;

	var motorway_width_z13 =			6;
	var motorway_link_width_z13 =		 4;
	var trunk_width_z13 =				 6;
	var trunk_link_width_z13 =			 4;
	var primary_width_z13 =			 5;
	var primary_link_width_z13 =		4;
	var secondary_width_z13 =			 5;
	var secondary_link_width_z13 =		4;
	var tertiary_width_z13 =			4;
	var tertiary_link_width_z13 =		 3;
	var residential_width_z13 =		 2.5;
	var living_street_width_z13 =		 2;
	var bridleway_width_z13 =			 0.3;
	var footway_width_z14 =			 0.7;
	var cycleway_width_z13 =			0.7;
	var track_width_z13 =				 0.5;
	var track_grade1_width_z13 =		0.5;
	var track_grade2_width_z13 =		0.5;

	var secondary_width_z14 =			 5;
	var tertiary_width_z14 =			5;
	var residential_width_z14 =		 3;
	var living_street_width_z14 =		 3;
	var pedestrian_width_z14 =			3;
	var road_width_z14 =				2;
	var service_width_z14 =			 2;
	var steps_width_z14 =				 0.7;

	var motorway_width_z15 =			 10;
	var motorway_link_width_z15 =		 7.8;
	var trunk_width_z15 =				10;
	var trunk_link_width_z15 =		7.8;
	var primary_width_z15 =			10;
	var primary_link_width_z15 =		7.8;
	var secondary_width_z15 =			 9;
	var secondary_link_width_z15 =		7;
	var tertiary_width_z15 =			9;
	var tertiary_link_width_z15 =		 7;
	var residential_width_z15 =		 5;
	var living_street_width_z15 =		 5;
	var pedestrian_width_z15 =			5;
	var bridleway_width_z15 =			 1.2;
	var footway_width_z15 =			 1;
	var cycleway_width_z15 =			0.9;
	var track_width_z15 =				 1.5;
	var track_grade1_width_z15 =		0.75;
	var track_grade2_width_z15 =		0.75;
	var steps_width_z15 =				 3;

	var secondary_width_z16 =			10;
	var tertiary_width_z16 =			 10;
	var residential_width_z16 =		 6;
	var living_street_width_z16 =		 6;
	var pedestrian_width_z16 =			6;
	var road_width_z16 =				3.5;
	var service_width_z16 =			 3.5;
	var minor_service_width_z16 =		 2;
	var footway_width_z16 =			 1.3;
	var cycleway_width_z16 =			0.9;

	var motorway_width_z17 =			 18;
	var motorway_link_width_z17 =		12;
	var trunk_width_z17 =				18;
	var trunk_link_width_z17 =		 12;
	var primary_width_z17 =			18;
	var primary_link_width_z17 =		 12;
	var secondary_width_z17 =			18;
	var secondary_link_width_z17 =	 12;
	var tertiary_width_z17 =			 18;
	var tertiary_link_width_z17 =		12;
	var residential_width_z17 =		12;
	var living_street_width_z17 =		12;
	var pedestrian_width_z17 =		 12;
	var road_width_z17 =				7;
	var service_width_z17 =			 7;
	var minor_service_width_z17 =		 3.5;

	var motorway_width_z18 =			 21;
	var motorway_link_width_z18 =		13;
	var trunk_width_z18 =				21;
	var trunk_link_width_z18 =		 13;
	var primary_width_z18 =			21;
	var primary_link_width_z18 =		 13;
	var secondary_width_z18 =			21;
	var secondary_link_width_z18 =	 13;
	var tertiary_width_z18 =			 21;
	var tertiary_link_width_z18 =		13;
	var residential_width_z18 =		13;
	var living_street_width_z18 =		13;
	var pedestrian_width_z18 =		 13;
	var road_width_z18 =				8.5;
	var service_width_z18 =			 8.5;
	var minor_service_width_z18 =		 4.75;
	var footway_width_z18 =			 1.3;
	var cycleway_width_z18 =			1;

	var motorway_width_z19 =			 27;
	var motorway_link_width_z19 =		16;
	var trunk_width_z19 =				27;
	var trunk_link_width_z19 =		 16;
	var primary_width_z19 =			27;
	var primary_link_width_z19 =		 16;
	var secondary_width_z19 =			27;
	var secondary_link_width_z19 =	 16;
	var tertiary_width_z19 =			 27;
	var tertiary_link_width_z19 =		16;
	var residential_width_z19 =		17;
	var living_street_width_z19 =		17;
	var pedestrian_width_z19 =		 17;
	var road_width_z19 =				 11;
	var service_width_z19 =			11;
	var minor_service_width_z19 =		 5.5;
	var footway_width_z19 =			 1.6;
	var cycleway_width_z19 =			1.3;

	var motorway_width_z20 =			 33;
	var motorway_link_width_z20 =		17;
	var service_width_z20 =			12;
	var minor_service_width_z20 =		 8.5;


	var major_casing_width_z11 =		0.3;

	var casing_width_z12 =				0.3;
	var secondary_casing_width_z12 =	0.3;
	var major_casing_width_z12 =		0.5;

	var casing_width_z13 =				0.5;
	var residential_casing_width_z13 =	0.5;
	var secondary_casing_width_z13 =	0.35;
	var major_casing_width_z13 =		0.5;

	var casing_width_z14 =				0.55;
	var secondary_casing_width_z14 =	0.35;
	var major_casing_width_z14 =		0.6;

	var casing_width_z15 =				0.6;
	var secondary_casing_width_z15 =	0.7;
	var major_casing_width_z15 =		0.7;

	var casing_width_z16 =				0.6;
	var secondary_casing_width_z16 =	0.7;
	var major_casing_width_z16 =		0.7;

	var casing_width_z17 =				0.8;
	var secondary_casing_width_z17 =	1;
	var major_casing_width_z17 =		1;

	var casing_width_z18 =				0.8;
	var secondary_casing_width_z18 =	1;
	var major_casing_width_z18 =		1;

	var casing_width_z19 =				0.8;
	var secondary_casing_width_z19 =	1;
	var major_casing_width_z19 =		1;

	var casing_width_z20 =				0.8;
	var secondary_casing_width_z20 =	1;
	var major_casing_width_z20 =		1;

	var bridge_casing_width_z12 =		 0.1;
	var major_bridge_casing_width_z12 = 0.5;
	var bridge_casing_width_z13 =		 0.5;
	var major_bridge_casing_width_z13 = 0.5;
	var bridge_casing_width_z14 =		 0.5;
	var major_bridge_casing_width_z14 = 0.6;
	var bridge_casing_width_z15 =		 0.75;
	var major_bridge_casing_width_z15 = 0.75;
	var bridge_casing_width_z16 =		 0.75;
	var major_bridge_casing_width_z16 = 0.75;
	var bridge_casing_width_z17 =		 0.8;
	var major_bridge_casing_width_z17 = 1;
	var bridge_casing_width_z18 =		 0.8;
	var major_bridge_casing_width_z18 = 1;
	var bridge_casing_width_z19 =		 0.8;
	var major_bridge_casing_width_z19 = 1;
	var bridge_casing_width_z20 =		 0.8;
	var major_bridge_casing_width_z20 = 1;
	
	var major_points = ['label', 'airport', 'college', 'golf', 'park'];
	var high_points = ['aerialway', 'airfield', 'attraction', 'cinema', 'city', 'department', 'ferry', 'grocery', 'hospital', 'museum', 'park2', 'station', 'town', 'village', 'zoo'];
	var mid_points = ['america-football', 'bank', 'building', 'campsite', 'dam', 'embassy', 'fire-station', 'fuel', 'furniture', 'garden', 'hardware', 'library', 'lodging', 'medical', 'parking', 'parking-garage', 'pharmacy', 'place-of-worship', 'police', 'post', 'religious-christian', 'religious-jewish', 'religious-muslim', 'school', 'theatre', 'town-hall', 'water'];
	var low_points = ['bicycle', 'bus', 'telephone', 'toilets', 'information'];
	var detail_points = ['atm', 'drinking_water', 'shower', 'monument', 'viewpoint', 'subway_entrance'];

    //you can use the public domain licensed maki icon set if there is an issue with using fontawesome icons.

	var icons = {
	"airport" : '\uf072', //plane
	"alcohol_shop" : '\uf4e3', //wine_glass
	"america_football" : '\uf44e', //football_ball
	"art_gallery" : '\uf53f', //palette
	"attraction" : '\uf557', //archway
	"atm" : '\uf53a', //money-bill-wave
	"bakery" : '\uf7ec', //bread_slice
	"bank" : '\uf53d', //money-check-alt
	"bar" : '\uf561', //cocktail
	"baseball" : '\uf433', //baseball_ball
	"basketball" : '\uf434', //basketball_ball
	"beer" : '\uf0fc', //beer
	"book" : '\uf02d', //book
	"bicycle" : '\uf206', //bicycle
	"building" : '\uf6bb', //campground
	"bus" : '\uf207', //bus
	"cafe" : '\uf0f4', //coffee
	"camera" : '\uf083', //camera_retro
	"campsite" : '\uf6bb', //campground
	"car" : '\uf1b9', //car
	"cemetery" : '\uf5a6', //monument
	"chemist" : '\uf0c3', //flask
	"cinema" : '\uf008', //film
	"circle" : '\uf111', //circle
	"circle_stroked" : '\uf111', //circle
	"city" : '\uf64f', //city
	"clothing_store" : '\uf553', //tshirt
	"college" : '\uf19d', //graduation_cap
	"cross" : '\uf654', //cross
	"danger" : '\uf071', //exclamation_triangle
	"dentist" : '\uf5c9', //tooth
	"department" : '\uf290', //shopping_bag
	"disability" : '\uf29d', //blind
	"dog_park" : '\uf1b0', //paw
	"embassy" : '\uf66f', //landmark
	"emergency_telephone" : '\uf2a0', //phone_volume
	"entrance" : '\uf52b', //door_open
	"farm" : '\uf722', //tractor
	"fast_food" : '\uf805', //hamburger
	"ferry" : '\uf21a', //ship
	"florist" : '\uf5bb', //spa
	"fire_station" : '\uf06d', //fire
	"fuel" : '\uf52f', //gas_pump
	"furniture" : '\uf4b8', //couch
	"garden" : '\uf06c', //leaf
	"gift" : '\uf06b', //gift
	"golf" : '\uf450', //golf_ball
	"grocer" : '\uf291', //shopping_basket
	"grocery" : '\uf07a', //shopping_cart
	"hairdresser" : '\uf0c4', //cut
	"harbor" : '\uf13d', //anchor
	"hardware" : '\uf7d9', //tools
	"heart" : '\uf004', //heart
	"heliport" : '\uf533', //helicopter
	"hospital" : '\uf067', //plus
	"ice_cream" : '\uf810', //ice_cream
	"industrial" : '\uf275', //industry
	"informtaion" : '\uf129', //info
	"laundry" : '\uf96e', //soap
	"library" : '\uf518', //book_open
	"lighthouse" : '\uf519', //broadcast_tower
	"lodging" : '\uf236', //bed
	"london_underground" : '\uf239', //subway
	"marker" : '\uf08d', //thumbtack
	"marker_stroked" : '\uf08d', //thumbtack
	"medical" : '\uf469', //briefcase-medical
	"mobilephone" : '\uf3cd', //mobile_alt
	"monument" : '\uf5a6', //monument
	"museum" : '\uf66f', //landmark
	"music" : '\uf001', //music
	"oil_well" : '\uf613', //oil_can
	"park" : '\uf1bb', //tree
	"park2" : '\uf1bb', //tree
	"parking" : '\uf540', //parking
	"parking_garage" : '\uf540', //parking
	"pharmacy" : '\uf5b1', //prescription
	"pitch" : '\uf70c', //running
	"place_of_worship" : '\uf67f', //place_of_worship
	"playground" : '\uf1ae', //child
	"police" : '\uf1ba', //taxi
	"polling_place" : '\uf681', //poll
	"post" : '\uf674', //mail_bulk
	"prison" : '\uf6d9', //dungeon
	"station" : '\uf192', //dot circle
	"platform" : '\uf238', //train
	"subway_entrance" : '\uf239\uf0dd', //subway
	"tram_stop" : '\uf239', //subway
	"religious_christian" : '\uf51d', //church
	"religious_jewish" : '\uf69b', //synagogue
	"religious_muslim" : '\uf678', //mosque
	"restaurant" : '\uf2e7', //utensils
	"roadblock" : '\uf071', //exclamation_triangle
	"rocket" : '\uf135', //rocket
	"school" : '\uf19d', //f5ae
	"scooter" : '\uf193', //wheelchair
	"shelter" : '\uf505', //user-shield
	"shop" : '\uf54e', //store
	"shower" : '\uf2cc', //shower
	"skiing" : '\uf7c9', //skiing
	"slaughterhouse" : '\uf722', //tractor
	"soccer" : '\uf1e3', //futbol
	"square" : '\uf0c8', //square
	"square_stroked" : '\uf0c8', //square
	"star" : '\uf005', //star
	"star_stroked" : '\uf005', //star
	"suitcase" : '\uf5c1', //suitcase_rolling
	"swimming" : '\uf5c4', //swimmer
	"telephone" : '\uf095', //phone
	"tennis" : '\uf45d', //table_tennis
	"theatre" : '\uf630', //theater_masks
	"toilets" : '\uf7bd', //restroom
	"town" : '\uf1ad', //building
	"town_hall" : '\uf66f', //landmark
	"triangle" : '\uf0d8', //caret_up
	"triangle_stroked" : '\uf0d8', //caret_up
	"village" : '\uf1ad', //building
	"viewpoint" : '\uf1e5', //binoculars 
	"warehouse" : '\uf494', //warehouse
	"waste_basket" : '\uf2ed', //trash_alt
	"water" : '\uf773', //water
	"drinking_water" : '\ue005', //faucet
	"wetland" : '\uf773', //water
	"zoo" : '\uf6ed', //hippo
	};
	
	view.on("change:resolution", function() {
            var zoom = view.getZoom();
		
			if (zoom < 14 || zoom >= 17) {
				document.getElementById(div).style.backgroundColor = "#f6f5f3";
			} else {
				document.getElementById(div).style.backgroundColor = shadeColor("#f1f0ef",0); 
			}
    });
	//initial load
	var zoom = view.getZoom();

	if (zoom < 14 || zoom >= 17) {
		document.getElementById(div).style.backgroundColor = "#f6f5f3";
	} else {
		document.getElementById(div).style.backgroundColor = shadeColor("#f1f0ef",0); 
	}

   

	return function(feature, resolution){

		var zoom = View.getZoomForResolution(resolution);
		var length = 0;
		var layer_ = feature.get('layer');

		
		function clearLineFill () {
			line_fill_stroke.setLineDash(null);line_fill_stroke.setLineDashOffset(0);
			line_fill_stroke.setColor('');line_fill_stroke.setWidth(1);line_fill.setZIndex(2);
		}
		
		function clearLineStroke () {
			line_casing_stroke.setLineDash(null);line_casing_stroke.setLineDashOffset(0);
			line_casing_stroke.setColor('');line_casing_stroke.setWidth(1);line_casing.setZIndex(1);
		}
		
		function clearFill () {
			fill.setColor('');
		}
		
		function clearText () {
			text.getText().setPlacement('point');
			text.getText().setOverflow(false);
			text.getText().setOffsetX(0); text.getText().setOffsetY(0);text.setZIndex(1);
			text.getText().setTextBaseline('middle');
		}
		
		function clearPolygon () {
			polygon.setZIndex(0);
			strokedPolygon.setZIndex(0);
		}
		
		function clearLineText () {
			lineText.getText().setOverflow(false);
			lineText.setZIndex(1);
		}
		
		function clearStroke () {
			stroke.setLineDash(null);line_casing_stroke.setLineDashOffset(0);
			stroke.setColor('');
			stroke.setWidth(1);
		}
		
		if (layer_ == 'ocean' || layer_ == 'ocean-lz' || layer_ == 'water-areas') {
		clearFill();
		clearPolygon();
		fill.setColor(water_color);
		styles[length++] = polygon;
		}
		
		if ( layer_ == 'necountries' || layer_ == 'admin-low-zoom' || layer_ == 'admin-mid-zoom' || layer_ == 'admin-high-zoom' ) {
			clearStroke();
			//console.log(JSON.stringify(feature.getProperties()));
			var admin_level = feature.get('admin_level');

			if (zoom >= 1 && zoom < 4) {
				if (zoom >= 3) {
					stroke.setWidth(0.4);
				} else {
					stroke.setWidth(0.3);
				}
				stroke.setColor(admin_boundaries);
			} else if (zoom >=4) {
				if (admin_level == 2 ) {
						if (zoom >= 4) {
						stroke.setColor(admin_boundaries);
						stroke.setWidth(1.2);
						}
						if (zoom >= 5) {
						stroke.setWidth(1.5);
						}
						if (zoom >= 6) {
						stroke.setWidth(1.8);
						}
						if (zoom >= 7) {
						stroke.setWidth(2.2);
						}
						if (zoom >= 8) {
						stroke.setWidth(3);
						}
						if (zoom >= 9) {
						stroke.setWidth(3.5);
						}
						if (zoom >= 10) {
						stroke.setColor(admin_boundaries_narrow);
						stroke.setWidth(4.5);
						}
						if (zoom >= 11) {
						stroke.setWidth(5);
						}
						if (zoom >= 12) {
						stroke.setWidth(6);
						}
						if (zoom >= 13) {
						stroke.setWidth(7);
						}
						if (zoom >= 14) {
						stroke.setWidth(8);
						}
				} else if (admin_level == 3) {
					if (zoom >= 4) {
						stroke.setColor(admin_boundaries_wide);
						stroke.setWidth(0.6);
						}
						if (zoom >= 5) {
						stroke.setWidth(0.8);
						}
						if (zoom >= 6) {
						stroke.setWidth(1);
						}
						if (zoom >= 7) {
						stroke.setWidth(1.2);
						}
						if (zoom >= 8) {
						stroke.setWidth(1.8);
						}
						if (zoom >= 9) {
						stroke.setWidth(2.5);
						}
						if (zoom >= 10) {
						stroke.setWidth(3.2);
						}
						if (zoom >= 11) {
						stroke.setWidth(4);
						}
						if (zoom >= 12) {
						stroke.setWidth(4.5);
						}
						if (zoom >= 13) {
						stroke.setWidth(5);
						}
						if (zoom >= 14) {
						stroke.setWidth(5.5);
						}
				} else if (admin_level >= 4) {
						if (zoom >= 4) {
						stroke.setColor(admin_boundaries_wide);
						stroke.setWidth(0.4);
						}
						if (zoom >= 5) {
						stroke.setWidth(0.5);
						}
						if (zoom >= 6) {
						stroke.setWidth(0.6);
						}
						if (zoom >= 7) {
						stroke.setWidth(0.9);
						stroke.setColor(admin_boundaries_narrow);
						stroke.setLineDash([12,3,2,3]);
						stroke.setLineDashOffset(5);
						}
						if (zoom >= 9) {
						stroke.setWidth(1);
						}
						if (zoom >= 10) {
						stroke.setWidth(2);
						}
						if (zoom >= 11) {
						stroke.setWidth(2.5);
						stroke.setLineDash([12,4,3,4]);
						stroke.setLineDashOffset(6);
						}
						if (zoom >= 12) {
						stroke.setWidth(3);
						}
						if (zoom >= 13) {
						stroke.setWidth(3.5);
						}
						if (zoom >= 14) {
						stroke.setWidth(4);
						}
				}
			}
			
				styles[length++] = line;
			
			
		}

	if (layer_ == 'country-names' && zoom>=3 && zoom<=10) {
		//Currently using natural data's country names since OSM is having issues.  We have left way_pixels method commented out below for those who wish to use OSM data, and for if/when OSM data is fixed.
		
		clearFill();
		clearStroke();
		clearText();
		text.setZIndex(5);
		var zoomScale = 0;
		//var way_pixels = feature.get('way_pixels');
		var labelrank = feature.get('labelrank');
		
		//names overflowing at high zoom levels
		var name = wordWrap(feature.get('name'), 13);
		if (zoom <=4) {
			//if (way_pixels > 35000) {way_pixels = 35000}
			//zoomScale = ((way_pixels*0.001)/4);
			zoomScale =  labelrank+1;
		} else if (zoom < 6){
			//if (way_pixels > 150000) {way_pixels = 150000}
			//zoomScale = ((way_pixels*0.0001)+1);
			zoomScale =  labelrank;
		} else if (zoom <= 7){
			//if (way_pixels > 150000) {way_pixels = 150000}
			//zoomScale = ((way_pixels*0.0001)+1);
			zoomScale =  labelrank-2;
		} else if (zoom <= 8){
			//if (way_pixels > 150000) {way_pixels = 150000}
			//zoomScale = ((way_pixels*0.0001)+1);
			zoomScale =  labelrank-4;
		} else {
			zoomScale = 2;
		}
		
		text.getText().setText(name);
		if (zoom >= 9) {labelrank = 0;}
		fill.setColor('#444');
		stroke.setColor(halo);
		stroke.setWidth(1.5);
		//text.getText().setFont('Bold '+(8+zoomScale)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
		text.getText().setFont('Bold '+(14-zoomScale)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');

		styles[length++] = text;

	}

	if (layer_ == 'state-names' && zoom>=4) {
		var way_pixels = feature.get('way_pixels');

		clearFill();
		clearStroke();
		clearText();
		var zoomScale = 0;
		
		//names overflowing at high zoom levels
		if (zoom <=6) {
			var name = wordWrap(feature.get('name'), 10);
		} else {
			var name = feature.get('name');
		}
		text.getText().setText(name);
		text.setZIndex(4);

			
		if (zoom >= 7) {
			zoomScale = 1;
			if (way_pixels > 1000) {
				zoomScale = 2;
			}
		} else if (zoom >=6 && way_pixels > 2000) {
			zoomScale = 1;
		}
		
		//try to fit state names in small pixel sizes
		if (way_pixels > 2000) {
			
			text.getText().setFont('Italic 600 '+(11+zoomScale)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
		} else if (way_pixels > 1000){
			text.getText().setFont('Italic 600 '+(10+zoomScale)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
		} else{
			text.getText().setFont('Italic '+(9+zoomScale)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
		}
		
		fill.setColor(state_labels);
		stroke.setColor(halo);
		stroke.setWidth(1);

		styles[length++] = text;
	}
	
	if (layer_ == 'text-poly-low-zoom' && zoom>=5) {

		clearFill();
		clearStroke();
		clearText();
		text.setZIndex(4);
		if (zoom >= 10) {text.setZIndex(2);}
		
		var name = wordWrap(feature.get('name'), 13);
		var feature_ = feature.get('feature');
		text.getText().setText(name);
		text.getText().setFont('Italic 600 11px "Open Sans", "Arial", "Verdana", "sans-serif"');
		
		if (feature_ == 'landuse_farmland' || feature_ == 'landuse_forest' || feature_ == 'natural_wood' || feature_ == 'boundary_national_park' || feature_ == 'leisure_nature_reserve' || feature_ == 'boundary_protected_area') {
			fill.setColor(protected_area);
		} else if (feature_ == 'landuse_military') {
			fill.setColor('#a39686');
		} else if (feature_ == 'boundary_aboriginal_lands') {
			fill.setColor(aboriginal);
		} else {
			fill.setColor('#4d80b3');
		}
		stroke.setWidth(1);
		stroke.setColor(halo);
		styles[length++] = text;
		
	}

	if ((layer_ == 'placenames-medium' || layer_ == 'placenames-small') && zoom < 17) {
		clearFill();
		clearStroke();
		clearText();

		var name = feature.get('name');
		
		//cities are filtered on data side
		if (zoom>=4) {
		
			text.getText().setText(name);

			fill.setColor('#555');
			stroke.setColor('#fff');
			stroke.setWidth(2);
			var category = feature.get('category').toString();
			if (zoom >= 10) {
				var zooomScale = 0;
				if (zoom >= 15) {
					var zooomScale = 3;
					text.setZIndex(4);
				} else if (zoom >= 14) {
					var zooomScale = 2;
					text.setZIndex(4);
				} else if (zoom >= 13) {
					text.setZIndex(4);
					var zooomScale = 2;
				} else if (zoom >= 12) {
					var zooomScale = 2;
				} else if (zoom >= 11) {
					var zooomScale = 1;
					
				}
				if (layer_ == 'placenames-medium' && category < 4) {
					
					if (category <= 1) {
						text.getText().setFont('Normal 700 '+(zooomScale+14.5-(category))+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
					} else {
						text.getText().setFont('Normal 600 '+(zooomScale+13.5-(category/2))+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
					}
					if (zoom < 13) {
						text.setZIndex(2);
					}
				} else if (layer_ == 'placenames-medium' && category == 4) {
					if (zoom < 12) {
						text.getText().setFont('Normal '+(zooomScale+11)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
					} else {
						text.getText().setFont('Normal 600 '+(zooomScale+11)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
					}
				} else if (category >= 6){
					fill.setColor('#888');
					if (zoom < 12) {
						text.getText().setFont('Normal '+(zooomScale+10)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
					} else {
						text.getText().setFont('Normal 600 '+(zooomScale+10)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
					}
				} else {
					if (zoom < 15) {
						fill.setColor('#aaa');
						text.getText().setFont('Normal '+(zooomScale+10)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
					} else {
						fill.setColor('#aaa');
						text.getText().setFont('Normal 600 '+(zooomScale+10)+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
					}
				}
			} else if (zoom>=7) {
				
				if (layer_ == 'placenames-medium' && category < 4) {
					if (category <= 2) {
						if (category <= 1) {
							text.getText().setFont('Normal 700 12px "Open Sans", "Arial", "Verdana", "sans-serif"');
							text.setZIndex(2.5);
						} else {
							text.getText().setFont('Normal 600 11px "Open Sans", "Arial", "Verdana", "sans-serif"');
							text.setZIndex(2);
						}
					} else {
						text.getText().setFont('Normal 11px "Open Sans", "Arial", "Verdana", "sans-serif"');
					}
				} else {
					fill.setColor('#999');
					text.getText().setFont('Normal 10px "Open Sans", "Arial", "Verdana", "sans-serif"');
				}
			} else if (zoom>=6) {
				text.getText().setFont('Normal 10px "Open Sans", "Arial", "Verdana", "sans-serif"');
			} else {
				text.getText().setFont('Normal 11px "Open Sans", "Arial", "Verdana", "sans-serif"');
			}
			

			styles[length++] = text;
			if (((layer_ == 'placenames-medium' && category < 4) || zoom <= 6) && zoom < 8) {
				text.getText().setOffsetY(12); 
				styles[length++] = getcityDot();
			}
		}
		
	}
	
	if (layer_ == 'landcover_low_zoom' || layer_ == 'landcover-low-zoom' || layer_ == 'landcover' || layer_ == 'landuse-overlay' || layer_ == 'piers-poly' || layer_ == 'bridge' || layer_ == 'highway-area-fill') {
		clearFill();
		clearPolygon();
		var feature_ = feature.get('feature');
		
		if (feature_ == 'natural_green' || feature_ == 'leisure_nature_reserve') {
			if (zoom <= 9 || zoom >= 14) {
				fill.setColor(forest);
			} else {
				fill.setColor(forest_low_zoom);
			}
		} else if (feature_ == 'apron') {
			fill.setColor(trunk_fill_low_zoom);
		} else if (feature_ == 'aerodrome' || feature_ == 'landuse_industrial' || feature_ == 'shop_retail' || feature_ == 'railway_platform') {
			fill.setColor(commercial);
		} else if (feature_ == 'amenity_parking') {
			fill.setColor(parking);
		} else if (feature_ == 'highway_area') {
			fill.setColor('#f7f7f7');
		} else if (feature_ == 'amenity_school') {
			fill.setColor(school);
		} else if (feature_ == 'amenity_medical') {
			fill.setColor(medical);
		} else if (feature_ == 'leisure_water') {
			fill.setColor('lightblue');
		} else if (feature_ == 'leisure_park') {
			if (zoom >= 16) {
				fill.setColor(park);
			} else {
				fill.setColor(park_low_zoom);
			}
		} else if (feature_ == 'leisure_green') {
			fill.setColor(playground);
		} else if (feature_ == 'natural_brown') {
			if (layer_ == 'piers-poly') {polygon.setZIndex(1);}
			fill.setColor(natural_brown);
		} else if (feature_ == 'natural_glacier') {
			fill.setColor(glacier);
		} else if (feature_ == 'boundary_national_park') {
			if (zoom >= 12) {
				fill.setColor('#f6f7f0');
			} else {
				fill.setColor(national_park);
			}
		} else if (feature_ == 'landuse_military') {
			fill.setColor(military);
		} else {
			fill.setColor(land_color);
		}

		styles[length++] = polygon;
	}
	
	if (layer_ == 'highway') {
		clearLineStroke();
		line_casing_stroke.setColor(motorway_fill_low_zoom);
		line_casing_stroke.setWidth(1);
		styles[length++] = line_casing;
	}
	
	if (layer_ == 'roads-low-zoom' || layer_ == 'roads-casing' || layer_ == 'aerialways') {
		
		//Deviates a bit from osm-carto data by unifying some queries for easier changes and mods.
		clearLineFill();
		clearLineStroke();
		var feature_ = feature.get('feature');
		var link_ = feature.get('link'); 
		var int_type = feature.get('int_type'); //1 = tunnel; 2 = bridge; 3 = link; 4 = crosswalk; 5 = sidewalk; 6 = handicap accessible
		var oneway = feature.get('oneway'); 
		var lanes = feature.get('ln'); 
		
		if (zoom >= 7) {
			if (feature_ == 'highway_motorway') {
			line_fill_stroke.setColor(motorway_low_zoom);
			if (zoom<14) {line_fill.setZIndex(3);}
			line_fill_stroke.setWidth(motorway_width_z7);
			
			if (zoom>=8) { line_fill_stroke.setWidth(motorway_width_z8); }
			if (zoom>=9) { line_fill_stroke.setWidth(motorway_width_z9); }
			if (zoom>=10) { line_fill_stroke.setWidth(motorway_width_z10+0.75); line_fill_stroke.setColor(motorway_fill);}
			if (zoom>=11) { line_fill_stroke.setWidth(motorway_width_z11+0.75); }
			if (zoom>=12) { line_fill_stroke.setWidth(motorway_width_z12+1); }
			if (zoom>=13) { line_fill_stroke.setWidth(motorway_width_z13-1); }
			if (zoom>=14) { line_fill_stroke.setWidth(motorway_width_z13-2); }
			if (zoom>=15) { line_fill_stroke.setWidth(motorway_width_z15-4); }
			if (zoom>=16) { line_fill_stroke.setWidth(motorway_width_z15-3); }
			if (zoom>=17) { line_fill_stroke.setWidth(motorway_width_z17-5); }
			if (zoom>=18) { line_fill_stroke.setWidth(motorway_width_z18); }
			if (zoom>=19) { line_fill_stroke.setWidth(motorway_width_z19); }
			if (zoom>=20) { line_fill_stroke.setWidth(motorway_width_z20); }
			if (zoom>=16 && oneway == '1') {
				//add direction marker
			}
			
			if (int_type == 3 || lanes == 1) {
				if (zoom >= 17) { line_fill_stroke.setWidth(line_fill_stroke.getWidth()-2.5);}
				else if (zoom >= 7) { line_fill_stroke.setWidth(line_fill_stroke.getWidth()-2);}
				
			}
		} else if ((feature_== 'highway_primary' && zoom < 13) || feature_== 'highway_trunk') {
			line_fill_stroke.setColor(trunk_fill_low_zoom);
			line_fill_stroke.setWidth(trunk_width_z7+0.5);
			if (zoom<14 && feature_== 'highway_trunk') {line_fill.setZIndex(3.5);}
			if (zoom>=8) { line_fill_stroke.setWidth(trunk_width_z8); }
			if (zoom>=9) { line_fill_stroke.setWidth(trunk_width_z9-0.4); }
			if (zoom>=10) { line_fill_stroke.setWidth(trunk_width_z10-0.6); }
			if (zoom>=11) { line_fill_stroke.setWidth(trunk_width_z11-0.6); }
			if (zoom>=12) { line_fill_stroke.setWidth(trunk_width_z12 + 1.5); }
			if (zoom>=13) { line_fill_stroke.setWidth(trunk_width_z13); line_fill_stroke.setColor(secondary_fill);}
			if (zoom>=14) { line_fill_stroke.setWidth(trunk_width_z13+1); if (feature_== 'highway_primary') {line_fill_stroke.setColor('#ffffff');}}
			if (zoom>=15) { line_fill_stroke.setWidth(trunk_width_z15-1); }
			if (zoom>=16) { line_fill_stroke.setWidth(trunk_width_z15-0.2); }
			if (zoom>=17) { line_fill_stroke.setWidth(trunk_width_z17-1.8); }
			if (zoom>=18) { line_fill_stroke.setWidth(trunk_width_z18); }
			if (zoom>=19) { line_fill_stroke.setWidth(trunk_width_z19); }

			if (zoom>=16 && oneway == '1') {
				 //add direction marker
			}
		} else if (feature_== 'highway_secondary' || feature_== 'highway_tertiary' || (feature_== 'highway_primary' && zoom >= 13)) {
			line_fill_stroke.setColor(secondary_low_zoom);
			line_fill_stroke.setWidth(trunk_width_z7+0.5);
			if (zoom>=10) { line_fill_stroke.setWidth(secondary_width_z10+0.25); }
			if (zoom>=11) { line_fill_stroke.setWidth(secondary_width_z11+1.2); }
			if (zoom>=12) { line_fill_stroke.setWidth(secondary_width_z12-0.4);}
			if (zoom>=13) { line_fill_stroke.setWidth(secondary_width_z13); }
			if (zoom>=14) { line_fill_stroke.setWidth(secondary_width_z14+0.5);  line_fill_stroke.setColor('#ffffff');}
			if (zoom>=15) { line_fill_stroke.setWidth(secondary_width_z15-1); }
			if (zoom>=16) { line_fill_stroke.setWidth(secondary_width_z16-0.5);} 
			if (zoom>=17) { line_fill_stroke.setWidth(secondary_width_z17-2.5);} //large jump needed for showing seperation between medians
			if (zoom>=18) { line_fill_stroke.setWidth(secondary_width_z18);}
			if (zoom>=19) { line_fill_stroke.setWidth(secondary_width_z19);}
			if (feature_== 'highway_primary') {line_fill_stroke.setColor(secondary_fill);}
			if (zoom>=16 && oneway == '1') {
				 //add direction marker
			}
		} else if (feature_ == 'highway_residential' || feature_ == 'highway_unclassified') {
			line_fill_stroke.setColor('#dadada');
			if (zoom>=12) { line_fill_stroke.setWidth(residential_width_z12);}
			if (zoom>=13) { line_fill_stroke.setWidth(residential_width_z13-1.7); }
			if (zoom>=14) { line_fill_stroke.setWidth(residential_width_z14-0.8); line_fill_stroke.setColor('#ffffff');}
			if (zoom>=15) { line_fill_stroke.setWidth(residential_width_z15-1.4);}
			if (zoom>=16) { line_fill_stroke.setWidth(residential_width_z16-0.5);}
			if (zoom>=17) { line_fill_stroke.setWidth(residential_width_z17-1.4);}
			if (zoom>=18) { line_fill_stroke.setWidth(residential_width_z18-1);}
			if (zoom>=19) { line_fill_stroke.setWidth(residential_width_z19-1);}
			if (zoom>=16 && oneway == '1') {
				 //add direction marker
			}
		} else if (feature_ == 'highway_pedestrian' || feature_ == 'highway_living_street') {
			line_fill_stroke.setColor('#e7e7e7');
			if (zoom>=14) { line_fill_stroke.setWidth(service_width_z16);}
			if (zoom>=17) { line_fill_stroke.setWidth(service_width_z17);}
			if (zoom>=18) { line_fill_stroke.setWidth(service_width_z18);}
			if (zoom>=19) { line_fill_stroke.setWidth(service_width_z19);line_fill_stroke.setColor('#ffffff');}
			if (zoom>=16 && oneway == '1') {
				 //add direction marker
			}
		} else if (feature_ == 'highway_road' || (feature_ == 'highway_service' && zoom >= 15) || (feature_ == 'highway_INT-minor' && zoom >= 16)) {
			line_fill_stroke.setColor('#e7e7e7');
			if (zoom>=14) { if (feature_ == 'highway_service') {line_fill_stroke.setWidth(minor_service_width_z16 - 1.2);} else {line_fill_stroke.setWidth(minor_service_width_z16);}}
			if (zoom>=16) { line_fill_stroke.setWidth(minor_service_width_z16);}
			if (zoom>=17) { line_fill_stroke.setWidth(minor_service_width_z17);}
			if (zoom>=18) { line_fill_stroke.setWidth(minor_service_width_z18);}
			if (zoom>=19) { line_fill_stroke.setWidth(minor_service_width_z19);}
			if (zoom>=16 && oneway == '1') {
				 //add direction marker
			}
			
			if (feature_ == 'highway_INT-minor' ) {
				if (zoom<17) { line_fill_stroke.setWidth(minor_service_width_z16-1.5);} 
				else {line_fill_stroke.setWidth(line_fill_stroke.getWidth()-2);}
			}
		} else if ((feature_ == 'railway_train'  || feature_ == 'railway_subway') && zoom >= 15) {
			line_fill_stroke.setColor(trunk_fill_low_zoom);
			if (feature_ == 'railway_subway') {line_fill_stroke.setLineDash([6,3]);}
			if (zoom>=14) { line_fill_stroke.setWidth(0.7);}

		} else if (((zoom >= 15 && !int_type) || zoom >= 16) && (feature_ != 'highway_INT-minor')) {
			line_fill_stroke.setColor('rgba(175, 175, 165, 0.3)');
		
			if (int_type < 4 || int_type == 6 ||  layer_ == 'aerialways' ) {
				if (zoom>=15) { line_fill_stroke.setWidth(0.7);}
				if (zoom>=16) { line_fill_stroke.setWidth(1.2);}
				if (zoom>=17) { line_fill_stroke.setWidth(1.7);}
			} else {
				if (zoom>=16) { line_fill_stroke.setWidth(minor_service_width_z16);}
				if (zoom>=17) { line_fill_stroke.setWidth(minor_service_width_z17);}
				if (zoom>=18) { line_fill_stroke.setWidth(minor_service_width_z18);}
				if (zoom>=19) { line_fill_stroke.setWidth(minor_service_width_z19);}
			} 
			if (int_type == 4) {
				
				line_fill_stroke.setWidth(3);
				line_fill_stroke.setColor(land_color);
				line_fill.setZIndex(3);
				line_fill_stroke.setLineDash([4,4]);
				line_fill_stroke.setLineDashOffset(4);
			}
			if (int_type == 5) {line_fill_stroke.setColor(parking);}
			if (int_type == 1) {line_fill_stroke.setColor('#e8e1e7');}
			if (int_type < 4 || int_type == 6 ) {
				line_fill_stroke.setLineDash([3,3]);
			}
			if (layer_ == 'aerialways') {line_fill_stroke.setColor('#d9d9d9');}
			
		}
		if (lanes > 2 && zoom >= 14) {
			var linewidth = line_fill_stroke.getWidth();
			linewidth = ((linewidth * 0.125) * (lanes - 2)) + linewidth;
			line_fill_stroke.setWidth(linewidth);
		}
	}

if (zoom>= 9) {
		
		if ((feature_== 'highway_motorway') && zoom > 15 ) {
			line_casing_stroke.setWidth(line_fill_stroke.getWidth()+0.4);
			line_casing_stroke.setColor(shadeColor(line_fill_stroke.getColor(), -20));
			
		} else if ((feature_== 'highway_primary' && zoom < 13) || feature_== 'highway_trunk') {
			line_casing_stroke.setColor('#cccccc');
			line_casing_stroke.setWidth(line_fill_stroke.getWidth()+0.4);
			if (zoom==12) {line_casing_stroke.setColor('#fff');line_casing_stroke.setWidth(line_fill_stroke.getWidth()+0.6);}
			if (zoom<14 && feature_== 'highway_trunk') {line_casing.setZIndex(3);}
			if (zoom>=13) { line_casing_stroke.setColor(shadeColor(line_fill_stroke.getColor(), -20));line_casing_stroke.setWidth(line_fill_stroke.getWidth()+0.8);}
			
		} else if ((feature_== 'highway_secondary' || feature_== 'highway_tertiary' || (feature_== 'highway_primary' && zoom >= 13)) && zoom >= 11 ) {
			line_casing_stroke.setWidth(line_fill_stroke.getWidth()+1.2);
			line_casing_stroke.setColor('#fff');
			if (zoom>=14 || feature_== 'highway_primary') { line_casing_stroke.setColor(shadeColor(line_fill_stroke.getColor(), -25));}
			
		} else if ((feature_== 'highway_residential' || feature_== 'highway_unclassified') && (zoom >= 14)) {
			line_casing_stroke.setWidth(line_fill_stroke.getWidth()+0.2);
			line_casing_stroke.setColor('#fff');
			if (zoom>=14) { line_casing_stroke.setColor(shadeColor(line_fill_stroke.getColor(), -20));line_casing_stroke.setWidth(line_fill_stroke.getWidth()+1);}
			if (zoom>=15) { line_casing_stroke.setWidth(line_fill_stroke.getWidth()+0.9);}
			if (zoom>=16) { line_casing_stroke.setColor(shadeColor(line_fill_stroke.getColor(), -25))}
			if (zoom>=17) {line_casing_stroke.setWidth(line_fill_stroke.getWidth()+1.2);}
			
		} else if ((feature_== 'highway_pedestrian' || feature_== 'highway_living_street') && zoom < 19) {
			line_casing_stroke.setColor('#fff');
			line_casing_stroke.setWidth(line_fill_stroke.getWidth()+0.2);
			if (zoom>=16) { line_casing_stroke.setWidth(line_fill_stroke.getWidth()+1);}
			
		} else if ((feature_== 'highway_road' || (feature_== 'highway_service' && zoom >= 16) || (feature_ == 'highway_INT-minor' && zoom >= 17))) {
			line_casing_stroke.setColor('#fff');
			line_casing_stroke.setWidth(line_fill_stroke.getWidth()+0.2);
			if (zoom>=16) { line_casing_stroke.setWidth(line_fill_stroke.getWidth()+0.8);}
		} else if (zoom >= 17 && int_type == 6) {
			line_casing_stroke.setLineDash([3,3]);
			line_casing_stroke.setColor('rgba(118, 147, 183, 0.2)');
			line_casing_stroke.setWidth(line_fill_stroke.getWidth());
		}
		//add casing for bridges and tunnels
		if (zoom >= 15 && (int_type == 1 || int_type == 2 ) && (feature_!= 'railway_train'  && feature_!= 'railway_subway')) {line_casing_stroke.setWidth(line_casing_stroke.getWidth()+1);}
	}

	if (line_casing_stroke.getColor() != '') {
	 styles[length++] = line_casing;
	}
	if (line_fill_stroke.getColor() != '') {
	 styles[length++] = line_fill;
	}
	}


	if (layer_ == 'ferry-routes' ) {
		clearStroke();
		stroke.setColor('#a9c1da');
		stroke.setLineDash([6,6]);
		if (zoom>=12) { stroke.setWidth(1);}
		if (zoom>=17) { stroke.setWidth(1.5);}
		styles[length++] = line;
	}
	
	if (layer_ == 'roads-text-ref-low-zoom' || layer_ == 'roads-text-ref') {
		clearFill();
		var highway = feature.get('highway');
		var width = feature.get('width');
		var refs = feature.get('refs');

		//have to convert line to points for shields.  Had trouble with built in functions, so grabbing manually.
		var aa = feature.getGeometry();
		var coords = [],
		i = 0,
		n = aa["flatCoordinates_"].length;

		while (i < n) {
			coords.push(aa["flatCoordinates_"].slice(i, i += 2));
		}
		var opacity = 1;
		if (zoom <= 11) {opacity = 0.7} else {opacity = 0.9};
		
		if (zoom >= 10 || ((highway == 'motorway' || highway == 'trunk' || highway == 'primary' || highway == 'secondary' || highway == 'tertiary') && width <=7) ) {
			 if (refs.lastIndexOf('I ', 0) === 0 && width<=5) {
				 styles[length++] = getShield('us-interstate.svg', coords[0], refs.replace('I ',''), 'interstate',opacity, zoom);
			 } else if (refs.lastIndexOf('US ', 0) === 0 && width<=6) {
				if (zoom > 11) { opacity = 0.9};
				styles[length++] = getShield('us-shield.svg', coords[0], refs.replace('US ',''), 'us', opacity, zoom);
			 } else if ( width<=11) {
				styles[length++] = getShield('motorway_'+width+'x1.svg', coords[0], refs, 'other', opacity, zoom);
			 } 
		 }
			
	}
	
	if (layer_ == 'roads-text-name' || layer_ == 'paths-text-name') {
		clearFill();
		var name = feature.get('name');
		var highway = feature.get('highway');
		
 
		if (zoom >= 14 || ((highway == 'trunk' || highway == 'primary' || highway == 'secondary' || highway == 'tertiary') && zoom >= 11) ) {
			clearLineText();
			var way_length = feature.get('way_length');
			var showRoad = false;
			var roadFont = 'Normal 9px "Open Sans", "Arial", "Verdana", "sans-serif"';
			var roadZindex = 0;
			var roadColor = '#999';
			
			if (zoom<14 ) {
				showRoad = true;
			}
			else if (zoom>=14 && zoom<15 ) {
				if (highway == 'motorway' || highway == 'trunk' || highway == 'primary') {
					roadFont = 'Normal 11px "Open Sans", "Arial", "Verdana", "sans-serif"';
				} else {
					roadFont = 'Normal 9px "Open Sans", "Arial", "Verdana", "sans-serif"';
				}
				showRoad = true;
			}
			else if (zoom>=15 && zoom<16) { 
				if (highway == 'motorway' || highway == 'trunk' || highway == 'primary' || highway == 'secondary' || highway == 'tertiary') {
					roadFont = 'Normal 10.5px "Open Sans", "Arial", "Verdana", "sans-serif"';
					roadZindex = 3;
				} else {
					roadFont = 'Normal 8.5px "Open Sans", "Arial", "Verdana", "sans-serif"';
					roadZindex = 1;
				}
				if (way_length > 350) {
					showRoad = true;
				}
			}
			else if (zoom>=16 && zoom<17) { 
			if (highway == 'motorway' || highway == 'trunk' || highway == 'primary' || highway == 'secondary' || highway == 'tertiary') {
					roadFont = 'Normal 11px "Open Sans", "Arial", "Verdana", "sans-serif"';
					roadZindex = 3;
				} else {
					roadFont = 'Normal 10px "Open Sans", "Arial", "Verdana", "sans-serif"';
					roadZindex = 2;
				}
				if (way_length > 200) {
					showRoad = true;
				}
				
			}
			else if (zoom>=17) {
				if (highway == 'motorway') {
					roadFont = 'Normal 12px "Open Sans", "Arial", "Verdana", "sans-serif"';
				} else if (highway == 'trunk' || highway == 'primary' || highway == 'secondary' || highway == 'tertiary') {
					roadFont = 'Normal 13.5px "Open Sans", "Arial", "Verdana", "sans-serif"';
				} else {
					roadFont = 'Normal 12px "Open Sans", "Arial", "Verdana", "sans-serif"';
				}
				showRoad = true;
				roadZindex = 5;
			}
			
			if (showRoad == true ) {

				if (highway == 'motorway' ) {
					roadColor = '#777';
				} else {
					if (zoom >=15 && (highway == 'trunk' || highway == 'primary' || highway == 'secondary' || highway == 'tertiary')) {
						roadColor = '#888'
					} else if (zoom == 14) {
						roadColor = '#909090';
					} else if (zoom < 14) {
						roadColor = '#999';
					} else {
						roadColor = '#aaa';
					}
					if (highway == 'ferry') {
						roadColor = water_text;
					}
				}
				styles[length++] = getLineText(roadColor, name, roadFont, roadZindex);
			}
		}
	}
		
		
	if (layer_ == 'water-lines') {
		clearStroke();
		var waterway = feature.get('waterway');
		var intermittent = feature.get('int');
		if (zoom >= 8) {
			if (intermittent == 'yes' || waterway =='stream') {
				stroke.setLineDash([8,4]);
			}
			stroke.setColor( water_color );
			stroke.setWidth( 0.7 );
			if (zoom >= 11) { stroke.setWidth( 1 ); }
			if (zoom >= 13 && waterway == 'river') { stroke.setWidth( 2 ); }
			if (zoom >= 13 && waterway != 'river') { stroke.setWidth( 0.5 ); }
			styles[length++] = line;
	  }
	}
	
	if (layer_ == 'water-lines-text') {
		clearFill();
		clearLineText();
		lineText.setZIndex(0);
		lineText.getText().setText(feature.get('name'));
		fill.setColor(water_text);
		lineText.getText().setFont('Italic 10px "Open Sans", "Arial", "Verdana", "sans-serif"');
		styles[length++] = lineText;
	}

		
				 
	if (layer_ == 'aeroways') {
		var aeroway = feature.get('aeroway');
		clearFill();
		clearStroke();
		clearPolygon();
		if (aeroway == 'runway' && zoom >= 12) { 
			fill.setColor(runway_fill);
			stroke.setColor(runway_fill);
			stroke.setWidth(2+2*major_casing_width_z14); 
			styles[length++] = strokedPolygon;
		} else if (aeroway == 'taxiway' && zoom >= 12) {
			fill.setColor(taxiway_fill);
			stroke.setColor(taxiway_fill);
			stroke.setWidth(1+2*secondary_casing_width_z14); 
			if (zoom >=14) {stroke.setWidth(1+2*secondary_casing_width_z15);} 
			styles[length++] = strokedPolygon;
		} 
	}
		
	if (layer_ == 'amenity-points' || layer_ == 'stations') { 
		
		var imp = feature.get('i');
		//imp gives a bit more information for implying importance. 1 = chain; 2 = larger school; 3 = has wikidata
		var handicap = feature.get('h'); //handicap accessible
		var textname = feature.get('name');
		var feature_ = feature.get('feature');
		var feature_icon = '';
		var feature_color = '';
		var showIcon = false;
		var zindex = 1;
		var textsize = '10';
		var textweight = '';
		var textfill = amenity_purple;
		
		if (mapFilters !== '') {
			var addFeature = true;
			var i;
			for (i = 0; i < mapFilters.length; i++) {
			   switch(mapFilters[i]) {
				  case 'major_points':
					if (major_points.includes(feature_)) { return false; }
					break;
				  case 'high_points':
					if (high_points.includes(feature_)) { return false; }
					break;
				  case 'mid_points':
					if (mid_points.includes(feature_)) { return false; }
					break;
				  case 'low_points':
					if (low_points.includes(feature_)) { return false; }
					break;
				  case 'detail_points':
					if (detail_points.includes(feature_)) { return false; }
					break;
				  case 'other_points':
					if (major_points.includes(feature_) || high_points.includes(feature_) || mid_points.includes(feature_) || low_points.includes(feature_) || detail_points.includes(feature_)) {   break;} else {
						return false;
					}
				} 
			} 
		}
		
		if (feature_=='park' || feature_=='golf') {
			textfill = protected_area;
		} else if (feature_=='label') {
			textfill = amenity_brown;
		}
		
		if (zoom>=14) { textweight = '650';}
		
		if (major_points.includes(feature_)) {
			showIcon = true;
			zindex = 3;
			if (zoom>=10 && feature_=='airport') {
				zindex = 4;
				textfill = state_labels;
				textweight = '700';
				textsize = '10';
				if (zoom>=14) { textsize = '12';}
				if (zoom>=15) { textsize = '13';}
				if (zoom>=16) { textsize = '15';}
				if (zoom>=17) { showIcon = false; }
			}
			if (zoom>=17 && feature_=='label') { zindex = 0; }
			else if (zoom>=16) {  
				textsize = '11';
				zindex = 4;
				if (feature_ == 'label') {zindex = 0;}
			} else if (zoom>=15) {  textsize = '10.5'; }
			else if (zoom>=14) {  textsize = '11'; }
			
			if (feature_=='park' || feature_=='golf') {textsize = '10.5';zindex = zindex - 1;}
			
		} else {
			if (icons[feature_.replace(/-/g, '_')] != undefined && feature_!='other' && feature_!='building' && zoom>=14) {
				if (feature_=='parking') {
					feature_icon = icons[feature_.replace(/-/g, '_')];
					feature_color = '#ddd';
					textfill = '#bbb';
				} else if (layer_ == 'stations' || detail_points.includes(feature_) || low_points.includes(feature_)) { 
					feature_icon = icons[feature_.replace(/-/g, '_')];
					if (handicap == 1) {
						feature_color = '#96afce';
					} else {
						feature_color = amenity_brown;
					}	
				} else {
					feature_icon = icons[feature_.replace(/-/g, '_')];
					feature_color = amenity_purple;
				}
			}
			if (feature_ == 'restaurant' || feature_ == 'fast-food' || feature_ == 'cafe') {
				textfill = '#dfb171';
				feature_color = '#dfb171';
			} else if (feature_ == 'hospital' || feature_ == 'medical') {
				textfill = '#e69c90';
				feature_color = '#e69c90';
			} else if (feature_ == 'bank') {
				textfill = '#b9b0a2';
				feature_color = '#b9b0a2';
			} else if (feature_ == 'station') {
				feature_color = '#79a6e0';
			}
			if (zoom >= 14 && high_points.includes(feature_)) {
				showIcon = true;
				//zoom 15 brings in additional points
				
				if (zoom >= 16) {zindex = 3;}
				if (zoom >= 18) {zindex = 4;}
				
			} else if (zoom >= 16 && (mid_points.includes(feature_) && (imp >= 1 ))) {
				showIcon = true;
				zindex = 1;
				if (zoom >= 17) {zindex = 2;}
				if (zoom >= 18) {zindex = 3;}
			} else if (zoom >= 17 && mid_points.includes(feature_) ) {
				showIcon = true;
				zindex = 1;
				if (zoom >= 18) {zindex = 3;}
			} else if (zoom >= 17 && imp >= 1) {
				showIcon = true;
				zindex = 0;
				if (zoom >= 18) {zindex = 2;}
			} else if (zoom >= 18 && !detail_points.includes(feature_)) {
				showIcon = true;
				zindex = 2;
			} else if (zoom >= 19) {
				showIcon = true;
				zindex = 2;
			}
			textsize = '10';
		}

		if (textname != undefined && textname != '') {
			textname = wordWrap(textname, 12)
		}
		
		if (showIcon) {
			if (feature_icon != '') {
				styles[length++] = getIcon(feature_icon, feature_color, textname, textfill, textweight+' '+textsize+'px/'+(parseInt(textsize) + 2).toString()+'px "Font Awesome 5 Free", "Open Sans", "Arial", "Verdana", "sans-serif"', zoom, zindex);
			}
			if (layer_ == 'stations' || detail_points.includes(feature_) || low_points.includes(feature_)) {
				textfill = amenity_brown;
			}
			
			if (textname != undefined && textname != '') {
				
				text.getText().setText(textname);
				clearText();
				clearFill();
				clearStroke();
				fill.setColor(textfill);
				stroke.setColor(halo);
				stroke.setWidth(1.5);
				if (feature_ == 'college' || feature_ == 'airport' || (feature_icon == '' && feature_ != 'label' && feature_ != 'park' && feature_ != 'golf')) {
					stroke.setWidth(2);
				}
				text.getText().setFont('Normal 600 '+textsize+'px "Open Sans", "Arial", "Verdana", "sans-serif"');
				if (feature_icon == '') {
					text.getText().setOffsetY(10);
				} else {
					text.getText().setTextBaseline('top');
					text.getText().setOffsetY(1);
				}
				text.setZIndex(zindex-1);
				if ( low_points.includes(feature_)) {text.setZIndex(0);}
				text.getText().setPadding([0,0,0,0]);
				styles[length++] = text;
			}
		}
	}
	
	if (layer_ == 'buildings' && zoom>=17 ) {
		clearFill();
		clearStroke();
		clearPolygon();
		var height = feature.get('height');

		if (zoom >= 17) {
			//todo: add better 3d effect.  open layers lacks proper concept.

			var aa = feature.getGeometry();
			var coords = [];
			i = 0;
			n = aa["flatCoordinates_"].length;

			if ((height*0.0185) > 1) {
				while (i < n) {
					coords.push(aa["flatCoordinates_"][i]+(height*0.0185));
					i += 1;
				}
			} else {
				while (i < n) {
					coords.push(aa["flatCoordinates_"][i]+(1));
					i += 1;
				}
			}

			fill.setColor(building_fill);
			stroke.setWidth(0.75);
			stroke.setColor(building_line);
			strokedPolygon.setZIndex(1);
			styles[length++] = strokedPolygon;
			styles[length++] = new Style({
				geometry: new ol.geom.Polygon(coords, 'XY', feature.getGeometry()["ends_"]),
				fill: new Fill({
						color: building_line
				}), zIndex: 0
			});
			
		} else {
			styles[length++] = polygon;
		}
		

	}	


	if (layer_ == 'icesheet-poly') {
		clearFill();
		clearPolygon();
		fill.setColor(glacier);
		styles[length++] = polygon;
	}

	if (layer_ == 'addresses' && zoom>=19 ) {

		var styleaddress = addaddressnum(feature.get('addr_housenumber'), 'Normal 10px "Open Sans", "Arial", "Verdana", "sans-serif"');
		if (zoom >= 21) { 
			styleaddress.setZIndex(5);
		} else {
			styleaddress.setZIndex(0);
		}
		if (styleaddress != '') {styles[length++] = styleaddress;}
	}

	styles.length = length;
	return styles;
};
}
