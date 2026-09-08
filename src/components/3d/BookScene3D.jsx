import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Pause, Play, BookOpen, Globe2, Compass } from 'lucide-react';
export const BookScene3D = ({ className = '' }) => {
    const containerRef = useRef(null);
    const [variation, setVariation] = useState('shelf');
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [selectedBookIndex, setSelectedBookIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    // Mutable refs for animation loop
    const variationRef = useRef('shelf');
    const isAutoRotatingRef = useRef(true);
    const selectedBookIndexRef = useRef(0);
    useEffect(() => {
        variationRef.current = variation;
    }, [variation]);
    useEffect(() => {
        isAutoRotatingRef.current = isAutoRotating;
    }, [isAutoRotating]);
    useEffect(() => {
        selectedBookIndexRef.current = selectedBookIndex;
    }, [selectedBookIndex]);
    useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const width = container.clientWidth || 520;
        const height = container.clientHeight || 480;
        // 1. Core Three.js Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0.5, 6.2);
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);
        // Raycaster for interactive clicking on books
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        // 2. Lighting Rig
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
        scene.add(ambientLight);
        const keyLight = new THREE.DirectionalLight(0xfef08a, 3.5);
        keyLight.position.set(5, 7, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        scene.add(keyLight);
        const cyanFillLight = new THREE.PointLight(0x38bdf8, 3.2, 12);
        cyanFillLight.position.set(-4, -1, 3);
        scene.add(cyanFillLight);
        const violetRimLight = new THREE.PointLight(0xc084fc, 3.5, 10);
        violetRimLight.position.set(3, -3, -3);
        scene.add(violetRimLight);
        const amberCoreLight = new THREE.PointLight(0xf59e0b, 2.8, 8);
        amberCoreLight.position.set(0, 0.2, 0.8);
        scene.add(amberCoreLight);
        // 3. Texture Helpers
        const createSpineCanvasTexture = (title, subtitle, baseColor, accentColor) => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Spine gradient
                const grad = ctx.createLinearGradient(0, 0, 256, 1024);
                grad.addColorStop(0, '#0f172a');
                grad.addColorStop(0.4, baseColor);
                grad.addColorStop(0.8, baseColor);
                grad.addColorStop(1, '#020617');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 256, 1024);
                // Gold embossed bands
                ctx.fillStyle = accentColor;
                [80, 180, 840, 940].forEach((y) => {
                    ctx.fillRect(16, y, 224, 10);
                    ctx.fillStyle = '#ffffff';
                    ctx.globalAlpha = 0.5;
                    ctx.fillRect(16, y + 2, 224, 2);
                    ctx.globalAlpha = 1.0;
                    ctx.fillStyle = accentColor;
                });
                // Vertical Title
                ctx.save();
                ctx.translate(128, 512);
                ctx.rotate(Math.PI / 2);
                ctx.textAlign = 'center';
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 36px "Times New Roman", Times, serif';
                ctx.fillText(title, 0, -8);
                ctx.fillStyle = accentColor;
                ctx.font = 'bold 22px monospace';
                ctx.fillText(subtitle, 0, 28);
                ctx.restore();
                // Publisher Seal
                ctx.fillStyle = accentColor;
                ctx.font = 'bold 30px "Times New Roman", Times, serif';
                ctx.textAlign = 'center';
                ctx.fillText('✦ AGY ✦', 128, 900);
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.anisotropy = 4;
            return tex;
        };
        const createCoverCanvasTexture = (title, sub, baseColor, accentColor) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 768;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const grad = ctx.createLinearGradient(0, 0, 512, 768);
                grad.addColorStop(0, '#0f172a');
                grad.addColorStop(0.5, baseColor);
                grad.addColorStop(1, '#020617');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 512, 768);
                // Gold border
                ctx.strokeStyle = accentColor;
                ctx.lineWidth = 6;
                ctx.strokeRect(24, 24, 464, 720);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(34, 34, 444, 700);
                // Title
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 42px "Times New Roman", Times, serif';
                ctx.textAlign = 'center';
                ctx.fillText(title, 256, 180);
                ctx.fillStyle = accentColor;
                ctx.font = 'bold 20px monospace';
                ctx.fillText(sub, 256, 225);
                // Central Icon / Emblem
                ctx.beginPath();
                ctx.arc(256, 380, 80, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                ctx.fill();
                ctx.strokeStyle = accentColor;
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 64px sans-serif';
                ctx.fillText('📖', 256, 402);
                // Footer
                ctx.fillStyle = '#cbd5e1';
                ctx.font = '16px monospace';
                ctx.fillText('LIBRARY MANAGEMENT COMMENT OPTIMIZATION', 256, 680);
            }
            return new THREE.CanvasTexture(canvas);
        };
        const createPageEdgeTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#fef3c7';
                ctx.fillRect(0, 0, 256, 256);
                for (let y = 0; y < 256; y += 4) {
                    ctx.fillStyle = Math.random() > 0.5 ? '#f59e0b' : '#e2e8f0';
                    ctx.globalAlpha = 0.35;
                    ctx.fillRect(0, y, 256, 2);
                }
            }
            const tex = new THREE.CanvasTexture(canvas);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(2, 1);
            return tex;
        };
        const pageEdgeTex = createPageEdgeTexture();
        const pageEdgeMat = new THREE.MeshStandardMaterial({
            map: pageEdgeTex,
            roughness: 0.7,
            metalness: 0.2,
        });
        // =========================================================================
        // VARIATION 1: 3D FLOATING BOOKS (shelfGroup - No Bookshelf, Pure Floating Books)
        // =========================================================================
        const shelfGroup = new THREE.Group();
        // Books metadata (Floating Books)
        const shelfBooksData = [
            {
                title: 'ALGORITHMS',
                sub: 'O(log n) // VOL 1',
                baseColor: '#1e3a8a',
                accentColor: '#38bdf8',
                width: 0.42,
                height: 2.8,
                depth: 1.45,
                lean: -0.06,
            },
            {
                title: 'AI & ML CORE',
                sub: 'NEURAL NETS',
                baseColor: '#065f46',
                accentColor: '#34d399',
                width: 0.48,
                height: 3.1,
                depth: 1.5,
                lean: 0,
            },
            {
                title: 'CLOUD DEVOPS',
                sub: 'DOCKER // K8S',
                baseColor: '#581c87',
                accentColor: '#c084fc',
                width: 0.52,
                height: 2.9,
                depth: 1.42,
                lean: 0,
            },
            {
                title: 'DATABASE SYS',
                sub: 'IN-MEMORY STORE',
                baseColor: '#78350f',
                accentColor: '#fbbf24',
                width: 0.44,
                height: 3.2,
                depth: 1.55,
                lean: 0.05,
            },
            {
                title: 'RUST SYSTEMS',
                sub: 'ZERO COST ABSTR',
                baseColor: '#881337',
                accentColor: '#f43f5e',
                width: 0.38,
                height: 2.7,
                depth: 1.38,
                lean: 0.12,
            },
        ];
        const shelfBookMeshes = [];
        const shelfBookBaseZ = [];
        let currentShelfX = -1.55;
        shelfBooksData.forEach((bData, idx) => {
            const spineTex = createSpineCanvasTexture(bData.title, bData.sub, bData.baseColor, bData.accentColor);
            const coverTex = createCoverCanvasTexture(bData.title, bData.sub, bData.baseColor, bData.accentColor);
            const spineMaterial = new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.3, metalness: 0.3 });
            const coverMaterial = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.3, metalness: 0.3 });
            // Box face order: Right, Left, Top, Bottom, Front, Back
            // For books standing facing outwards, spine is facing the front (+Z)
            const bookMaterials = [
                coverMaterial, // Right
                coverMaterial, // Left
                pageEdgeMat, // Top
                pageEdgeMat, // Bottom
                spineMaterial, // Front (facing viewer on the shelf!)
                pageEdgeMat, // Back
            ];
            const bGeo = new THREE.BoxGeometry(bData.width, bData.height, bData.depth);
            const bMesh = new THREE.Mesh(bGeo, bookMaterials);
            bMesh.castShadow = true;
            bMesh.receiveShadow = true;
            const posX = currentShelfX + bData.width / 2;
            const posY = 0; // Floating centered vertically
            const posZ = 0;
            bMesh.position.set(posX, posY, posZ);
            bMesh.rotation.z = bData.lean;
            bMesh.userData = { index: idx, defaultZ: posZ };
            shelfGroup.add(bMesh);
            shelfBookMeshes.push(bMesh);
            shelfBookBaseZ.push(posZ);
            currentShelfX += bData.width + 0.16;
        });
        scene.add(shelfGroup);
        // =========================================================================
        // VARIATION 2: HOLOGRAPHIC OPEN GRIMOIRE (grimoireGroup)
        // =========================================================================
        const grimoireGroup = new THREE.Group();
        grimoireGroup.visible = false;
        // Curved Open Book Geometry
        const openPagesGeo = new THREE.PlaneGeometry(3.8, 2.6, 32, 16);
        const posAttr = openPagesGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const px = posAttr.getX(i);
            const pz = -Math.cos((px / 1.9) * (Math.PI / 2)) * 0.35 + 0.35;
            posAttr.setZ(i, pz);
        }
        openPagesGeo.computeVertexNormals();
        const createGrimoireOpenPagesTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1536;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Deep parchment background with golden edges
                const grad = ctx.createLinearGradient(0, 0, 1536, 1024);
                grad.addColorStop(0, '#0f172a');
                grad.addColorStop(0.5, '#1e1b4b');
                grad.addColorStop(1, '#0f172a');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 1536, 1024);
                // Gold border margins
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 6;
                ctx.strokeRect(40, 40, 680, 944);
                ctx.strokeRect(816, 40, 680, 944);
                // Spine Crevice shadow
                const shadow = ctx.createLinearGradient(700, 0, 836, 0);
                shadow.addColorStop(0, 'rgba(0,0,0,0)');
                shadow.addColorStop(0.5, 'rgba(0,0,0,0.85)');
                shadow.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = shadow;
                ctx.fillRect(700, 0, 136, 1024);
                // Left Page Content (Holographic Binary Search Diagram)
                ctx.fillStyle = '#38bdf8';
                ctx.font = 'bold 32px "Times New Roman", Times, serif';
                ctx.fillText('✦ LOGARITHMIC SEARCH MATRIX ✦', 80, 120);
                ctx.fillStyle = '#fde047';
                ctx.font = 'bold 20px monospace';
                ctx.fillText('COMPLEXITY: O(log n) < 0.05ms', 80, 165);
                // Tree node graphics on left page
                ctx.strokeStyle = '#818cf8';
                ctx.lineWidth = 3;
                ctx.beginPath();
                // Root node
                ctx.arc(380, 280, 36, 0, Math.PI * 2);
                // Children
                ctx.moveTo(350, 305);
                ctx.lineTo(240, 400);
                ctx.moveTo(410, 305);
                ctx.lineTo(520, 400);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(240, 420, 30, 0, Math.PI * 2);
                ctx.arc(520, 420, 30, 0, Math.PI * 2);
                ctx.stroke();
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 18px monospace';
                ctx.fillText('ROOT [Mid]', 330, 285);
                ctx.fillText('L: < Key', 200, 425);
                ctx.fillText('R: > Key', 480, 425);
                ctx.fillStyle = '#94a3b8';
                ctx.font = '18px monospace';
                const codeSnippets = [
                    'low = 0, high = catalog.length - 1;',
                    'while (low <= high) {',
                    '  mid = (low + high) >> 1;',
                    '  if (match(catalog[mid])) return mid;',
                    '  catalog[mid] < target ? low++ : high--;',
                    '}',
                    '// Zero shelf traversal delay',
                ];
                codeSnippets.forEach((line, i) => {
                    ctx.fillText(line, 80, 560 + i * 36);
                });
                // Right Page Content (Real-time Circulation & Guardrails)
                ctx.fillStyle = '#f59e0b';
                ctx.font = 'bold 32px "Times New Roman", Times, serif';
                ctx.fillText('✦ AUTOMATED CIRCULATION ENGINE ✦', 860, 120);
                ctx.fillStyle = '#34d399';
                ctx.font = 'bold 20px monospace';
                ctx.fillText('FINE RATE: $5 / OVERDUE CALENDAR DAY', 860, 165);
                const rightSnippets = [
                    '// Real-Time Calendar Timestamp Diff',
                    'days = ceil((returnDate - dueDate) / 86400000);',
                    'fine = max(0, days * 5.00);',
                    '',
                    '// Concurrency Guardrails (PRD Sec 4.2)',
                    'inventory[title] > 0 ? issue() : waitlist.push();',
                    'deduplicate_isbn(new_entry);',
                    'in_memory_state.snapshot();',
                ];
                ctx.fillStyle = '#e2e8f0';
                ctx.font = '18px monospace';
                rightSnippets.forEach((line, i) => {
                    ctx.fillText(line, 860, 240 + i * 36);
                });
                // Footer stamps
                ctx.fillStyle = '#fde047';
                ctx.font = '18px monospace';
                ctx.fillText('ANTIGRAVITY ARCHIVE // FOLIO 042', 80, 940);
                ctx.fillText('VERIFIED SYSTEM PROTOCOL 2026', 860, 940);
            }
            return new THREE.CanvasTexture(canvas);
        };
        const grimoirePagesMat = new THREE.MeshStandardMaterial({
            map: createGrimoireOpenPagesTexture(),
            roughness: 0.35,
            metalness: 0.2,
        });
        const grimoirePagesMesh = new THREE.Mesh(openPagesGeo, grimoirePagesMat);
        grimoirePagesMesh.castShadow = true;
        grimoireGroup.add(grimoirePagesMesh);
        // Hardcover Base Tray
        const grimoireCoverGeo = new THREE.BoxGeometry(3.9, 2.7, 0.1);
        const grimoireCoverMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.6 });
        const grimoireCover = new THREE.Mesh(grimoireCoverGeo, grimoireCoverMat);
        grimoireCover.position.set(0, 0, -0.06);
        grimoireGroup.add(grimoireCover);
        // Vertical Holographic Vortex Light Spire
        const spireGeo = new THREE.CylinderGeometry(0.2, 1.2, 3.2, 32, 1, true);
        const spireMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
        });
        const spireMesh = new THREE.Mesh(spireGeo, spireMat);
        spireMesh.position.set(0, 1.4, 0.2);
        grimoireGroup.add(spireMesh);
        // Golden Floating Concentric Rune Rings above book
        const grimoireRingGeo1 = new THREE.RingGeometry(1.2, 1.25, 64);
        const grimoireRingMat1 = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
        });
        const grimoireRing1 = new THREE.Mesh(grimoireRingGeo1, grimoireRingMat1);
        grimoireRing1.position.set(0, 1.1, 0.3);
        grimoireRing1.rotation.x = Math.PI / 2;
        grimoireGroup.add(grimoireRing1);
        const grimoireRingGeo2 = new THREE.RingGeometry(1.6, 1.64, 64);
        const grimoireRingMat2 = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
        });
        const grimoireRing2 = new THREE.Mesh(grimoireRingGeo2, grimoireRingMat2);
        grimoireRing2.position.set(0, 1.6, 0.4);
        grimoireRing2.rotation.x = Math.PI / 2.2;
        grimoireGroup.add(grimoireRing2);
        // Lie the open book at a comfortable 40-degree tilted angle
        grimoireGroup.position.set(0, -0.4, 0);
        grimoireGroup.rotation.set(0.65, 0, 0);
        scene.add(grimoireGroup);
        // =========================================================================
        // VARIATION 3: ORBITING BOOK GALAXY (orbitalGroup)
        // =========================================================================
        const orbitalGroup = new THREE.Group();
        orbitalGroup.visible = false;
        // Glowing Central Core (Icosahedron Knowledge Crystal)
        const coreGeo = new THREE.IcosahedronGeometry(0.85, 2);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.8,
            roughness: 0.1,
            metalness: 0.9,
        });
        const coreCrystal = new THREE.Mesh(coreGeo, coreMat);
        orbitalGroup.add(coreCrystal);
        // Outer Wireframe Cage around Core
        const cageGeo = new THREE.IcosahedronGeometry(1.15, 1);
        const cageMat = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            wireframe: true,
            transparent: true,
            opacity: 0.45,
        });
        const cageMesh = new THREE.Mesh(cageGeo, cageMat);
        orbitalGroup.add(cageMesh);
        // 4 Orbiting Book Satellites
        const orbitSatellites = [];
        const orbitRadii = [2.2, 2.6, 3.0, 2.4];
        const orbitSpeeds = [0.8, -0.65, 0.5, -0.75];
        const orbitInclinations = [0.25, -0.35, 0.5, -0.2];
        const orbitColors = [0x38bdf8, 0xf59e0b, 0xc084fc, 0x10b981];
        for (let i = 0; i < 4; i++) {
            const satPivot = new THREE.Group();
            satPivot.rotation.x = orbitInclinations[i];
            satPivot.rotation.z = (i * Math.PI) / 4;
            // Small Book Satellite Model
            const miniBookGeo = new THREE.BoxGeometry(0.6, 0.85, 0.16);
            const miniBookMat = new THREE.MeshStandardMaterial({
                color: orbitColors[i],
                roughness: 0.25,
                metalness: 0.4,
            });
            const miniBook = new THREE.Mesh(miniBookGeo, miniBookMat);
            miniBook.position.x = orbitRadii[i];
            miniBook.rotation.y = Math.PI / 4;
            satPivot.add(miniBook);
            // Orbit trail ring
            const trailGeo = new THREE.RingGeometry(orbitRadii[i] - 0.02, orbitRadii[i] + 0.02, 64);
            const trailMat = new THREE.MeshBasicMaterial({
                color: orbitColors[i],
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending,
            });
            const trailMesh = new THREE.Mesh(trailGeo, trailMat);
            trailMesh.rotation.x = Math.PI / 2;
            satPivot.add(trailMesh);
            orbitalGroup.add(satPivot);
            orbitSatellites.push(satPivot);
        }
        scene.add(orbitalGroup);
        // =========================================================================
        // VARIATION 4: ISOMETRIC SMART LIBRARY HUB (isometricGroup)
        // =========================================================================
        const isometricGroup = new THREE.Group();
        isometricGroup.visible = false;
        // Isometric Base Floor Platform
        const floorGeo = new THREE.BoxGeometry(4.2, 0.2, 4.2);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.2,
            metalness: 0.8,
        });
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.position.y = -1.2;
        floorMesh.receiveShadow = true;
        isometricGroup.add(floorMesh);
        // Neon Floor Grid
        const gridHelper = new THREE.GridHelper(4.2, 10, 0x38bdf8, 0x1e293b);
        gridHelper.position.y = -1.09;
        isometricGroup.add(gridHelper);
        // Floating books hovering freely around terminal (no bulky bookshelf tower)
        const isoBooksData = [
            { color: 0x38bdf8, pos: [-1.4, 0.6, -0.6], rot: [0.1, 0.4, -0.2] },
            { color: 0xf59e0b, pos: [-1.5, 0.1, 0.2], rot: [-0.1, 0.2, 0.15] },
            { color: 0xc084fc, pos: [-1.3, -0.4, 0.9], rot: [0.2, -0.3, 0.1] },
            { color: 0x10b981, pos: [-0.8, 0.9, -0.3], rot: [0.0, 0.5, -0.1] },
            { color: 0xf43f5e, pos: [-0.5, 0.3, 1.0], rot: [0.15, -0.2, 0.25] },
        ];
        const isoBookMeshes = [];
        isoBooksData.forEach((ib) => {
            const bGeo = new THREE.BoxGeometry(0.36, 0.52, 0.14);
            const bMat = new THREE.MeshStandardMaterial({
                color: ib.color,
                roughness: 0.3,
                metalness: 0.4,
            });
            const m = new THREE.Mesh(bGeo, bMat);
            m.position.set(ib.pos[0], ib.pos[1], ib.pos[2]);
            m.rotation.set(ib.rot[0], ib.rot[1], ib.rot[2]);
            m.castShadow = true;
            isometricGroup.add(m);
            isoBookMeshes.push(m);
        });
        // Center Terminal Pedestal
        const pedestalGeo = new THREE.CylinderGeometry(0.45, 0.55, 0.8, 16);
        const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
        const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
        pedestal.position.set(0.4, -0.7, 0.4);
        isometricGroup.add(pedestal);
        // Floating Hologram Holographic Book above Terminal
        const holoBookGeo = new THREE.BoxGeometry(0.7, 0.9, 0.2);
        const holoBookMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            wireframe: true,
            transparent: true,
            opacity: 0.8,
        });
        const holoBook = new THREE.Mesh(holoBookGeo, holoBookMat);
        holoBook.position.set(0.4, 0.2, 0.4);
        isometricGroup.add(holoBook);
        // Light pool on terminal
        const terminalLight = new THREE.PointLight(0x38bdf8, 2.5, 4);
        terminalLight.position.set(0.4, 0.6, 0.4);
        isometricGroup.add(terminalLight);
        // Isometric orientation
        isometricGroup.rotation.set(0.48, -0.65, 0.2);
        scene.add(isometricGroup);
        // =========================================================================
        // 4. CELESTIAL BACKGROUND PARTICLES
        // =========================================================================
        const particlesCount = 200;
        const pPositions = new Float32Array(particlesCount * 3);
        const pColors = new Float32Array(particlesCount * 3);
        const palette = [
            new THREE.Color(0x38bdf8),
            new THREE.Color(0xf59e0b),
            new THREE.Color(0xc084fc),
            new THREE.Color(0x10b981),
            new THREE.Color(0xffffff),
        ];
        for (let i = 0; i < particlesCount; i++) {
            const idx = i * 3;
            pPositions[idx] = (Math.random() - 0.5) * 10;
            pPositions[idx + 1] = (Math.random() - 0.5) * 8;
            pPositions[idx + 2] = (Math.random() - 0.5) * 7;
            const c = palette[Math.floor(Math.random() * palette.length)];
            pColors[idx] = c.r;
            pColors[idx + 1] = c.g;
            pColors[idx + 2] = c.b;
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
        const pMat = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending,
        });
        const particlesMesh = new THREE.Points(pGeo, pMat);
        scene.add(particlesMesh);
        // =========================================================================
        // 5. POINTER & INTERACTION CONTROLS
        // =========================================================================
        const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        let isDragging = false;
        let prevPointer = { x: 0, y: 0 };
        let manualRotY = 0;
        let manualRotX = 0;
        const handlePointerMove = (e) => {
            const rect = container.getBoundingClientRect();
            const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
            mouse.targetX = nx;
            mouse.targetY = ny;
            pointer.x = nx;
            pointer.y = ny;
            if (isDragging) {
                const dx = e.clientX - prevPointer.x;
                const dy = e.clientY - prevPointer.y;
                manualRotY += dx * 0.008;
                manualRotX = Math.max(-0.5, Math.min(0.5, manualRotX + dy * 0.008));
                prevPointer = { x: e.clientX, y: e.clientY };
            }
        };
        const handlePointerDown = (e) => {
            isDragging = true;
            prevPointer = { x: e.clientX, y: e.clientY };
            // Raycast test for clicking books in shelf mode
            if (variationRef.current === 'shelf') {
                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObjects(shelfBookMeshes);
                if (intersects.length > 0) {
                    const clickedBook = intersects[0].object;
                    const bookIndex = clickedBook.userData.index;
                    if (bookIndex !== undefined) {
                        setSelectedBookIndex(bookIndex === selectedBookIndexRef.current ? null : bookIndex);
                    }
                }
            }
        };
        const handlePointerUp = () => {
            isDragging = false;
        };
        container.addEventListener('pointermove', handlePointerMove);
        container.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointerup', handlePointerUp);
        const handleResize = () => {
            if (!container)
                return;
            const w = container.clientWidth || 520;
            const h = container.clientHeight || 480;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);
        // =========================================================================
        // 6. ANIMATION LOOP
        // =========================================================================
        let animationFrameId;
        const clock = new THREE.Clock();
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();
            const curVar = variationRef.current;
            // Mouse smoothing
            mouse.x += (mouse.targetX - mouse.x) * 0.06;
            mouse.y += (mouse.targetY - mouse.y) * 0.06;
            // Toggle group visibilities
            shelfGroup.visible = curVar === 'shelf';
            grimoireGroup.visible = curVar === 'grimoire';
            orbitalGroup.visible = curVar === 'orbital';
            isometricGroup.visible = curVar === 'isometric';
            // Auto rotation logic per scene
            if (isAutoRotatingRef.current && !isDragging) {
                manualRotY += 0.004;
            }
            // --- Scene 1: Floating Books Animations ---
            if (shelfGroup.visible) {
                shelfGroup.rotation.y = manualRotY * 0.4 + mouse.x * 0.2;
                shelfGroup.rotation.x = mouse.y * 0.15;
                shelfGroup.position.y = Math.sin(elapsed * 1.2) * 0.05;
                // Animate slide-out for selected book and individual floating levitation wave
                const selectedIdx = selectedBookIndexRef.current;
                shelfBookMeshes.forEach((mesh, idx) => {
                    const targetZ = idx === selectedIdx ? 0.75 : 0;
                    mesh.position.z += (targetZ - mesh.position.z) * 0.1;
                    mesh.position.y = Math.sin(elapsed * 2.2 + idx * 0.7) * 0.09;
                });
            }
            // --- Scene 2: Grimoire Animations ---
            if (grimoireGroup.visible) {
                grimoireGroup.rotation.y = manualRotY * 0.6 + mouse.x * 0.25;
                grimoireGroup.rotation.x = 0.65 + mouse.y * 0.2;
                grimoireGroup.position.y = -0.4 + Math.sin(elapsed * 1.4) * 0.1;
                // Swirling light spire & rune rings
                spireMesh.rotation.y = elapsed * 0.6;
                grimoireRing1.rotation.z = elapsed * 0.4;
                grimoireRing2.rotation.z = -elapsed * 0.3;
                spireMat.opacity = 0.25 + Math.sin(elapsed * 3.5) * 0.15;
            }
            // --- Scene 3: Orbital Galaxy Animations ---
            if (orbitalGroup.visible) {
                orbitalGroup.rotation.y = manualRotY + mouse.x * 0.3;
                orbitalGroup.rotation.x = mouse.y * 0.2;
                coreCrystal.rotation.x = elapsed * 0.4;
                coreCrystal.rotation.y = elapsed * 0.6;
                cageMesh.rotation.y = -elapsed * 0.3;
                orbitSatellites.forEach((sat, i) => {
                    sat.rotation.y = elapsed * orbitSpeeds[i];
                });
            }
            // --- Scene 4: Isometric Hub Animations ---
            if (isometricGroup.visible) {
                isometricGroup.rotation.y = -0.65 + manualRotY * 0.3 + mouse.x * 0.2;
                isometricGroup.rotation.x = 0.48 + mouse.y * 0.15;
                isometricGroup.position.y = Math.sin(elapsed * 1.2) * 0.06;
                holoBook.rotation.y = elapsed * 1.2;
                holoBook.position.y = 0.2 + Math.sin(elapsed * 2.5) * 0.08;
                // Floating mini books levitation
                isoBookMeshes.forEach((bm, i) => {
                    bm.position.y = isoBooksData[i].pos[1] + Math.sin(elapsed * 2.0 + i * 0.8) * 0.06;
                    bm.rotation.y += 0.005;
                });
            }
            // Rotate background particles
            particlesMesh.rotation.y = elapsed * 0.02;
            amberCoreLight.intensity = 2.4 + Math.sin(elapsed * 2.8) * 0.8;
            renderer.render(scene, camera);
        };
        animate();
        const handleResetCamera = () => {
            manualRotY = 0;
            manualRotX = 0;
            mouse.targetX = 0;
            mouse.targetY = 0;
        };
        container.addEventListener('reset-camera', handleResetCamera);
        return () => {
            cancelAnimationFrame(animationFrameId);
            container.removeEventListener('pointermove', handlePointerMove);
            container.removeEventListener('pointerdown', handlePointerDown);
            container.removeEventListener('reset-camera', handleResetCamera);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('resize', handleResize);
            if (renderer.domElement && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            openPagesGeo.dispose();
            grimoirePagesMat.dispose();
            grimoireCoverGeo.dispose();
            grimoireCoverMat.dispose();
            spireGeo.dispose();
            spireMat.dispose();
            grimoireRingGeo1.dispose();
            grimoireRingMat1.dispose();
            grimoireRingGeo2.dispose();
            grimoireRingMat2.dispose();
            coreGeo.dispose();
            coreMat.dispose();
            cageGeo.dispose();
            cageMat.dispose();
            floorGeo.dispose();
            floorMat.dispose();
            pedestalGeo.dispose();
            pedestalMat.dispose();
            holoBookGeo.dispose();
            holoBookMat.dispose();
            pGeo.dispose();
            pMat.dispose();
            pageEdgeTex.dispose();
            pageEdgeMat.dispose();
            renderer.dispose();
        };
    }, []);
    const triggerReset = () => {
        containerRef.current?.dispatchEvent(new CustomEvent('reset-camera'));
    };
    const variationsList = [
        {
            id: 'shelf',
            name: '3D Books',
            icon: <BookOpen className="w-3.5 h-3.5"/>,
            subtitle: 'Click any floating book to inspect or pull forward',
        },
        {
            id: 'grimoire',
            name: 'Open Grimoire',
            icon: <BookOpen className="w-3.5 h-3.5"/>,
            subtitle: 'Flat open algorithmic codex with holographic energy vortex',
        },
        {
            id: 'orbital',
            name: 'Orbit Matrix',
            icon: <Globe2 className="w-3.5 h-3.5"/>,
            subtitle: 'Floating book satellites orbiting central data core',
        },
        {
            id: 'isometric',
            name: 'Library Hub',
            icon: <Compass className="w-3.5 h-3.5"/>,
            subtitle: 'Miniature 3D isometric futuristic library diorama with floating books',
        },
    ];
    const currentOption = variationsList.find((v) => v.id === variation) || variationsList[0];
    return (<div className={`relative w-full h-[440px] sm:h-[490px] lg:h-[530px] flex items-center justify-center select-none ${className}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"/>

      {/* Floating 3D Variation Selector Bar */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-xl max-w-[98%] flex-wrap sm:flex-nowrap justify-center">
        {variationsList.map((opt) => {
            const isActive = variation === opt.id;
            return (<button key={opt.id} onClick={() => {
                    setVariation(opt.id);
                    setSelectedBookIndex(opt.id === 'shelf' ? 0 : null);
                }} className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${isActive
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
              {opt.icon}
              <span>{opt.name}</span>
            </button>);
        })}

        {/* Divider */}
        <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block"/>

        {/* Turntable Pause/Resume */}
        <button onClick={() => setIsAutoRotating((prev) => !prev)} title={isAutoRotating ? 'Pause Turntable' : 'Resume Turntable'} className={`p-1 sm:p-1.5 rounded-xl text-xs transition-colors ${!isAutoRotating ? 'bg-amber-500/30 text-amber-300' : 'text-slate-400 hover:text-white'}`}>
          {isAutoRotating ? <Pause className="w-3.5 h-3.5"/> : <Play className="w-3.5 h-3.5"/>}
        </button>

        {/* Reset Camera View */}
        <button onClick={triggerReset} title="Reset Camera Angle" className="p-1 sm:p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
          <RotateCw className="w-3.5 h-3.5"/>
        </button>
      </div>

      {/* Selected Book Banner in Shelf Mode */}
      {variation === 'shelf' && selectedBookIndex !== null && (<div className="absolute top-14 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-white/10 text-[11px] font-mono text-brand-300 pointer-events-none animate-slide-up shadow-lg">
          <span>
            Pulling out Volume #{selectedBookIndex + 1} • Click another book or drag to orbit
          </span>
        </div>)}

      {/* Contextual Bottom Instruction Hint */}
      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/40 backdrop-blur-lg border border-white/5 text-[11px] font-mono text-slate-300 pointer-events-none transition-opacity duration-300 flex items-center gap-2 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
        <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"/>
        <span>{currentOption.subtitle}</span>
      </div>
    </div>);
};
