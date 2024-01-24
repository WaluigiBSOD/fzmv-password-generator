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

function _ComputeJetVermilionPasswordScoreDijkstraPrimitive(Password) {
	// Under four assumptions:
	//
	// 1) Path length among different letters is expressed in button presses
	// 2) Holding a button causes a time delay in the same way as multiple one-button presses
	// 3) Each letter entry adds a single A button press + a last one for O.K.
	// 4) Movement is like A -> ... Base32 chaos ... -> O.K.
	//
	// Observation: any password (in canonical form) always ands with 0 or J because 6*8*12 is congruent to 1 modulo 5, so the very last character only encodes one bit.
	
	var retSCORE = 0;
	
	var PrecedentCharacter = _FindOffsetInKeyboard1D("A");
	var CurrentCharacter;
	
	for (var i=0;i<Password.length;i++) {
		CurrentCharacter = _FindOffsetInKeyboard1D(Password.charAt(i));
		
		retSCORE += KeyboardLengthsLookupTable[PrecedentCharacter][CurrentCharacter];
		
		PrecedentCharacter = CurrentCharacter;
	}
	
	retSCORE += KeyboardLengthsLookupTable[PrecedentCharacter][_FindOffsetInKeyboard1D("O.K.")];
	
	// Adding the effect of A button presses.
	
	retSCORE += Password.length + 1;
	
	return retSCORE;
}

function _ComputeJetVermilionPasswordScoreDijkstra(Password) {
	// It can be proved that the score function is strictly monotonically decreasing when removing zeros (and characters in general).
	//
	// The file containing the proof has been excluded from the GitHub release.
	
	var retPASSWORD = Array(2);
	
	while (Password.charAt(Password.length - 1) == "0")
		Password = Password.slice(0,Password.length - 1);
		
	retPASSWORD[0] = Password;
	retPASSWORD[1] = _ComputeJetVermilionPasswordScoreDijkstraPrimitive(Password);
	
	return retPASSWORD;
}

function _ComputeBestJetVermilionPassword(PlayerName) {
	var retPASSWORD = Array(3);
	
	var CurrentPassword;
	var CurrentScore;
	
	// Return Format
	//
	// 0: Password
	// 1: Password Score (number of D-Pad/A button presses)
	// 2: Seed
	//
	// By the way what an user sees it's just the first thing, the rest was used during development
	// for automated testing, has been left untouched since who knows if will be needed in the future
	// alongside source files containing test data (but these are not included in the GitHub release).
	
	retPASSWORD[1] = Number.MAX_VALUE;
		
	for (var i=0x00;i<=0xFF;i++) {
		CurrentPassword = _GenerateJetVermilionPassword(PlayerName,i);
		CurrentScore = _ComputeJetVermilionPasswordScoreDijkstra(CurrentPassword);
		
		if (CurrentScore[1] < retPASSWORD[1]) {
			retPASSWORD[0] = CurrentScore[0];
			retPASSWORD[1] = CurrentScore[1];
			retPASSWORD[2] = i;
		}
	}
	
	return retPASSWORD;
}

function _SpaceSequence(Length) {
	var retSPACES = "";
	
	for (var i=0;i<Length;i++)
		retSPACES += " ";
	
	return retSPACES;
}

function _GeneratePassword(PlayerName) {
	ValidPlayerName = false;
	
	if (PlayerName.length > 0 && PlayerName != _SpaceSequence(PlayerName.length)) {
		var FinalResult = _ComputeBestJetVermilionPassword(PlayerName);
		
		while (FinalResult[0].length < 12)
			FinalResult[0] += " ";
		
		document.getElementById("password").innerHTML = FinalResult[0];
		
		_ShowResult();
		
		ValidPlayerName = true;
	} else
		_WriteError("Enter player name",true);
}