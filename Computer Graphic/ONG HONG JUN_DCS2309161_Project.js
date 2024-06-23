let centerX = 640;
let centerY = 360;
let frame = 0;
let animationPhase = 0;
const totalFrames = 130;
const stopFrames = 60;  // Number of frames to stop (1 second if 60 FPS)
const rotationSpeed = 3.2 / totalFrames; // Rotation speed per frame
let bgImage; // Declare a global variable for the background image

function preload() {
    bgImage = loadImage('logo.jpg'); // Load the image
}

function setup() {
    createCanvas(1280, 720);
    strokeWeight(2);
    noFill();
}

function draw() {
    background(0);


    function drawHexagon(x, y, size, angleX, angleY) {
        const hexVertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const vertexX = size * cos(angle);
            const vertexY = size * sin(angle);

            // Apply 3D rotation
            const rotatedX = vertexX * cos(angleY) - vertexY * sin(angleY);
            const rotatedY = vertexX * sin(angleY) + vertexY * cos(angleY);
            const rotatedZ = rotatedY * sin(angleX);

            const perspective = 400 / (400 - rotatedZ); // Simple perspective calculation

            hexVertices.push({ x: x + rotatedX * perspective, y: y + rotatedY * perspective });
        }
        return hexVertices;
    }

    function drawLines(centerX, centerY, vertices) {
        vertices.forEach(vertex => {
            line(centerX, centerY, vertex.x, vertex.y);
        });
    }

    function drawHexagonWithLines(centerX, centerY, size, color, angleX = 0, angleY = 0, rotation = 0) {
        push();
        translate(centerX, centerY);
        rotate(rotation);  // Apply rotation
        stroke(color);
        rotate(HALF_PI);

        const hexVertices = drawHexagon(0, 0, size, angleX, angleY);
        beginShape();
        hexVertices.forEach(v => vertex(v.x, v.y));
        endShape(CLOSE);

        drawLines(0, 0, hexVertices);
        for (let i = 0; i < hexVertices.length; i++) {
            const startVertex = hexVertices[i];
            const endVertex = hexVertices[(i + 1) % hexVertices.length];
            line(startVertex.x, startVertex.y, endVertex.x, endVertex.y);
        }
        pop();
    }

    function drawCenterHexagon(centerX, centerY, size, color, angleX = 0, angleY = 0, rotation = 0) {
        push();
        translate(centerX, centerY);
        rotate(rotation);  // Apply rotation
        stroke(color);
        rotate(HALF_PI);

        const hexVertices = drawHexagon(0, 0, size, angleX, angleY);
        beginShape();
        hexVertices.forEach(v => vertex(v.x, v.y));
        endShape(CLOSE);

        drawLines(0, 0, hexVertices);
        for (let i = 0; i < hexVertices.length; i++) {
            const startVertex = hexVertices[i];
            const endVertex = hexVertices[(i + 1) % hexVertices.length];
            line(startVertex.x, startVertex.y, endVertex.x, endVertex.y);
        }
        pop();
    }

    let angleX = frame * rotationSpeed;
    let angleY = frame * rotationSpeed;

    if (animationPhase === 0) {
        drawCenterHexagon(centerX, centerY, 100, 'white');
        if (frame >= totalFrames) {
            animationPhase = 1;
            frame = 0;
        }
    } else if (animationPhase === 1) {
        let t = frame / totalFrames;
        let firstHexX = lerp(centerX, 466, t);
        let firstHexY = lerp(centerY, 260, t);
        let thirdHexX = lerp(centerX, 813, t);
        let thirdHexY = lerp(centerY, 460, t);
        let rotation = 200;  // 180-degree anticlockwise rotation

        drawHexagonWithLines(firstHexX, firstHexY, 100, 'red', angleX,angleY,  rotation); // Left
        drawCenterHexagon(centerX, centerY, 100, 'green', angleX,angleY, rotation); // Center
        drawHexagonWithLines(thirdHexX, thirdHexY, 100, 'blue', angleX,angleY, rotation); // Right
        if (frame >= totalFrames) {
            animationPhase = 2;
            frame = 0;
        }
    } else if (animationPhase === 2) {
        // Stop for a second (60 frames)
        drawHexagonWithLines(466, 260, 100, 'red', 0, 0, Math.PI); // Left
        drawCenterHexagon(centerX, centerY, 100, 'green',0,0,Math.PI); // Center
        drawHexagonWithLines(813, 460, 100, 'blue', 0, 0, Math.PI); // Right

        if (frame >= stopFrames) {
            animationPhase = 3;
            frame = 0;
        }
    } else if (animationPhase === 3) {
        let t = frame / totalFrames;
        let firstHexX = lerp(466, 640, t);
        let firstHexY = lerp(260, 160, t);
        let thirdHexX = lerp(813, 640, t);
        let thirdHexY = lerp(460, 560, t);
        let rotation = 200;  // 180-degree clockwise rotation back to 360 degrees (or 0)

        drawHexagonWithLines(firstHexX, firstHexY, 100, 'red', angleX, angleY, rotation); // Left
        drawCenterHexagon(centerX, centerY, 100, 'green', angleX, angleY, rotation); // Center
        drawHexagonWithLines(thirdHexX, thirdHexY, 100, 'blue', angleX, angleY, rotation); // Right

        if (frame >= totalFrames) {
            animationPhase = 4;
            frame = 0;
        }
    } else if (animationPhase === 4) {
        // Stop for a second (60 frames)
        drawHexagonWithLines(640, 160, 100, 'red', 0, 0, Math.PI); // Left
        drawCenterHexagon(centerX, centerY, 100, 'green',0,0,Math.PI); // Center
        drawHexagonWithLines(640, 560, 100, 'blue', 0, 0, Math.PI); // Right

        if (frame >= stopFrames) {
            animationPhase = 5;
            frame = 0;
        }
    } else if (animationPhase === 5) {
        let t = frame / totalFrames;
        let firstHexX = lerp(640, centerX, t);
        let firstHexY = lerp(160, centerY, t);
        let thirdHexX = lerp(640, centerX, t);
        let thirdHexY = lerp(560, centerY, t);
        let rotation = -200;  // Maintain 360-degree rotation (or 0)

        drawHexagonWithLines(firstHexX, firstHexY, 100, 'red', angleX, angleY, rotation);
        drawCenterHexagon(centerX, centerY, 100, 'green', angleX, angleY, rotation); // Center
        drawHexagonWithLines(thirdHexX, thirdHexY, 100, 'blue', angleX, angleY, rotation);
        if (frame >= totalFrames) {
            animationPhase = 6;
            frame = 0;
        }
    } else if (animationPhase === 6) {
        // Draw single white hexagon in the center
        drawCenterHexagon(centerX, centerY, 100, 'white');
        if (frame >= totalFrames) {
            animationPhase = 7;
            frame = 0;
        }
    }else if (animationPhase === 7) {
        image(bgImage, 500, 200, 300, 300); // Draw the background image
        if (frame >= totalFrames) {
            animationPhase = 1;
            frame = 0;
        }
    }
    

    frame++;
}
