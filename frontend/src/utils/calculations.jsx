const hosCovConverter = {
    'none': 0,
    'basic': 90,
    'bronze': 120,
    'silver': 160,
    'gold': 220
};

const extCovConverter = {
    'none': 0,
    'basic': 25,
    'standard': 45,
    'premium': 70
};

const calculateLHC = (coverHistory, age, hospital_cover) => {
    if (hospital_cover === 'none') {
        return 0;
    }

    if (
        coverHistory === 'yes' || 
        coverHistory === 'not sure'
    ) {
        return 0;
    } 
    else if (coverHistory === 'no') {
        if (age > 30) {
            return ((age - 30)*2);
        }

        return 0;
    }

    return 0;
}

const calculateHosPrem = (hospital_cover, lhc) => {
    return hosCovConverter[hospital_cover] * (1 + (lhc/100))
}

const calculateExtPrem = (extras_cover, adults) => {
    return extCovConverter[extras_cover] * adults
}

const calculateMonthPrem = (hosPrem, extPrem, familyFeeBool) => {
    if (familyFeeBool) {
        return hosPrem + extPrem + 30;
    } else {
        return hosPrem + extPrem;
    }
}

const calculateYearDisc = (yearTotal, yearDiscount) => {
    return yearTotal * (1-(yearDiscount/100));
}

export {calculateLHC, calculateHosPrem, calculateExtPrem, calculateMonthPrem, calculateYearDisc, hosCovConverter, extCovConverter};