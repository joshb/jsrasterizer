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

var rast = new Rasterizer(document.getElementById("framebuffer"));
var clearFramebuffer = true;

var boxes = new Array();
boxes.push(new Box(new Vector4(-1, -1, -1), 1, new Vector4(255, 0, 0)));
boxes.push(new Box(new Vector4(-1, -1, 1), 1, new Vector4(0, 255, 0)));
boxes.push(new Box(new Vector4(-1, 1, -1), 1, new Vector4(0, 0, 255)));
boxes.push(new Box(new Vector4(-1, 1, 1), 1, new Vector4(255, 255, 255)));
boxes.push(new Box(new Vector4(1, -1, -1), 1, new Vector4(64, 64, 64)));
boxes.push(new Box(new Vector4(1, -1, 1), 1, new Vector4(255, 255, 0)));
boxes.push(new Box(new Vector4(1, 1, -1), 1, new Vector4(0, 255, 255)));
boxes.push(new Box(new Vector4(1, 1, 1), 1, new Vector4(255, 0, 255)));

var r = 0.0;
function render()
{
	if(clearFramebuffer)
		rast.clear();

	r += (Math.PI / 180.0) * 2;
	var mr = Matrix4.rollRotation(r);
	var my = Matrix4.yawRotation(-r * 1.5);
	var mt = Matrix4.translation(new Vector4(0, 0, -6));
	rast.setModelviewMatrix(mt.multiply(my.multiply(mr)));

	for(var i = 0; i < boxes.length; ++i)
		boxes[i].render(rast);
}

setInterval(render, 50);

function pixelSizeChanged(pixelSize)
{
	document.getElementById("framebuffer").className = pixelSize.options[pixelSize.selectedIndex].value;
	rast = new Rasterizer(document.getElementById("framebuffer"));
}

function clearFramebufferChanged(clearFramebufferCheckbox)
{
	clearFramebuffer = clearFramebufferCheckbox.checked;
}