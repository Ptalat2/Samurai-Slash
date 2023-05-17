const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width =  1024;
canvas.height = 550;
ctx.fillRect(0, 0, canvas.width, canvas.height);
let audio1 = new Audio('Samurai.mp3');
let stopGame = false;
let another =1;
let audio2 = new Audio('Game Over.mp3');

audio1.loop = true;


const gravity = 0.4;

class icon {
    constructor({position, imgSource, scale =1, framesMax =1, offset = {x:0,y:0}}) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imgSource;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 6;
        this.offset = offset;
    }
 
    draw_out() {
        ctx.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width/this.framesMax,
            this.image.height,
            this.position.x-this.offset.x, 
            this.position.y-this.offset.y,
            (this.image.width/this.framesMax) *this.scale,
            this.image.height* this.scale 
        );
    }

    animateFrames() {
        this.framesElapsed++;
        if(this.framesElapsed % this.framesHold ===0) {
        if(this.framesCurrent < this.framesMax-1) {
            this.framesCurrent++;
        } else {
            this.framesCurrent = 0;
        }
    }
    }

    update() {
        this.draw_out();
        this.animateFrames();
        
    }
};


class fighter extends icon {
    constructor({position,velocity, color,imgSource, scale =1, framesMax =1, offset = {x:0,y:0},sprites, attackBox = {offset:{}, width:undefined,height: undefined} }  ) {
        super({
            position,
            imgSource,
            scale,
            framesMax,
            offset
           
        });
        // this.position = position;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 6;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.Last_Key;
        this.attacking;
        this.color = color
        this.dead = false;
        this.attack_box = {
            position: {
                x:this.position.x,
                y:this.position.y
            } ,
            offset: attackBox.offset,
            width: attackBox.width ,
            height: attackBox.height
        }
        this.health = 100;
        this.sprites = sprites
        for (const sprite in this.sprites) {
            this.sprites[sprite].image = new Image();
            this.sprites[sprite].image.src = this.sprites[sprite].imgSource;

        }
        console.log(this.sprites);
        
    }

    switchSprite(Sprite) {
    if(this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax-1) return
    if(this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax-1) return
    if(this.image === this.sprites.death.image){
        if(this.framesCurrent == this.sprites.death.framesMax-1) {
            this.dead = true;
            
        }
        return
        
    }
    switch (Sprite) {
            case 'idle':
                if(this.image != this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent =0;


                 }

                break;
            case 'run':
                console.log( this.image)
                if(this.image != this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent =0;

                }
                break;
            case 'jump':
                if(this.image != this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent =0;

                }
                break;
            case 'fall' : 
                if(this.image != this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent =0;

                }
                 break;
             case 'attack1' : 
                 if(this.image != this.sprites.attack1.image) {
                     this.image = this.sprites.attack1.image;
                     this.framesMax = this.sprites.attack1.framesMax;
                     this.framesCurrent =0;
 
                 }
                  break;
            case 'takeHit' : 
                  if(this.image != this.sprites.takeHit.image) {
                      this.image = this.sprites.takeHit.image;
                      this.framesMax = this.sprites.takeHit.framesMax;
                      this.framesCurrent =0;
  
                  }
                   break;
            case 'death' : 
                   if(this.image != this.sprites.death.image) {
                       this.image = this.sprites.death.image;
                       this.framesMax = this.sprites.death.framesMax;
                       this.framesCurrent =0;
   
                   }
                    break;

        }
    }
 
 

    update() {
        this.draw_out();
        if(!this.dead) { this.animateFrames();}
       
        this.attack_box.position.x = this.position.x + this.attack_box.offset.x;
        this.attack_box.position.y = this.position.y + this.attack_box.offset.y;
        //ctx.fillRect(this.attack_box.position.x, this.attack_box.position.y,this.attack_box.width,this.attack_box.height);



        this.position.x += this.velocity.x;
        this.position.y +=this.velocity.y;
        if((this.position.x) >=canvas.width+100) {
            this.position.x = canvas.width+100;
        }

        if((this.position.x)>= canvas.height+400) {
            this.position.x = 900;
        }


        if((this.position.x) <0) {
            this.position.x = 0;
        }

        if(this.position.y + this.height + this.velocity.y < 0) {
            this.position.y = canvas.height;
        }

        if(this.position.y + this.height + this.velocity.y >= canvas.height -70 ) {
           this.velocity.y = 0;
           this.position.y = 330; 
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite('attack1');
        this.attacking = true;
       
    }

    takeHit() {
        this.health -= 20;

        if(this.health<=0) {
            this.switchSprite('death');
        }else{
            this.switchSprite('takeHit');
        }
    }
};


const background = new icon({position:{x:0,y:0},imgSource:"background.png"})
const shop = new icon({position:{x:600,y:160},imgSource:"shop.png", scale:2.5, framesMax:6})
let player = undefined;
let enemy = undefined;

function makePlayer() {
    player = new fighter({
    position:{x:0,y:0},
    velocity:{x:0,y:0},
    color: "red",
    imgSource:"./samuraiMack/Idle.png",
    framesMax:8,
    scale:2.5 ,
    offset: {x:215,y:157},
    sprites: {
        idle:{
            imgSource:"./samuraiMack/Idle.png",
            framesMax: 8
        },
        run:{
            imgSource:"./samuraiMack/Run.png",
            framesMax: 8
        },
        jump:{
            imgSource:"./samuraiMack/Jump.png",
            framesMax: 2
        },
        fall:{
            imgSource:"./samuraiMack/Fall.png",
            framesMax: 2
        },
        attack1:{
            imgSource:"./samuraiMack/Attack1.png",
            framesMax: 6
        },
        takeHit:{
            imgSource:"./samuraiMack/Take Hit_white.png",
            framesMax: 4
        },
        death:{
            imgSource:"./samuraiMack/Death.png",
            framesMax: 6
        }

    },
    attackBox: {
        offset: {
            x:100,
            y:50
        },
        width:150,
        height:50
    }
    

    });

    player.draw_out();
}

const keys = {
    Right: {
        pressed:false
    },
    Left : {
        pressed:false
    },

    Up: {
        pressed:false
    },

    d: {
        pressed:false
    },

    a : {
        pressed:false
    },

    w: {
        pressed:false
    }
}

 
function makeEnemy() {

    enemy = new fighter({
    position: {x:900,y:10},
    velocity:{x:0,y:0},
    color: "blue",
    imgSource:"./kenji/Idle.png",
    framesMax:4,
    scale:2.5 ,
    offset: {x:215,y:167},
    sprites: {
        idle:{
            imgSource:"./kenji/Idle.png",
            framesMax: 4
        },
        run:{
            imgSource:"./kenji/Run.png",
            framesMax: 8
        },
        jump:{
            imgSource:"./kenji/Jump.png",
            framesMax: 2
        },
        fall:{
            imgSource:"./kenji/Fall.png",
            framesMax: 2
        },
        attack1:{
            imgSource:"./kenji/Attack1.png",
            framesMax: 4
        },
        takeHit:{
            imgSource:"./kenji/Take hit.png",
            framesMax: 3
        },
        death:{
            imgSource:"./kenji/Death.png",
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x:-165,
            y:50
        },
        width:165,
        height:50
    }
    });

    
    enemy.draw_out();
}

makePlayer();
makeEnemy();


function collision({player, enemy}) {
    return (player.attack_box.position.x + player.attack_box.width >= enemy.position.x && 
        (player.attack_box.position.x <= enemy.position.x +enemy.width) &&
        (player.attack_box.position.y + player.attack_box.height >= enemy.position.y 
        && player.attack_box.position.y <= enemy.position.y + enemy.height) 
         && player.attacking);
} 
let time = 60;
let timerId;


function time_Down() {
   if(stopGame === false && another ===1) {
    if(time >0) {
      timerId =  setTimeout(time_Down, 1200);
        --time;
        document.querySelector("#timer").innerHTML= time;
    }
 
    if(time ===0) {
        document.querySelector("#display-score").style.display="flex";

        if(player.health == enemy.health) {
            document.querySelector("#display-score").innerHTML = 'Tie';
        } else if(player.health >= enemy.health) {
    
            document.querySelector("#display-score").innerHTML = 'Player Wins';

         } else if(player.health < enemy.health) {
       
            document.querySelector("#display-score").innerHTML = 'Enemy Wins';
    }

    audio1.pause();

    audio2.play();

    reStart();

    }
}
}


function reStart() {

    
    

    document.querySelector('.reDone').style.display = "block";

    if(player.health > enemy.health) {

        document.querySelector("#display").innerText= 'Samurai Mack Wins';

    }  else if(player.health < enemy.health) {
   
        document.querySelector("#display").innerText = 'Kenji Wins';
    } else if(time ==0) {
        document.querySelector("#display").innerText = 'TimeOut';
    }
  
     const reDone = document.querySelector('.reDone');
     reDone.style.display = 'flex';
     setTimeout(() => {
       reDone.style.top = '0';
     }, 1200);
    
}


function reset() {
   
      document.getElementById("playerHealth").style.width = "100%";
      document.getElementById("enemyHealth").style.width = "100%";
      document.querySelector("#display-score").innerHTML = '';
      document.querySelector("#display").innerText= '';

    makePlayer();
    makeEnemy();

}



function animation() {
    
    window.requestAnimationFrame(animation);
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    background.update();
    shop.update();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';

    ctx.fillRect(0,0,canvas.width,canvas.height);
    player.update();
   enemy.update();
    
    player.velocity.x =0;
    enemy.velocity.x =0;

    // player
    if(keys.a.pressed && player.Last_Key === 'a' ) {
        player.velocity.x  =-5;
        player.switchSprite('run');
    } else if(keys.d.pressed && player.Last_Key === 'd' ) {
        player.velocity.x =5;
        player.switchSprite('run');

    } else {
        player.switchSprite('idle');

    }

    if( player.velocity.y <0) {
       player.switchSprite('jump');

    } else if( player.velocity.y >0) {
        player.switchSprite('fall');
    }
    // end of player

    // enemy
    if(keys.Left.pressed && enemy.Last_Key === 'ArrowLeft' ) {
        enemy.velocity.x  =-5;
        enemy.switchSprite('run');
    } else if(keys.Right.pressed && enemy.Last_Key === 'ArrowRight' ) {
        enemy.velocity.x =5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    if( enemy.velocity.y <0) {
        enemy.switchSprite('jump');
 
     } else if( enemy.velocity.y >0) {
         enemy.switchSprite('fall');
     }

    

    // end of enemy

    // collision 
    if(collision({player:player,enemy:enemy})&& player.attacking && player.framesCurrent === 4) {
        enemy.takeHit();
       
    //  document.querySelector("#enemyHealth").style.width = enemy.health + '%';
     gsap.to('#enemyHealth', {width: enemy.health + '%'})
    }

    if(player.attacking && player.framesCurrent ===4) {
        player.attacking = false;
    }

    if(collision({player:enemy,enemy:player}) && enemy.attacking && enemy.framesCurrent === 2 ) {
        enemy.attacking = false;
        player.takeHit();
    //    document.querySelector("#playerHealth").style.width = player.health + '%';
       gsap.to('#playerHealth', {width: player.health + '%'})


    }

    if(enemy.attacking && enemy.framesCurrent ===2) {
        enemy.attacking = false;
    }



    // end game

    if(enemy.health <= 0 || player.health <=0) {
        clearTimeout(timerId);
        document.querySelector("#display-score").style.display="flex";

        if(player.health > enemy.health) {

            document.querySelector("#display-score").innerText= 'Samurai Mack Wins';

        }  else if(player.health < enemy.health) {
       
            document.querySelector("#display-score").innerText = 'Kenji Wins';
        }
        audio1.pause();

        audio2.play();
        reStart();
    }

    
}

animation();

window.addEventListener('keydown', (keyss) => {
    if(!player.dead) {
    switch (keyss.key) {
        case 'd': {
            keys.d.pressed = true;
            player.Last_Key = 'd';
            break;
        }

        case 'a': {
          keys.a.pressed = true;
          player.Last_Key = 'a';
            break;
        }

        case ' ': {
            player.attack();
            break;
        }
        case 'w': {
            player.velocity.y = -13;
            break;
          }
        
    }
}
    

        // for enemy
    if(enemy.dead === false) {
      switch(keyss.key) {
        
  
          case 'ArrowRight': {
              keys.Right.pressed = true;
              enemy.Last_Key = 'ArrowRight';
              break;
          }
  
          case 'ArrowLeft': {
            keys.Left.pressed = true;
            enemy.Last_Key = 'ArrowLeft';
              break;
          }
  
          case 'ArrowUp': {
            enemy.velocity.y = -13;
            break;
          }
  
          case 'ArrowDown': {
              enemy.attack();
              enemy.attacking = true;
              break;
          }
      }
    }

        //end of enemy;

        


});

window.addEventListener('keyup', (keyss) => {
    console.log(keyss.key);
    switch (keyss.key) {

        case 'd': {
            keys.d.pressed  = false;
            break;
        }

        case 'a': {
            keys.a.pressed  = false;
            break;
        }

        // enemy 
        case 'ArrowRight': {
            keys.Right.pressed  = false;
            break;
        }

        case 'ArrowLeft': {
            keys.Left.pressed  = false;
            break;
        }
        // end of enemy
    }


});

function countdown() {
    audio1.pause();
    audio2.pause();
    audio1.currentTime = 0;
    audio2.currentTime = 0;
    document.querySelector('.game').style.display = 'none';
    const welcomeSection = document.querySelector('.welcome');
    const gameSection = document.querySelector('.game');
    const countdownSection = document.getElementById('countdown');
    document.body.style.backgroundColor =  "#190c0c";
    const goText = document.createElement('h1');
    goText.classList.add('fade-out'); // add 'fade-out' class here
    goText.innerText = '';
    countdownSection.innerHTML = '';
    countdownSection.appendChild(goText);
      countdownSection.style.display = "block";
      welcomeSection.style.display = "none";
      let count = 3;
      const audio = new Audio('go.mp3');
      audio1.pause();
      audio.play();
      const countdown = setInterval(() => {
       
       
        if (count > 0) {
     
          const countdownText = document.createElement('h1');
          countdownText.classList.add('countdown', 'fade-out'); // add 'fade-out' class here
          countdownText.innerText = count;
          countdownSection.innerHTML = '';
          countdownSection.appendChild(countdownText);
          count--;
          if(count == 0) {
            audio.pause();
            audio1.play();
          }
        } else {
           
          clearInterval(countdown);
          const goText = document.createElement('h1');
          goText.classList.add('fade-out'); // add 'fade-out' class here
          goText.innerText = 'GO!';
          countdownSection.innerHTML = '';
          countdownSection.appendChild(goText);
          setTimeout(() => {
            countdownSection.style.display = 'none';
            gameSection.style.display = 'block';
            time = 60;
            time_Down();
           
          }, 900);
        }
      }, 900);

    
    
    
    
    




}

document.querySelector("#switch").addEventListener("click", (e) => {
    document.querySelector(".welcome").style.display = "none";
    

  countdown();

 

});
//button

document.querySelector("#button").addEventListener("click", (e) => {
    document.querySelector('.reDone').style.display = "none";

    document.body.style.backgroundColor =  "#190c0c";
    reset();
    countdown();

});

let click =0;
let mic =0;

const widgetBtn = document.querySelector('.widget-btn');
const widgetOptions = document.querySelector('.widget-options');

widgetBtn.addEventListener('click', () => {
    if(click ===0) {
        widgetOptions.style.display = 'block';
        widgetBtn.innerText = "Close"

        click =1;
    } else {
        widgetOptions.style.display = 'none';
        widgetBtn.innerText = "Open Widget"

        click =0;
    }

    
});

function pause() {
    if(stopGame) {
        player.dead = true;
        enemy.dead = true;
    } else {
        player.dead = false;
        enemy.dead = false;
    }

    time_Down();
    
}

const option1 = document.getElementById('option-1');
const option2 = document.getElementById('option-2');
const option3 = document.getElementById('option-3');
const popup = document.getElementById('popup');
const p = document.getElementById('pause')
const closeBtn = document.getElementById('close-btn');

option1.addEventListener('click', () => {
  popup.style.display = 'flex';
  stopGame = true;
  pause();
});

closeBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  stopGame = false;
  pause();
});

document.querySelector(".p").addEventListener('click', () => {
    //document.querySelector("#pause-hd").innerHTML = '<span class="material-symbols-outlined"> play_arrow </span>'
    p.style.display = 'none';
    document.getElementById("option-3").innerText = 'pause'
    another =1;
    player.dead = false;
    enemy.dead = false;
    time_Down();
})

option3.addEventListener('click', () => {
    if(another ===1) {
        document.querySelector('#pause').style.display = "block";
        p.style.display = 'flex';
        setTimeout(() => {
            p.style.top = '0';
          }, 400);
       
        player.dead = true;
        enemy.dead = true;
        //document.getElementById("option-3").innerHTML = '<span class="material-symbols-outlined"> play_arrow </span>'
        another =0;
        time_Down();
       
    
    } else {
        p.style.display = 'none';
        document.getElementById("option-3").innerText = 'pause'
        another =1;
        player.dead = false;
        enemy.dead = false;
        time_Down();
    }
})

option2.addEventListener('click', () => {
    if(mic ==0) {
        option2.innerHTML = '<span class="material-symbols-outlined"> mic_off</span>'
        mic =1;
        audio1.pause();
    } else {
        option2.innerHTML= '<span class="material-symbols-outlined"> mic</span>'
        mic =0;
        audio1.play();
    }
  // Code to execute when option 2 is clicked
});


