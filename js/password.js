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

function _SwapBit(Buffer, IndexX, IndexY) {
	// It's "res_xchg_bit" in the leaked source code of the game.
	
	var ElementX = Math.floor(IndexX / 8);
	var BitX = 7 - (IndexX % 8);
	
	var ElementY = Math.floor(IndexY / 8);
	var BitY = 7 - (IndexY % 8);
	
	// A bit swap is performed only if the bits to swap are different.
	
	if (ElementX < Buffer.length && ElementY < Buffer.length && ((((Buffer[ElementX] & (1 << BitX)) >> BitX) + ((Buffer[ElementY] & (1 << BitY)) >> BitY)) & 0x1)) {
		Buffer[ElementX] ^= 1 << BitX;
		Buffer[ElementY] ^= 1 << BitY;
	}
}

function _GetBit(Buffer, Index) {
	// It's "res_get_bit" in the leaked source code of the game.
	
	var Element = Math.floor(Index / 8);
	var Bit = 7 - (Index % 8);
	
	if (Element < Buffer.length && (Buffer[Element] & (1 << Bit)))
		return 1;
	else
		return 0;
}

function _SelfInvertibleScrambleBitsForJetVermilion(Buffer) {
	// It's "res_xchg_pattern04" in the leaked source code of the game.
	
	var j = Math.floor((Buffer.length * 8) / 6);
	var k = j;
	
	for (var i=0;i<j;i++) {
		_SwapBit(Buffer,i,k);
		
		k += 5;
	}
}

function _CompressPlayerName(Name) {
	// It's "res_name_pack" in the leaked source code of the game.
	
	var retNAME = Array(7);
	
	var PreparedPlayerName = Array(8);
	
	// Printable character compression.
	
	for (var i=0;i<8;i++)
		if (i < Name.length)
			PreparedPlayerName[i] = (Name.charCodeAt(i) & 0x3F) - 32;
		else
			PreparedPlayerName[i] = 0;
	
	// Actual name compression
	//
	// Slot #7 (index at 6) is reserved for randomization seed.
	
	retNAME[0] = ((PreparedPlayerName[0] & 0x3F) << 2) | (PreparedPlayerName[1] >> 4) & 0x03;
	retNAME[1] = ((PreparedPlayerName[1] & 0x0F) << 4) | (PreparedPlayerName[2] >> 2) & 0x0F;
	retNAME[2] = ((PreparedPlayerName[2] & 0x03) << 6) | (PreparedPlayerName[3]     ) & 0x3F;
	retNAME[3] = ((PreparedPlayerName[4] & 0x3F) << 2) | (PreparedPlayerName[5] >> 4) & 0x03;
	retNAME[4] = ((PreparedPlayerName[5] & 0x0F) << 4) | (PreparedPlayerName[6] >> 2) & 0x0F;
	retNAME[5] = ((PreparedPlayerName[6] & 0x03) << 6) | (PreparedPlayerName[7]     ) & 0x3F;
	
	return retNAME;
}

function _BufferToBase32(Buffer) {
	// It's "res_dat2ascii" in the leaked source code of the game.
	
	var retPASSWORD = "";
	
	var CurrentPasswordCharacter;
	
	var i;
	var j;
	
	for (i=0;i<=Math.floor(Buffer.length * Math.log(256) / Math.log(32));i++) {
		CurrentPasswordCharacter = 0;
		
		for (j=0;j<5;j++) {
			CurrentPasswordCharacter <<= 1;
			
			CurrentPasswordCharacter += _GetBit(Buffer,(i * 5) + j);
		}
		
		retPASSWORD += PasswordBase32Alphabet.charAt(CurrentPasswordCharacter);
	}
	
	return retPASSWORD;
}

function _GenerateJetVermilionPassword(PlayerName, Seed) {
	// It's "ras_make_vpass" in the leaked source code of the game.
	
	var PasswordBuffer = _CompressPlayerName(PlayerName);
	
	// Add-XOR scramble algorithm
	// 
	// Random seed is "expanded" by adding different constants.
	
	PasswordBuffer[0] ^= Seed & 0xFF;
	PasswordBuffer[1] ^= (Seed + 0x49) & 0xFF;
	PasswordBuffer[2] ^= (Seed + 0x89) & 0xFF;
	PasswordBuffer[3] ^= (Seed + 0x59) & 0xFF;
	PasswordBuffer[4] ^= (Seed + 0x63) & 0xFF;
	PasswordBuffer[5] ^= (Seed + 0x99) & 0xFF;
	PasswordBuffer[6] = Seed & 0xFF;
	
	// Then the buffer is scrambled by using a cheap bit-swapping function.
	//
	// It's so cheap it's even the inverse of itself.
	
	_SelfInvertibleScrambleBitsForJetVermilion(PasswordBuffer);
	
	// And finally, the buffer is output as a Base 32 number using a custom alphabet.
	
	return _BufferToBase32(PasswordBuffer);
}