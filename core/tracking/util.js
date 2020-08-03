/**
 * Indicates if a certain "sub object" is a subset of a "super object".
 */
export const isSubset = (superObject, subObjectSelector) => (subObject) => {
    const finalSubObject = subObjectSelector ? subObject[subObjectSelector] : subObject;
    return Object.keys(finalSubObject).every((key) => {
        if (typeof finalSubObject[key] === 'object') {
            return isSubset(superObject[key])(finalSubObject[key]);
        }
        return finalSubObject[key] === superObject[key];
    });
};

export const isNotGadgetUrl = () => !window.location.pathname.includes('gadgets');
