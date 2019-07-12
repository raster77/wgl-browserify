/**
 * GlContext
 *
 * @class
 */
class GlContext {
    
    constructor() {
        /** @type {WebGLRenderingContext} */
        this.ctx = null;
    }

    /**
     * Creates a new webgl2 context
     * 
     * @param {number} width canvas width
     * @param {number} height canvas height
     * @param {String} id canvas id
     */
    create(width, height, id) {
        let glCanvas = document.createElement('canvas');
        glCanvas.id = id;
        glCanvas.width = width;
        glCanvas.height = height;
        document.querySelector('body').appendChild(glCanvas);
        
        this.ctx = glCanvas.getContext('webgl2');
        if (!this.ctx) {
            console.error("WebGL 2 not available");
            document.body.innerHTML = "WebGL2 is unavailable on this system."
        }
    }

    /**
     * Creates a new webgl2 context from an existing canvas
     * 
     * @param {String} idCanvas canvas id
     */
    createFromCanvas(idCanvas) {
        this.ctx = document.getElementById(idCanvas).getContext('webgl2');
        if (!this.ctx) {
            console.error("WebGL 2 not available");
            document.body.innerHTML = "WebGL2 is unavailable on this system."
        }
    }

    /**
     * Return gl context
     * @returns {WebGLRenderingContext} ctx
     */
    getContext() {
        return this.ctx;
    }
}

module.exports = GlContext;