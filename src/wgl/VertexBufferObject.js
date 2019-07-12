/**
 * VertexBufferObject
 *
 * @class
 */
class VertexBufferObject {

    /**
     * Constructor
     * @param  {WebGL2RenderingContext} gl
     * @param  {GLenum} [target=gl.ARRAY_BUFFER] Default value is ARRAY_BUFFER
     * @param  {GLenum} [usage=gl.STATIC_DRAW] Default value is STATIC_DRAW
     */
    constructor(gl, target, usage) {
        this.gl = gl;
        this.target = (typeof target === 'undefined') ? gl.ARRAY_BUFFER : target;
        this.usage = (typeof usage === 'undefined') ? gl.STATIC_DRAW : usage;
        this.buffer = gl.createBuffer();
        this.bind();
    }

    /**
     * Set buffer's data
     * @param  {Array} datas
     */
    setData(datas) {
        this.gl.bufferData(this.target, datas, this.usage);
    }

    /**
     * Set and enable vertex attrib array
     * 
     * @param  {number} index
     * @param  {number} size
     * @param  {GLenum} type
     * @param  {boolean} normalized
     * @param  {number} stride
     * @param  {number} offset
     */
    enableVertexAttribArray(index, size, type, normalized, stride, offset) {
        this.bind();
        this.gl.vertexAttribPointer(
            index,
            size,
            type,
            normalized,
            stride,
            offset);
        this.gl.enableVertexAttribArray(index);
    }

    /**
     * Bind buffer
     */
    bind() {
        this.gl.bindBuffer(this.target, this.buffer);
    }

    /**
     * Unbind buffer
     */
    unbind() {
        this.gl.bindBuffer(this.target, null);
    }

    /**
     * Delete buffer
     */
    delete() {
        this.gl.deleteBuffer(this.buffer);
        this.buffer = null;
    }

}

module.exports = VertexBufferObject;