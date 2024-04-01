////////////////////////////
//Displays numeric results//
////////////////////////////

function CalculateF1() {
    let p1Genotype = document.getElementById("P1").value;
    let p2Genotype = document.getElementById("P2").value;
    let dom = document.getElementById("DomType").value;
    
    let zeroCheck = p1Genotype.length !=0 && p2Genotype.length != 0;
    let lengthCheck = p1Genotype.length % 2 == 0;
    let inputMatch = p1Genotype.length == p2Genotype.length;
    let locusCheck = true;

    if (zeroCheck && lengthCheck && inputMatch) {
        locusCheck = LocusCheck(p1Genotype, p2Genotype);
    }

    if (zeroCheck && lengthCheck && inputMatch && locusCheck) {
        let singleAlleles = CombineAlleles(p1Genotype, p2Genotype);
        let F1 = F1Genotypes(singleAlleles);

        ShowSquare(p1Genotype, p2Genotype);
        DisplayResults(F1, dom);
    }
    else {
        let errorMsg = "";
        if (!lengthCheck || !zeroCheck) {errorMsg = "Improper genotype length"}
        else if (!inputMatch) {errorMsg = "Genotype lengths do not match"}
        else if (!locusCheck) {errorMsg = "Genotype loci error"}

        ClearData();
        let gResults = document.getElementById("GenoResults");
        let pResults = document.getElementById("PhenoResults");
        gResults.style.color = 'red';
        gResults.innerHTML = `${errorMsg}, please try again`;
        pResults.innerHTML = "";
    }
}


function  CombineAlleles(p1, p2) {
    let singleAlleles = [];
    for(let i = 0; i < p1.length; i = i+2) {
        let temp = [];
        temp.push(p1[i] + p2[i]);
        temp.push(p1[i] + p2[i+1]);
        temp.push(p1[i+1] + p2[i]);
        temp.push(p1[i+1] + p2[i+1]);
        singleAlleles.push(temp);
    }

    return singleAlleles;
}


function F1Genotypes(singleAlleles) {
    let finalF1Arr = singleAlleles;
    let finalF1length = 0;

    // Each array in singleAlleles has all possible combos of each letter i.e. [[AA,Aa,aA,aa], [BB,Bb.bB,bb]]
    do {
        let i = 0;
        let currentArrLength = finalF1Arr.length - 1; // Length of array of arrays
        let f1Arr = [];

        while (i < currentArrLength) {
            let f1TempAllele = []; // array for storing paired alleles to push onto f1Arr
            let arr1 = finalF1Arr[i]; // ith array in finalF1arr to combo with (i+1)th  e.g. [AA,Aa,aA,aa]
            let arr2 = finalF1Arr[i+1]; // e.g. [BB,Bb,bB,bb]

            for (let j = 0; j < arr1.length; j++) {
                for (let k = 0; k < arr2.length; k++) {
                    f1TempAllele.push(arr1[j] + arr2[k]);
                }
            }

            f1Arr.push(f1TempAllele);
            i += 2;   
        }

        if (i == currentArrLength) {
            f1Arr.push(finalF1Arr[i]);
        }

        finalF1Arr = f1Arr;
        finalF1length = finalF1Arr.length;
    } while (finalF1length > 1);

    return finalF1Arr;    
}


function DisplayResults(f1, dom) {
    let f1List = f1[0] //Turn F1 (arr of arr) into single arr for easier use
    let dataToDisplay = NormalizeGenotypeLettering(f1List); // Returns arr of allele types and total number of alleles
    let alleleTypes = dataToDisplay[0];
    let totalNumOfAlleles = dataToDisplay[1];

    let genotypeMap = new Map();
    let phenotypeMap = new Map();

    for (let i = 0; i < alleleTypes.length; i++) {
        let allele = alleleTypes[i];

        // Count number of different alleles (add to map)
        if (genotypeMap.has(allele)) {
            let newAmt = genotypeMap.get(allele) + 1;
            genotypeMap.set(allele, newAmt);
        }
        else {
            genotypeMap.set(allele, 1);
        }
    }


    if (dom == "INCOMPLETE") {
        phenotypeMap = PhenoIncompleteDominance(alleleTypes);
    }
    else if (dom == "CODOMINANCE") {
        phenotypeMap = PhenoCoDominance(alleleTypes);
    }
    else {
        phenotypeMap = PhenoCompleteDominance(alleleTypes);
    }

    let genotypeResults = "";
    genotypeMap.forEach((value, key) => {
        let percent = (parseFloat(value)/parseFloat(totalNumOfAlleles) * 100).toFixed(2);
        genotypeResults += `<p>${key}: ${value}/${totalNumOfAlleles} (${percent}%)</p>`;
    })

    let phenotypeResults = "";
    phenotypeMap.forEach((value, key) => {
        let percent = (parseFloat(value)/parseFloat(totalNumOfAlleles) * 100).toFixed(2);
        phenotypeResults += `<p>${key}: ${value}/${totalNumOfAlleles} (${percent}%)</p>`
    })

    let gResults = document.getElementById("GenoResults");
    gResults.style.color = 'black';
    gResults.innerHTML = "<p><u>Genotype Results</u></p>" + genotypeResults;
    let pResults = document.getElementById("PhenoResults");
    pResults.innerHTML = "<p><u>Phenotype Results</u></p>" + phenotypeResults;

}


// Normalizes gene casing in allele (uppercase first lowercase second) (e.g. aA -> Aa)
function NormalizeGenotypeLettering(f1) {
    let normalizedF1Arr = [];
    let totalNumOfAlleles = 0;
    for (let i = 0; i < f1.length; i++) {
        let allele = f1[i];
        let alleleTemp = "";
        for (let j = 0; j < allele.length; j += 2) {
            if (allele[j] == allele[j].toLowerCase() && allele[j+1] == allele[j+1].toUpperCase()) {
                alleleTemp += (allele[j+1] + allele[j]);
            }
            else {
                alleleTemp += (allele[j] + allele[j+1]);
            }
        }
        totalNumOfAlleles++;
        normalizedF1Arr.push(alleleTemp);
    }
    
    return [normalizedF1Arr, totalNumOfAlleles];
}


// Clears table and numeric results
function ClearData() {
    document.getElementById("GenoResults").innerHTML = "";
    document.getElementById("PhenoResults").innerHTML = "";
    document.getElementById("pSquareHead").innerHTML = "";
    document.getElementById("pSquareRows").innerHTML = "";
}


function PhenoCompleteDominance(alleleTypes) {
    let phenotypeMap = new Map();

    for (let i = 0; i < alleleTypes.length; i++) {
        let allele = alleleTypes[i];

        // Count number of dominant/recessive phenotype (add to map)
        let phenoToAdd = "";
        for (let j = 0; j < allele.length; j = j+2) {
            phenoToAdd += allele[j];
        }
        if (phenotypeMap.has(phenoToAdd)) {
            let newAmt = phenotypeMap.get(phenoToAdd) + 1;
            phenotypeMap.set(phenoToAdd, newAmt);
        }
        else {
            phenotypeMap.set(phenoToAdd, 1);
        }

    }

    return phenotypeMap;
}


// TODO: Implement
function PhenoIncompleteDominance(alleleTypes) {

    console.log("INC");

}


// TODO: Implement
function PhenoCoDominance(alleleTypes) {

    console.log("CO");

}


// Checks to ensure p1 and p2 genes are structured AABBCC... etc.
function LocusCheck(p1, p2) {
    let ok = true;
    for (let i = 0; i < p1.length; i = i+2) {
        if (p1[i].toUpperCase() != p1[i+1].toUpperCase() || p2[i].toUpperCase() != p2[i+1].toUpperCase() || p1[i].toUpperCase() != p2[i].toUpperCase()) {
            ok = false;
        }
    }
    return ok;
}


//////////////////////////
//Punnett Square Display//
//////////////////////////

// Displays punnett square table
function ShowSquare(p1Genotype, p2Genotype) {
    const p1 = p1Genotype.split("");
    const p2 = p2Genotype.split("");

    const p1Arr = PairUp(p1);
    const p2Arr = PairUp(p2);

    p1Arr.forEach((val) => {
        console.log(val);
    });

    // Display P1 alleles as columns
    document.getElementById("pSquareHead").innerHTML = "<th scope=\"col\"></th>";
    p1Arr[0].forEach((val)=> {
        document.getElementById("pSquareHead").innerHTML += "<th scope=\"col\">" + val + "</th>";
    });
    
    // Display P2 alleles as rows and fill in table data
    document.getElementById("pSquareRows").innerHTML = '';
    p2Arr[0].forEach((val2)=> {
        let htmlString = `<tr><th scope="row"> ${val2} </th>`;
        p1Arr[0].forEach((val1)=> {
            htmlString += "<td class=\"bg-secondary\">";
            let index = 0;
            while (index < val2.length) {
                htmlString += val2[index] + val1[index];
                index++;
            }
            htmlString += "</td>";
        });
        htmlString += "</tr>";

        document.getElementById("pSquareRows").innerHTML += htmlString;
    });
}

// Takes p1 or p2 string as array, makes arrays of pairs (i.e. "AaBbCcDd" = [['AB', 'Ab', 'aB', 'ab'], ['CD', 'Cd',....]])
function PairUp(alleleArr) {
    let i;
    let arrToReturn = [];

    if (alleleArr.length == 2) {
        let temp = [];
        temp.push(alleleArr[0]);
        temp.push(alleleArr[1]);
        arrToReturn.push(temp);
        return AllPossibleAlleles(arrToReturn);
    }
    for (i = 0; i <= alleleArr.length - 4; i += 4) {
        let temp = [];
        temp.push(alleleArr[i] + alleleArr[i+2]);
        temp.push(alleleArr[i] + alleleArr[i+3]);
        temp.push(alleleArr[i+1] + alleleArr[i+2]);
        temp.push(alleleArr[i+1] + alleleArr[i+3]);
        arrToReturn.push(temp);
    }
    if ((alleleArr.length / 2) % 2 == 1) {
        let temp = [];
        temp.push(alleleArr[i]);
        temp.push(alleleArr[i+1]);
        arrToReturn.push(temp);
    }

    return AllPossibleAlleles(arrToReturn);
}

// Takes paired arrays from GetCombos and combines into full allele
// (i.e. [['AB', 'Ab', 'aB', 'ab'], ['CD','Cd', 'cD', cd']] => ['ABCD', 'ABCd', 'ABcD', 'ABcd', 'AbCD',...])
function AllPossibleAlleles(alleleArr) {
    let arrToReturn = [];
    while (alleleArr.length > 1) {
        let tempArr = [];
        const temp1 = alleleArr.pop();
        const temp2 = alleleArr.pop();
        temp1.forEach((val1)=> {
            temp2.forEach((val2)=> {
                tempArr.push(val2 + val1);
            });
        });
        alleleArr.push(tempArr);
    }

    return alleleArr;
}