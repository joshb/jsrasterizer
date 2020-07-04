/*
 * Copyright (C) 2011 Josh A. Beam
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *   1. Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *   2. Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function Matrix4()
{
	this.matrix = new Array();
	for(var i = 0; i < 4; ++i) {
		for(var j = 0; j < 4; ++j)
			this.matrix.push((i == j) ? 1.0 : 0.0);
	}

	this.multiply = function(matrix)
	{
		var newMatrix = new Matrix4();
		var m = newMatrix.matrix;
		var m1 = this.matrix;
		var m2 = matrix.matrix;

		m[ 0] = m1[ 0]*m2[ 0] + m1[ 1]*m2[ 4] + m1[ 2]*m2[ 8] + m1[ 3]*m2[12];
		m[ 1] = m1[ 0]*m2[ 1] + m1[ 1]*m2[ 5] + m1[ 2]*m2[ 9] + m1[ 3]*m2[13];
		m[ 2] = m1[ 0]*m2[ 2] + m1[ 1]*m2[ 6] + m1[ 2]*m2[10] + m1[ 3]*m2[14];
		m[ 3] = m1[ 0]*m2[ 3] + m1[ 1]*m2[ 7] + m1[ 2]*m2[11] + m1[ 3]*m2[15];
		m[ 4] = m1[ 4]*m2[ 0] + m1[ 5]*m2[ 4] + m1[ 6]*m2[ 8] + m1[ 7]*m2[12];
		m[ 5] = m1[ 4]*m2[ 1] + m1[ 5]*m2[ 5] + m1[ 6]*m2[ 9] + m1[ 7]*m2[13];
		m[ 6] = m1[ 4]*m2[ 2] + m1[ 5]*m2[ 6] + m1[ 6]*m2[10] + m1[ 7]*m2[14];
		m[ 7] = m1[ 4]*m2[ 3] + m1[ 5]*m2[ 7] + m1[ 6]*m2[11] + m1[ 7]*m2[15];
		m[ 8] = m1[ 8]*m2[ 0] + m1[ 9]*m2[ 4] + m1[10]*m2[ 8] + m1[11]*m2[12];
		m[ 9] = m1[ 8]*m2[ 1] + m1[ 9]*m2[ 5] + m1[10]*m2[ 9] + m1[11]*m2[13];
		m[10] = m1[ 8]*m2[ 2] + m1[ 9]*m2[ 6] + m1[10]*m2[10] + m1[11]*m2[14];
		m[11] = m1[ 8]*m2[ 3] + m1[ 9]*m2[ 7] + m1[10]*m2[11] + m1[11]*m2[15];
		m[12] = m1[12]*m2[ 0] + m1[13]*m2[ 4] + m1[14]*m2[ 8] + m1[15]*m2[12];
		m[13] = m1[12]*m2[ 1] + m1[13]*m2[ 5] + m1[14]*m2[ 9] + m1[15]*m2[13];
		m[14] = m1[12]*m2[ 2] + m1[13]*m2[ 6] + m1[14]*m2[10] + m1[15]*m2[14];
		m[15] = m1[12]*m2[ 3] + m1[13]*m2[ 7] + m1[14]*m2[11] + m1[15]*m2[15];

		return newMatrix;
	}

	this.transform = function(v)
	{
		var m = this.matrix;

		var x = m[ 0] * v.x + m[ 1] * v.y + m[ 2] * v.z + m[ 3] * v.w;
		var y = m[ 4] * v.x + m[ 5] * v.y + m[ 6] * v.z + m[ 7] * v.w;
		var z = m[ 8] * v.x + m[ 9] * v.y + m[10] * v.z + m[11] * v.w;
		var w = m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15] * v.w;

		return new Vector4(x, y, z, w);
	}

	this.toString = function()
	{
		var s = "";

		for(var i = 0; i < 4; ++i) {
			if(i != 0)
				s += "\n";
			for(var j = 0; j < 4; ++j) {
				if(j != 0)
					s += " ";
				s += this.matrix[i*4 + j];
			}
		}

		return s;
	}
}

Matrix4.perspective = function(fov, aspect, znear, zfar)
{
	var m = new Matrix4();
	var f = 1.0 / Math.tan(fov / 2.0);
	var zdiff = znear - zfar;

	m.matrix[0] = f / aspect;
	m.matrix[5] = f;
	m.matrix[10] = (zfar + znear) / zdiff;
	m.matrix[11] = -1.0;
	m.matrix[14] = (2.0 * zfar * znear) / zdiff;
	m.matrix[15] = 0.0;

	return m;
}

Matrix4.yawRotation = function(angle)
{
	var m = new Matrix4();

	var c = Math.cos(angle);
	var s = Math.sin(angle);
	m.matrix[0] = c;
	m.matrix[2] = s;
	m.matrix[8] = -s;
	m.matrix[10] = c;

	return m;
}

Matrix4.rollRotation = function(angle)
{
	var m = new Matrix4();

	var c = Math.cos(angle);
	var s = Math.sin(angle);
	m.matrix[0] = c;
	m.matrix[1] = s;
	m.matrix[4] = -s;
	m.matrix[5] = c;

	return m;
}

Matrix4.translation = function(v)
{
	var m = new Matrix4();

	m.matrix[3] = v.x;
	m.matrix[7] = v.y;
	m.matrix[11] = v.z;

	return m;
}
