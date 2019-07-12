const Matrix4 = require('./Matrix4');

/**
 * @param  {WebGLRenderingContext} gl
 * @param  {String} sourceCode
 * @param  {GLenum} type
 */
function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var info = gl.getShaderInfoLog(shader);
        throw 'Could not compile WebGL program. \n\n' + info;
    }
    return shader;
}

const attribsMap = new Map();
const uniformsMap = new Map();

/**
 * ShaderProgram
 *
 * @class
 */
class ShaderProgram {

    /**
     * Constructor
     * @param  {WebGLRenderingContext} gl
     * @param  {string} vs Vertex shader source
     * @param  {string} fs Fragment shader source
     */
    constructor(gl, vs, fs) {
        /** @type { WebGLRenderingContext } */
        this.gl = gl;
        this.program = null;
        if (vs && fs) {
            this.create(vs, fs);
        }
    }

    /**
     * Create shader program from vertex and shader source
     * @param  {string} vs Vertex shader source
     * @param  {string} fs Fragment shader source
     */
    create(vs, fs) {
        this.gl.deleteProgram(this.program);
        attribsMap.clear();
        uniformsMap.clear();

        const vertexShader = createShader(this.gl, vs, this.gl.VERTEX_SHADER);
        const fragmentShader = createShader(this.gl, fs, this.gl.FRAGMENT_SHADER);
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            let info = this.gl.getProgramInfoLog(this.program);
            throw 'Could not compile WebGL program. \n\n' + info;
        }

        let idx = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < idx; ++i) {
            let info = this.gl.getActiveAttrib(this.program, i);
            attribsMap.set(info.name, this.getAttribLocation(info.name));
        }

        idx = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < idx; ++i) {
            let info = this.gl.getActiveUniform(this.program, i);
            uniformsMap.set(info.name, this.getUniformLocation(info.name));
        }
    }

    /**
     * Get attribute location
     * @param  {String} name
     * @returns {number} Location of the variable name
     */
    getAttribLocation(name) {
        return this.gl.getAttribLocation(this.program, name);
    }

    /**
     * Get uniform location
     * @param  {String} name
     * @returns {WebGLUniformLocation} Location of the uniform
     */
    getUniformLocation(name) {
        return this.gl.getUniformLocation(this.program, name);
    }

    /**
     * @param  {String} name
     * @param  {Matrix4} mat4
     */
    setUniformMat4(name, mat4) {
        this.gl.uniformMatrix4fv(
            uniformsMap.get(name),
            false,
            mat4.toFloat32Array());
    }

    /**
     * @param  {String} name
     * @param  {number} value
     */
    setUniform1i(name, value) {
        this.gl.uniform1i(
            uniformsMap.get(name),
            false,
            value);
    }

    /**
     * @param  {String} name
     * @param  {number} value
     */
    setUniform1f(name, value) {
        this.gl.uniform1f(
            uniformsMap.get(name),
            false,
            value);
    }

    /**
     * Use current shader program
     */
    use() {
        this.gl.useProgram(this.program);
    }

    delete() {
        this.deleteProgram(this.program);
        this.program = null;
    }

}

module.exports = ShaderProgram;