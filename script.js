document.addEventListener("DOMContentLoaded", function() {
    const fireButton = document.getElementById('fireButton');
    let canvasCreated = false;
    let canvas, ctx;

    function createCanvas() {
        canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');

        // Adjust the canvas size and position
        canvas.width = window.innerWidth;
        canvas.height = 200;  // Height of the fireworks area
        canvas.style.position = 'fixed';
        canvas.style.bottom = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';  // Allows clicking through the canvas
        canvas.style.zIndex = '1000';  // Ensures it is above other content but below overlays

        canvasCreated = true;
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function Firework() {
        this.x = random(0, canvas.width);
        this.y = canvas.height + 10;
        this.color = `hsl(${random(0, 360)}, 100%, 50%)`;
        this.particles = [];

        this.explode = function() {
            for (let i = 0; i < 30; i++) {
                this.particles.push(new Particle(this.x, this.y - 10, this.color));
            }
        };

        this.update = function() {
            this.particles = this.particles.filter(p => p.lifeSpan > 0);
            this.particles.forEach(p => p.update());
        };

        this.draw = function() {
            this.particles.forEach(p => p.draw());
        };
    }

    function Particle(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = random(-3, 3);
        this.vy = random(-2, -5);
        this.lifeSpan = random(30, 60);
        this.color = color;

        this.update = function() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.04;  // Gravity
            this.lifeSpan--;
        };

        this.draw = function() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        };
    }

    let fireworks = [];

    function loop() {
        if (canvasCreated) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear only the part of the canvas

            fireworks.forEach(fw => {
                fw.update();
                fw.draw();
            });

            fireworks = fireworks.filter(fw => fw.particles.length > 0);

            if (fireworks.length > 0) {
                requestAnimationFrame(loop);
            }
        }
    }

    fireButton.addEventListener('click', function() {
        if (!canvasCreated) createCanvas();
        let firework = new Firework();
        firework.explode();
        fireworks.push(firework);
        requestAnimationFrame(loop);
    });
});
