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

function Vector4(x, y, z, w)
{
	this.x = (x != null) ? x : 0.0;
	this.y = (y != null) ? y : 0.0;
	this.z = (z != null) ? z : 0.0;
	this.w = (w != null) ? w : 0.0;

	this.add = function(v)
	{
		return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
	}

	this.subtract = function(v)
	{
		return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
	}

	this.multiply = function(v)
	{
		return new Vector4(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w);
	}

	this.scale = function(f)
	{
		return new Vector4(this.x * f, this.y * f, this.z * f, this.w * f);
	}

	this.toString = function()
	{
		return this.x + "," + this.y + "," + this.z + "," + this.w;
	}

	this.toColorString = function()
	{
		return "rgb(" + parseInt(this.x) + "," + parseInt(this.y) + "," + parseInt(this.z) + ")";
	}
}
