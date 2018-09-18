//主函数 
function game() {
    //初始化变量
    var bullets = [], //子弹
        asteroids = [], //小行星
        explosions = [], // 爆炸
        destroyed = 0, // 被摧毁的
        record = 0, //记录
        count = 0,
        playing = false, //  343
        gameOver = false, // 游戏结束的判断
        xuanzhuan = {
            deg: 0 //  地球的旋转角度 初始位置
        };

    //绘制
    var ctx = document.getElementById('canvas').getContext('2d');

    //响应的把窗口的宽，高给canvas画布，
    var cH = ctx.canvas.height = window.innerHeight;
    var cW = ctx.canvas.width = window.innerWidth;

    //地球类
    function earch() {
        ctx.save(); //保存绘图状态---1
        ctx.fillStyle = 'white';
        // 地球阴影光晕
        ctx.shadowBlur = 100;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "#AEEEEE";
        //绘制圆，放置地球
        ctx.arc(
            (cW / 2),
            (cH / 2),
            100,
            100,
            Math.PI * 2
        );
        ctx.fill();
        // 地球在canvas画布的位置
        ctx.translate(cW / 2, cH / 2);
        //地球旋转
        ctx.rotate((xuanzhuan.deg += 0.1) * (Math.PI / 180));
        ctx.drawImage(sprite, 0, 0, 200, 200, -100, -100, 200, 200);
        ctx.restore(); //取出绘图状态---1
    }
    //炮台与地球之间相对位置
    var player = {
        posX: -35,
        posY: -177,
        width: 70,
        height: 79,
        deg: 0
    };
    // 向指定元素添加事件
    canvas.addEventListener('click', action);
    canvas.addEventListener('mousemove', action);
    window.addEventListener("resize", update);
    //更新
    function update() {
        cH = ctx.canvas.height = window.innerHeight;
        cW = ctx.canvas.width = window.innerWidth;
    }
    //实现-鼠标移动--炮台---使用atan2函数角度移动
    function move(event) {
        player.deg = Math.atan2(event.offsetX - (cW / 2), -(event.offsetY - (cH / 2)));
    }

    //鼠标右击
    function rightClick(event) {
        event.preventDefault();







    }
    //动作 鼠标移动  鼠标左击
    function action(event) {
        //如果游戏开始，鼠标左击是发射子弹
        if (playing) {
            var bullet = {
                x: -8,
                y: -179,
                sizeX: 2,
                sizeY: 10,
                realX: event.offsetX,
                realY: event.offsetY,
                dirX: event.offsetX,
                dirY: event.offsetY,
                deg: Math.atan2(event.offsetX - cW / 2, -(event.offsetY - cH / 2)),
                destroyed: false
            };
            bullets.push(bullet);
        } else {
            var dist;
            // 否则 ，再如果游戏结束
            if (gameOver) {
                //实现-游戏结束后--左击重玩键---重新进入游戏
                dist = Math.sqrt(((event.offsetX - cW / 2) * (event.offsetX - cW / 2)) + ((event.offsetY - (cH / 2 + 45 + 22)) * (event.offsetY - (cH / 2 + 45 + 22))));
                //
                if (dist < 50) {
                    if (event.type == 'click') {
                        gameOver = false;
                        count = 0;
                        bullets = [];
                        asteroids = [];
                        //爆炸
                        explosions = [];
                        //摧毁量
                        destroyed = 0;
                        player.deg = 0;
                        //移除监听
                        canvas.removeEventListener('contextmenu', action);
                        canvas.removeEventListener('mousemove', move);
                        canvas.style.cursor = "default";
                    }
                }
            } else {
                dist = Math.sqrt(((event.offsetX - cW / 2) * (event.offsetX - cW / 2)) + ((event.offsetY - cH / 2) * (event.offsetY - cH / 2)));

                if (dist < 50) {
                    if (event.type == 'click') {
                        playing = true;
                        canvas.removeEventListener("mousemove", action);
                        // canvas.addEventListener('contextmenu', action);
                        canvas.addEventListener('mousemove', move);
                        canvas.setAttribute("class", "playing");
                        canvas.style.cursor = "default";
                    }
                }
            }
        }
    }

    //玩家对炮台的操作
    function playerOperation() {
        //剪切雪碧图中的大炮---显示
        ctx.save(); // 保存绘图状态---2
        ctx.translate(cW / 2, cH / 2);
        ctx.rotate(player.deg);
        ctx.drawImage(
            sprite,
            200,
            0,
            player.width,
            player.height,
            player.posX,
            player.posY,
            player.width,
            player.height
        );
        ctx.restore(); //取出绘图状态---2
        if (bullets.length - destroyed && playing) {
            fire();
        }
    }

    //开火
    function fire() {
        //定义且设置子弹之间的间隔
        var distance;
        for (var i = 0; i < bullets.length; i++) {
            if (!bullets[i].destroyed) {
                ctx.save(); //保存绘图状态---3
                //子弹的位置
                ctx.translate(cW / 2, cH / 2);
                ctx.rotate(bullets[i].deg);
                //子弹 剪切
                ctx.drawImage(
                    sprite,
                    224,
                    90,
                    25,
                    70,
                    // 子弹在炮筒的位置
                    bullets[i].x - 15,
                    //子弹的速度
                    bullets[i].y -= 1, //点击 定时器 加速
                    //显示的导弹宽 高
                    48,
                    150
                );
                ctx.restore(); //取出绘图状态---3
                //真正的坐标
                bullets[i].realX = (0) - (bullets[i].y + 10) * Math.sin(bullets[i].deg);
                bullets[i].realY = (0) + (bullets[i].y + 10) * Math.cos(bullets[i].deg);

                bullets[i].realX += cW / 2;
                bullets[i].realY += cH / 2;

                //子弹碰撞小行星
                for (var j = 0; j < asteroids.length; j++) {
                    if (!asteroids[j].destroyed) {
                        //小行星出现的间隔
                        distance = Math.sqrt(
                            (asteroids[j].realX - bullets[i].realX) ** 2 +
                            (asteroids[j].realY - bullets[i].realY) ** 2
                        );
                        if (distance < (((asteroids[j].width / asteroids[j].size) / 2) - 4) + ((19 / 2) - 4)) {
                            //被摧毁量+1
                            destroyed += 1;
                            asteroids[j].destroyed = true;
                            bullets[i].destroyed = true;
                            explosions.push(asteroids[j]);
                        }
                    }
                }
            }
        }
    }
    // //流星类
    function newAsteroid() {

        var type = random(1, 4),
            coordsX,
            coordsY;

        switch (type) {
            case 1:
                coordsX = random(0, cW);
                coordsY = 0 - 150;
                break;
            case 2:
                coordsX = cW + 150;
                coordsY = random(0, cH);
                break;
            case 3:
                coordsX = random(0, cW);
                coordsY = cH + 150;
                break;
            case 4:
                coordsX = 0 - 150;
                coordsY = random(0, cH);
                break;
        }

        //定义小行星对象
        var asteroid = {
            x: 278,
            y: 0,
            state: 0,
            stateX: 0,
            width: 134,
            height: 123,
            realX: coordsX,
            realY: coordsY,
            moveY: 0,
            coordsX: coordsX,
            coordsY: coordsY,
            size: random(1, 4), //小行星运行速度
            deg: Math.atan2(coordsX - (cW / 2), -(coordsY - (cH / 2))),
            destroyed: false
        };
        // 定义定时器 实现每5秒随机出来的小行星增加数量起始为4 最终为1
        var frame = 0;
        var idx = 0;
        var timer = setInterval(function (param) {
            idx--;
            if (frame % 5000 == 0) {
                asteroid.size = random(1, 4 + idx);
            }
        }, 5000);
        if (idx == -3) {
            clearInterval(timer);
        }
        asteroids.push(asteroid);
    }
    //小行星
    function xiaoXingXing() {
        for (var i = 0; i < asteroids.length; i++) {
            if (!asteroids[i].destroyed) {
                ctx.save(); //保存绘图状态---4
                ctx.translate(asteroids[i].coordsX, asteroids[i].coordsY);
                ctx.rotate(asteroids[i].deg);

                ctx.drawImage(
                    sprite,
                    asteroids[i].x,
                    asteroids[i].y,
                    asteroids[i].width,
                    asteroids[i].height, -(asteroids[i].width / asteroids[i].size) / 2,
                    asteroids[i].moveY += 1 / (asteroids[i].size),
                    asteroids[i].width / asteroids[i].size,
                    asteroids[i].height / asteroids[i].size
                );
                ctx.restore(); //取出绘图状态---4

                //小行星的真实坐标
                asteroids[i].realX = (0) - (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size) / 2)) * Math.sin(asteroids[i].deg);
                asteroids[i].realY = (0) + (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size) / 2)) * Math.cos(asteroids[i].deg);

                asteroids[i].realX += asteroids[i].coordsX;
                asteroids[i].realY += asteroids[i].coordsY;
                //游戏结束的判断
                var distance;
                //当小行星的距离触碰到地球的时候--游戏结束
                distance = Math.sqrt(Math.pow(asteroids[i].realX - cW / 2, 2) + Math.pow(asteroids[i].realY - cH / 2, 2));
                if (distance < (((asteroids[i].width / asteroids[i].size) / 2) - 4) + 100) {
                    gameOver = true;
                    playing = false;
                    canvas.addEventListener('mousemove', action);
                }
            } else if (!asteroids[i].extinct) {
                explosion(asteroids[i]);
            }
        }

        if (asteroids.length - destroyed < 10 + (Math.floor(destroyed / 6))) {
            newAsteroid();
        }
    }
    //爆炸类
    function explosion(asteroid) {
        ctx.save(); //保存绘图状态---5
        ctx.translate(asteroid.realX, asteroid.realY);
        ctx.rotate(asteroid.deg);

        var spriteY,
            spriteX = 256;
        if (asteroid.state == 0) {
            spriteY = 0;
            spriteX = 0;
        } else if (asteroid.state < 8) {
            spriteY = 0;
        } else if (asteroid.state < 16) {
            spriteY = 256;
        } else if (asteroid.state < 24) {
            spriteY = 512;
        } else {
            spriteY = 768;
        }

        if (asteroid.state == 8 || asteroid.state == 16 || asteroid.state == 24) {
            asteroid.stateX = 0;
        }

        ctx.drawImage(
            spriteBoom,
            asteroid.stateX += spriteX,
            spriteY,
            256,
            256, -(asteroid.width / asteroid.size) / 2, -(asteroid.height / asteroid.size) / 2,
            asteroid.width / asteroid.size,
            asteroid.height / asteroid.size
        );
        asteroid.state += 1;

        if (asteroid.state == 31) {
            asteroid.extinct = true;
        }

        ctx.restore(); //取出绘图状态---5
    }
    //开始
    function start() {
        if (!gameOver) {
            //清屏
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();
            //地球类
            earch();
            //玩家操作
            playerOperation();

            if (playing) {
                xiaoXingXing();
                ctx.font = "20px Verdana";
                ctx.fillStyle = "white";
                ctx.textBaseline = 'middle';
                ctx.textAlign = "left";
                ctx.fillText('Record: ' + record + '', 20, 30);

                ctx.font = "40px Verdana";
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                ctx.strokeText('' + destroyed + '', cW / 2, cH / 2);
                ctx.fillText('' + destroyed + '', cW / 2, cH / 2);

            } else {
                //剪切----开始按钮
                ctx.drawImage(sprite, 440, 12, 70, 70, cW / 2 - 35, cH / 2 - 35, 70, 70);
            }
        } else if (count < 1) {
            count = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.rect(0, 0, cW, cH);
            ctx.fill();

            ctx.font = "60px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("  游戏结束！", cW / 2, cH / 2 - 150);

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("总击毁: " + destroyed, cW / 2, cH / 2 + 140);

            record = destroyed > record ? destroyed : record;

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("纪   录: " + record, cW / 2, cH / 2 + 185);
            //剪切----重玩按钮
            ctx.drawImage(sprite, 520, 20, 70, 70, cW / 2 - 44, cH / 2 - 3, 70, 70);

            canvas.removeAttribute('class');
        }
    }
    //初始化
    function init() {
        window.requestAnimationFrame(init);
        start();
    }

    init();

    // Utils 跑龙套
    function random(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    if (~window.location.href.indexOf('full')) {
        var full = document.getElementsByTagName('a');
        full[0].setAttribute('style', 'display: none');
    }
}