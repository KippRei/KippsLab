window.onload = (event) => {
    document.getElementById("matrixSize").addEventListener("keypress", (e)=> {
        if (e.key == "Enter") {
            showUserInputMatrix();
        }
    });
  };
  
// Matrix Size
let n = 3;
// Determinant Grand Total
let grandTotal = 0;

function showUserInputMatrix() {
    n = document.getElementById("matrixSize").value;
    let maxNSize = 12;
    let mat = "";

    if (n > maxNSize) {
        mat = "Please enter an n that is 12 or lower.";
        document.getElementById("userInputMat").innerHTML = mat;
        return;
    }
    if (n < 2) {
        mat = "Please enter an n larger than 1.";
        document.getElementById("userInputMat").innerHTML = mat;
        return;
    }

    for (let i = 0; i < n; i++) {
        mat += `<div class="d-flex justify-content-center mt-3 p-1">`;
        for (let j = 0; j < n; j++) {
            mat+= `<input type="text" size="4" id="${i}${j}">`
        }
        mat+=  `</div>`
    }
    mat += `<div class="d-flex justify-content-center mt-3">
                <button onclick="getUserInputMatrix('determinant')" style='margin-left:10px'>Get Determinant</button>
                <button onclick="getUserInputMatrix('transpose')" style='margin-left:10px'>Get Transpose</button>
                <button onclick="getUserInputMatrix('adjoint')" style='margin-left:10px'>Get Adjoint</button>
            </div>`;
    document.getElementById("userInputMat").innerHTML = mat;
}

function getUserInputMatrix(calculation) {
    let inputMat = [];
    for (let i = 0; i < n; i++) {
        inputMat[i] = [];
        for (let j = 0; j < n; j++) {
            inputMat[i][j] = document.getElementById(`${i}${j}`).value;
        }
    }

    //// 4x4 matrix for testing ////
    // inputMat[0] = [];
    // inputMat[1] = [];
    // inputMat[2] = [];
    // inputMat[3] = [];

    // inputMat[0][0] = 1;
    // inputMat[0][1] = 2;
    // inputMat[0][2] = -2;
    // inputMat[0][3] = 4;

    // inputMat[1][0] = 3;
    // inputMat[1][1] = -11;
    // inputMat[1][2] = 4;
    // inputMat[1][3] = 5;

    // inputMat[2][0] = 1;
    // inputMat[2][1] = 1;
    // inputMat[2][2] = 2;
    // inputMat[2][3] = 1;

    // inputMat[3][0] = -4;
    // inputMat[3][1] = 3;
    // inputMat[3][2] = 3;
    // inputMat[3][3] = 1;
    //// End 4x4 test matrix ////

    // Zeroes grand total for calculation
    grandTotal = 0;

    // Performs requested calculation and displays
    switch (calculation) {
        case "determinant":
            displaySingleNumberResult(inputMat, getDeterminant(inputMat), "det");
            break;
        case "adjoint":
            displayMatrixResult(inputMat,getAdjoint(inputMat), "adj");
            break;
        case "transpose":
            displayMatrixResult(inputMat,transposeMatrix(inputMat), "Transpose of: ");
        default:
            break;
    }
}

function getDeterminant(mat) {
    let depth = mat.length;
    if (depth == 2) {
        det = (mat[0][0] * mat[1][1]) - (mat[0][1] * mat[1][0]);
        return det;
    }
    else {
        let total = 0
        for (let colVal = 0; colVal < depth; colVal++) {
            let newMat = [];
            let currRow = -1;
            let currCol = -1;
            // Create submatrix and multiply by a[0][colVal] to get cofactor
            for (let i = 1; i < depth; i++) {
                currRow += 1;
                currCol = -1;
                newMat[currRow] = [];
                for (let j = 0; j < depth; j++) {
                    if (j == colVal) {
                        continue;
                    }
                    currCol += 1;
                    newMat[currRow][currCol] = mat[i][j];
                }
            }
            total += (((-1) ** (colVal)) * mat[0][colVal] * getDeterminant(newMat));
        }
        return grandTotal + total;
    }
}

function getCofactorMatrix(matrix) {
    let cofactorMatrix = [];
    let subMat = [];
    let depth = matrix.length;
    
    // Creates a sub-matrix and gets determinant for each cell ([i][j])
    for (let i = 0; i < depth; i++) {
        cofactorMatrix[i] = [];
        for (let j = 0; j < depth; j++) {
            let rowIndex = -1
            let colIndex = -1
            for (let row = 0; row < depth; row++) {
                if (row == i) {
                    continue;
                }
                rowIndex += 1
                colIndex = -1
                subMat[rowIndex] = [];
                for (let col = 0; col < depth; col++) {
                    if (col == j) {
                        continue;
                    }
                    colIndex += 1
                    subMat[rowIndex][colIndex] = matrix[row][col]
                }
            cofactorMatrix[i][j] = ((-1) ** (i+j)) * getDeterminant(subMat);
            }
        }
    }
    return cofactorMatrix;
}

function transposeMatrix(matrix) {
    let depth = matrix.length;
    let tMat = [];
    for (let i = 0; i < depth; i++) {
        tMat[i] = [];
        for (let j = 0; j < depth; j++) {
            tMat[i][j] = 0;
        }
    }
    for (let i = 0; i < depth; i++) {
        for (let j = 0; j < depth; j++) {
            tMat[j][i] = matrix[i][j];
        }
    }
    return tMat;
}

function getAdjoint(mat) {
    if (mat.length == 2) {
        let adjMat = [];
        adjMat[0] = [];
        adjMat[1] = [];
        adjMat[0][0] = mat[1][1];
        adjMat[1][1] = mat[0][0];
        adjMat[0][1] = -1 * mat[0][1];
        adjMat[1][0] = -1 * mat[1][0];
        return adjMat;
    }
    else {
        return transposeMatrix(getCofactorMatrix(mat));
    }
}

// Displays results
function displayMatrixResult(origMat, resultMat, type) {
    let str = "";
    str += type;
    // Original matrix
    str += `<math>
                <mrow>
                    <mo> ( </mo>
                    <mtable rowspacing="10px" columnspacing="17px" columnalign="centered">`;

    for (let i = 0; i < origMat.length; i++) {
        str += `<mtr>`;
        for (let j = 0; j < origMat.length; j++) {
            str+= `<mtd>${origMat[i][j]}</mtd>`
        }
        str+=  `</mtr>`
    }
    str += `        </mtable>
                    <mo> ) </mo>
                </mrow>
            </math>`

    str += "<span class='m-3'>=</span>";

    // Resulting matrix
    str += `<math>
                <mrow>
                    <mo> ( </mo>
                    <mtable rowspacing="10px" columnspacing="17px" columnalign="centered">`;

    for (let i = 0; i < resultMat.length; i++) {
        str += `<mtr>`;
        for (let j = 0; j < resultMat.length; j++) {
            str+= `<mtd>${resultMat[i][j]}</mtd>`
        }
        str+=  `</mtr>`
    }
    str += `        </mtable>
                    <mo> ) </mo>
                </mrow>
            </math>`

    document.getElementById("results").innerHTML = str;
}

function displaySingleNumberResult(origMat, result, type) {
    let str = type;
    // Original matrix
    str += `<math>
                <mrow>
                    <mo> ( </mo>
                    <mtable rowspacing="10px" columnspacing="17px" columnalign="centered">`;

    for (let i = 0; i < origMat.length; i++) {
        str += `<mtr>`;
        for (let j = 0; j < origMat.length; j++) {
            str+= `<mtd>${origMat[i][j]}</mtd>`
        }
        str+=  `</mtr>`
    }
    str += `        </mtable>
                    <mo> ) </mo>
                </mrow>
            </math>`

    str += "<span class='m-3'>=</span>" + result;

    document.getElementById("results").innerHTML = str;
}