const users = [
  { mssv: "12345", id: "huy",name:"Tran Thanh Huy", date: new Date().toLocaleDateString(), class: "",
    session: "" },
  { mssv: "67890", id: "loi",name:"Vu Tien Loi", date: new Date().toLocaleDateString(), class: "",
    session: "" }
];

let attendances = [];
let alreadyAttendances = [];
let selectedClass = null;
let selectedSession = null;

const video = document.getElementById("video");
const attendanceTable = document.getElementById("attendance_table");
const attendanceBody = document.getElementById("attendance_body");
const selectItem = document.getElementById("select_item");
const buttonSave = document.getElementById("save_btn");
const buttonReset = document.getElementById("reset_btn");
document.getElementById('cameraDiv').style.display = 'none';
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models"),
]).then();

function setSession(session, buttonId) {
  selectedClass = selectItem.value;
  selectedSession = session;
  // Lấy tất cả các nút trong div select_time
  const buttons = document.querySelectorAll('.select_time .btn');
  // Loại bỏ lớp active từ tất cả các nút
  buttons.forEach(button => {
      button.classList.remove('active');
  });
  // Thêm lớp active cho nút được chọn
  document.getElementById(buttonId).classList.add('active');
}

function startWebcam() {
  document.getElementById('cameraDiv').style.display = 'initial';
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
function stopWebcam() {
  const stream = video.srcObject;
  const tracks = stream.getTracks();

  tracks.forEach(function (track) {
    track.stop();
  });

  video.srcObject = null;
  const canvas = document.getElementById("myCanvas");
  // Remove the canvas by ID
  canvas.remove();
  console.log(attendances);
  const jsonDataToSaveSesionStorage = JSON.stringify(attendances);
  // Lưu chuỗi JSON vào sessionStorage
  sessionStorage.setItem('attendances', jsonDataToSaveSesionStorage);
  document.getElementById('cameraDiv').style.display = 'none';
}

function getLabeledFaceDescriptions() {
  const labels = ["huy", "loi"];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= label.length; i++) {
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

video.addEventListener("play", async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.id = 'myCanvas'; // Assign the ID 'myCanvas'
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
        label: result.toString(),
      });

      const foundUser = users.find(user => user.id === result.label);
      if (foundUser) {
        if (!alreadyAttendances.includes(foundUser.id)) {
          attendances.push({
            ...foundUser,
            mssv: foundUser.mssv,
            name: foundUser.name,
            date: new Date().toLocaleDateString(),
            class: selectedClass,
            session: selectedSession,
          });
          alreadyAttendances.push(foundUser.id);
          addAttendanceToTable(foundUser);
        }
      }
      drawBox.draw(canvas);
    });
  }, 100);
});

function addAttendanceToTable(user) {
  const tr = document.createElement("tr");
  const td1 = document.createElement("td");
  const td2 = document.createElement("td");
  const td3 = document.createElement("td");
  const td4 = document.createElement("td");
  const td5 = document.createElement("td");

  td1.textContent = user.mssv;
  td2.textContent = user.name;
  td3.textContent = new Date().toLocaleDateString();
  td4.textContent = selectedClass;
  td5.textContent = selectedSession;

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tr.appendChild(td5);
  attendanceBody.appendChild(tr);
  tr.style.textAlign = "center";
}


buttonSave.addEventListener("click", () => {
  attendances.forEach(element => {
      //if element.name is already raw in table don't push it to table
    if (!alreadyAttendances.includes(element.id)){
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      const td4 = document.createElement("td");
      const td5 = document.createElement("td");
      td1.textContent = element.mssv;
      td2.textContent = element.name;
      td3.textContent = new Date().toLocaleDateString();
      td4.textContent = selectedClass;
      td5.textContent = selectedSession;
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tbody.appendChild(tr);


      tr.style.textAlign = "center";

      alreadyAttendances.push(element.mssv);
      alreadyAttendances.push(element.name);
      alreadyAttendances.push(element.date);
      alreadyAttendances.push(element.class);
      alreadyAttendances.push(element.session);

    }
    else{
      alert(`${element.name} has already been saved`);
    }




      // Gửi dữ liệu xuống server

      const data = {
        users:attendances,
        workSheetName: `Attendance_ ${new Date().toLocaleDateString().split('/').join('-')}`,
        
        filePath: `../../Attendance_${new Date().toLocaleDateString().split('/').join('-')}.xlsx`,
        workSheetColumnName: [
          "MSSV",
          "Name",
          "Date",
          "Class",
          "Session"
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

buttonReset.addEventListener("click", () => {
  // Xóa tất cả các hàng trong bảng điểm danh
  while (attendanceBody.firstChild) {
    attendanceBody.removeChild(attendanceBody.firstChild);
  }
  // Đặt lại các mảng điểm danh
  attendances = [];
  alreadyAttendances = [];
});