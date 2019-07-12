const DEG = 180.0 / Math.PI;
const RAD = Math.PI / 180.0;

function radToDeg(r) {
  return r * DEG;
}

function degToRad(d) {
  return d * RAD;
}

module.exports.radToDeg = radToDeg;
module.exports.degToRad = degToRad;