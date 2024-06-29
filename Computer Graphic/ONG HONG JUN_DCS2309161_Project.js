let canvasWidth = 1280;
let canvasHeight = 720;
const groundY = 550;
const cityWidth = 90;
const cityHeight = 25;
const cityY = groundY - cityHeight;
const siloY = groundY - 40;
const missileSize = 8;
const missileSpeed = 2;
const counterMissileSpeed = 15;
let missiles = [];
let counterMissiles = [];
let explosions = [];
const levels = [ [4, 4] ];
let currLevel = 0;
let currInterval = 0;
let lastTime = -2000;

let cities = [
    { x: 300, y: cityY, alive: true },
    { x: 415, y: cityY, alive: true },
    { x: 530, y: cityY, alive: true },
    { x: 750, y: cityY, alive: true },
    { x: 870, y: cityY, alive: true },
    { x: 990, y: cityY, alive: true },
];

const siloPos = [190, canvasWidth / 2, 1100]; 
let silos = [
  { x: siloPos[0], y: siloY, missiles: 10, alive: true },
  { x: siloPos[1], y: siloY, missiles: 10, alive: true },
  { x: siloPos[2], y: siloY, missiles: 10, alive: true }
];

function setup() {
  createCanvas(1280, 720);
}

function draw() {
  background(0);

  if (remainingTargets().length > 0) {
    if (millis() - lastTime > 3000 && missiles.length < 2) {
      spawnMissiles(2);
      lastTime = millis();
    }
  }

  fill(0, 0, 255);
  cities.forEach(city => {
    if (city.alive) {
      rect(city.x - cityWidth / 2, city.y, cityWidth, cityHeight);
    }
  });

  fill(255, 255, 0);
  beginShape();
  vertex(0, height);
  vertex(0, groundY);
  siloPos.forEach(x => {
    vertex(x - 40, groundY);
    vertex(x - 20, siloY);
    vertex(x + 20, siloY);
    vertex(x + 40, groundY);
  });
  vertex(width, groundY);
  vertex(width, height);
  endShape(CLOSE);

  fill(0);
  silos.forEach(silo => {
    let missilesPerRow = 1;
    let count = 0;
    let x = silo.x;
    let y = silo.y + 5;
    for (let i = 0; i < silo.missiles; i++) {
      rect(x, y, 4, 10);
      x += 12;
      if (++count === missilesPerRow) {
        x = silo.x - 6 * count;
        missilesPerRow++;
        y += 7;
        count = 0;
      }
    }
  });

  stroke(255, 0, 0);
  strokeWeight(2);
  fill((Math.round(millis() / 2) % 2 === 0) ? 0 : 255);

  missiles.forEach(missile => {
    missile.pos.x += missile.dx;
    missile.pos.y += missile.dy;

    explosions.forEach(explosion => {
      const dist = distance(explosion, missile.pos);
      if (dist < missileSize + explosion.size) {
        missile.alive = false;
      }
    });

    const dist = distance(missile.pos, missile.target);
    if (dist < missileSpeed) {
      missile.alive = false;
      missile.target.alive = false;
    }

    if (missile.alive) {
      line(missile.start.x, missile.start.y, missile.pos.x, missile.pos.y);
      rect(missile.pos.x - missileSize / 2, missile.pos.y - missileSize / 2, missileSize, missileSize);
    } else {
      explosions.push({ x: missile.pos.x, y: missile.pos.y, size: 2, dir: 1, alive: true });
    }
  });

  stroke(0, 0, 255);
  fill(255);
  counterMissiles.forEach(missile => {
    missile.pos.x += missile.dx;
    missile.pos.y += missile.dy;

    const dist = distance(missile.pos, missile.target);
    if (dist < counterMissileSpeed) {
      missile.alive = false;
      explosions.push({ x: missile.pos.x, y: missile.pos.y, size: 2, dir: 1, alive: true });
    } else {
      line(missile.start.x, missile.start.y, missile.pos.x, missile.pos.y);
      rect(missile.pos.x - 2, missile.pos.y - 2, 4, 4);
    }
  });

  explosions.forEach(explosion => {
    explosion.size += 0.35 * explosion.dir;
    if (explosion.size > 30) {
      explosion.dir = -1;
    }
    if (explosion.size <= 0) {
      explosion.alive = false;
    } else {
      fill((Math.round(millis() / 3) % 2 === 0) ? 0 : 0, 0, 255);
      ellipse(explosion.x, explosion.y, explosion.size * 2);
    }
  });

  missiles = missiles.filter(missile => missile.alive);
  counterMissiles = counterMissiles.filter(missile => missile.alive);
  explosions = explosions.filter(explosion => explosion.alive);
  cities = cities.filter(city => city.alive);
  silos = silos.filter(silo => silo.alive);
}

function mousePressed() {
  const x = mouseX;
  const y = mouseY;
  let launchSilo = null;
  let siloDistance = Infinity;
  silos.forEach(silo => {
    const dist = distance({ x, y }, silo);
    if (dist < siloDistance && silo.missiles) {
      siloDistance = dist;
      launchSilo = silo;
    }
  });
  if (launchSilo) {
    const start = { x: launchSilo.x, y: launchSilo.y };
    const target = { x, y };
    const angle = angleBetweenPoints(start, target);
    launchSilo.missiles--;
    counterMissiles.push({
      start,
      target,
      pos: { x: launchSilo.x, y: launchSilo.y },
      dx: counterMissileSpeed * sin(angle),
      dy: counterMissileSpeed * -cos(angle),
      alive: true
    });
  }
}

function spawnMissiles(numMissiles) {
  const missileSpawns = cities
    .concat(silos)
    .concat([{ x: 0, y: 0 }, { x: canvasWidth, y: 0 }])
    .map(pos => ({ x: pos.x, y: 0 }));

  const targets = remainingTargets();
  for (let i = 0; i < numMissiles; i++) {
    if (targets.length > 0) {
      const randSpawn = randInt(0, missileSpawns.length - 1);
      const randTarget = randInt(0, targets.length - 1);
      const start = missileSpawns[randSpawn];
      const target = targets[randTarget];
      const angle = angleBetweenPoints(start, target);
      missiles.push({
        start,
        target,
        pos: { x: start.x, y: start.y },
        alive: true,
        dx: missileSpeed * sin(angle),
        dy: missileSpeed * -cos(angle)
      });
    }
  }
}

function remainingTargets() {
  return cities.concat(silos).filter(target => target.alive);
}

function randInt(min, max) {
  return floor(random() * (max - min + 1)) + min;
}

function angleBetweenPoints(source, target) {
  return atan2(target.y - source.y, target.x - source.x) + PI / 2;
}

function distance(source, target) {
  return dist(source.x, source.y, target.x, target.y);
}