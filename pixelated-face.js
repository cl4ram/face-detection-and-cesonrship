const video = document.querySelector('.webcam');

const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');

const faceDetector = new window.FaceDetector();

const optionsInputs = document.querySelectorAll('.controls input[type="range"]');
const options = {
    SIZE: 10,
    SCALE: 1.3  
}

const buttonStart = document.querySelector('.photo-button')
const strip = document.querySelector('.strip');

// const buttonStart = document.querySelector('#buttonStart')
// const buttonStop = document.querySelector('#buttonStop')
// const videoRecorded = document.querySelector('#videoRecorded')

function handleOption(event) {
    console.log(event.currentTarget.value)
    const {value, name} = event.currentTarget
    options[name] = parseFloat(value);
}

optionsInputs.forEach(input => input.addEventListener('input', handleOption))

async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video : true,
    });
    video.srcObject = stream;

    await video.play();
    canvas.width = video.videoWidth
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.height = video.videoHeight;  

    // if (!MediaRecorder.isTypeSupported('video/webm')) { // <2>
    //     console.warn('video/webm is not supported')
    //   }
    
    // const mediaRecorder = new MediaRecorder(stream, { // <3>
    //     mimeType: 'video/webm',
    // })

    // buttonStart.addEventListener('click', () => {
    //   mediaRecorder.start() // <4>
    //   buttonStart.setAttribute('disabled', '')
    //   buttonStop.removeAttribute('disabled')
    // })
  
    // buttonStop.addEventListener('click', () => {
    //   mediaRecorder.stop() // <5>
    //   buttonStart.removeAttribute('disabled')
    //   buttonStop.setAttribute('disabled', '')
    // })
  
    // mediaRecorder.addEventListener('dataavailable', event => {
    //   videoRecorded.src = URL.createObjectURL(event.data) // <6>
    //   videoRecorded.style.display = 'inline'
    // })

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
    const width = faceDetails.width * options.SCALE;
    const height = faceDetails.height * options.SCALE;
    ctx.drawImage(
        video, 
        0, 
        0, 
        canvas.width,
        canvas.height
    );
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
    );


}

function takePhoto(){
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'picture');
    link.innerHTML = `<img src="${data}" alt="Nice pic!" class="photo"/>`;
    strip.insertBefore(link, strip.firstChild);

}

buttonStart.addEventListener('click', takePhoto)


populateVideo().then(detect);
  
