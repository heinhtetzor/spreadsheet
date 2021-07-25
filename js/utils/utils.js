const COLS = 26;
const ROWS = 20;

const charArr = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
];

const charMap = {
	1: "A",
	2: "B",
	3: "C",
	4: "D",
	5: "E",
	6: "F",
	7: "G",
	8: "H",
	9: "I",
	10: "J",
	11: "K",
	12: "L",
	13: "M",
	14: "N",
	15: "O",
	16: "P",
	17: "Q",
	18: "R",
	19: "S",
	20: "T",
	21: "U",
	22: "V",
	23: "W",
	24: "X",
	25: "Y",
	26: "Z",
}

const charMapToNum = {
    "A": 1,
    "B": 2,
    "C": 3,
    "D": 4,
    "E": 5,
    "F": 6,
    "G": 7,
    "H": 8,
    "I": 9,
    "J": 10,
    "K": 11,
    "L": 12,
    "M": 13,
    "N": 14,
    "O": 15,
    "P": 16,
    "Q": 17,
    "R": 18,
    "S": 19,
    "T": 20,
    "U": 21,
    "V": 22,
    "W": 23,
    "X": 24,
    "Y": 25,
    "Z": 26
}

const isNumeric = str => {
	return !isNaN(parseFloat(str)) && !isNaN(str - 0);
}

const getXandY = (str) => {
    if (!str.includes('x')) throw new Error("x required");
    return str.split('x');
}

const getCellFromXandY = (x, y) => {
    return `${x}x${y}`;
}

const getSelectedCells = (s, e) => {
    if (!s || !e) return;

	if (s === e) return [s];

    let [sx, sy] = getXandY(s);
    let [ex, ey] = getXandY(e);

    sx = parseInt(sx);
    sy = parseInt(sy);

    let cells = [];

    //if ey is greter than sy
    if (ey >= sy) {
        for (let y = sy; y <= ey; y++) {
            //if ex is larger than sx
            if (ex > sx) {
                for (let x = sx; x <= ex; x++) {
                    cells.push(`${x}x${y}`);
                }
            }
            if (sx >= ex) {
                for (let x = ex; x <= +sx; x++) {
                    cells.push(`${x}x${y}`);
                }

            }
        }
    }
    //if sy is greater than ey
    if (sy >= ey) {
        for (let y = ey; y <= sy; y++) {
            //if ex is larger than sx
            if (ex > sx) {
                for (let x = sx; x <= ex; x++) {
                    cells.push(`${x}x${y}`);
                }
            }
            if (sx >= ex) {
                for (let x = ex; x <= sx; x++) {
                    cells.push(`${x}x${y}`);
                }

            }
        }

    }
    return cells;
}

const getNeighbours = cell => {
    //if cell is 8x3
    //left is 7x3
    //up is 8x2
    //right is 9x3
    //down is 8x4
    let [x, y] = getXandY(cell);

    if (x > COLS || y > ROWS) return;

    left = x == 1 ? null : getCellFromXandY(+x - 1, y);
    up = y == 1 ? null : getCellFromXandY(x, +y - 1);
    right = x == COLS ? null : getCellFromXandY(+x + 1, y);
    down = y == ROWS ? null : getCellFromXandY(x, +y + 1);

    return {
        left,
        up,
        right,
        down
    }
}

const getCellByCode = code => {
    let alphabet = code.slice(0, 1);
    let num = code.slice(1);

    if (charArr.indexOf(alphabet) < 0) {
        throw new Error("Cell X must be alphabet");
    }

    if (isNaN(num)) {
        throw new Error("Cell Y must be number");
    }

    let cell = `${charMapToNum[alphabet]}x${num}`;
    return cell;
}
