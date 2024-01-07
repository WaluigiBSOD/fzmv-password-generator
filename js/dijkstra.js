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

function _IsCharacterAlphabetic(Character) {
	var CharacterCode = Character.codePointAt(0);
	
	return (CharacterCode >= 65 && CharacterCode <= 90) || (CharacterCode >= 97 && CharacterCode <= 122);
}

function _IsCharacterNumeric(Character) {
	var CharacterCode = Character.codePointAt(0);
	
	return (CharacterCode >= 48 && CharacterCode <= 57);
}

// Source: Demetrescu, C., Finocchi, I., & Italiano, G. F. (2008). "Algoritmi e strutture dati". McGraw-Hill Education.
//         https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/
//
//         Demetrescu's book talks deeply on graph theory in general and how it works, plus gives the same exact underlying algorithm from GeeksForGeeks as a pseudocode at page 394.
//         It also focuses on implementing Dijkstra's algorithm with priority queues to reduce the execution time, but in this case an adjacency matrix is more than sufficient.

function _DijkstraMinimumLengthIndex(MinimumLengths, ProcessedVertices) {
	var retINDEX;
	
	var CurrentMinimumLength = Number.MAX_VALUE;
	
	for (var i=0;i<MinimumLengths.length;i++)
		if (!ProcessedVertices[i] && MinimumLengths[i] <= CurrentMinimumLength) {
			CurrentMinimumLength = MinimumLengths[i];
			
			retINDEX = i;
		}
	
	return retINDEX;
}

function _DijkstraFindMinimumLength(GraphAdjacencyMatrix, StartIndex) {
	var retLENGTHS = Array(GraphAdjacencyMatrix.length);
	
	var ProcessedVertices = Array(GraphAdjacencyMatrix.length);
	
	var CurrentMinimumLengthIndex;
	
	var i;
	var j;
	
	// Initialization
	
	for (i=0;i<retLENGTHS.length;i++) {
		if (i == StartIndex)
			retLENGTHS[i] = 0;
		else
			retLENGTHS[i] = Number.MAX_VALUE;
		
		ProcessedVertices[i] = false;
	}
	
	// Processing
	
	for (i=0;i<retLENGTHS.length - 1;i++) {
		CurrentMinimumLengthIndex = _DijkstraMinimumLengthIndex(retLENGTHS,ProcessedVertices);
		
		ProcessedVertices[CurrentMinimumLengthIndex] = true;
		
		for (j=0;j<retLENGTHS.length;j++)
			if (!ProcessedVertices[j] && GraphAdjacencyMatrix[CurrentMinimumLengthIndex][j] > 0 && retLENGTHS[CurrentMinimumLengthIndex] < Number.MAX_VALUE && retLENGTHS[CurrentMinimumLengthIndex] + GraphAdjacencyMatrix[CurrentMinimumLengthIndex][j] < retLENGTHS[j])
				retLENGTHS[j] = retLENGTHS[CurrentMinimumLengthIndex] + GraphAdjacencyMatrix[CurrentMinimumLengthIndex][j];
	}
	
	return retLENGTHS;
}

function _CacheMinimumLengthsDijkstra() {
	var retCACHE = [...Array(KeyboardLayout1D.length)].map(e => Array(KeyboardLayout1D.length));
	
	var CurrentStartingCharacter;
	var CurrentCharacterLengths;
	
	var i;
	var j;
	
	// Handling of everything except O.K. and CANCEL.
	
	for (i=0;i<PasswordBase32Alphabet.length;i++) {
		CurrentStartingCharacter = _FindOffsetInKeyboard1D(PasswordBase32Alphabet.charAt(i));
		
		CurrentCharacterLengths = _DijkstraFindMinimumLength(KeyboardAdjacencyMatrix,CurrentStartingCharacter);
		
		for (j=0;j<CurrentCharacterLengths.length;j++)
			retCACHE[CurrentStartingCharacter][j] = CurrentCharacterLengths[j];
	}
	
	// Handling of O.K. and CANCEL.
	//
	// Actually we only need to handle only the route from everythting in the Base32 alphabet to O.K., in a hardcoded way.
	
	var CurrentCharacter;
	
	for (i=0;i<PasswordBase32Alphabet.length;i++) {
		CurrentCharacter = PasswordBase32Alphabet.charAt(i);
		
		if (_IsCharacterAlphabetic(CurrentCharacter) || CurrentCharacter == "?" || CurrentCharacter == "=")
			retCACHE[_FindOffsetInKeyboard1D(CurrentCharacter)][_FindOffsetInKeyboard1D("O.K.")] = 1;
		else if (_IsCharacterNumeric(CurrentCharacter) || CurrentCharacter == "-" || CurrentCharacter == "+")
			retCACHE[_FindOffsetInKeyboard1D(CurrentCharacter)][_FindOffsetInKeyboard1D("O.K.")] = 2;
	}
	
	return retCACHE;
}

// To be executed

const KeyboardLengthsLookupTable = _CacheMinimumLengthsDijkstra();