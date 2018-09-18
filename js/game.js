//主函数 
function game() {
    //初始化变量
    var bullets = [], //鼠标左击子弹
        skill = [], //技能--鼠标右击技能
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

    //canvas 画布
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
        ctx.shadowColor = "purple";
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
    // 月球类
    function moon(param) {
        ctx.save(); //保存绘图状态---2
        ctx.fillStyle = 'transparent'; //transparent 
        // 制造月球阴影光晕
        ctx.shadowBlur = 100;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "white";
        // 绘制圆，放置月球
        ctx.arc(
            770,
            120,
            50,
            0,
            2 * Math.PI
        );
        ctx.fill();
        //月球在canvas画布的位置
        ctx.translate(900, 60);
        //月球自传
        // ctx.rotate((xuanzhuan.deg += 0.1) * (Math.PI / 180));
        //剪切---月球
        ctx.drawImage(sprite, 570, 103, 100, 100, -0, -0, 100, 100);
        ctx.restore(); //取出绘图状态---2
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
    //清除鼠标右键的默认样式
    document.oncontextmenu = function (param) {
        return false
    }
    var dazhao = {
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

    //鼠标右击的大招的定义-----5秒/个
    var dazhaoNum = 0;
    setInterval(function (param) {
        dazhaoNum++;
        dazhaoNum = dazhaoNum > 5 ? 5 : dazhaoNum;
        skill.push(dazhao);
    }, 5000)

    // 鼠标右击事件
    function rightClick(event) {
        //大招技能对象
        event.preventDefault();
        canvas.removeEventListener('contextmenu', rightClick);
        for (var i = 0; i < skill.length; i++) {
            if (!skill[i].destroyed) {
                ctx.save(); //保存绘图状态---3
                //子弹的位置
                ctx.translate(cW / 2, cH / 2);
                ctx.rotate(skill[i].deg);
                //子弹 剪切
                ctx.drawImage(
                    sprite,
                    224,
                    140,
                    25,
                    70,
                    // 子弹在炮筒的位置
                    skill[i].x - 15,
                    //子弹的速度
                    skill[i].y -= 20, //点击 定时器 加速
                    //显示的导弹宽 高
                    48,
                    150
                );
                ctx.restore(); //取出绘图状态---3
                //真正的坐标
                skill[i].realX = (0) - (skill[i].y + 10) * Math.sin(skill[i].deg);
                skill[i].realY = (0) + (skill[i].y + 10) * Math.cos(skill[i].deg);
                skill[i].realX += cW / 2;
                skill[i].realY += cH / 2;

                //子弹碰撞小行星
                for (var j = 0; j < asteroids.length; j++) {
                    if (!asteroids[j].destroyed) {
                        //小行星出现的间隔
                        distance = Math.sqrt(
                            (asteroids[j].realX - skill[i].realX) ** 2 +
                            (asteroids[j].realY - skill[i].realY) ** 2
                        );
                        if (distance < (((asteroids[j].width / asteroids[j].size) / 2) - 4) + ((19 / 2) - 4)) {
                            //被摧毁量+1
                            destroyed += 1;
                            asteroids[j].destroyed = true;
                            skill[i].destroyed = true;
                            explosions.push(asteroids[j]);
                        }
                    }
                }
            }
        }
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
                        //移除事件监听
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
                        // if (event.button == 1) {
                        //     canvas.removeEventListener("mousemove", action);
                        // }
                        // if (event.button == 2) {
                        //     canvas.addEventListener('contextmenu', action);
                        // }
                        canvas.addEventListener('mousemove', move);
                        canvas.removeEventListener("mousemove", action);
                        //鼠标右击添加事件
                        canvas.addEventListener('contextmenu', rightClick);
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

    // 定义定时器 实现每5秒为子弹加一次速度
    var speed = 0;
    var timer2 = setInterval(function (param) {
        speed += 0.2;
        speed = speed > 20 ? 20 : speed;
        // bullets[i].y -= 1 + speed;
    }, 1000)
    if (speed == 20) {
        clearInterval(timer2);
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
                    bullets[i].y -= 1 + speed, //点击 定时器 加速
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

    //播放时间变化就会触发
    //音效类
    var audio = new Audio();
    audio.controls = false;
    audio.autoplay = false;
    audio.loop = 1;
    audio.src = '../music/one.js';
    audio.currentTime = 500;
    audio.addEventListener('timeupdate', function () {

    }); //播放时间变化就会触发

    //设定random 所使用的值
    function random(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    //小行星绘制以及坐标以便与判断和子弹是否在同一直线上
    function xiaoXingXing() {
        for (var i = 0; i < asteroids.length; i++) {
            if (!asteroids[i].destroyed) {
                ctx.save(); //保存绘图状态---4
                ctx.translate(asteroids[i].coordsX, asteroids[i].coordsY);
                ctx.rotate(asteroids[i].deg);
                ctx.drawImage(
                    sprite,
                    asteroids[i].x + 140,
                    asteroids[i].y + 100 - 10,
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
            } else if (!asteroids[i].extinct) { //小行星没消失
                explosion(asteroids[i]);
            }
        }

        if (asteroids.length - destroyed < 10 + (Math.floor(destroyed / 6))) {
            newAsteroid();
        }
    }

    //流星类--生成
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
            size: random(1, 4), //小行星大小 绑定运行速度
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
            256,
            (asteroid.width / asteroid.size) / -2,
            (asteroid.height / asteroid.size) / -2,
            (asteroid.width / asteroid.size) + 0,
            (asteroid.height / asteroid.size) + 0
        );
        asteroid.state += 1;

        if (asteroid.state == 31) {
            asteroid.extinct = true;
        }
        ctx.restore(); //取出绘图状态---5
    }

    //初始化
    function init() {
        //实现递归调用 ---持续动画
        window.requestAnimationFrame(init);
        start();
    }
    init();
    //开始
    function start() {
        //如果游戏没结束--清屏游戏启动
        if (!gameOver) {
            //清屏
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();
            //地球类
            earch();
            // 月球类
            moon();
            //玩家操作
            playerOperation();
            //如果游戏正在进行--绘制显示-最高纪录&击毁数
            if (playing) {
                //小行星开始坠落
                xiaoXingXing();
                //绘制最高纪录的文字
                ctx.font = "20px 微软雅黑";
                ctx.fillStyle = "yellow";
                ctx.fillText('最高纪录: ' + record + '', 1450, 30);

                //地球上的分数 ---字体
                ctx.font = "40px 微软雅黑";
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                ctx.strokeText('' + destroyed + '', cW / 2, cH / 2);
                ctx.fillText('' + destroyed + '', cW / 2, cH / 2);

                //绘制大招的剩余是使用次数
                ctx.font = "30px 微软雅黑";
                ctx.fillStyle = "red";
                ctx.fillText("终结技能:" + dazhaoNum + '', 100, 50);

            } else {
                //如果游戏还没开始---绘制开始按钮
                //剪切----开始按钮
                ctx.drawImage(sprite, 440, 12, 70, 70, cW / 2 - 35, cH / 2 - 35, 70, 70);
            }
        } else if (count < 1) {
            //如果游戏结束 则显示一张透明的页面以显示出游戏主体背景
            count = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.rect(0, 0, cW, cH);
            ctx.fill();
            // 绘制游戏结束字样
            ctx.font = "60px 微软雅黑";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("  游戏结束！", cW / 2, cH / 2 - 150);
            //绘制总击毁数
            ctx.font = "30px 微软雅黑";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("总击毁: " + destroyed, cW / 2, cH / 2 + 140);

            record = destroyed > record ? destroyed : record;
            //绘制记录字体
            ctx.font = "30px 微软雅黑";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("纪   录: " + record, cW / 2, cH / 2 + 185);
            //剪切----重玩按钮
            ctx.drawImage(sprite, 520, 20, 70, 70, cW / 2 - 44, cH / 2 - 3, 70, 70);

            canvas.removeAttribute('class');
        }
    }
}