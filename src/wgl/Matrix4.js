const Vector3 = require('./Vector3');

const N = 16;
/**
 * Matrix4
 *
 * @class
 */
class Matrix4 {

    /**
     * Creates a new matrix4
     */
    constructor() {
        this.datas = new Array(16);
        this.identity();
    }

    /**
     * Set Matrix4 as identity
     *
     * @returns {Matrix4} this
     */
    identity() {
        this.datas.fill(0.0);
        this.datas[0] = 1.0;
        this.datas[5] = 1.0;
        this.datas[10] = 1.0;
        this.datas[15] = 1.0;
        return this;
    }

    /**
     * Inverts a Matrix4
     *
     * @returns {Matrix4} this
     */
    invert() {
        let a00 = this.datas[0], a01 = this.datas[1], a02 = this.datas[2], a03 = this.datas[3];
        let a10 = this.datas[4], a11 = this.datas[5], a12 = this.datas[6], a13 = this.datas[7];
        let a20 = this.datas[8], a21 = this.datas[9], a22 = this.datas[10], a23 = this.datas[11];
        let a30 = this.datas[12], a31 = this.datas[13], a32 = this.datas[14], a33 = this.datas[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        this.datas[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.datas[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.datas[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.datas[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this.datas[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.datas[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.datas[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.datas[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this.datas[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this.datas[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this.datas[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this.datas[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this.datas[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this.datas[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this.datas[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this.datas[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return this;
    }

    /**
     * Transpose the values of a Matrix4
     *
     * @returns {Matrix4} this
     */
    transpose() {
        let a01 = this.datas[1], a02 = this.datas[2], a03 = this.datas[3];
        let a12 = this.datas[6], a13 = this.datas[7];
        let a23 = this.datas[11];

        this.datas[1] = this.datas[4];
        this.datas[2] = this.datas[8];
        this.datas[3] = this.datas[12];
        this.datas[4] = a01;
        this.datas[6] = this.datas[9];
        this.datas[7] = this.datas[13];
        this.datas[8] = a02;
        this.datas[9] = a12;
        this.datas[11] = this.datas[14];
        this.datas[12] = a03;
        this.datas[13] = a13;
        this.datas[14] = a23;

        return this;
    }

    /**
     * Generates a perspective projection Matrix4 with the given bounds
     *
     * @param {number} fov Field of view in radians
     * @param {number} aspect Aspect ratio
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {Matrix4} this
     */
    perspective(fov, aspect, zNear, zFar) {
        this.datas.fill(0);

        const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        const rangeInv = 1.0 / (zNear - zFar);

        this.datas[0] = f / aspect;
        this.datas[5] = f;
        this.datas[10] = (zNear + zFar) * rangeInv;
        this.datas[11] = -1.0;
        this.datas[14] = zNear * zFar * rangeInv * 2;

        return this;
    }

    /**
     * Generates an orthogonal projection Matrix4 with the given bounds
     *
     * @param {number} left Left bound of the frustum
     * @param {number} right Right bound of the frustum
     * @param {number} bottom Bottom bound of the frustum
     * @param {number} top Top bound of the frustum
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {Matrix4} this
     */
    orthogonal(left, right, bottom, top, near, far) {
        this.datas.fill(0);
        let lr = 1 / (left - right);
        let bt = 1 / (bottom - top);
        let nf = 1 / (near - far);
        this.datas[0] = -2 * lr;
        this.datas[5] = -2 * bt;
        this.datas[10] = 2 * nf;
        this.datas[12] = (left + right) * lr;
        this.datas[13] = (top + bottom) * bt;
        this.datas[14] = (far + near) * nf;
        this.datas[15] = 1;
        return this;
    }

    /**
     * Translate a matrix4 by the given array
     *
     * @param {Array} array Array to translate by
     * @returns {Matrix4} this
     */
    translateFromArray(array) {
        this.translate(new Vector3(array[0], array[1], array[2]));
    }

    /**
     * Translate a matrix4 by the given Vector3
     *
     * @param {Vector3} vec3 vector to translate by
     * @returns {Matrix4} this
     */
    translate(vec3) {
        const v0 = vec3.datas[0];
        const v1 = vec3.datas[1];
        const v2 = vec3.datas[2];
        const m00 = this.datas[0];
        const m01 = this.datas[1];
        const m02 = this.datas[2];
        const m03 = this.datas[3];
        const m10 = this.datas[4];
        const m11 = this.datas[5];
        const m12 = this.datas[6];
        const m13 = this.datas[7];
        const m20 = this.datas[8];
        const m21 = this.datas[9];
        const m22 = this.datas[10];
        const m23 = this.datas[11];
        const m30 = this.datas[12];
        const m31 = this.datas[13];
        const m32 = this.datas[14];
        const m33 = this.datas[15];

        this.datas[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
        this.datas[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
        this.datas[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
        this.datas[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;

        return this;
    }

    /**
     * Rotates a Matrix4 by the given angle around the given axis
     *
     * @param {Number} angleInRadians the angle to rotate the matrix by
     * @param {Vector3} axis the axis to rotate around
     * @returns {Matrix4} this
     */
    rotate(angleInRadians, axis) {
        let x = axis.datas[0];
        let y = axis.datas[1];
        let z = axis.datas[2];
        let len = axis.length();
        let s, c, t;
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        let b00, b01, b02;
        let b10, b11, b12;
        let b20, b21, b22;

        if (len < 0.000001) {
            return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(angleInRadians);
        c = Math.cos(angleInRadians);
        t = 1 - c;

        a00 = this.datas[0];
        a01 = this.datas[1];
        a02 = this.datas[2];
        a03 = this.datas[3];
        a10 = this.datas[4];
        a11 = this.datas[5];
        a12 = this.datas[6];
        a13 = this.datas[7];
        a20 = this.datas[8];
        a21 = this.datas[9];
        a22 = this.datas[10];
        a23 = this.datas[11];

        // Construct the elements of the rotation matrix
        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        this.datas[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this.datas[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this.datas[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this.datas[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this.datas[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this.datas[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this.datas[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this.datas[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this.datas[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this.datas[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this.datas[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this.datas[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return this;
    }

    /**
     * Rotates a matrix4 by the given angle around the X axis
     *
     * @param {Number} rad the angle to rotate the matrix4 by
     * @returns {Matrix4} this
     */
    rotateX(angleInRadians) {
        const m10 = this.datas[4];
        const m11 = this.datas[5];
        const m12 = this.datas[6];
        const m13 = this.datas[7];
        const m20 = this.datas[8];
        const m21 = this.datas[9];
        const m22 = this.datas[10];
        const m23 = this.datas[11];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        this.datas[4] = c * m10 + s * m20;
        this.datas[5] = c * m11 + s * m21;
        this.datas[6] = c * m12 + s * m22;
        this.datas[7] = c * m13 + s * m23;
        this.datas[8] = c * m20 - s * m10;
        this.datas[9] = c * m21 - s * m11;
        this.datas[10] = c * m22 - s * m12;
        this.datas[11] = c * m23 - s * m13;

        return this;
    }

    /**
     * Rotates a matrix4 by the given angle around the Y axis
     *
     * @param {Number} rad the angle to rotate the matrix4 by
     * @returns {Matrix4} mat4
     */
    rotateY(angleInRadians) {
        const m00 = this.datas[0];
        const m01 = this.datas[1];
        const m02 = this.datas[2];
        const m03 = this.datas[3];
        const m20 = this.datas[8];
        const m21 = this.datas[9];
        const m22 = this.datas[10];
        const m23 = this.datas[11];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        this.datas[0] = c * m00 - s * m20;
        this.datas[1] = c * m01 - s * m21;
        this.datas[2] = c * m02 - s * m22;
        this.datas[3] = c * m03 - s * m23;
        this.datas[8] = c * m20 + s * m00;
        this.datas[9] = c * m21 + s * m01;
        this.datas[10] = c * m22 + s * m02;
        this.datas[11] = c * m23 + s * m03;

        return this;
    }

    /**
     * Rotates a matrix4 by the given angle around the Z axis
     *
     * @param {Number} rad the angle to rotate the matrix4 by
     * @returns {Matrix4} mat4
     */
    rotateZ(angleInRadians) {
        const m00 = this.datas[0];
        const m01 = this.datas[1];
        const m02 = this.datas[2];
        const m03 = this.datas[3];
        const m10 = this.datas[4];
        const m11 = this.datas[5];
        const m12 = this.datas[6];
        const m13 = this.datas[7];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        this.datas[0] = c * m00 + s * m10;
        this.datas[1] = c * m01 + s * m11;
        this.datas[2] = c * m02 + s * m12;
        this.datas[3] = c * m03 + s * m13;
        this.datas[4] = c * m10 - s * m00;
        this.datas[5] = c * m11 - s * m01;
        this.datas[6] = c * m12 - s * m02;
        this.datas[7] = c * m13 - s * m03;

        return this;
    }

    /**
     * Scales the matrix4 by the vector3
     *
     * @param {Vector3} vec3 the vector3 to scale the matrix by
     * @returns {Matrix4} this
     **/
    scale(vec3) {
        this.datas[0] *= vec3.datas[0];
        this.datas[1] *= vec3.datas[0];
        this.datas[2] *= vec3.datas[0];
        this.datas[3] *= vec3.datas[0];
        this.datas[4] *= vec3.datas[1];
        this.datas[5] *= vec3.datas[1];
        this.datas[6] *= vec3.datas[1];
        this.datas[7] *= vec3.datas[1];
        this.datas[8] *= vec3.datas[2];
        this.datas[9] *= vec3.datas[2];
        this.datas[10] *= vec3.datas[2];
        this.datas[11] *= vec3.datas[2];

        return this;
    }

    /**
     * Creates a new Matrix4 initialized with values of this
     *
     * @returns {Matrix4} a new Matrix4
     */
    clone() {
        let m4 = new Matrix4();
        m4.datas = this.datas.slice(0, N);
        return m4;
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
     * Return a string representation of a matrix4
     * @param  {matrix4} mat4
     * @returns {string} string mat4
     */
    toString() {
        let str = 'Matrix4(' + '\n';
        str += '  ' + this.datas[0] + ' ' + this.datas[1] + ' ' + this.datas[2] + ' ' + this.datas[3] + '\n';
        str += '  ' + this.datas[4] + ' ' + this.datas[5] + ' ' + this.datas[6] + ' ' + this.datas[7] + '\n';
        str += '  ' + this.datas[8] + ' ' + this.datas[9] + ' ' + this.datas[10] + ' ' + this.datas[11] + '\n';
        str += '  ' + this.datas[12] + ' ' + this.datas[13] + ' ' + this.datas[14] + ' ' + this.datas[15] + '\n';
        str += ')';
        str = '';
        for (let i = 0; i < N; i++) {
            str += this.datas[i];
            if (i < 15)
                str += ',';
        }
        return str;
    }
}

module.exports = Matrix4;