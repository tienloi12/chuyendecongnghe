
//import write to excel file


const users = [
  {
    name: "huy",
    date : new Date().toLocaleDateString()

  },

  {
    name:"lợi",
    date : new Date().toLocaleDateString()
  }
]

const attendances = [];
const alreadyAttendances = [];
if (attendances.lenght > 0){
  attendances.forEach(element => {
    console.log('ve')
    const tr = document.createElement("tr");
          const td1 = document.createElement("td");
          const td2 = document.createElement("td");
          const td3 = document.createElement("td");
          td1.textContent = element.name;
          td2.textContent = new Date().toLocaleTimeString();
          td3.textContent = new Date().toLocaleDateString();
          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tbody.appendChild(tr);
          tr.style.textAlign = "center";
   });

}


const video = document.getElementById("video");

Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.ageGenderNet.loadFromUri("/models"),
]).then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

//how to extract to excel file when catch face in video in the label




function getLabeledFaceDescriptions() {
  const labels = ["huy","loi"];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./labels/${label}/${i}.jpg`);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
         
        descriptions.push(detections.descriptor);
      
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
    
  );
}


//draw a table to write name and time  when catch face in video 1 perser 1 row 
const table = document.createElement("table");
const thead = document.createElement("thead");
const tbody = document.createElement("tbody");
const tr = document.createElement("tr");
const th1 = document.createElement("th");
const th2 = document.createElement("th");
const th3 = document.createElement("th");
th1.textContent = "Name";
th2.textContent = "Time";
th3.textContent = "Status";
tr.appendChild(th1);
tr.appendChild(th2);
tr.appendChild(th3);
thead.appendChild(tr);
table.appendChild(thead);
table.appendChild(tbody);
document.body.appendChild(table);
table.style.border = "1px solid black";
table.style.position = "absolute";
table.style.top = "30%";
table.style.left = "69%";
table.style.width = "20%";
table.style.padding = "10px";

//dom button save
const buttonSave = document.getElementById("btn")

//click event
buttonSave.addEventListener("click", () => {
  attendances.forEach(element => {
      //if element.name is already raw in table don't push it to table
    if (!alreadyAttendances.includes(element.name)){
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      td1.textContent = element.name;
      td2.textContent = new Date().toLocaleTimeString();
      td3.textContent = new Date().toLocaleDateString();
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tbody.appendChild(tr);
      tr.style.textAlign = "center";
      alreadyAttendances.push(element.name);
    }
    else{
      alert(`${element.name} has already been saved`);
    }




      // Gửi dữ liệu xuống server
      const data = {
        users:attendances,
        workSheetName: `Attendance_${new Date().toLocaleDateString().split('/').join('-')}`,
        
        filePath: `../../Attendance_${new Date().toLocaleDateString().split('/').join('-')}.xlsx`,
        workSheetColumnName: [
         
          "Name",
          "Date"
        ]
        
      }
      const jsonData = JSON.stringify(data);
      fetch('http://localhost:3000/excel/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    })
      .then(response => response.text()) // Change to .text() to handle boolean response
      .then(data => {
        if (data === 'true') {
          alert('Excel file created successfully.');
        } else {
          alert('Failed to create Excel file.');
        }
      })
      .catch(error => {
        console.error(error);
      });
      console.log(attendances);
    })
});




video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
  

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);


    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    
    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });
  
    
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result,
      });
      const foundUser = users.find(user => user.name === result.label);
      if (foundUser) {
        if(!attendances.includes(foundUser)){
          attendances.push(foundUser);
          
        }
        
      }

      // check if id in array resultface don't push it to array 
      drawBox.draw(canvas);
    });
  }, 100);
});


  


