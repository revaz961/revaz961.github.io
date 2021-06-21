		document.body.style.height = window.innerHeight + "px";
		document.body.style.overflow = "hidden";
		// document.body.style.cursor = "url(images/cursor1.png) 12 12,auto";
		var time = 0;
		var left_sec = 0, right_sec = 0, left_min = 0, right_min = 0;
		var delay = 25;
		var score = 0;
		var difficulty_changer = [7,20];
		var timer_interval;
		var img_counter = 1;
		var is_start = false;
		var music_muted = sound_muted = false;
		var current_score = 1, current_time;
		var rate_time_1 = rate_time_2 = rate_time_3 = "00 : 00";
		var rate_score_1 = rate_score_2 = rate_score_3 = 0;
		var is_played = false;
		var is_paused = false;
		var is_fullscreen = false;
		var user, user_score_1 = user_score_2 = user_score_3 = user_time_1 = user_time_2 = user_time_3 = "...";
		var win_header = document.getElementById("win_header");
		var screen_mode = document.getElementById('full_screen');
		var pause_header = document.getElementById('paused');
		var pause_btn1 = document.getElementById('pause_btn');
		var pause_btn = document.getElementById('pause');
		var music_mute_btn = document.getElementById('music_mute');
		var sound_mute_btn = document.getElementById('sound_mute');
		var rate_by_time = document.getElementById('time_rate');
		var list_1 = rate_by_time.querySelectorAll('li');
		var rate_by_score = document.getElementById('score_rate');
		var list = rate_by_score.querySelectorAll('li');
		var bg_btn = document.getElementById('bg_btn');
		var difficulty = document.getElementById('difficulty');
		var score_header = document.getElementById('score_header');
		var game_over_header = document.getElementById('game_over_header');
		var user_name = document.getElementById('user');
		var start_btn = document.getElementById('start_btn');
		var clock = document.getElementById('clock');
		var bg_music = new Audio("audio/bg_music.mp3");
		var audio_game_over = new Audio("audio/game_over.mp3");




		function object(){
			this.click_sound = new Audio("audio/click.mp3");
			this.click_sound.volume = 0.2;
			if(sound_muted){
				this.click_sound.muted = true;
			}else{
				this.click_sound.muted = false;
			}
			this.posX = Math.round(Math.random() * (window.innerWidth - 250));
			this.posY = Math.round(Math.random() * (window.innerHeight - 250) + 50);
			this.size = 200;
			this.degree = 0;
			this.div = document.createElement("div");
			this.div.style.height = this.size + "px";
			this.div.style.width = this.size + "px";
			this.div.style.transform = "rotate(" + this.degree + "deg)";
			this.div.style.backgroundImage = "url(images/10.jpg)";
			this.div.style.backgroundSize = "100% 100%";
			this.div.style.borderRadius = "100%";
			this.div.style.position = "absolute";
			this.div.style.left = this.posX + "px";
			this.div.style.top = this.posY + "px";
			document.body.appendChild(this.div);
			this.changeValue = function (){
					this.size = this.size - 3;
					this.degree = this.degree + 3;
					this.div.style.height = this.size + "px";
					this.div.style.width = this.size + "px";
					this.div.style.transform = "rotate(" + this.degree + "deg)";
			}
		}


		function play(){
			var game_interval = setInterval(function(){

				if(!is_paused){
					if(bg_music.duration <= time){
						clearInterval(game_interval);
						win();
					}
					if(score > difficulty_changer[1] || bg_music.duration / difficulty_changer[0] < time){
					delay -= 2;
					difficulty_changer[1] = difficulty_changer[1] + 20;
					difficulty_changer[0] = difficulty_changer[0] - 1;
					}
				var obj = new object();
				var interval = setInterval(function(){
					if(!is_paused){
						obj.changeValue();
						obj.div.onclick = function(){
							if(is_start){
								if(!is_paused){
									obj.click_sound.play();
									clearInterval(interval);
									event.cancelBubble = true;
									score += 1;
									if(current_score < score){
										current_score = score;
									}
									score_header.innerHTML = "score: " + score;
									document.body.removeChild(obj.div)
									obj = null;
								}
							}
						}
						if (obj.size <=30){
							clearInterval(interval);
							document.body.removeChild(obj.div)
							if(score > 0){
								score -= 1;
								score_header.innerHTML = "score: " + score;
							}			
							if (score <= 0) {
								clearInterval(game_interval);
								if(is_start){
									gameOver();
								}
							}
						}
					}
				},delay);
			}
			},400);
		}
		

		function rating(){
			if(rate_score_1 == 0){
				rate_score_1 = current_score;
				user_score_1 = user;
			}else if(current_score > rate_score_1 && rate_score_3 != 0){
				user_score_2 = user_score_1;
				user_score_1 = user;
				rate_score_2 = rate_score_1;
				rate_score_1 = current_score;
			}else if(current_score > rate_score_1){
				user_score_3 = user_score_2;
				user_score_2 = user_score_1;
				user_score_1 = user;
				rate_score_3 = rate_score_2;
				rate_score_2 = rate_score_1;
				rate_score_1 = current_score;
			}else if(current_score < rate_score_1 && current_score > rate_score_2){
				user_score_3 = user_score_2;
				user_score_2 = user;
				rate_score_3 = rate_score_2;
				rate_score_2 = current_score;
			}else if(current_score < rate_score_2 && current_score > rate_score_3){
				user_score_3 = user;
				rate_score_3 = current_score;
			}
			list[0].innerHTML = "1." + user_score_1 + " - " + rate_score_1;
			list[1].innerHTML = "2." + user_score_2 + " - " + rate_score_2;
			list[2].innerHTML = "3." + user_score_3 + " - " + rate_score_3;


			if(rate_time_1 == "00 : 00"){
				rate_time_1 = current_time;
				user_time_1 = user;
			}else if(current_time > rate_time_1 && rate_time_3 != "00 : 00"){
				user_time_2 = user_time_1;
				user_time_1 = user;
				rate_time_2 = rate_time_1;
				rate_time_1 = current_time;
			}else if(current_time > rate_time_1){
				user_time_3 = user_time_2;
				user_time_2 = user_time_1;
				user_time_1 = user;
				rate_time_3 = rate_time_2;
				rate_time_2 = rate_time_1;
				rate_time_1 = current_time;
			}else if(current_time < rate_time_1 && current_time > rate_time_2){
				user_time_3 = user_time_2;
				user_time_2 = user;
				rate_time_3 = rate_time_2;
				rate_time_2 = current_time;
			}else if(current_time < rate_time_2 && current_time > rate_time_3){
				user_time_3 = user;
				rate_time_3 = current_time;
			}
			list_1[0].innerHTML = "1." + user_time_1 + " - " + rate_time_1;
			list_1[1].innerHTML = "2." + user_time_2 + " - " + rate_time_2;
			list_1[2].innerHTML = "3." + user_time_3 + " - " + rate_time_3;
		}

		function changeScreenMode(){
			event.cancelBubble = true;
			if(!is_fullscreen){
				if (document.documentElement.requestFullscreen) {
				    document.documentElement.requestFullscreen();
				  } else if (document.documentElement.mozRequestFullScreen) {
				    document.documentElement.mozRequestFullScreen();
				  } else if (document.documentElement.webkitRequestFullscreen) {
				    document.documentElement.webkitRequestFullscreen();
				  } else if (document.documentElement.msRequestFullscreen) {
				    document.documentElement.msRequestFullscreen();
				  }
				  screen_mode.style.backgroundImage = "url(images/no-fullscreen.png)"
				  is_fullscreen = true;
			}else{
				if (document.exitFullscreen) {
		            document.exitFullscreen();
		        } else if (document.webkitExitFullscreen) {
		            document.webkitExitFullscreen();
		        } else if (document.mozCancelFullScreen) {
		            document.mozCancelFullScreen();
		        } else if (document.msExitFullscreen) {
		            document.msExitFullscreen();
		        }
		        screen_mode.style.backgroundImage = "url(images/fullscreen.png)"
		         is_fullscreen = false;
			}
			setTimeout(function(){
				document.body.style.height = window.innerHeight + "px";
			},100);
		}

		function pause(){
			event.cancelBubble = true;
			if(is_start){
				if(is_paused){
					is_paused = false;
					pause_btn.style.backgroundImage = "url('images/pause.png')";
					bg_music.play();
					pause_btn1.style.display = "none";
					pause_header.style.display = "none";
				}else{
					is_paused = true;
					pause_btn.style.backgroundImage = "url('images/play.png')";
					bg_music.pause();
					pause_btn1.style.display = "inline-block";
					pause_header.style.display = "inline-block";
				}
			}
		}

		document.onkeypress = function (event){
			if(is_start){
				if(event.key == 'p'){
					if(is_paused){
						is_paused = false;
						pause_btn.style.backgroundImage = "url('images/pause.png')";
						bg_music.play();
						pause_btn1.style.display = "none";
						pause_header.style.display = "none";
					}else{
						is_paused = true;
						pause_btn.style.backgroundImage = "url('images/play.png')";
						bg_music.pause();
						pause_btn1.style.display = "inline-block";
						pause_header.style.display = "inline-block";
					}
				}
			}
		}

		function muteMusic(){
			event.cancelBubble = true;
			if(music_muted){
				music_mute_btn.style.backgroundImage = "url('images/music.png')";
				bg_music.muted = false;
				music_muted = false;
			}else{
				music_mute_btn.style.backgroundImage = "url('images/no-music.png')";
				bg_music.muted = true;
				music_muted = true;
			}
		}

		function muteSound(){
			event.cancelBubble = true;
			if(sound_muted){
				sound_mute_btn.style.backgroundImage = "url('images/speaker.png')";
				sound_muted = false;
				audio_game_over.muted = false;
			}else{
				sound_mute_btn.style.backgroundImage = "url('images/no-speaker.png')";
				audio_game_over.muted = true;
				sound_muted = true;
			}
		}

		function changeDifficulty(){
			event.cancelBubble = true;
			if( difficulty.innerHTML == "easy"){
				difficulty.innerHTML = "hard";
				delay = 18;
				difficulty_changer[0] = 5;
				difficulty_changer[1] = 25;
			}else if(difficulty.innerHTML == "hard"){
				difficulty.innerHTML = "expert";
				delay = 14;
				difficulty_changer[0] = 4;
				difficulty_changer[1] = 30;
			}else if(difficulty.innerHTML == "expert"){
				difficulty.innerHTML = "easy";
				delay = 25;
				difficulty_changer[0] = 7;
				difficulty_changer[1] = 20;
			}
		}

		function bgChange(){
			event.cancelBubble = true;
			if(img_counter == 5){
				img_counter = 1;
				document.body.style.backgroundImage = "url(images/" + img_counter + ".jpg)";
			}else{
				img_counter++;
				document.body.style.backgroundImage = "url(images/" + img_counter + ".jpg)";
			}
		}

		function timer(){
			timer_interval = setInterval(function(){
				if(!is_paused){
				time += 1;
				right_sec = time % 10;
				left_sec = Math.floor((time % 60) / 10);
				right_min = Math.floor(time / 60);
				left_min = Math.floor(Math.floor(time / 60) / 10);
				clock.innerHTML = "" + left_min + right_min + " : " + left_sec + right_sec;
			}
			},1000);
		}

		function start(){

			user = user_name.value;
			is_start = true;
			bg_music.play();			
			event.cancelBubble = true;
			timer();
			game_over_header.style.display = "none";
			start_btn.style.display = "none";
			user_name.style.display = "none"
			difficulty.style.display = "none";
			bg_btn.style.display = "none";
			rate_by_time.style.left = "-400px";
			rate_by_score.style.right = "-400px";
			win_header.style.display = "none";
			play();
		}

		function gameOver(){
				current_time = "" + left_min + right_min + " : " + left_sec + right_sec;
				rating();
				left_sec = 0;
				right_sec = 0;
				left_min = 0;
				right_min = 0;
				time = 0;
				current_score = 1;
				clock.innerHTML = "" + left_min + right_min + " : " + left_sec + right_sec;
				is_start = false;
				user_name.value = "";
				clearInterval(timer_interval)
				bg_music.pause();
				bg_music.currentTime = 0.0;
				audio_game_over.play();
				score = 0;
				game_over_header.style.display = "inline-block";
				start_btn.style.display = "inline-block";
				user_name.style.display = "inline-block";
				difficulty.style.display = "inline-block";
				bg_btn.style.display = "inline-block";
				rate_by_time.style.left = "10px";
				rate_by_score.style.right = "50px";
				score_header.innerHTML = "score: " + score;
				difficulty.innerHTML = "easy";
				delay = 25;
		}

		function win(){
			current_time = "" + left_min + right_min + " : " + left_sec + right_sec;
			rating();
			left_sec = 0;
			right_sec = 0;
			left_min = 0;
			right_min = 0;
			time = 0;
			current_score = 1;
			clock.innerHTML = "" + left_min + right_min + " : " + left_sec + right_sec;
			bg_music.pause();
			bg_music.currentTime = 0.0;
			score = 0;
			score_header.innerHTML = "score: " + score;
			user_name.value = "";
			is_start = false;
			clearInterval(timer_interval)
			win_header.style.display = "block"
			start_btn.style.display = "inline-block";
			user_name.style.display = "inline-block";
			difficulty.style.display = "inline-block";
			bg_btn.style.display = "inline-block";
			rate_by_time.style.left = "10px";
			rate_by_score.style.right = "50px";
			difficulty.innerHTML = "easy";
			delay = 25;
		}

		function missClick(){
			if(!is_paused){
				if(is_start){
					score -= 1;
					score_header.innerHTML = "score: " + score;
					if (score < 0) {
						gameOver();
					}
				}
			}
		}