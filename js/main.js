let startPoint = null;
let endPoint = null;

let cellDomMap = new Map();
let selectedCellDomMap = new Map();

let sumEle;
let avgEle;


//cell event listeners
const onMouseDownCell = e => {
	resetSelection();
	const id = e.target.dataset['id'];
	startPoint = id;
	const selectedCells = getSelectedCells(startPoint, startPoint);

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

	e.target.classList.add('cell-is-selected')
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
	if (e.target.contentEditable) {
		e.target.style.userSelect = 'none';
		e.target.style.webkitUserSelect = 'none';
		e.target.contentEditable = false;
	}
}

const onEnterKeyCell = e => {
	if (e.keyCode === 13) {
		resetSelection();
		e.target.contentEditable = false;
		return;		
	}
}

//cell event listeners end

const resetSelection = () => {
	sumEle.innerText = 0;
	avgEle.innerText = 0;
	selectedCellDomMap.forEach (x => {		
		x.dom.classList.remove('cell-is-selected');
	});

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
			cell.addEventListener('keypress', onEnterKeyCell);

			cell.innerText = ``;
			cellDomMap.set(id, {
				dom: cell,
				innerText: cell.innerText,
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

	const sum = document.createElement('span');
	sum.id = 'sumEle';
	sum.innerText = 0;
	const avg = document.createElement('span');
	avg.id = 'avgEle';
	avg.innerText = 0;
	
	footer.appendChild(sum);
	footer.appendChild(avg);

	sumEle = sum;
	avgEle = avg;
	
	return footer;
}


window.addEventListener('load', () => {
	const app = document.querySelector('.app');

	const sheet =  createSheet(26, 100);
	const footer =  createFooter();

	app.appendChild(sheet);
	app.appendChild(footer);
})