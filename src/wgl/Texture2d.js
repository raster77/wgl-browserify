/**
 * Texture2d
 *
 * @class
 */
class Texture2d {

    /**
     * Constructor
     * @param  {WebGLRenderingContext} gl
     * @param  {GLenum} target Texture target
     * @param  {GLenum} textureUnit textureUnit
     * @param  {number} level
     * @param  {GLenum} internalFormat
     * @param  {GLenum} format
     * @param  {GLenum} type
     */
    constructor(gl, target, textureUnit, level, internalFormat, format, type) {
        this.gl = gl;
        this.target = (typeof target === 'undefined') ? this.gl.TEXTURE_2D : target;
        this.textureUnit = (typeof textureUnit === 'undefined') ? this.gl.TEXTURE0 : textureUnit;
        this.level = (typeof level === 'undefined') ? 0 : level;
        this.internalFormat = (typeof internalFormat === 'undefined') ? this.gl.RGBA : internalFormat;
        this.format = (typeof format === 'undefined') ? this.gl.RGBA : format;
        this.type = (typeof type === 'undefined') ? this.gl.UNSIGNED_BYTE : type;

        this.texture = this.gl.createTexture();
    }

    bindTextureUnit() {
        gl.activeTexture(this.textureUnit);
        this.bind();
    }

    bind() {
        this.gl.bindTexture(this.target, this.texture);
    }

    unbind() {
        this.gl.bindTexture(this.target, null);
    }

    delete() {
        this.gl.deleteTexture(this.texture);
        this.texture = null;
    }

}

module.exports = Texture2d;