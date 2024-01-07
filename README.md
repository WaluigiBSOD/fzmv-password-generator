# F-Zero: Maximum Velocity Password Generator

A JavaScript-based F-Zero: Maximum Velocity Jet Vermilion password generator that computes and outputs the fastest one to enter in-game, with the help of graph theory and Dijkstra's algorithm.

## How to use

Note: these steps won't work for save files where Jet Vermilion has already been unlocked.

1. Write down the name of the save file where you want to unlock Jet Vermilion on before accessing it (it's case insensitive but leading spaces or ones among letters/symbols matter).
2. Select Start and then Grand Prix mode.
3. While on the machine selection screen, press in sequence **L, R, Start, R, L, Select**. A screen named Password with no music in the background should appear.
5. Open [https://waluigibsod.github.io/fzmv-password-generator/](https://waluigibsod.github.io/fzmv-password-generator/).
6. Enter the player name on the website.
7. Enter the generated password in-game (remember that the keyboard cursor wraps around both horizontally and vertically), then press O.K. at the end. A jingle should confirm a correct entry before being sent back to the machine selection screen.

## Program

It's basically a fork of [Version 1.1.1](https://github.com/WaluigiBSOD/mkdd-password-decoder/releases/tag/1.1.1) of [Mario Kart: Double Dash!! Password Decoder](https://github.com/WaluigiBSOD/mkdd-password-decoder), another tool I wrote. Obviously the underlying algorithm is not the same.

Both this program and [F-Zero: Maximum Velocity Password Decoder](https://github.com/WaluigiBSOD/fzmv-password-decoder) were written using the original source code of the game that leaked in July 2020 as reference.

The original implementations of the password generation and decoding algorithms inside the source code of the game can be found at `netcard.7z\iqgba.tar\iQue-GBA\cvsroot\FZERO_for_GBA\rasheen\src\main\ras_codec.c`.

## License

The source code is released under the GNU General Public License v 3.0 (see [LICENSE](https://github.com/WaluigiBSOD/fzmv-password-generator/blob/master/LICENSE) in the root of the repository for a copy of the license and for more information).

### Disclaimer

This program may contain copyrighted material, the use of which may not have been specifically authorized by the copyright owner.
This material is available in an effort to research on the password system of the videogame "F-Zero: Maximum Velocity", to provide a better tool to generate Jet Vermilion passwords for use the game.

This should constitute a ‘fair use’ of any such copyrighted material (referenced and provided for in section 107 of the US Copyright Law).

If you wish to use any copyrighted material from this program for purposes of your own that go beyond ‘fair use’, you must obtain expressed permission from the copyright owner.