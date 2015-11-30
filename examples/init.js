var markerPositions = [
	{
		lat: -33.8784226,
		lng: 151.1956816, 
		title: "Muhammad 'Nof' Naufal",
		videoId: "sGbxmsDFVnE"
	},
	{
		lat: -33.9627721,
		lng: 151.08323, 
		title: "Jabran Chaudhry",
		videoId: "vgqG3ITMv1Q"
	},
	{
		lat: -33.962826,
		lng: 151.1324472, 
		title: "Rahaf Ahmed ",
		videoId: "4W6byFcD5uE"
	},
	{
		lat: -33.920286,
		lng: 151.0186004, 
		title: "Tala Judeh",
		videoId: "kMqeoW3XRa0"
	},
	{
		lat: -33.8571165,
		lng: 151.0188128, 
		title: "Mehmet Ozalp",
		videoId: "sGbxmsDFVnE"
	},
	{
		lat: -33.8536437,
		lng: 151.0236031, 
		title: "Masheed Ansari",
		videoId: "Y_cSTFbozb8"
	}
];


for(var i = 0; i < markerPositions.length; i++) {

	$('#slider').append('<div class="sliderBox" boxid="' + i + '" id="' + 'box' + i + '"><span id="childElement"></span><div class="sliderBoxImg"><img src="https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2012/1/19/1326962405927/A-Muslim-woman-wearing-a--007.jpg?w=620&q=85&auto=format&sharp=10&s=d337a9244f20ff527a6842f11ac55a57"/></div><div class="sliderBoxTitle">' + markerPositions[i].title + '</div></div>');

}



