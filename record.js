const video = document.querySelector('.webcam');

const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');

const faceDetector = new window.FaceDetector();

const optionsInputs = document.querySelectorAll('.controls input[type="range"]');
const options = {
    SIZE: 10,
    SCALE: 1.3  
}

const buttonStart = document.querySelector('.button-start')
const buttonStop = document.querySelector('.button-stop')
const videoRecorded = document.querySelector('.video-recorded')

function handleOption(event) {
    console.log(event.currentTarget.value)
    const {value, name} = event.currentTarget
    options[name] = parseFloat(value);
}

optionsInputs.forEach(input => input.addEventListener('input', handleOption))

async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video : true,
        // audio: true,
    });
    video.srcObject = stream;
    console.log(stream)

    await video.play();
    canvas.width = video.videoWidth
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.height = video.videoHeight;
    

}

async function detect() {
    const faces = await faceDetector.detect(video)
    requestAnimationFrame(detect)
    faces.forEach(censor);
    
}

function censor(face) {
    const faceDetails = face.boundingBox;
    ctx.clearRect(0 , 0, canvas.width, canvas.height)
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        video,
        faceDetails.x,
        faceDetails.y,
        faceDetails.width,
        faceDetails.height,

        faceDetails.x,
        faceDetails.y,
        options.SIZE,
        options.SIZE
    );

    const width = faceDetails.width * options.SCALE;
    const height = faceDetails.height * options.SCALE;
    ctx.drawImage(
        canvas,
        faceDetails.x,
        faceDetails.y,
        options.SIZE,
        options.SIZE,

        faceDetails.x,
        faceDetails.y,
        width,
        height,
    )
}

async function main() {  
    const stream = await navigator.mediaDevices.getUserMedia({ // <1>
      video: true,
    //   audio: true,
    })
  
    canvas.srcObject = stream
    console.log(canvas.srcObject)
  
    const mediaRecorder = new MediaRecorder(stream, { // <3>
      mimeType: 'video/webm',
    })
  
    buttonStart.addEventListener('click', () => {
      mediaRecorder.start() // <4>
      buttonStart.setAttribute('disabled', '')
      buttonStop.removeAttribute('disabled')
    })
  
    buttonStop.addEventListener('click', () => {
      mediaRecorder.stop() // <5>
      buttonStart.removeAttribute('disabled')
      buttonStop.setAttribute('disabled', '')
    })
  
    mediaRecorder.addEventListener('dataavailable', event => {
      videoRecorded.src = URL.createObjectURL(event.data) // <6>
      videoRecorded.style.display = 'inline'
    })
  }

populateVideo().then(detect);
  
main();