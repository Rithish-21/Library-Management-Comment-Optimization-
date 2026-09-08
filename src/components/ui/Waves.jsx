import React, { useRef, useEffect } from 'react';
import './Waves.css';
class Grad {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    dot2(x, y) {
        return this.x * x + this.y * y;
    }
}
class Noise {
    grad3;
    p;
    perm;
    gradP;
    constructor(seed = 0) {
        this.grad3 = [
            new Grad(1, 1, 0),
            new Grad(-1, 1, 0),
            new Grad(1, -1, 0),
            new Grad(-1, -1, 0),
            new Grad(1, 0, 1),
            new Grad(-1, 0, 1),
            new Grad(1, 0, -1),
            new Grad(-1, 0, -1),
            new Grad(0, 1, 1),
            new Grad(0, -1, 1),
            new Grad(0, 1, -1),
            new Grad(0, -1, -1)
        ];
        this.p = [
            151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240,
            21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88,
            237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83,
            111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216,
            80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
            3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58,
            17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
            129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193,
            238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
            184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128,
            195, 78, 66, 215, 61, 156, 180
        ];
        this.perm = new Array(512);
        this.gradP = new Array(512);
        this.seed(seed);
    }
    seed(seed) {
        if (seed > 0 && seed < 1)
            seed *= 65536;
        seed = Math.floor(seed);
        if (seed < 256)
            seed |= seed << 8;
        for (let i = 0; i < 256; i++) {
            const v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
            this.perm[i] = this.perm[i + 256] = v;
            this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
        }
    }
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }
    perlin2(x, y) {
        let X = Math.floor(x);
        let Y = Math.floor(y);
        x -= X;
        y -= Y;
        X &= 255;
        Y &= 255;
        const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
        const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
        const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
        const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
        const u = this.fade(x);
        return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
    }
}
export const Waves = ({ lineColor = 'rgba(99, 102, 241, 0.3)', backgroundColor = 'transparent', waveSpeedX = 0.0125, waveSpeedY = 0.005, waveAmpX = 32, waveAmpY = 16, xGap = 12, yGap = 32, friction = 0.925, tension = 0.005, maxCursorMove = 100, style = {}, className = '' }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const boundingRef = useRef({ width: 0, height: 0, left: 0, top: 0 });
    const noiseRef = useRef(new Noise(Math.random()));
    const linesRef = useRef([]);
    const mouseRef = useRef({
        x: -10,
        y: 0,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        v: 0,
        vs: 0,
        a: 0,
        set: false
    });
    const configRef = useRef({
        lineColor,
        waveSpeedX,
        waveSpeedY,
        waveAmpX,
        waveAmpY,
        friction,
        tension,
        maxCursorMove,
        xGap,
        yGap
    });
    const frameIdRef = useRef(null);
    useEffect(() => {
        configRef.current = {
            lineColor,
            waveSpeedX,
            waveSpeedY,
            waveAmpX,
            waveAmpY,
            friction,
            tension,
            maxCursorMove,
            xGap,
            yGap
        };
    }, [lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove, xGap, yGap]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container)
            return;
        ctxRef.current = canvas.getContext('2d');
        function setSize() {
            if (!container || !canvas)
                return;
            boundingRef.current = container.getBoundingClientRect();
            canvas.width = boundingRef.current.width || 500;
            canvas.height = boundingRef.current.height || 500;
        }
        function setLines() {
            const { width, height } = boundingRef.current;
            linesRef.current = [];
            const oWidth = width + 200;
            const oHeight = height + 30;
            const { xGap: curXGap, yGap: curYGap } = configRef.current;
            const totalLines = Math.ceil(oWidth / curXGap);
            const totalPoints = Math.ceil(oHeight / curYGap);
            const xStart = (width - curXGap * totalLines) / 2;
            const yStart = (height - curYGap * totalPoints) / 2;
            for (let i = 0; i <= totalLines; i++) {
                const pts = [];
                for (let j = 0; j <= totalPoints; j++) {
                    pts.push({
                        x: xStart + curXGap * i,
                        y: yStart + curYGap * j,
                        wave: { x: 0, y: 0 },
                        cursor: { x: 0, y: 0, vx: 0, vy: 0 }
                    });
                }
                linesRef.current.push(pts);
            }
        }
        function movePoints(time) {
            const lines = linesRef.current;
            const mouse = mouseRef.current;
            const noise = noiseRef.current;
            const { waveSpeedX: wsX, waveSpeedY: wsY, waveAmpX: waX, waveAmpY: waY, friction: f, tension: ten, maxCursorMove: mcm } = configRef.current;
            lines.forEach((pts) => {
                pts.forEach((p) => {
                    const move = noise.perlin2((p.x + time * wsX) * 0.002, (p.y + time * wsY) * 0.0015) * 12;
                    p.wave.x = Math.cos(move) * waX;
                    p.wave.y = Math.sin(move) * waY;
                    const dx = p.x - mouse.sx;
                    const dy = p.y - mouse.sy;
                    const dist = Math.hypot(dx, dy);
                    const l = Math.max(175, mouse.vs);
                    if (dist < l) {
                        const s = 1 - dist / l;
                        const force = Math.cos(dist * 0.001) * s;
                        p.cursor.vx += Math.cos(mouse.a) * force * l * mouse.vs * 0.00065;
                        p.cursor.vy += Math.sin(mouse.a) * force * l * mouse.vs * 0.00065;
                    }
                    p.cursor.vx += (0 - p.cursor.x) * ten;
                    p.cursor.vy += (0 - p.cursor.y) * ten;
                    p.cursor.vx *= f;
                    p.cursor.vy *= f;
                    p.cursor.x += p.cursor.vx * 2;
                    p.cursor.y += p.cursor.vy * 2;
                    p.cursor.x = Math.min(mcm, Math.max(-mcm, p.cursor.x));
                    p.cursor.y = Math.min(mcm, Math.max(-mcm, p.cursor.y));
                });
            });
        }
        function moved(point, withCursor = true) {
            const x = point.x + point.wave.x + (withCursor ? point.cursor.x : 0);
            const y = point.y + point.wave.y + (withCursor ? point.cursor.y : 0);
            return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
        }
        function drawLines() {
            const { width, height } = boundingRef.current;
            const ctx = ctxRef.current;
            if (!ctx)
                return;
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            ctx.strokeStyle = configRef.current.lineColor;
            ctx.lineWidth = 1.2;
            linesRef.current.forEach((points) => {
                if (!points[0])
                    return;
                let p1 = moved(points[0], false);
                ctx.moveTo(p1.x, p1.y);
                points.forEach((p, idx) => {
                    const isLast = idx === points.length - 1;
                    p1 = moved(p, !isLast);
                    const p2 = moved(points[idx + 1] || points[points.length - 1], !isLast);
                    ctx.lineTo(p1.x, p1.y);
                    if (isLast)
                        ctx.moveTo(p2.x, p2.y);
                });
            });
            ctx.stroke();
        }
        function tick(t) {
            const mouse = mouseRef.current;
            mouse.sx += (mouse.x - mouse.sx) * 0.1;
            mouse.sy += (mouse.y - mouse.sy) * 0.1;
            const dx = mouse.x - mouse.lx;
            const dy = mouse.y - mouse.ly;
            const d = Math.hypot(dx, dy);
            mouse.v = d;
            mouse.vs += (d - mouse.vs) * 0.1;
            mouse.vs = Math.min(100, mouse.vs);
            mouse.lx = mouse.x;
            mouse.ly = mouse.y;
            mouse.a = Math.atan2(dy, dx);
            if (container) {
                container.style.setProperty('--x', `${mouse.sx}px`);
                container.style.setProperty('--y', `${mouse.sy}px`);
            }
            movePoints(t);
            drawLines();
            frameIdRef.current = requestAnimationFrame(tick);
        }
        function onResize() {
            setSize();
            setLines();
        }
        function updateMouse(clientX, clientY) {
            const mouse = mouseRef.current;
            const b = boundingRef.current;
            mouse.x = clientX - b.left;
            mouse.y = clientY - b.top;
            if (!mouse.set) {
                mouse.sx = mouse.x;
                mouse.sy = mouse.y;
                mouse.lx = mouse.x;
                mouse.ly = mouse.y;
                mouse.set = true;
            }
        }
        function onMouseMove(e) {
            updateMouse(e.clientX, e.clientY);
        }
        function onTouchMove(e) {
            if (!e.touches[0])
                return;
            updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        }
        setSize();
        setLines();
        frameIdRef.current = requestAnimationFrame(tick);
        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
        };
    }, []);
    return (<div ref={containerRef} className={`waves ${className}`} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor,
            ...style
        }}>
      <canvas ref={canvasRef} className="waves-canvas"/>
    </div>);
};
export default Waves;
