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

    const gl = wglUtils.create(window.innerWidth, window.innerHeight, 'glCanvas');

    const vsSource = `#version 300 es			
    layout (location=0) in vec3 aPosition;
    layout (location=1) in vec3 aVertexNormal;
    layout (location=2) in vec2 aTextureCoord;
    
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    out vec2 outTexCoord;
    out vec3 outLight;

    void main(void) {

        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
        outTexCoord = aTextureCoord;
  
        // Apply lighting effect
  
        vec3 ambientLight = vec3(0.3, 0.3, 0.3);
        vec3 directionalLightColor = vec3(1, 1, 1);
        vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
  
        vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  
        float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        outLight = ambientLight + (directionalLightColor * directional);
    }
  `;

    // Fragment shader program

    const fsSource = `#version 300 es
    precision highp float;
    
    in vec2 outTexCoord;
    in vec3 outLight;

    out vec4 fragColor;

    uniform sampler2D uSampler;

    void main(void) {
      vec4 texelColor = texture(uSampler, outTexCoord);
      fragColor = vec4(texelColor.rgb * outLight, texelColor.a);
    }
  `;

    const shaderProgram = new ShaderProgram(gl, vsSource, fsSource);

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl, shaderProgram);

    const texture = loadTexture(gl, 'texture.jpg');

    var then = 0;

    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        drawScene(gl, shaderProgram, buffers, texture, deltaTime);

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
    const vertexBuffer = new VertexBufferObject(gl);

    // Now create an array of positions for the cube.

    const vertices = [
        // Vertex(3) Normals(3) Uvs(2)
        // Front
        -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0,
        1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0,
        // Back
        -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        -1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 0.0,
        1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0,
        1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0,
        // Top
        -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 0.0,
        -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0,
        1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        // Bottom
        -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 0.0,
        1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 1.0, 0.0,
        1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 1.0,
        -1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 1.0,
        // Right
        1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 0.0,
        1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
        // Left
        -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0,
        -1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 1.0,
        -1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0
    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    // 8 elements * size of float (4)
    const stride = 8 * 4;
    let offset = 0;

    vertexBuffer.setData(new Float32Array(vertices));
    vertexBuffer.enableVertexAttribArray(
        shaderProgram.getAttribLocation('aPosition'),
        3,
        gl.FLOAT,
        false,
        stride,
        offset
    );

    offset += 3 * 4;

    vertexBuffer.enableVertexAttribArray(
        shaderProgram.getAttribLocation('aVertexNormal'),
        3,
        gl.FLOAT,
        false,
        stride,
        offset
    );

    offset += 3 * 4;

    vertexBuffer.enableVertexAttribArray(
        shaderProgram.getAttribLocation('aTextureCoord'),
        2,
        gl.FLOAT,
        false,
        stride,
        offset
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
/**
 * @param  {WebGL2RenderingContext} gl
 * @param  {ShaderProgram} shaderProgram
 * @param  {VertexBufferObject} buffers
 * @param  {} texture
 * @param  {number} deltaTime
 */
function drawScene(gl, shaderProgram, buffers, texture, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = new Matrix4();
    modelViewMatrix.translateFromArray([0, 0, -10]);
    modelViewMatrix.rotate(cubeRotation, new Vector3(1, -1, 2));

    const normalMatrix = modelViewMatrix.clone().invert().transpose();

    buffers.vao.bind();
    // Tell WebGL which indices to use to index the vertices
    buffers.indices.bind();

    // Tell WebGL to use our program when drawing
    shaderProgram.use();

    // Set the shader uniforms

    shaderProgram.setUniformMat4('uProjectionMatrix', getProjectionMatrix(gl));
    shaderProgram.setUniformMat4('uModelViewMatrix', modelViewMatrix);
    shaderProgram.setUniformMat4('uNormalMatrix', normalMatrix);

    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell the shader we bound the texture to texture unit 0
    shaderProgram.setUniform1i('uSampler', 0);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    // Update the rotation for the next draw
    cubeRotation += deltaTime;
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 126]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn of mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

exports.run = main;