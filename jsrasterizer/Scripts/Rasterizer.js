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

function Edge(color1, x1, y1, z1, color2, x2, y2, z2)
{
	if(y1 < y2) {
		this.color1 = color1;
		this.x1 = x1;
		this.y1 = y1;
		this.z1 = z1;
		this.color2 = color2;
		this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;
	} else {
		this.color1 = color2;
		this.x1 = x2;
		this.y1 = y2;
		this.z1 = z2;
		this.color2 = color1;
		this.x2 = x1;
		this.y2 = y1;
		this.z2 = z1;
	}
}

function Span(color1, x1, z1, color2, x2, z2)
{
	if(x1 < x2) {
		this.color1 = color1;
		this.x1 = x1;
		this.z1 = z1;
		this.color2 = color2;
		this.x2 = x2;
		this.z2 = z2;
	} else {
		this.color1 = color2;
		this.x1 = x2;
		this.z1 = z2;
		this.color2 = color1;
		this.x2 = x1;
		this.z2 = z1;
	}
}

function Rasterizer(container)
{
	var ZNEAR = 0.1;
	var ZFAR = 2000.0;

	var m_width = 0, m_height = 0;
	var m_centerX = 0, m_centerY = 0;

	var m_pixels = null;
	var m_depth = null;

	var m_modelviewMatrix = null;
	var m_projectionMatrix = null;

	function construct()
	{
		buildPixels();

		m_modelviewMatrix = new Matrix4();
		m_projectionMatrix = Matrix4.perspective(Math.PI / 2.0, m_width / m_height, ZNEAR, ZFAR);
	}

	function buildPixels()
	{
		// remove all existing pixels
		while(container.hasChildNodes())
			container.removeChild(container.firstChild);

		m_pixels = new Array();

		// create first pixel
		var pixel = document.createElement("div");
		pixel.className = "pixel";
		pixel.style.left = "0px";
		pixel.style.top = "0px";
		container.appendChild(pixel);
		m_pixels.push(pixel);

		var pixelWidth = pixel.offsetWidth;
		var pixelHeight = pixel.offsetHeight;

		// create the rest of the pixels
		var framebufferWidth = container.offsetWidth;
		var framebufferHeight = container.offsetHeight;
		m_width = parseInt(framebufferWidth / pixelWidth) + 1;
		m_height = parseInt(framebufferHeight / pixelHeight) + 1;
		m_centerX = m_width / 2;
		m_centerY = m_height / 2;
		for(var y = 0; y < m_height; ++y) {
			for(var x = ((y == 0) ? 1 : 0); x < m_width; ++x) {
				pixel = document.createElement("div");
				pixel.className = "pixel";
				pixel.style.left = (x * pixelWidth) + "px";
				pixel.style.top = (y * pixelHeight) + "px";
				container.appendChild(pixel);
				m_pixels.push(pixel);
			}
		}

		// create depth buffer
		m_depth = new Array();
		for(var i = 0; i < m_width * m_height; ++i)
			m_depth.push(1.0);
	}

	function setPixel(x, y, z, color)
	{
		// make sure the x/y coordinates are valid
		if(x < 0 || x >= m_width || y < 0 || y >= m_height)
			return;

		// make sure the depth isn't greater than
		// the depth of the currently stored pixel
		var index = parseInt(m_width * parseInt(y) + parseInt(x));
		if(z > m_depth[index])
			return;

		// set the color and depth of the pixel
		m_pixels[index].style.backgroundColor = color.toColorString();
		m_depth[index] = z;
	}

	function drawSpan(span, y)
	{
		var xdiff = span.x2 - span.x1;
		if(xdiff == 0)
			return;

		var colordiff = span.color2.subtract(span.color1);
		var zdiff = span.z2 - span.z1;

		var factor = 0.0;
		var factorStep = 1.0 / xdiff;

		// draw each pixel in the span
		for(var x = span.x1; x < span.x2; ++x) {
			setPixel(x, y, span.z1 + zdiff * factor, span.color1.add(colordiff.scale(factor)));
			factor += factorStep;
		}
	}

	function drawSpansBetweenEdges(e1, e2)
	{
		// calculate difference between the y coordinates
		// of the first edge and return if 0
		var e1ydiff = e1.y2 - e1.y1;
		if(e1ydiff == 0)
			return;

		// calculate difference between the y coordinates
		// of the second edge and return if 0
		var e2ydiff = e2.y2 - e2.y1;
		if(e2ydiff == 0)
			return;

		// calculate differences between the x/z coordinates
		// and colors of the points of the edges
		var e1xdiff = e1.x2 - e1.x1;
		var e2xdiff = e2.x2 - e2.x1;
		var e1zdiff = e1.z2 - e1.z1;
		var e2zdiff = e2.z2 - e2.z1;
		var e1colordiff = e1.color2.subtract(e1.color1);
		var e2colordiff = e2.color2.subtract(e2.color1);

		// calculate factors to use for interpolation
		// with the edges and the step values to increase
		// them by after drawing each span
		var factor1 = (e2.y1 - e1.y1) / e1ydiff;
		var factorStep1 = 1.0 / e1ydiff;
		var factor2 = 0.0;
		var factorStep2 = 1.0 / e2ydiff;

		// loop through the lines between the edges and draw spans
		for(var y = e2.y1; y < e2.y2; ++y) {
			// create and draw span
			var span = new Span(e1.color1.add(e1colordiff.scale(factor1)),
			                    e1.x1 + (e1xdiff * factor1),
			                    e1.z1 + (e1zdiff * factor1),
			                    e2.color1.add(e2colordiff.scale(factor2)),
			                    e2.x1 + (e2xdiff * factor2),
			                    e2.z1 + (e2zdiff * factor2));
			drawSpan(span, y);

			// increase factors
			factor1 += factorStep1;
			factor2 += factorStep2;
		}
	}

	function drawTriangle(color1, v1, color2, v2, color3, v3)
	{
		// creates edges for the triangle
		var edges = [
			new Edge(color1, v1.x, v1.y, v1.z, color2, v2.x, v2.y, v2.z),
			new Edge(color2, v2.x, v2.y, v2.z, color3, v3.x, v3.y, v3.z),
			new Edge(color3, v3.x, v3.y, v3.z, color1, v1.x, v1.y, v1.z)
		];

		var maxLength = 0;
		var longEdge = 0;

		// find edge with the greatest length in the y axis
		for(var i = 0; i < 3; ++i) {
			var length = edges[i].y2 - edges[i].y1;
			if(length > maxLength) {
				maxLength = length;
				longEdge = i;
			}
		}

		var shortEdge1 = (longEdge + 1) % 3;
		var shortEdge2 = (longEdge + 2) % 3;

		// draw spans between edges; the long edge can be drawn
		// with the shorter edges to draw the full triangle
		drawSpansBetweenEdges(edges[longEdge], edges[shortEdge1]);
		drawSpansBetweenEdges(edges[longEdge], edges[shortEdge2]);
	}

	function projectVertex(vertex)
	{
		var v = m_modelviewMatrix.transform(vertex);
		v = m_projectionMatrix.transform(v);
		if(v.z < ZNEAR)
			return null;

		v = v.scale(1.0 / v.w);

		var cx = m_centerX;
		var cy = m_centerY;
		return new Vector4(cx + cx * v.x, cy - cy * v.y, v.z / ZFAR, v.w);
	}

	function drawTriangle3D(color1, v1, color2, v2, color3, v3)
	{
		v1 = projectVertex(new Vector4(v1.x, v1.y, v1.z, 1.0));
		v2 = projectVertex(new Vector4(v2.x, v2.y, v2.z, 1.0));
		v3 = projectVertex(new Vector4(v3.x, v3.y, v3.z, 1.0));

		if(v1 == null || v2 == null || v3 == null)
			return;

		drawTriangle(color1, v1, color2, v2, color3, v3);
	}

	function drawQuad3D(color1, v1, color2, v2, color3, v3, color4, v4)
	{
		drawTriangle3D(color1, v1, color2, v2, color3, v3);
		drawTriangle3D(color3, v3, color2, v2, color4, v4);
	}

	function drawLine(color1, x1, y1, color2, x2, y2)
	{
		var xdiff = x2 - x1;
		var ydiff = y2 - y1;

		if(xdiff == 0 && ydiff == 0) {
			setPixel(x1, y1, 0.0, color1);
			return;
		}

		if(Math.abs(xdiff) > Math.abs(ydiff)) {
			var xmin, xmax;

			// set xmin to the lower x value given
			// and xmax to the higher value
			if(x1 < x2) {
				xmin = x1;
				xmax = x2;
			} else {
				xmin = x2;
				xmax = x1;
			}

			// draw line in terms of y slope
			var slope = ydiff / xdiff;
			for(var x = xmin; x <= xmax; ++x) {
				var y = y1 + ((x - x1) * slope);
				var color = color1.add(color2.subtract(color1).scale((x - x1) / xdiff));
				setPixel(x, y, 0.0, color);
			}
		} else {
			var ymin, ymax;

			// set ymin to the lower y value given
			// and ymax to the higher value
			if(y1 < y2) {
				ymin = y1;
				ymax = y2;
			} else {
				ymin = y2;
				ymax = y1;
			}

			// draw line in terms of x slope
			var slope = xdiff / ydiff;
			for(var y = ymin; y <= ymax; ++y) {
				var x = x1 + ((y - y1) * slope);
				var color = color1.add(color2.subtract(color1).scale((y - y1) / ydiff));
				setPixel(x, y, 0.0, color);
			}
		}
	}

	this.getWidth = function()
	{
		return m_width;
	}

	this.getHeight = function()
	{
		return m_height;
	}

	this.clear = function()
	{
		for(var i = 0; i < m_pixels.length; ++i) {
			m_pixels[i].style.backgroundColor = "transparent";
			m_depth[i] = 1.0;
		}
	}

	this.setModelviewMatrix = function(m)
	{
		m_modelviewMatrix = m;
	}

	this.drawTriangle = drawTriangle;
	this.drawTriangle3D = drawTriangle3D;
	this.drawQuad3D = drawQuad3D;
	this.drawLine = drawLine;

	construct();
}
