// F-Zero: Maximum Velocity Password Generator
// Copyright (C) 2024-present WaluigiBSOD (waluigibsod.github.io)
//
// This file is part of F-Zero: Maximum Velocity Password Generator.
//
// F-Zero: Maximum Velocity Password Generator is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// F-Zero: Maximum Velocity Password Generator is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

// Functions

function _ResultTableAddBlankRow() {
	var retELEMENT = "<tr><td></br></td></tr>";
	
	return retELEMENT;
}

function _ResultTableAddColumn(Caption, CaptionID, EntryID) {
	var retELEMENT = "<tr>";
	
	if (CaptionID.length > 0)
		retELEMENT += "<td id=\"" + CaptionID + "\">" + Caption + ":&emsp;</td>";
	else
		retELEMENT += "<td>" + Caption + ":&emsp;</td>";
	
	retELEMENT += "<td id=\"" + EntryID + "\"></td>";
	
	retELEMENT += "</tr>";
	
	return retELEMENT;
}

function _GenerateResultTableSkeleton() {
	var TableBody = "";
	
	TableBody += _ResultTableAddBlankRow();
	
	var CurrentElement;
	
	for (var i=0;i<ResultEntries.length;i++) {
		CurrentElement = ResultEntries[i];
		
		if (CurrentElement.length != 3 || CurrentElement[0] == "") {
			TableBody += "<tr><td colspan=\"2\"><hr></td></tr>";
		} else {
			CurrentElement[0].trim();
			CurrentElement[1].trim().toLowerCase();
			CurrentElement[2].trim().toLowerCase();
			
			if (CurrentElement[2] == "")
				CurrentElement[2] = CurrentElement[0].toLowerCase();
			
			TableBody += _ResultTableAddColumn(CurrentElement[0],CurrentElement[1],CurrentElement[2]);
		}
	}
	
	document.getElementById("result").innerHTML = TableBody;
}

function _ShowResult() {
	document.getElementById("error").innerHTML = "";
	document.getElementById("result").style = "";
}

function _HideResult() {
	document.getElementById("result").style = "display: none;";
}

// To be executed

_GenerateResultTableSkeleton();