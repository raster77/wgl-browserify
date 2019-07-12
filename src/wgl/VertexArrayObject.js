class VertexArrayObject {
    /**
     * @param  {WebGLRenderingContext} gl
     */
    constructor(gl) {
        this.gl = gl;
        this.vao = this.gl.createVertexArray();
    }

    /**
     * Bind VertexArrayObject
     */
    bind() {
        this.gl.bindVertexArray(this.vao);
    }

    /**
     * Unbind VertexArrayObject
     */
    unbind() {
        this.gl.bindVertexArray(null);
    }

    delete() {
        this.gl.deleteVertexArray(this.vao);
        this.vao = null;
    }

}

module.exports = VertexArrayObject;