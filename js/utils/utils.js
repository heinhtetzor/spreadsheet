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

const isNumeric = str => {
	return !isNaN(parseFloat(str)) && !isNaN(str - 0);
}

const getXandY = (str) => {
    if (!str.includes('x')) throw new Error("x required");
    return str.split('x');
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

//  const startPoint = "8x3";
 // const endPoint = "19x9";
//
 // const result = getSelectedCells(startPoint, endPoint);
  //console.log(result);
