let startPoint = null;
let endPoint = null;

//for traversing with arrow keys
let selectedCell = {
	// neighbours
	dom: null,
	left: null,
	up: null,
	right: null,
	down: null,
};

const formulaHolder = {
    firstCell: null,
    secondCell: null,
    symbol: null,
};

let cellDomMap = new Map();
let selectedCellDomMap = new Map();

let rowIndicatorCellMap = new Map();
let colIndicatorCellMap = new Map();


let sumEle;
let avgEle;

const isAlreadySelected = (cell) => {
	return selectedCellDomMap.has(cell);
}

const setNeighbours = cellEle => {
	if(!cellEle) return;
	selectedCell.dom = cellEle;

	let { left, up, right, down } = getNeighbours(cellEle.dataset['id']);

	selectedCell.left = left ? cellDomMap.get(left).dom : null;
	selectedCell.up = up ? cellDomMap.get(up).dom : null;
	selectedCell.right = right ? cellDomMap.get(right).dom : null;
	selectedCell.down = down ? cellDomMap.get(down).dom : null;


}

const enterEditableMode = cellEle => {
    cellEle.classList.add('cell-is-editable');
    cellEle.style.webkitUserSelect = 'text';
    cellEle.contentEditable =  true;

    let cellRef = cellDomMap.get(cellEle.dataset['id']);
    cellRef.isEditable = true;
}

const setActiveIndicatorCells = cellId => {
    const [x1, y1] = getXandY(cellId);
    const [x2, y2] = getXandY(cellId);

    const colRef = colIndicatorCellMap.get(+x1);
    colRef.dom.classList.add('indicator-is-selected');

    const rowRef = rowIndicatorCellMap.get(+y1);
    rowRef.dom.classList.add('indicator-is-selected');
}

//cell event listeners
const onMouseDownCell = e => {
	const id = e.target.dataset['id'];
	// check if a cell is selected before resetting selection
	// if selected, turn on edit mode
	if (isAlreadySelected(id)) {
        enterEditableMode(e.target);
	}

	resetSelection();

    setNeighbours(e.target);

	startPoint = id;
	const selectedCells = getSelectedCells(startPoint, startPoint);


    setActiveIndicatorCells(startPoint);

	performSelection(selectedCells);
}

const onMouseEnterCell = e => {
	if (!startPoint) {
		return;
	}
	const id = e.target.dataset['id'];
	endPoint = id;

	const selectedCells = getSelectedCells(startPoint, endPoint);

	resetSelection();

	performSelection(selectedCells);

	e.target.classList.add('cell-is-selected');
}

const onMouseUpCell = () => {
	startPoint = null;
	endPoint = null;
}


const onDblClickCell = e => {
	//safari fix
	//reference - https://stackoverflow.com/questions/20435166/contenteditable-not-working-in-safari-but-works-in-chrome
	e.target.style.webkitUserSelect = 'text';

	e.target.contentEditable =  true;
}

const onBlurCell = e => {
    resetEditableMode(e.target)
    resetFormulaMode(e.target)
}

const handleDirectionKeys = e => {
	if ([13, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        let direction;

        //enter key is down
        if (e.keyCode === 37) {
            direction = 'left';
        } else if (e.keyCode === 38) {
            direction = 'up';
        } else if (e.keyCode === 39) {
            direction = 'right';
        } else if (e.keyCode === 40) {
            direction = 'down';
        } else if (e.keyCode === 13) {
            direction = 'down';
        }

        resetEditableMode(e.target);
        resetSelection();

        setNeighbours(selectedCell[direction]);

        //pass in the current dom
        const selectedCells = getSelectedCells(selectedCell.dom.dataset['id'], selectedCell.dom.dataset['id']);

        setActiveIndicatorCells(selectedCell.dom.dataset['id']);

        performSelection(selectedCells);
		return;
	}
}

const handleEscKey = e => {
    if (e.keyCode === 27) {
        resetEditableMode(e.target);
    }
}

const handleDelKey = e => {
    let cellRef = cellDomMap.get(e.target.dataset['id']);
    if (cellRef.isEditable) {
        return;
    }
    if (e.keyCode === 8) {
        e.target.innerText = "";
        cellDomMap.get(e.target.dataset['id']).innerText="";
    }
}

const handleEnterKey = e => {
    if (e.keyCode === 13) {
        return;
    }
}

//exclude special keys such as directions, equal, enter
const handleOthersKey = e => {
    if ([37, 38, 39, 40, 27, 8, 13].indexOf(e.keyCode) > -1) {
        return;
    }
    let cellRef = cellDomMap.get(e.target.dataset['id']);
    if (!cellRef.isEditable) {
        enterEditableMode(e.target);
    }
    if (cellRef.isFormula) {

    }
}

const handleEqualSign = e => {
    if (e.keyCode === 61) {
        enterFormulaMode(e.target);
    }
}

const onPressKeyCell = e => {
    //for direction keys
    handleDirectionKeys(e);

    handleEnterKey(e);

    handleEscKey(e);

    handleDelKey(e);

    handleOthersKey(e);

    handleEqualSign(e);
}

//cell event listeners end
const resetEditableMode = cellEle => {
	//selectedCellDomMap.forEach(x => {
	//	x.dom.classList
	//})
	if (cellEle.contentEditable) {
		cellEle.style.userSelect = 'none';
		cellEle.classList.remove('cell-is-editable');
		cellEle.style.webkitUserSelect = 'none';
		cellEle.contentEditable = false;

        let cellRef = cellDomMap.get(cellEle.dataset['id']);
        cellRef.isEditable = false;
	}

}

const enterFormulaMode = cellEle => {
    cellEle.classList.add('cell-is-formula');

    let cellRef = cellDomMap.get(cellEle.dataset['id']);
    cellRef.isFormula = true;
}

const resetFormulaMode = cellEle => {
	if (cellEle.contentEditable) {
		cellEle.style.userSelect = 'none';
		cellEle.classList.remove('cell-is-formula');
		cellEle.style.webkitUserSelect = 'none';
		cellEle.contentEditable = false;


        let cellRef = cellDomMap.get(cellEle.dataset['id']);
        cellRef.isFormula = false;
	}

}

const resetSelection = () => {
	sumEle.innerText = 0;
	avgEle.innerText = 0;
	selectedCellDomMap.forEach (x => {
		x.dom.classList.remove('cell-is-selected');
	});
    colIndicatorCellMap.forEach (x => {
        x.dom.classList.remove('indicator-is-selected');
    })
    rowIndicatorCellMap.forEach (x => {
        x.dom.classList.remove('indicator-is-selected');
    })

	selectedCellDomMap.clear();
}

const performSelection = (cells) => {
	let numericCellCount = 0;
	cells.forEach (x => {
		let cell = cellDomMap.get(x);
		cell.dom.classList.add('cell-is-selected');

		//put into selected cells
		selectedCellDomMap.set(x, {
			dom: cell.dom,
			innerText: cell.innerText,
		})

		//perform calculation of avg and sum
		if (isNumeric(cell.innerText)) {
			let oldSumValue = parseFloat(sumEle.innerText);
			let newSumValue = parseFloat(cell.innerText);

			sumEle.innerText = oldSumValue + newSumValue;
			numericCellCount++;

			avgEle.innerText = Number(sumEle.innerText) / numericCellCount;
		}

	})
}

const createSheet = (cols, rows) => {
	const sheet = document.createElement('sheet');

	sheet.classList.add('sheet');

	//row indicator
	const rowIndicator = document.createElement('div');
	rowIndicator.classList.add('sheet-col');

	const intersect = document.createElement('div');
	intersect.classList.add('cell');

	rowIndicator.appendChild(intersect);

	for (let y = 1; y <= rows; y++) {
		const cell = document.createElement('div');
		cell.classList.add('cell');
		cell.classList.add('sheet-row-indicator');
		cell.innerText = y;

		rowIndicator.appendChild(cell);
        rowIndicatorCellMap.set(y, {
            dom: cell
        })
	}

	sheet.appendChild(rowIndicator);

	for (let x = 1; x <= cols; x++) {
		//create col
		const col = document.createElement('div');
		col.classList.add('sheet-col');

		//col indicator
		const colIndicator = document.createElement('div');
		colIndicator.classList.add('cell');
		colIndicator.classList.add('sheet-col-indicator');
		colIndicator.innerText = charMap[x];
        colIndicatorCellMap.set(x, {
            dom: colIndicator
        })
		col.appendChild(colIndicator);

		for (let y = 1; y <= rows; y++) {
			const id = `${x}x${y}`;
			const cell = document.createElement('div');
			cell.classList.add('cell');
			cell.dataset['id'] = id;
			cell.tabIndex = 0;
			cell.addEventListener('mouseenter', onMouseEnterCell);
			cell.addEventListener('mousedown', onMouseDownCell);
			cell.addEventListener('mouseup', onMouseUpCell);
			cell.addEventListener('dblclick', onDblClickCell);
			cell.addEventListener('blur', onBlurCell);
			cell.addEventListener('keydown', onPressKeyCell);

			cell.innerText = ``;
			cellDomMap.set(id, {
				dom: cell,
				innerText: cell.innerText,
                isEditable: false,
                isFormula: false
			});

			const observer = new MutationObserver(mutations => {
				mutations.forEach (mutation => {
					cellDomMap.set(id, {
						dom: cell,
						innerText: mutation.target.data
					});
				})
			})
			const config = {characterData: true, subtree: true};
			observer.observe(cell, config);

			col.appendChild(cell);
		}
		sheet.appendChild(col);
	}

	return sheet;
}

const createFooter = () => {
	const footer = document.createElement('div');
	footer.classList.add('sheet-footer');

    const sumWrapper = document.createElement('p');
    sumWrapper.innerText = "Sum - ";


	const sum = document.createElement('span');
	sum.id = 'sumEle';
	sum.innerText = 0;

    sumWrapper.appendChild(sum);

    const avgWrapper = document.createElement('p');
    avgWrapper.innerText = "Average - ";


	const avg = document.createElement('span');
	avg.id = 'avgEle';
	avg.innerText = 0;

    avgWrapper.appendChild(avg);

	footer.appendChild(sumWrapper);
	footer.appendChild(avgWrapper);

	sumEle = sum;
	avgEle = avg;

	return footer;
}


window.addEventListener('load', () => {
	const app = document.querySelector('.app');

	const sheet =  createSheet(COLS, ROWS);
	const footer =  createFooter();

	app.appendChild(sheet);
	app.appendChild(footer);
});

window.addEventListener('keydown', e => {
	if (['Space', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(e.code) > -1) {
		e.preventDefault();
	}
}, false);
