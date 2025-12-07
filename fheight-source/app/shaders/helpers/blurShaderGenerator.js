/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const template = require('./blurShaderTemplate.hbs');
const _ = require('underscore');
const glslify = require('glslify');

// nvidia suggests kernel size = sigma * 3
// we'll use sigma * 2 for increased performance
const SIGMA_KERNEL_RATIO = 2.0;

// kernel size shouldn't dip below 5x5
const MIN_KERNEL_SIZE = 5.0;

class BlurShaderGenerator {

  static compileShader(name,sigma,kernelSize=null){
    if (sigma == null) { sigma = 2.0; }
    const blurProgram = new cc.GLProgram();
    blurProgram.initWithVertexShaderByteArray(glslify("./PosTexVertex.glsl"), this.generateFragmentShaderCode(sigma,kernelSize));
    blurProgram.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
    blurProgram.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
    blurProgram.link();
    blurProgram.updateUniforms();
    blurProgram.loc_xStep = blurProgram.getUniformLocationForName("u_xStep");
    blurProgram.loc_yStep = blurProgram.getUniformLocationForName("u_yStep");
    return cc.shaderCache.addProgram(blurProgram, name);
  }

  static generateFragmentShaderCode(sigma, kernelSize=null){
    if ((kernelSize == null)) {
      // calculate kernel size from sigma
      kernelSize = sigma * SIGMA_KERNEL_RATIO;
    }

    // kernel size must always be odd and never below minimum
    kernelSize = Math.max(MIN_KERNEL_SIZE, (kernelSize + 1.0) - (kernelSize % 2));

    // generate brightness from sigma and kernel size
    // blur shaders are low-pass and tend to reduce brightness
    // we'll roughly approximate a boost to brightness
    // where the higher the sigma and kernel size, the higher the boost
    const expectedKernelSize = Math.max(MIN_KERNEL_SIZE, ((sigma * SIGMA_KERNEL_RATIO) + 1.0) - ((sigma * SIGMA_KERNEL_RATIO) % 2.0));
    const brightness = parseFloat(1.0 + (sigma/4/100.0) + ((kernelSize * ((kernelSize / expectedKernelSize) - 1.0)) / 2000.0));

    // generate kernel
    const kernel = this.generateKernel(sigma,kernelSize,1000);
    const kernel1d = _.map(kernel, kColumn => { return this.roundTo(kColumn[1], 6); });
    const kernelRows = _.map(kernel1d, function(value,i) {
      const offset = i - Math.ceil(kernelSize/2);
      return {
        "offset": parseFloat(Math.abs(offset)).toFixed(1),
        "value": parseFloat(value).toFixed(6),
        "operator": (offset < 0) ? "-" : "+"
      };
  });

    // generate code from template
    const shaderCode = template({
      "kernelRows":kernelRows,
      "brightness": brightness.toFixed(3)
    });

    return shaderCode;
  }

  static gaussianDistribution(x, mu, sigma) {
    const d = x - mu;
    const n = 1.0 / (Math.sqrt(2 * Math.PI) * sigma);
    return Math.exp((-d * d) / (2 * sigma * sigma)) * n;
  }

  static sampleInterval(f, minInclusive, maxInclusive, sampleCount) {
    const result = [];
    const stepSize = (maxInclusive - minInclusive) / (sampleCount - 1);
    let s = 0;
    while (s < sampleCount) {
      var x = minInclusive + (s * stepSize);
      var y = f(x);
      result.push([
        x,
        y
      ]);
      ++s;
    }
    return result;
  }

  static integrateSimphson(samples) {
    let result = samples[0][1] + samples[samples.length - 1][1];
    let s = 1;
    while (s < (samples.length - 1)) {
      var sampleWeight = (s % 2) === 0 ? 2.0 : 4.0;
      result += sampleWeight * samples[s][1];
      ++s;
    }
    const h = (samples[samples.length - 1][0] - (samples[0][0])) / (samples.length - 1);
    return (result * h) / 3.0;
  }

  static roundTo(num, decimals) {
    const shift = Math.pow(10, decimals);
    return Math.round(num * shift) / shift;
  }

  static calcSamplesForRange(sigma, minInclusive, maxInclusive, samplesPerBin) {
    const f = x => this.gaussianDistribution(x, 0, sigma);
    return this.sampleInterval(f, minInclusive, maxInclusive, samplesPerBin);
  }

  static generateKernel(sigma, kernelSize, sampleCount) {
    let samplesPerBin = Math.ceil(sampleCount / kernelSize);
    if ((samplesPerBin % 2) === 0) {
      ++samplesPerBin;
    }
    let weightSum = 0;
    const kernelLeft = -Math.floor(kernelSize / 2);

    // get samples left and right of kernel support first
    const outsideSamplesLeft = this.calcSamplesForRange(sigma ,-5 * sigma, kernelLeft - 0.5,samplesPerBin);
    const outsideSamplesRight = this.calcSamplesForRange(sigma, -kernelLeft + 0.5, 5 * sigma,samplesPerBin);
    const allSamples = [ [
      outsideSamplesLeft,
      0
    ] ];
    // now sample kernel taps and calculate tap weights
    let tap = 0;
    while (tap < kernelSize) {
      var left = (kernelLeft - 0.5) + tap;
      var tapSamples = this.calcSamplesForRange(sigma, left, left + 1,samplesPerBin);
      var tapWeight = this.integrateSimphson(tapSamples);
      allSamples.push([
        tapSamples,
        tapWeight
      ]);
      weightSum += tapWeight;
      ++tap;
    }
    allSamples.push([
      outsideSamplesRight,
      0
    ]);
    // renormalize kernel and round to 6 decimals
    let i = 0;
    while (i < allSamples.length) {
      allSamples[i][1] = this.roundTo(allSamples[i][1] / weightSum, 6);
      ++i;
    }

    return allSamples;
  }
}

module.exports = BlurShaderGenerator;
