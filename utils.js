/**
 * Exposes generic methods that can be used in any service.
 */

module.exports = {
    shuffleArray : (array) => {
        let temp = [];
        let len = array.length;
        while(len){
            temp.push(array.splice(Math.floor(Math.random()*array.length),1)[0]);
            len--;
        }
        return temp;
    }
};