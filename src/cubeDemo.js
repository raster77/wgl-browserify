const Vector3 = require('./wgl/Vector3');
const Matrix4 = require('./wgl/Matrix4');
const wglUtils = require('./wgl/wglUtils');
const VertexArrayObject = require('./wgl/VertexArrayObject');
const VertexBufferObject = require('./wgl/VertexBufferObject');
const ShaderProgram = require('./wgl/ShaderProgram');
const mathUtils = require('./wgl/mathUtils');

// https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample5/webgl-demo.js

var cubeRotation = 0.0;
var projectionMatrix = null;

function main() {
    const gl = wglUtils.create(800, 600, 'glCanvas');

    const vsSource = `#version 300 es			
    layout (location=0) in vec3 aPosition;
    layout (location=1) in vec3 aColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    out vec3 outColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
      outColor = aColor;
    }
  `;

    // Fragment shader program

    const fsSource = `#version 300 es
    precision highp float;
    in vec3 outColor;
    out vec4 fragColor;
    void main(void) {
        fragColor = vec4(outColor, 1.0);
    }
  `;
    const shaderProgram = new ShaderProgram(gl, vsSource, fsSource);
    //    shaderProgram.create(vsSource, fsSource);

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl, shaderProgram);

    var then = 0;

    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        drawScene(gl, shaderProgram, buffers, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

/**
 * @param  {WebGLRenderingContext} gl
 * @param  {ShaderProgram} shaderProgram
 */
function initBuffers(gl, shaderProgram) {

    // Create a buffer for the cube's vertex positions.

    const vao = new VertexArrayObject(gl);
    vao.bind();
    const positionBuffer = new VertexBufferObject(gl);

    // Now create an array of positions for the cube.

    const positions = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    positionBuffer.setData(new Float32Array(positions));
    positionBuffer.enableVertexAttribArray(
        shaderProgram.getAttribLocation('aPosition'),
        3,
        gl.FLOAT,
        false,
        0,
        0
    );

    // Now set up the colors for the faces. We'll use solid colors
    // for each face.

    const faceColors = [
        [1.0, 1.0, 1.0, 1.0],    // Front face: white
        [1.0, 0.0, 0.0, 1.0],    // Back face: red
        [0.0, 1.0, 0.0, 1.0],    // Top face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // Left face: purple
    ];

    // Convert the array of colors into a table for all the vertices.

    var colors = [];

    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];

        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = new VertexBufferObject(gl);

    colorBuffer.setData(new Float32Array(colors));
    colorBuffer.enableVertexAttribArray(
        shaderProgram.getAttribLocation('aColor'),
        4,
        gl.FLOAT,
        false,
        0,
        0
    );

    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.

    const indexBuffer = new VertexBufferObject(gl, gl.ELEMENT_ARRAY_BUFFER);
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    const indices = [
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23,   // left
    ];

    // Now send the element array to GL

    indexBuffer.setData(new Uint16Array(indices));

    vao.unbind();

    return {
        vao: vao,
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
    };
}

function getProjectionMatrix(gl) {
    if (!projectionMatrix) {
        const fieldOfView = mathUtils.degToRad(45);
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        projectionMatrix = new Matrix4();
        projectionMatrix.perspective(fieldOfView, aspect, zNear, zFar);
    }
    return projectionMatrix;
}

//
// Draw the scene.
//
function drawScene(gl, shaderProgram, buffers, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = new Matrix4();
    modelViewMatrix.translateFromArray([0, 0, -16]);
    modelViewMatrix.rotate(cubeRotation, new Vector3(1, -1, 2));

    buffers.vao.bind();

    // Tell WebGL which indices to use to index the vertices
    buffers.indices.bind();

    // Tell WebGL to use our program when drawing
    shaderProgram.use();

    // Set the shader uniforms
    shaderProgram.setUniformMat4('uProjectionMatrix', getProjectionMatrix(gl));
    shaderProgram.setUniformMat4('uModelViewMatrix', modelViewMatrix);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    // Update the rotation for the next draw

    cubeRotation += deltaTime;
}

exports.run = main;