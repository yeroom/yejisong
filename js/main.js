
$(document).ready(function(){

    

    $(document).ready(function(){
        $(window).scroll(function(){
          var scroll = $(window).scrollTop();
          if (scroll > 1) {
            $(".header_wrap").css("background" , "#fff");
          }
          else{
            $(".header_wrap").css("background" , "transparent");   
          }
        })
      })


    // 원 모양의 div 요소를 마우스 커서 위치로 이동하는 부분
    const cursor = document.querySelector(".circle");
    window.addEventListener("mousemove", e => {
        //GSAP
        gsap.to(cursor, {duration: 4, left: e.pageX -450, top: e.pageY -450});
    });
    

    // 스윙 애니메이션을 그리는 부분
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const pi = Math.PI;
    const points = 12;
    const radius = 300 * dpr;
    const h = 800 * dpr;
    const w = 800 * dpr;
    const center = {
        x: w / 2 * dpr,
        y: h / 2 * dpr
    };
    const circles = [];
    const rangeMin = 1;
    const rangeMax = 30;

    let mouseY = 0;
    let tick = 0;

    var easing = 0.1; // 이동 속도 조절
    
    // 그라디언트 스타일을 설정
    const gradient1 = ctx.createLinearGradient(0, 0, w, 0);
    gradient1.addColorStop(0, '#ccdbfd');
    gradient1.addColorStop(1, '#caf0f8');
    const gradients = [gradient1];

    // 캔버스 크기와 디바이스 픽셀 비율 설정
    ctx.scale(dpr, dpr);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    // 스윙 애니메이션을 그리기 위한 초기 포인트 설정
    for (var idx = 0; idx <= gradients.length - 1; idx++) {
        let swingpoints = [];
        let radian = 0;

        for (var i = 0; i < points; i++) {
            radian = pi * 2 / points * i;
            var ptX = center.x + radius * Math.cos(radian);
            var ptY = center.y + radius * Math.sin(radian);

            swingpoints.push({
                x: ptX,
                y: ptY,
                radian: radian,
                range: random(rangeMin, rangeMax),
                phase: 0
            });
        }

        circles.push(swingpoints);
    }

    // 스윙 애니메이션을 그리는 함수
    function swingCircle() {
        ctx.clearRect(0, 0, w * dpr, h * dpr);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'screen';

        for (let k = 0; k < circles.length; k++) {
            let swingpoints = circles[k];

            for (var i = 0; i < swingpoints.length; i++) {
                swingpoints[i].phase += random(1, 10) * -0.01;

                let phase = 4 * Math.sin(tick / 65);

                if (mouseY !== 0) {
                    phase = mouseY / 200 + 1;
                }

                var r = radius + (swingpoints[i].range * phase * Math.sin(swingpoints[i].phase)) - rangeMax;
                swingpoints[i].radian += pi / 360;
                var ptX = center.x + r * Math.cos(swingpoints[i].radian);
                var ptY = center.y + r * Math.sin(swingpoints[i].radian);

                swingpoints[i] = {
                    x: ptX,
                    y: ptY,
                    radian: swingpoints[i].radian,
                    range: swingpoints[i].range,
                    phase: swingpoints[i].phase,
                };
            }

            const fill = gradients[k];
            drawCurve(swingpoints, fill);
        }

        tick++;
        requestAnimationFrame(swingCircle);
    }

    // 블러 그리고 곡선 그리기 함수
    function drawCurve(pts, fillStyle) {
        ctx.filter = "blur(70px)";
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.moveTo(
            (pts[cycle(-1, points)].x + pts[0].x) / 2,
            (pts[cycle(-1, points)].y + pts[0].y) / 2
        );
        for (var i = 0; i < pts.length; i++) {
            ctx.quadraticCurveTo(
                pts[i].x,
                pts[i].y,
                (pts[i].x + pts[cycle(i + 1, points)].x) / 2,
                (pts[i].y + pts[cycle(i + 1, points)].y) / 2
            );
        }
        ctx.closePath();
        ctx.fill();
    }


    // 인덱스 순환 함수
    function cycle(num1, num2) {
        return (num1 % num2 + num2) % num2;
    }

    // 랜덤 정수 생성 함수
    function random(num1, num2) {
        var max = Math.max(num1, num2);
        var min = Math.min(num1, num2);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    requestAnimationFrame(swingCircle);

    //객체 회전 함수
    function rotate(x, y, angle, center) {
        var radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - center.x)) - (sin * (y - center.y)) + center.x,
            ny = (sin * (x - center.x)) + (cos * (y - center.y)) + center.y;
        return { x: nx, y: ny };
    }

    // visual section 애니메이션
    var mainLead = document.querySelectorAll(".lead_change > div");
    var mainLeadBox = document.querySelector(".lead_change");
    var animTimeouts = [];
    var animIntervals = [];

    function visualAnim(a, b, c) {
        animTimeouts.push(
        setTimeout(() => {
            animTimeouts.push(
            setTimeout(() => {
                mainLead[0].classList.add("on");
                mainLead[1].classList.remove("on");
                mainLead[2].classList.remove("on");
                mainLeadBox.style.width = a + 80 + "px";
            }, 0)
            );
            animTimeouts.push(
            setTimeout(() => {
                mainLead[0].classList.remove("on");
                mainLeadBox.style.width = b + 70 + "px";
                mainLead[1].classList.add("on");
            }, 3000)
            );
            animTimeouts.push(
            setTimeout(() => {
                mainLead[1].classList.remove("on");
                mainLeadBox.style.width = c + 50 + "px";
                mainLead[2].classList.add("on");
            }, 6000)
            );
            animIntervals.push(
            setInterval(() => {
                animTimeouts.push(
                setTimeout(() => {
                    mainLead[0].classList.add("on");
                    mainLead[1].classList.remove("on");
                    mainLead[2].classList.remove("on");
                    mainLeadBox.style.width = a + 80 + "px";
                }, 0)
                );
                animTimeouts.push(
                setTimeout(() => {
                    mainLead[0].classList.remove("on");
                    mainLeadBox.style.width = b + 70 + "px";
                    mainLead[1].classList.add("on");
                }, 3000)
                );
                animTimeouts.push(
                setTimeout(() => {
                    mainLead[1].classList.remove("on");
                    mainLeadBox.style.width = c + 50  + "px";
                    mainLead[2].classList.add("on");
                }, 6000)
                );
            }, 9000)
            );
        }, 1200)
        );
    }
    

    // 화면크기에 따른 폰트사이즈 변경
    function visualAnimResponsive() {
        animTimeouts.forEach((timeout) => clearTimeout(timeout));
        animIntervals.forEach((interval) => clearInterval(interval));
        animTimeouts = [];
        animIntervals = [];
        if (window.matchMedia("(min-width: 1800px)").matches) {
        visualAnim(255, 358, 225);
        } else if (window.matchMedia("(min-width: 1601px)").matches) {
        visualAnim(268, 371, 232);
        } else if (window.matchMedia("(min-width: 1201px)").matches) {
        visualAnim(268, 371, 232);
        } else if (window.matchMedia("(min-width: 769px)").matches) {
        visualAnim(275, 378, 248);
        } else if (window.matchMedia("(max-width: 768px)").matches) {
        visualAnim(275, 378, 248);
        }
    }

    window.addEventListener("resize", visualAnimResponsive);
    visualAnimResponsive();       

    //WOW
    new WOW().init();

    window.addEventListener('scroll', function() {
        var targetElement = document.getElementById('targetElement');
        var scrollHeight = window.scrollY; // 현재 스크롤된 높이
        var targetHeight = 1000; // 요소를 숨길 스크롤 높이 (픽셀 단위)
    
        if (scrollHeight > targetHeight) {
            targetElement.style.display = 'none';
        } else {
            targetElement.style.display = 'block';
        }
    });

    
   
});
