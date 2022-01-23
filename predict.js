// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/Yl3Z0YMy2/";

// let model, webcam, labelContainer, maxPredictions;

let imageLoaded = false;
$("#image-selector").change(function () {
	imageLoaded = false;
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		$("#selected-image").attr("src", dataURL);
		$("#prediction-list").empty();
		imageLoaded = true;
	}
	let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

let model;

const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

model = await tmImage.load(modelURL, metadataURL);
maxPredictions = model.getTotalClasses();

let modelLoaded = false;
$( document ).ready(async function () {
	modelLoaded = false;
	$('.progress-bar').show();
    console.log( "Loading model..." );
    // model = await tf.loadLayersModel('model/model.json');
    model = await tmImage.load(modelURL, metadataURL);
	$('.progress-bar').hide();
	modelLoaded = true;
});

$("#predict-button").click(async function () {
	if (!modelLoaded) { alert("The model must be loaded first"); return; }
	if (!imageLoaded) { alert("Please select an image first"); return; }

	let image = $('#selected-image').get(0);

	let tensor = tf.browser.fromPixels(image, 3)
		.resizeNearestNeighbor([224, 224]) // change the image size
		.expandDims()
		.toFloat()
		.reverse(-1); // RGB -> BGR
	let predictions = await model.predict(tensor).data();

	console.log(predictions);
	let top5 = Array.from(predictions)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: TARGET_CLASSES[i] // we are selecting the value from the obj
			};
		}).sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, 9);

	$("#prediction-list").empty();
	top5.forEach(function (p) {
		$("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
              prediction[i].className +
              ": " +
              prediction[i].probability.toFixed(9);
            labelContainer.childNodes[i].innerHTML = classPrediction;
          }
		});
});

