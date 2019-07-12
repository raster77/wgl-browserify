/**
* Creates a new webgl2 context
* 
* @param {number} width canvas width
* @param {number} height canvas height
* @param {String} id canvas id
* @returns {WebGL2RenderingContext}
*/
function create(width, height, id) {
    let glCanvas = document.createElement('canvas');
    glCanvas.id = id;
    glCanvas.width = width;
    glCanvas.height = height;
    document.querySelector('body').appendChild(glCanvas);

    const ctx = glCanvas.getContext('webgl2');
    if (!ctx) {
        console.error("WebGL 2 not available");
        document.body.innerHTML = "WebGL2 is unavailable on this system."
    }

    return ctx;
}

/**
 * Creates a new webgl2 context from an existing canvas
 * 
 * @param {String} idCanvas canvas id
 * @returns {WebGL2RenderingContext}
 */
function createFromCanvas(idCanvas) {
    const ctx = document.getElementById(idCanvas).getContext('webgl2');
    if (!ctx) {
        console.error("WebGL 2 not available");
        document.body.innerHTML = "WebGL2 is unavailable on this system."
    }
    return ctx;
}

exports.create = create;
exports.createFromCanvas = createFromCanvas;