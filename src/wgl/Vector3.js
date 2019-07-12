const N = 3;
/**
 * Vector3
 *
 * @class
 */
class Vector3 {

    /**
     * Constructor
     * @param  {Number} x
     * @param  {Number} y
     * @param  {Number} z
     */
    constructor(x, y, z) {
        this.datas = [0, 0, 0];
        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
            this.datas = [x, y, z];
        } else if (!isNaN(x)) {
            this.datas = [x, x, x];
        }
    }

    /**
     * Set the components of a Vector3 to the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {Vector3} this Vector3
     */
    set(x, y, z) {
        this.datas[0] = x;
        this.datas[1] = y;
        this.datas[2] = z;
        return this;
    }

    /**
     * Set the X component of a Vector3 to the given value
     *
     * @param {Number} x X component
     * @returns {Vector3} this.datas
     */
    setX(x) {
        this.datas[0] = x;
        return this;
    }

    /**
     * Set the Y component of a Vector3 to the given value
     *
     * @param {Number} y Y component
     * @returns {Vector3} this.datas
     */
    setY(y) {
        this.datas[1] = y;
        return this;
    }

    /**
     * Set the Z component of a Vector3 to the given value
     *
     * @param {Vector3} this.datas the receiving Vector3
     * @param {Number} z Z component
     * @returns {Vector3} this.datas
     */
    setZ(z) {
        this.datas[2] = z;
        return this;
    }

    /**
     * Set the components of a Vector3 to the given values
     *
     * @param {Number} value for x, y, z component
     * @returns {Vector3} this.datas
     */
    setAll(value) {
        this.datas.fill(value);
        return this;
    }

    /**
     * Set the components of a Vector3 to 0
     *
     * @returns {Vector3} this.datas
     */
    zero() {
        this.datas.fill(0);
        return this;
    }

    /**
     * Adds another Vector3 to current Vector3
     *
     * @param {Vector3} vec3 the Vector3 to add
     * @returns {Vector3} this
     */
    add(vec3) {
        for (let i = 0; i < N; i++) {
            this.datas[i] += vec3.datas[i];
        }
        return this;
    }

    /**
     * Substacts another Vector3 to current Vector3
     *
     * @param {Vector3} vec3 the Vector3 to substract
     * @returns {Vector3} this
     */
    substract(vec3) {
        for (let i = 0; i < N; i++) {
            this.datas[i] -= vec3.datas[i];
        }
        return this;
    }

    /**
     * Multiplies another Vector3 to current Vector3
     *
     * @param {Vector3} vec3 the Vector3 to multiply
     * @returns {Vector3} this
     */
    multiply(vec3) {
        for (let i = 0; i < N; i++) {
            this.datas[i] *= vec3.datas[i];
        }
        return this;
    }

    /**
     * Divides another Vector3 to current Vector3
     *
     * @param {Vector3} vec3 the Vector3 to multiply
     * @returns {Vector3} this
     */
    divide(vec3) {
        for (let i = 0; i < N; i++) {
            this.datas[i] /= vec3.datas[i];
        }
        return this;
    }

    /**
     * Negates the components of a vector3
     *
     * @returns {Vector3} this Vector3
     */
    negate() {
        for (let i = 0; i < N; i++) {
            this.datas[i] = -this.datas[i];
        }
        return this.datas;
    }

    /**
     * Calculates the euclidian distance with another Vector3
     *
     * @param {Vector3} vec3 the Vector3
     * @returns {Number} distance between this Vector3 and vec3
     */
    distance(vec3) {
        return Math.sqrt(this.distanceSquared(vec3));
    }

    /**
     * Calculates the squared euclidian distance with another Vector3
     *
     * @param {Vector3} vec3 the Vector3
     * @returns {Number} distance between this Vector3 and vec3
     */
    distanceSquared(vec3) {
        const dx = this.datas[0] - vec3.datas[0];
        const dy = this.datas[1] - vec3.datas[1];
        const dz = this.datas[2] - vec3.datas[2];
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * Calculates the length of the Vector3
     *
     * @returns {Number} length of Vector3
     */
    length() {
        return Math.sqrt(this.lengthSquared());
    }

    /**
     * Calculates the length squared of this Vector3
     *
     * @returns {Number} length of this Vector3
     */
    lengthSquared() {
        let r = 0;
        for (let i = 0; i < 3; i++) {
            r += this.datas[i] * this.datas[i];
        }
        return r;
    }

    /**
     * Normalize a Vector3
     *
     * @returns {Vector3} a new normalized Vector3
     */
    normalize() {
        let v = new Vector3();
        let len = this.length();
        if (len > 0) {
            for (let i = 0; i < 3; i++) {
                v.datas[i] = this.datas[i] / len;
            }
        }

        return v;
    }

    /**
     * Computes the cross product of two Vector3's
     *
     * @param {Vector3} vec3 the second operand
     * @returns {Vector3} new Vector3
     */
    cross(vec3) {
        let vec = new Vector3();
        vec.datas[0] = this.datas[1] * vec3.datas[2] - this.datas[2] * vec3.datas[1];
        vec.datas[1] = this.datas[2] * vec3.datas[0] - this.datas[0] * vec3.datas[2];
        vec.datas[2] = this.datas[0] * vec3.datas[1] - this.datas[1] * vec3.datas[0];
        return vec;
    }

    /**
     * Calculates the dot product of two Vector3's
     *
     * @param {Vector3} vec3 the second operand
     * @returns {Number} dot product of this Vector3 and vec3
     */
    dot(vec3) {
        return this.datas[0] * vec3.datas[0] + this.datas[1] * vec3.datas[1] + this.datas[2] * vec3.datas[2];
    }

    /**
     * Creates a new Vector3 initialized with values of this
     *
      * @returns {Vector3} a new Vector3
     */
    clone() {
        let vec3 = new Vector3();
        vec3.datas = this.datas.slice(0, N);
        return vec3;
    }

    /**
     * Return the datas as a Float32Array
     * 
     * @returns {Float32Array}
     */
    toFloat32Array() {
        return new Float32Array(this.datas);
    }

    /**
     * Returns a string representation of a Vector3
     *
     * @returns {String} string representation of the Vector3
     */
    toString() {
        return 'Vector3(' + this.datas[0] + ', '
            + this.datas[1] + ', '
            + this.datas[2] + ')';
    }
}

module.exports = Vector3;