// fireworks.js - Hiệu ứng pháo hoa đơn giản

(function() {
    'use strict';
    
    // Canvas và context
    let canvas, ctx;
    let particles = [];
    let rockets = [];
    let animationId;
    let isActive = true;
    
    // Màu sắc cho pháo hoa
    const colors = [
        '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
        '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
        '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
        '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
    ];
    
    // Khởi tạo pháo hoa
    function initFireworks() {
        canvas = document.getElementById('fireworks-canvas');
        ctx = canvas.getContext('2d');
        
        // Đặt kích thước canvas
        resizeCanvas();
        
        // Tạo pháo hoa ngẫu nhiên
        setInterval(createRocket, 800);
        
        // Bắt đầu animation loop
        animate();
        
        // Xử lý resize window
        window.addEventListener('resize', resizeCanvas);
    }
    
    // Đặt kích thước canvas bằng kích thước window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Tạo một rocket mới
    function createRocket() {
        if (!isActive) return;
        
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        const speed = 2 + Math.random() * 2;
        const targetY = 100 + Math.random() * (canvas.height / 2);
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        rockets.push({
            x, y,
            speed,
            targetY,
            color,
            size: 2
        });
    }
    
    // Tạo các hạt particle khi rocket nổ
    function createExplosion(x, y, color) {
        const particleCount = 100 + Math.random() * 200;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            
            particles.push({
                x, y,
                velocity,
                color,
                size: 1 + Math.random() * 3,
                life: 100 + Math.random() * 50,
                decay: 0.5 + Math.random() * 1,
                gravity: 0.05
            });
        }
    }
    
    // Cập nhật vị trí rocket
    function updateRockets() {
        for (let i = rockets.length - 1; i >= 0; i--) {
            const rocket = rockets[i];
            rocket.y -= rocket.speed;
            
            // Nếu rocket đạt đến độ cao mục tiêu
            if (rocket.y <= rocket.targetY) {
                createExplosion(rocket.x, rocket.y, rocket.color);
                rockets.splice(i, 1);
            }
        }
    }
    
    // Cập nhật vị trí particles
    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Cập nhật vị trí
            p.x += p.velocity.x;
            p.y += p.velocity.y;
            
            // Áp dụng gravity
            p.velocity.y += p.gravity;
            
            // Giảm life
            p.life -= p.decay;
            
            // Giảm kích thước
            p.size *= 0.99;
            
            // Xóa particle nếu life <= 0
            if (p.life <= 0 || p.size <= 0.1) {
                particles.splice(i, 1);
            }
        }
    }
    
    // Vẽ rocket
    function drawRockets() {
        rockets.forEach(rocket => {
            ctx.beginPath();
            ctx.arc(rocket.x, rocket.y, rocket.size, 0, Math.PI * 2);
            ctx.fillStyle = rocket.color;
            ctx.fill();
            
            // Vẽ đuôi rocket
            ctx.beginPath();
            ctx.moveTo(rocket.x, rocket.y + rocket.size);
            ctx.lineTo(rocket.x, rocket.y + 20);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }
    
    // Vẽ particles
    function drawParticles() {
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            
            // Tạo gradient màu cho particle
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, p.color + 'CC');
            gradient.addColorStop(1, p.color + '00');
            
            ctx.fillStyle = gradient;
            ctx.fill();
        });
    }
    
    // Animation loop
    function animate() {
        if (!isActive) return;
        
        // Xóa canvas với hiệu ứng mờ dần
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Cập nhật và vẽ
        updateRockets();
        updateParticles();
        drawRockets();
        drawParticles();
        
        // Tiếp tục animation
        animationId = requestAnimationFrame(animate);
    }
    
    // Dừng pháo hoa
    function stopFireworks() {
        isActive = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        // Xóa tất cả rocket và particles
        rockets = [];
        particles = [];
        
        // Xóa canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Public API
    window.initFireworks = initFireworks;
    window.stopFireworks = stopFireworks;
    
})();