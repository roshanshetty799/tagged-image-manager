/*
 Author      : Roshan S.
 Description : This file contains functions needed to populate random data for filling forms.
*/


const randomData = multiKey([
    ['phoneNumber', 'ag-formField--mobile'],
    ['TestField','TestTwoField','TestThreeField']

]);

// All keys that are part of the 'phoneNumber' block share the same value
randomData['phoneNumber'] = getRandom_Int(10);
// TestTwoField & TestThreeField share the same value
randomData['TestField'] = "Some_Value"





function getRandom_Int(length: number) {

    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
}

/**
 *  Allows you to create an object with multiple keys sharing the same value
 *  @param keyGroups
 */
function multiKey(keyGroups: string[][]) {
    let obj = {};
    let props = {};

    for (let keyGroup of keyGroups) {
        let masterKey = keyGroup[0];
        let prop = {
            configurable: true,
            enumerable: false,

            get() {
                return obj[masterKey];
            },

            set(value: any) {
                obj[masterKey] = value;
            }
        };

        obj[masterKey] = undefined;
        for (let i = 1; i < keyGroup.length; ++i) {
            if (keyGroup.hasOwnProperty(i)) {
                props[keyGroup[i]] = prop;
            }
        }
    }

    return Object.defineProperties(obj, props);
}

/**
 * Call this function where validating the input data is not part of the test
 * Specify 'Random' in the dataTables and call this function in the corresponding
 * step definition. Ensure that the field/fieldset has been assigned a random value above
 * @param fieldName - The cssSelector of the field
 */
export const getRandom_Data = (fieldName: string | number) => {
    return randomData[fieldName];

};

