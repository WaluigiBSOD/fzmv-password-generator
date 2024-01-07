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

// Constants

const KeyboardLayout1D = [
	"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
	"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
	"0","1","2","3","4","5","6","7","8","9","!","\"","#","$","%","&","'","(",")","*","+",",","-",".","/",":",
	";","<","=",">","?","@","[","¥","]","^","_","`","{","|","}","~","SP","O.K.","CANCEL"
];

const KeyboardLayout2D = [
	[
		"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
	],
	[
		"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"
	],
	[
		"0","1","2","3","4","5","6","7","8","9","!","\"","#","$","%","&","'","(",")","*","+",",","-",".","/",":"
	],
	[
		";","<","=",">","?","@","[","¥","]","^","_","`","{","|","}","~","SP","","","","","","","","",""		
	]
];

// Functions

function _ExistsInKeyboard1D(CharacterToFind) {
	for (var i=0;i<KeyboardLayout1D.length;i++)
		if (KeyboardLayout1D[i] == CharacterToFind)
			return true;
	
	return false;
}

function _ExistsInKeyboard2D(CharacterToFind) {
	var i;
	var j;
	
	for (i=0;i<KeyboardLayout2D.length;i++)
		for (j=0;j<KeyboardLayout2D[0].length;j++)
			if (KeyboardLayout2D[i][j] == CharacterToFind)
				return true;
	
	return false;
}

function _FindOffsetInKeyboard1D(CharacterToFind) {
	var retOFFSET = -1;
	
	for (var i=0;i<KeyboardLayout1D.length;i++)
		if (KeyboardLayout1D[i] == CharacterToFind) {
			retOFFSET = i;
			
			break;
		}
	
	return retOFFSET;
}

function _FindOffsetInKeyboard2D(CharacterToFind) {
	var retOFFSET = Array(2);
	
	retOFFSET[0] = -1;
	retOFFSET[1] = -1;
	
	var i;
	var j;
	
	for (i=0;i<KeyboardLayout2D.length && retOFFSET[0] == -1 && retOFFSET[1] == -1;i++)
		for (j=0;j<KeyboardLayout2D[0].length;j++)
			if (KeyboardLayout2D[i][j] == CharacterToFind) {
				retOFFSET[0] = i;
				retOFFSET[1] = j;
				
				break;
			}
	
	return retOFFSET;
}

function _ComputeKeyboardAdjacencyMatrix() {
	var retMATRIX = [...Array(KeyboardLayout1D.length)].map(e => Array(KeyboardLayout1D.length));
	
	var CurrentCoordinates2D;
	
	var CurrentCoordinatesLocal2D = Array(2);
	
	var i;
	var j;
	
	for (i=0;i<KeyboardLayout1D.length;i++) {
		// Handling of everything except O.K. and CANCEL, will be handled inside "_CacheMinimumLengthsDijkstra" from "dijkstra.js" instead.
		//
		// Rule colors refer to a little sketch I made as a guide to write all of this that is not included in the GitHub release.
		
		if (_ExistsInKeyboard2D(KeyboardLayout1D[i])) {
			CurrentCoordinates2D = _FindOffsetInKeyboard2D(KeyboardLayout1D[i]);
			
			// Up
			
			if (CurrentCoordinates2D[0] == 0) {
				if (CurrentCoordinates2D[1] < 16) {
					// Rule RED
					//
					// The O.K./CANCEL block is seen just as a funnel that lengthens vertical wraparounds by 1.
					
					CurrentCoordinatesLocal2D[0] = (CurrentCoordinates2D[0] + 3) % KeyboardLayout2D.length;
					CurrentCoordinatesLocal2D[1] = CurrentCoordinates2D[1];
					
					if (KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]] != "")
						retMATRIX[i][_FindOffsetInKeyboard1D(KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]])] = 2;
				} else {
					// Rule BLUE
					//
					// The O.K./CANCEL block is seen just as a funnel that lengthens vertical wraparounds by 1.
					
					retMATRIX[i][_FindOffsetInKeyboard1D("SP")] = 2;
				}
			} else {
				// Rule GREEN + all the rest.
				
				CurrentCoordinatesLocal2D[0] = (CurrentCoordinates2D[0] + 3) % KeyboardLayout2D.length;
				CurrentCoordinatesLocal2D[1] = CurrentCoordinates2D[1];
					
				if (KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]] != "")
					retMATRIX[i][_FindOffsetInKeyboard1D(KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]])] = 1;
			}
			
			// Down
			
			if (CurrentCoordinates2D[0] == 2 && CurrentCoordinates2D[1] > 16) {
				// Rule YELLOW
				
				retMATRIX[i][_FindOffsetInKeyboard1D("SP")] = 1;
			} else if (CurrentCoordinates2D[0] == 3) {
				// Rule LIGHT BLUE
				//
				// The O.K./CANCEL block is seen just as a funnel that lengthens vertical wraparounds by 1.
				
				CurrentCoordinatesLocal2D[0] = (CurrentCoordinates2D[0] + 1) % KeyboardLayout2D.length;
				CurrentCoordinatesLocal2D[1] = CurrentCoordinates2D[1];
					
				if (KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]] != "")
					retMATRIX[i][_FindOffsetInKeyboard1D(KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]])] = 2;
			} else {
				// All the rest.
				
				CurrentCoordinatesLocal2D[0] = (CurrentCoordinates2D[0] + 1) % KeyboardLayout2D.length;
				CurrentCoordinatesLocal2D[1] = CurrentCoordinates2D[1];
					
				if (KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]] != "")
					retMATRIX[i][_FindOffsetInKeyboard1D(KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]])] = 1;
			}
			
			// Left
			
			CurrentCoordinatesLocal2D[0] = CurrentCoordinates2D[0];
			CurrentCoordinatesLocal2D[1] = (CurrentCoordinates2D[1] + 25) % KeyboardLayout2D[0].length;
			
			while (KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]] == "")
				CurrentCoordinatesLocal2D[1] = (CurrentCoordinatesLocal2D[1] + 25) % KeyboardLayout2D[0].length;
			
			retMATRIX[i][_FindOffsetInKeyboard1D(KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]])] = 1;
			
			// Right
			
			CurrentCoordinatesLocal2D[0] = CurrentCoordinates2D[0];
			CurrentCoordinatesLocal2D[1] = (CurrentCoordinates2D[1] + 1) % KeyboardLayout2D[0].length;
			
			while (KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]] == "")
				CurrentCoordinatesLocal2D[1] = (CurrentCoordinatesLocal2D[1] + 1) % KeyboardLayout2D[0].length;
			
			retMATRIX[i][_FindOffsetInKeyboard1D(KeyboardLayout2D[CurrentCoordinatesLocal2D[0]][CurrentCoordinatesLocal2D[1]])] = 1;
		}
	}
	
	return retMATRIX;
}

// To be executed

const KeyboardAdjacencyMatrix = _ComputeKeyboardAdjacencyMatrix();