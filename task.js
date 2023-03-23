let done = false;
function readCSVFile() {
    let files = document.querySelector('#csvFile').files;
    if (files.length > 0 && done === false) {
        let file = files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function (e) {
            let csvdata = e.target.result;
            let rowData = csvdata.split('\n');
            const groupArray = [];
            for (let row = 1; row < rowData.length; row++) {
                rowColData = rowData[row].split(',');
                groupArray.push(rowColData);
            }
            const output = [];
            for (let i = 0; i < groupArray.length; i++) {
                let [uniqueId1, commonId1, fromDate1, toDate1] = groupArray[i];
                if (toDate1 == 'NULL') {
                    toDate1 = new Date();
                }
                const newToDate1 = formatDate(toDate1);
                for (let j = i + 1; j < groupArray.length; j++) {
                    let [uniqueId2, commonId2, fromDate2, toDate2] = groupArray[j];
                    if (toDate2 == 'NULL') {
                        toDate2 = new Date();
                    }
                    const newToDate2 = formatDate(toDate2);
                    if (commonId1 === commonId2) {
                        const overlapStart = fromDate1 > fromDate2 ? fromDate1 : fromDate2;
                        const overlapEnd = newToDate1 < newToDate2 ? newToDate1 : newToDate2;
                        if (overlapEnd > overlapStart) {
                            const overlapDays = Math.floor((new Date(overlapEnd) - new Date(overlapStart)) / (1000 * 60 * 60 * 24));
                            output.push([uniqueId1, uniqueId2, commonId1, overlapDays]);
                        }
                    }
                }
            }

            const table = document.getElementById('tableCsv');
            const headerRow = document.createElement("tr");
            ["Employee ID #1", "Employee ID #2", "Project ID", "Days worked"].forEach(
                (headingText) => {
                    const th = document.createElement("th");
                    th.textContent = headingText;
                    headerRow.appendChild(th);
                }
            );
            table.appendChild(headerRow);
            output.forEach((rowData) => {
                const [employeeId1, employeeId2, projectId, daysWorked] = rowData;
                const row = document.createElement("tr");
                
                const employeeId1Cell = document.createElement("td");
                employeeId1Cell.textContent = employeeId1;
                row.appendChild(employeeId1Cell);
                
                const employeeId2Cell = document.createElement("td");
                employeeId2Cell.textContent = employeeId2;
                row.appendChild(employeeId2Cell);
                
                const projectIdCell = document.createElement("td");
                projectIdCell.textContent = projectId;
                row.appendChild(projectIdCell);

                const daysWorkedCell = document.createElement("td");
                daysWorkedCell.textContent = daysWorked;
                row.appendChild(daysWorkedCell);


                table.appendChild(row);
            });
            document.body.appendChild(table);
            done = true
            if (done === true) {
                let divBox = document.getElementById("reloadDiv");
                let p = document.createElement('p');
                let p2 = document.createElement('p');
                p.innerHTML = 'If u want to upload new file click the button bellow.'
                p2.innerHTML = 'This list show the employees, who worked together on same projects and how much days they worked together.'
                let reloadButton = document.createElement("button");
                reloadButton.textContent = "Reload";
                reloadButton.addEventListener("click", function () {
                    location.reload();
                });
                divBox.appendChild(p);
                divBox.appendChild(reloadButton);
                divBox.appendChild(p2);
            }
        }
    } else {
        console.log('import file')
    }
}


function formatDate(date) {

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;

    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}



