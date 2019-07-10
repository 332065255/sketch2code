
let config = {'Button':''}
let output = {}
for(let name in config){
    output[name]=require('./renderFactory');
}
module.exports = output;