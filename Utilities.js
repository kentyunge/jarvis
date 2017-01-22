const Utilities = {
    containsWord: (string, word) => {
        return new RegExp('(?:^|\b)' + word + '(?=\b|$)').test(string);
//        return new RegExp('(?:[^.\w]|^|^\\W+)' + word + '(?:[^.\w]|\\W(?=\\W+|$)|$)').test(string);
    }
};

module.exports = Utilities;