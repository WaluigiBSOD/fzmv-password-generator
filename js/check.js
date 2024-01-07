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

function _CheckPlayerName() {
	var PlayerName = document.getElementById("name").value;
	var PlayerNameChanged = false;
	
	PlayerName = PlayerName.toUpperCase();
	
	if (PlayerName.length == 8)
		while (PlayerName.charAt(PlayerName.length - 1) == " ") {
			PlayerName = PlayerName.slice(0,PlayerName.length - 1);
				
			PlayerNameChanged = true;
		}
	
	for (var i=0;i<PlayerName.length;i++)
		if (PlayerNameAlphabet.indexOf(PlayerName.charAt(i)) == -1) {
			PlayerName = PlayerName.replace(PlayerName.charAt(i),"");
			
			PlayerNameChanged = true;
		}
	
	document.getElementById("name").value = PlayerName;
	
	if (!PlayerNameChanged)
		_GeneratePassword(PlayerName);
}