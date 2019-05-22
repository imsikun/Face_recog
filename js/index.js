const video = document.getElementById('video');

// loading all the modals that we have for the further process
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('../models'),

  //this is for the landmark in my faces(e.g. eyes, nose, lips, hair etc) 
  faceapi.nets.faceLandmark68Net.loadFromUri('../models'),

  //this one is for recongnize my face or the user face
  faceapi.nets.faceRecognitionNet.loadFromUri('../models'),

  //to show the expression that the user has
  faceapi.nets.faceExpressionNet.loadFromUri('../models')
]).then(startVideo)


//hook the webcam to get the video
function startVideo(){
  navigator.getUserMedia(
    {video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


//adding the event listner to the video
video.addEventListener('play', () =>{
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = {width: video.width, height: video.height}
  faceapi.matchDimensions(canvas,displaySize)
  setInterval(async () => {
    const detection = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detection,displaySize)
    canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas,resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas,resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas,resizedDetections);
  }, 100);
})