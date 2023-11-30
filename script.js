const STATUS_ERROR = "status-error";
const STATUS_WARNING = "status-warning";
const STATUS_OK = "status-ok";
const STATUS_PAUSED = "status-paused";
const STATUS_UNUSUAL = "status-unusual";

const API_TOKEN = "I2KW6ROL34VIO7EPLRX7HLQERIUGJAM4M2X7IFGT5Q======";

function setContents(groupID) {
        let url = "https://prtg/api/table.json?id="+groupID+"&content=sensors&columns=objid,group,device,sensor,status,message,lastvalue&apitoken="+API_TOKEN;
        $.getJSON(url, function(data) {
                // console.log(data);
                setData(data.sensors);
        });

}

function setData(json){
    if (Object.keys(json).length <= 0) {
		console.log("Not creating table, json length is " + Object.keys(json).length + "!");
		return;
	}
	console.log("Setting Table...");
	let content = "<table>";
	let total = 0;
	let countOK = 0;
	let countWarning = 0;
	let countPaused = 0;
	let countError = 0;
	let countUnusual = 0;
	let maxItemsPerTable = 14;
	let i = 0;
        json.forEach(object => {
		total++;
		i++;
		if (i>maxItemsPerTable) {
			content += "</table><table>"
			i= 0;
		}
		let statusClass = getAdditionalStatusClass(object.status_raw)
		switch (statusClass) {
		case STATUS_OK:
			countOK++;
			break;
		case STATUS_WARNING:
			countWarning++;
			break;
		case STATUS_PAUSED:
			countPaused++;
			break;
		case STATUS_UNUSUAL:
			countUnusual++;
			break;
		case STATUS_ERROR:
			countError++;
			break;
		default:
			break;
		}
                content += "<tr>";
                content += "<td class='device'>" + getFilteredNameOrStatus(object.device) + "</td>";
                content += "<td class='status'><div class='status-text " + statusClass + "'>" + getFilteredNameOrStatus(object.status) + "</div></td>";
                content += "</tr>";
        });
	content += "</table>";
    $(".data-container").html(content);
	console.log("Done!");

	console.log("Setting Status Overview...");
	let overviewText = "<span class='overview-error'>" + countError + "</span> | ";
	overviewText += "<span class='overview-warning'>" + countWarning + "</span> |  "
	overviewText += "<span class='overview-ok'>" + countOK + "</span> |  ";
	overviewText += "<span class='overview-paused'>" + countPaused + "</span> | ";
	overviewText += "<span class='overview-unusual'>" + countUnusual + "</span> | " + total;
	$(".status-overview").html(overviewText);
	console.log("Done!");

	console.log("Setting Status Message...");
	let statusMessageText = "";
	if (countError == 0) {
		statusMessageText = "Alles läuft! - Geh dir 'nen Kaffee holen!";
	} 
	else if (countError == total) {
		statusMessageText = "Es ist vorbei, geh heim!";
	}
	else if (countError >= 15) {
		statusMessageText = "Hallo?? Jemand da?!?";
	}
	else if (countError >= 10) {
		statusMessageText = "Erfordert Aufmerksamkeit!!!";
	}
	else if (countError >= 5) {
		statusMessageText = "Erfordert Aufmerksamkeit";
	}
	else {
		statusMessageText = "Fast perfekt...";
	}
	$(".status-message").html(statusMessageText);
	console.log("Done!");
}

function getAdditionalStatusClass(status_raw) {
	switch (status_raw) {
                case 3:
                        return STATUS_OK;
                case 4:
						return STATUS_WARNING;
                case 10:
                        return STATUS_UNUSUAL;
                case 5:
						return STATUS_ERROR;
                case 7:
                case 8:
                case 9:
                case 12:
                        return STATUS_PAUSED;
                default:
                        return "";
	}
}

function getFilteredNameOrStatus(text) {
	text = text.replaceAll(/.talentschmiede-rummelsberg.de/g,"");
	text = text.replaceAll(/\[.*\]/g,"");
	text = text.replaceAll(/\(.*\)/g,"");
	return text;
}


function changeSiteAfterDelay(newLocation, delay = 60000) {
	setTimeout(() => {
		location.replace(newLocation);
	}, delay);
}
