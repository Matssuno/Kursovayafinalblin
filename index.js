let studentsData = {};
function loadStudentsData() {
    let fileInput = document.getElementById('fileInput');
    let reader = new FileReader();
    reader.onload = function() {
        let lines = reader.result.split('\n');
        studentsData = {};
        for (let i = 1; i < lines.length; i++) {
            let student = lines[i].trim().split(';');
            if (student.length > 1) {
                studentsData[student[0]] = {
                    informatics: parseInt(student[1]),
                    physics: parseInt(student[2]),
                    mathematics: parseInt(student[3]),
                    literature: parseInt(student[4]),
                    music: parseInt(student[5])
                };
            }
        }
        displayEditTable();
        calculateStatistics();
        drawCharts();
    };
    reader.readAsText(fileInput.files[0]);
}
function displayEditTable() {
    let table = document.getElementById('editTable');
    table.innerHTML = '';
    let header = '<tr><th>Name</th><th>Informatics</th><th>Physics</th><th>Mathematics</th><th>Literature</th><th>Music</th><th>Actions</th></tr>';
    table.innerHTML += header;
    for (let student in studentsData) {
        let row = '<tr>';
        row += '<td contenteditable="true">' + student + '</td>';
        row += '<td contenteditable="true">' + studentsData[student].informatics + '</td>';
        row += '<td contenteditable="true">' + studentsData[student].physics + '</td>';
        row += '<td contenteditable="true">' + studentsData[student].mathematics + '</td>';
        row += '<td contenteditable="true">' + studentsData[student].literature + '</td>';
        row += '<td contenteditable="true">' + studentsData[student].music + '</td>';
        row += '<td><button onclick="deleteStudent(\'' + student + '\')">Удалить</button></td>';
        row += '</tr>';
        table.innerHTML += row;
    }
    let newRow = '<tr>';
    newRow += '<td contenteditable="true"></td>';
    newRow += '<td contenteditable="true"></td>';
    newRow += '<td contenteditable="true"></td>';
    newRow += '<td contenteditable="true"></td>';
    newRow += '<td contenteditable="true"></td>';
    newRow += '<td contenteditable="true"></td>';
    newRow += '<td><button onclick="addNewStudent()">Добавить</button></td>';
    newRow += '</tr>';
    table.innerHTML += newRow;
    document.getElementById('edit').style.display = 'block';
}
function deleteStudent(name) {
    delete studentsData[name];
    displayEditTable();
}
function addNewStudent() {
    let newRow = document.getElementById('editTable').insertRow(-1);
    newRow.innerHTML = '<td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td><button onclick="deleteRow(this)">Удалить</button></td>';
}
function deleteRow(button) {
    let row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}
function saveData(format) {
    let dataToSave = 'name;informatics;physics;mathematics;literature;music\n';
    let tableRows = document.getElementById('editTable').rows;
    for (let i = 1; i < tableRows.length; i++) { // Начинаем с 1, чтобы пропустить заголовок
        let cells = tableRows[i].cells;
        let name = cells[0].textContent.trim();
        let informatics = parseInt(cells[1].textContent.trim());
        let physics = parseInt(cells[2].textContent.trim());
        let mathematics = parseInt(cells[3].textContent.trim());
        let literature = parseInt(cells[4].textContent.trim());
        let music = parseInt(cells[5].textContent.trim());
        if (name !== '') {
            dataToSave += name + ';' + informatics + ';' + physics + ';' + mathematics + ';' + literature + ';' + music + '\n';
        }
    }
    let blob = new Blob([dataToSave], { type: 'text/plain' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'students_data.' + format;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
function calculateStatistics() {
    let statistics = {};
    for (let student in studentsData) {
        for (let subject in studentsData[student]) {
            if (subject !== 'name') {
                if (!statistics[subject]) {
                    statistics[subject] = {
                        average: 0,
                        count: 0,
                        grades: {}
                    };
                }
                let grade = studentsData[student][subject];
                statistics[subject].average += grade;
                statistics[subject].count++;
                if (!statistics[subject].grades[grade]) {
                    statistics[subject].grades[grade] = 0;
                }
                statistics[subject].grades[grade]++;
            }
        }
    }
    let table = document.getElementById('statisticsTable');
    table.innerHTML = '';
    let header = '<tr><th>Subject</th><th>Average</th><th>Grades</th></tr>';
    table.innerHTML += header;
    for (let subject in statistics) {
        let row = '<tr>';
        row += '<td>' + subject + '</td>';
        row += '<td>' + (statistics[subject].average / statistics[subject].count).toFixed(2) + '</td>';
        row += '<td>';
        for (let grade in statistics[subject].grades) {
            row += grade + ': ' + ((statistics[subject].grades[grade] / statistics[subject].count) * 100).toFixed(2) + '%, ';
        }
        row = row.slice(0, -2);
        row += '</td>';
        row += '</tr>';
        table.innerHTML += row;
    }
}
function drawCharts() {
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Subject');
    data.addColumn('number', 'Average');
    let tableRows = document.getElementById('statisticsTable').rows;
    for (let i = 1; i < tableRows.length; i++) { 
        let subject = tableRows[i].cells[0].textContent;
        let average = parseFloat(tableRows[i].cells[1].textContent);
        data.addRow([subject, average]);
    }
    let options = {
        width: 700,
        height: 500,
        title: 'Академическая успеваемость',
        hAxis: { title: 'Предметы' },
        vAxis: { title: 'Средняя оценка' },
        chartArea: {
            left: "5%",
            top: "20%",
            width: "100%"
        }
    };
    let chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}
function view(el) {
    let elements = document.querySelectorAll('.content > div');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
    document.getElementById(el).style.display = 'block';
}
