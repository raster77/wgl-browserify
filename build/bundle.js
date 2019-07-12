(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * App laucher
 * Called js must have an exports.run = method;
*/
const app = require('./cubeLightDemo');

app.run();

},{"./cubeLightDemo":2}],2:[function(require,module,exports){
const Vector3 = require('./wgl/Vector3');

const Matrix4 = require('./wgl/Matrix4');

const wglUtils = require('./wgl/wglUtils');

const VertexArrayObject = require('./wgl/VertexArrayObject');

const VertexBufferObject = require('./wgl/VertexBufferObject');

const ShaderProgram = require('./wgl/ShaderProgram');

const mathUtils = require('./wgl/mathUtils'); // https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample5/webgl-demo.js


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
  `; // Fragment shader program

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
  const shaderProgram = new ShaderProgram(gl, vsSource, fsSource); // Here's where we call the routine that builds all the
  // objects we'll be drawing.

  const buffers = initBuffers(gl, shaderProgram);
  const texture = loadTexture(gl, 'texture.jpg');
  var then = 0;
  gl.enable(gl.DEPTH_TEST); // Enable depth testing

  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  // Draw the scene repeatedly

  function render(now) {
    now *= 0.001; // convert to seconds

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
  const vertexBuffer = new VertexBufferObject(gl); // Now create an array of positions for the cube.

  const vertices = [// Vertex(3) Normals(3) Uvs(2)
  // Front
  -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, // Back
  -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 0.0, 1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.0, 1.0, // Top
  -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.0, 1.0, // Bottom
  -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.0, 0.0, 1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 1.0, 0.0, 1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 1.0, -1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.0, 1.0, // Right
  1.0, -1.0, -1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, -1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, // Left
  -1.0, -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0, -1.0, -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0, -1.0, 1.0, 1.0, -1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 0.0, 0.0, 0.0, 1.0]; // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  // 8 elements * size of float (4)

  const stride = 8 * 4;
  let offset = 0;
  vertexBuffer.setData(new Float32Array(vertices));
  vertexBuffer.enableVertexAttribArray(shaderProgram.getAttribLocation('aPosition'), 3, gl.FLOAT, false, stride, offset);
  offset += 3 * 4;
  vertexBuffer.enableVertexAttribArray(shaderProgram.getAttribLocation('aVertexNormal'), 3, gl.FLOAT, false, stride, offset);
  offset += 3 * 4;
  vertexBuffer.enableVertexAttribArray(shaderProgram.getAttribLocation('aTextureCoord'), 2, gl.FLOAT, false, stride, offset); // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = new VertexBufferObject(gl, gl.ELEMENT_ARRAY_BUFFER); // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [0, 1, 2, 0, 2, 3, // front
  4, 5, 6, 4, 6, 7, // back
  8, 9, 10, 8, 10, 11, // top
  12, 13, 14, 12, 14, 15, // bottom
  16, 17, 18, 16, 18, 19, // right
  20, 21, 22, 20, 22, 23]; // Now send the element array to GL

  indexBuffer.setData(new Uint16Array(indices));
  vao.unbind();
  return {
    vao: vao,
    indices: indexBuffer
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
} //
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
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque

  gl.clearDepth(1.0); // Clear everything

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Set the drawing position to the "identity" point, which is
  // the center of the scene.

  const modelViewMatrix = new Matrix4();
  modelViewMatrix.translateFromArray([0, 0, -10]);
  modelViewMatrix.rotate(cubeRotation, new Vector3(1, -1, 2));
  const normalMatrix = modelViewMatrix.clone().invert().transpose();
  buffers.vao.bind(); // Tell WebGL which indices to use to index the vertices

  buffers.indices.bind(); // Tell WebGL to use our program when drawing

  shaderProgram.use(); // Set the shader uniforms

  shaderProgram.setUniformMat4('uProjectionMatrix', getProjectionMatrix(gl));
  shaderProgram.setUniformMat4('uModelViewMatrix', modelViewMatrix);
  shaderProgram.setUniformMat4('uNormalMatrix', normalMatrix);
  gl.activeTexture(gl.TEXTURE0); // Bind the texture to texture unit 0

  gl.bindTexture(gl.TEXTURE_2D, texture); // Tell the shader we bound the texture to texture unit 0

  shaderProgram.setUniform1i('uSampler', 0);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0); // Update the rotation for the next draw

  cubeRotation += deltaTime;
} //
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//


function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture); // Because images have to be download over the internet
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
  const pixel = new Uint8Array([0, 0, 255, 126]); // opaque blue

  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
  const image = new Image();

  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image); // WebGL1 has different requirements for power of 2 images
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
  return (value & value - 1) == 0;
}

exports.run = main;

},{"./wgl/Matrix4":3,"./wgl/ShaderProgram":4,"./wgl/Vector3":5,"./wgl/VertexArrayObject":6,"./wgl/VertexBufferObject":7,"./wgl/mathUtils":8,"./wgl/wglUtils":9}],3:[function(require,module,exports){
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
    let a00 = this.datas[0],
        a01 = this.datas[1],
        a02 = this.datas[2],
        a03 = this.datas[3];
    let a10 = this.datas[4],
        a11 = this.datas[5],
        a12 = this.datas[6],
        a13 = this.datas[7];
    let a20 = this.datas[8],
        a21 = this.datas[9],
        a22 = this.datas[10],
        a23 = this.datas[11];
    let a30 = this.datas[12],
        a31 = this.datas[13],
        a32 = this.datas[14],
        a33 = this.datas[15];
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
    let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

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
    let a01 = this.datas[1],
        a02 = this.datas[2],
        a03 = this.datas[3];
    let a12 = this.datas[6],
        a13 = this.datas[7];
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
    a23 = this.datas[11]; // Construct the elements of the rotation matrix

    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

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
      if (i < 15) str += ',';
    }

    return str;
  }

}

module.exports = Matrix4;

},{"./Vector3":5}],4:[function(require,module,exports){
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
    this.gl.uniformMatrix4fv(uniformsMap.get(name), false, mat4.toFloat32Array());
  }
  /**
   * @param  {String} name
   * @param  {number} value
   */


  setUniform1i(name, value) {
    this.gl.uniform1i(uniformsMap.get(name), false, value);
  }
  /**
   * @param  {String} name
   * @param  {number} value
   */


  setUniform1f(name, value) {
    this.gl.uniform1f(uniformsMap.get(name), false, value);
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

},{"./Matrix4":3}],5:[function(require,module,exports){
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
    return 'Vector3(' + this.datas[0] + ', ' + this.datas[1] + ', ' + this.datas[2] + ')';
  }

}

module.exports = Vector3;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
    this.target = typeof target === 'undefined' ? gl.ARRAY_BUFFER : target;
    this.usage = typeof usage === 'undefined' ? gl.STATIC_DRAW : usage;
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
    this.gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
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

},{}],8:[function(require,module,exports){
const DEG = 180.0 / Math.PI;
const RAD = Math.PI / 180.0;

function radToDeg(r) {
  return r * DEG;
}

function degToRad(d) {
  return d * RAD;
}

module.exports.radToDeg = radToDeg;
module.exports.degToRad = degToRad;

},{}],9:[function(require,module,exports){
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
    document.body.innerHTML = "WebGL2 is unavailable on this system.";
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
    document.body.innerHTML = "WebGL2 is unavailable on this system.";
  }

  return ctx;
}

exports.create = create;
exports.createFromCanvas = createFromCanvas;

},{}]},{},[1]);
