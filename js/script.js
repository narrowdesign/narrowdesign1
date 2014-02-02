/* Author: Nick Jones

*/

/*	HELLO, I INVITE YOU TO USE ANYTHING YOU FIND USEFUL FROM BELOW. 
NO LICENSE OR ATTRIBUTION NECESSARY, UNLESS YOU FEEL LIKE IT.
I'LL BACK YOU UP IF SOMEBODY CALLS YOU OUT FOR "STEALING." IT JUST MEANS THEY NEED LOVE.
PLEASE, SEND ME A LINK THOUGH SO I CAN KNOW THAT I CONTRIBUTED SOMETHING USEFUL.
	
If you're looking for the right way to do what I did here, TURN BACK NOW!
I just hacked and hacked until it worked the way I wanted.
I'd love and appreciate any help I can get to make this cleaner/better since I'm pretty new to this whole scene.

nick@narrowdesign.com
@narrowd

*/
$(document).ready(function() { 
	var touchEnabled = Modernizr.touch;
	var win = $(window);
	var doc = $(document);
	var content;
	var bottomMessages = new Array("GO <span class='in'>the</span> OTHER WAY")

// RESET ON RESIZE
	var WIN_H = win.height();
	var WIN_W = win.width();
	var PROJECT_HEIGHT;
	var LIST_H = $('#project-list').outerHeight()+400;

	var PROJECT_MAX_H; // height of the projects list when expended
	var TOP_MARGIN = 26;
	var MIN_PROJECT_H = 0;
	var SINGLE_PROJECT_H = 104;
	var BOTTOM_MARGIN = (.08*WIN_H)+1;
	var SCALE_FACTOR; //screenScaleFactor w/1000

	var projectsH; // current height of the projects list
	var projectListTop; // current top of the projets list
	var projectsBottom; // needed to adjust on resize
	var logoTop; // adjust on resize
	var contactTop;
	var imageValign;

	var darkGray="#222";
	var lightGray="#aaa";
	var darkGrayColor="rgba(33, 36, 39, .3)";
	var textShadowColor="rgba(33, 36, 39, .04)";
	var red="#ff4454"
	var lightRed="#dcbdb6";
	var darkRed="#b03139";	
	var topOn;

	var currentProject = 0;
	var oldProject;

	var animatingScroll = false;
	var expandingList = false;
	var listExpanded = false;
	var smallScreen = true;

	var oldScrollTop;
	var newScrollTop;
	var newScroll = 0;

	var scrollAmt = 0;

	var touchStartY;
	var touchStartX;
	var touchEndY;
	var touchEndX;
	var touchMoveH;

	var oldMouseY;
	var newMouseY;
	var oldMouseX;
	var newMouseX;
	var moved;
	var movedX;

	var easeInterval;
	var easeIntervalX;
	var inertia = .92;

	var scroll=0;
	var to; // timeout

	var initialized = false;
	var started = false;
	var shadowSet = false;

	var storyOpen = false;
	var articlesOpen = true;

	var events = {
		init: function(){
			content = $('#everything');
			content.css('position','fixed');

			if(touchEnabled){
	 			win.bind('touchstart', function(e) {
				 	//e.preventDefault();
				 	started = false;
				 	stopEasing();
				 	stopEasingX();
				 	var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				 	touchStartY = touch.pageY;
				 	touchStartX = touch.pageX;
				});
				win.bind('touchend', function(e) {
					var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
					touchEndY = touch.pageY;
					touchEndX = touch.pageX;
					if(currentProject){
    					throwImage();
    				}else{
						throwScroll();
    				}
				});
				win.bind('touchmove', function(e) {
					win.bind('click', function(e){
						e.preventDefault();
						win.unbind('click');
					});
					if(!started){
			 			e.preventDefault();
			 			started = true;
			 		}
		 			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
					moved = touch.pageY-touchStartY	
					movedX = touch.pageX-touchStartX;
		 			if(currentProject){
    					imagesScroll(movedX);
    				}else{
						pageScroll(moved);
    				}
		 			touchStartY=touch.pageY;
		 			touchStartX=touch.pageX;
				});
			}else{
				win.bind('mousewheel', function(eventData,deltaY) {
					if(!storyOpen){
						eventData.preventDefault();
					}
					if($.browser.mozilla){
						deltaY*=5;
					}
	    			pageScroll(deltaY*16);
				});
				win.bind('mousedown', function(e){
					e.preventDefault();
					dragging = true;
					stopEasing();
					stopEasingX();
					oldMouseY = e.pageY;
					oldMouseX = e.pageX;
          $(".project").unbind('click');
					$(".project").click(function(){
						expandProject($(this),"click");
					});					
					win.bind('mousemove',function(e) {
						e.preventDefault();
	    				newMouseY = e.pageY;
	    				newMouseX = e.pageX;
	    				$(".project").unbind('click');
	    				win.click( function(e){
							e.preventDefault();
							win.unbind('click');
						});
						moved = newMouseY-oldMouseY;
						movedX = newMouseX-oldMouseX;
	    				pageScroll(moved);
	    				if(Math.abs(moved)<Math.abs(movedX)){
	    					imagesScroll(movedX);
	    				}else{
							pageScroll(moved);
	    				}
						oldMouseY = e.pageY;
						oldMouseX = e.pageX;
	    			});
				});
			 win.bind('mouseup', function(e){
					win.unbind('mousemove');

					if(currentProject){
    					throwImage();
    				}else{
						throwScroll();
    				}
				});			
			}
			$("#contact").mouseover(function(){
				expandContact()
			});
			$("#contact").mouseout(function(){
				to = setTimeout(function(){collapseContact()},100);});
			$(".project").click(function(){
				expandProject($(this),"click");
			});
			$('#articles, #articles-temp').click(function(){
				if(articlesOpen == true){
					hideArticles()
				}else{
					showArticles();
				}
			})
			$('#article-rwd').click(function(e){
				e.stopPropagation();
				window.open("http://www.creativebloq.com/responsive-web-design/i-cannot-design-or-code-responsive-website-9122806");
					_gaq.push(['_trackEvent', 'Article', 'Launch', ".net"]);
			})
			$('#article-father').click(function(e){
				e.stopPropagation();
				window.open("https://medium.com/better-humans/cf72d203b60b");
					_gaq.push(['_trackEvent', 'Article', 'Launch', "Father"]);
			})
			$('#article-human').click(function(e){
				e.stopPropagation();
				window.open("https://medium.com/p/36f0b4c35f6d");
					_gaq.push(['_trackEvent', 'Article', 'Launch', "Human"]);
			})
			$('#top-button,#n').click(function(){
				animatingScroll = true;
				hideTop();
				hideProjects();
				stopEasing();
				stopEasingX();
				moved = getWinTop()/10;
				throwScroll();
				_gaq.push(['_trackEvent', 'Top', 'Clicked']);
			});
			$('#top-button').mouseover(function(){
				$('#top-arrow').css('fill',red);
			});
			$('#top-button').mouseout(function(){
				$('#top-arrow').css('fill',darkGrayColor);
			})
			$(".next-arrow").click(function(){
				nextProject()
			});
			$(".prev-arrow").click(function(){
				prevProject()
			});
			$('#asterisk').mouseover(function(){
				$('#done-yet').show();
			});
			$('#asterisk').mouseout(function(){
				$('#done-yet').hide();
			})
			$('#logo').mouseover(function(){
				
			});
			$('#asterisk').mouseout(function(){
				$('#done-yet').hide();
			});
			$('#launch-btn').click(function(){
				link = currentProject.attr('url');
				if(link != "blank"){
					_gaq.push(['_trackEvent', 'Projects', 'Launch', "http:"+currentProject.attr('id')]);
					launchProject(link);
				}
			});
			$('#instructions').mouseover(function(){
				$('#work').html('SCROLL')
			})
			$('#instructions').mouseout(function(){
				$('#work').html('SO FAR')
			})
			$('#instructions').click(function(){
				startProjects();
				_gaq.push(['_trackEvent', 'Instructions', 'So Far']);
			})
      $('.design-build').click(function(){
        startProjects();
        _gaq.push(['_trackEvent', 'Instructions', 'DESIGN BUILD']);
      })
			$('.email-icon').click(function(){
				_gaq.push(['_trackEvent', 'Email', 'Launch', 'Icon']);
				window.location.href="mailto:nick@narrowdesign.com?subject=So, I was on your site and..."
			});
			$('.twitter-icon').click(function(){
				_gaq.push(['_trackEvent', 'Twitter', 'Launch', 'Icon']);
				window.open("http://twitter.com/narrowd");
			});
			$('#open,#phone').click(function(){
				_gaq.push(['_trackEvent', 'Email', 'Launch', 'HELLO']);
				window.location.href="mailto:nick@narrowdesign.com?subject=So, I was on your site and..."
			});			
			$('#project-list-icon').click(expandList);
			$('#project-list-close').click(function(){
				expandProject(oldProject,"rollout")
			});
			$('#story-btn').click(showStory);
			$('#top-x').click(function(){
				if(storyOpen){
					hideStory();
				}else{
					animatingScroll = true;
					hideTop();
					hideProjects();
					stopEasing();
					stopEasingX();
					moved = getWinTop()/10;
					throwScroll();
				}

			});			
			win.bind('keydown',keyHandler);
			win.bind('resize', pageResize);
			win.bind('orientationchange', checkLandscape);
			pageResize();
			if(smallScreen){
				setTimeout(function(){
				    // Hide the address bar!
				    setTimeout(function(){
				    	window.scrollTo(0, 1);
				    	win.bind('scroll',function(e){
				    		e.preventDefault();
				    	});
				    	setTimeout(function(){
				    		pageResize();
				    	},1000);
				    },1);
				  }, 0);
			}else{
				win.bind('scroll',function(e){
		    		e.preventDefault();
		    	});
				setTimeout(function(){
				    setTransitionDuration($('#design,#codee'),'0s');
				  }, 4000);
				var myTop = getContactTop();
				$('#contact').css('top',myTop);
				$('#ick-jones,#n').css({
					'top':getLogoTop()+'px',
					'-webkit-filter':'blur('+Math.abs(logoTop-getLogoTop())+'px)'
				});
			}
			pageScroll(0);
			initialized = true;
			checkLandscape();

      win.bind('popstate', function(e) {
        var deeplink;
        var delay;
        if(e.originalEvent.state){
          deeplink = e.originalEvent.state;
          delay = 0;
        }else if(window.location.hash){
          startProjects();
          deeplink = window.location.hash.substr(1);
          delay = 1000;
        }
        var hashProject;
        for(var i = 0; i < $(".project").length; i++){
          if($(".project").eq(i).attr('id') == deeplink){
            hashProject = $(".project").eq(i);
            setTimeout(function(){
              window.scrollTo(0, 0);
              expandProject(hashProject,"pop");
            },delay)
          }
        }
      });
		}
	}
	function checkLandscape(){
		pageResize();
		if(smallScreen && Math.abs(window.orientation) > 0){
			$('#landscape-overlay').css('height','150%');
		}else{
			$('#landscape-overlay').css('height','0%');
		}
		window.scrollTo(0, 1);
	}
	function collapseContact () {
		$("#contact-cta").css({
			'margin-top':"0"
		});
		$("#contact-icons").css({
			'margin-top':"84px",
		});
		$("#contact").css({
			'height':'77px',
      background: '#ff4454'
		});
	}
	function expandContact () {
		if(to){clearTimeout(to)};
		$("#contact-cta").css('margin-top','-100px');
		$("#contact-icons").css('margin-top',"-20px");		
		$("#contact").css({
			'height':'300px',
      color: darkGray,
		});
	}
	function pageResize () {
		WIN_H = win.height();
		WIN_W = win.width();
		SCALE_FACTOR = WIN_W/1000;
		PROJECT_H = WIN_H*.62;
		TOP_MARGIN = 26;
		imageValign = 'top';
		BOTTOM_MARGIN = (.08*WIN_H)+1;
		PROJECT_MAX_H = WIN_H-(TOP_MARGIN+BOTTOM_MARGIN);
		SINGLE_PROJECT_H = 104;
		projectsBottom = WIN_H*.92
		logoTop = (WIN_H*.12);
		contactTop=WIN_H*.82;
		if(WIN_W <= 768){
			smallScreen = true;
		}else{
			smallScreen = false;
		}
		//var centerTop = $('#center').css('top').substr(0,$('#center').css('top').length-2);
		if(smallScreen){
			SINGLE_PROJECT_H = 112;
			imageValign = 'center';
			projectsBottom = WIN_H+200;
			logoTop = (WIN_H*.08);
			contactTop = WIN_H*.9;
			TOP_MARGIN = 0;
			BOTTOM_MARGIN = 0;
			PROJECT_MAX_H = WIN_H-(TOP_MARGIN+BOTTOM_MARGIN);
			$('.design-build').css({
				'font-size':15.4*SCALE_FACTOR+'em',
				'margin-left':(-1*SCALE_FACTOR)+'px',
			});
		 	$('#intro-text,#intro-text-temp').css({
		 		top:$('#codee').position().top+$('#codee').height()+160
		 	})		
		}else{
			$('.design-build').css({
				'font-size':7*SCALE_FACTOR+'em',
				'margin-left':(-1*SCALE_FACTOR)+'px',
			});
			$('#intro-text').css({
		 		top:$('#codee').position().top+145
		 	})
		 	$('#intro-text-temp').css({
		 		top:$('#codee').position().top+50
		 	})
		}
		if(!smallScreen){
			setBGW();
		}
		resizeContact();
		$('#projects').css('left',(WIN_W/2)-$('#projects').outerWidth()/2);
		pageScroll();
	}
	function resizeContact(){
		var myLeft = (WIN_W-(WIN_W-50+(Math.min(240,getWinTop())/4)))/2;
		$('#contact').width((WIN_W*.161)-myLeft-1);
		$('#contact').css({
			'left':myLeft
		});
	}
	function keyHandler (argument) {
		if(argument.keyCode==38 || argument.keyCode==37){
			prevProject();
			$('.prev-arrow').addClass('prev-arrow-hover');
			setTimeout(function(){
				$('.prev-arrow').removeClass('prev-arrow-hover');
			},300);
		}else if(argument.keyCode==40 || argument.keyCode==39){
			if(currentProject){
				nextProject();
				$('.next-arrow').addClass('next-arrow-hover');
					setTimeout(function(){
						$('.next-arrow').removeClass('next-arrow-hover');
					},300);
			}else{
				startProjects();
			}	
		}else if(argument.keyCode==32){
			if(currentProject){
				launchProject();
			}
		}
	}
	function launchProject () {
		window.open(link);
	}
	function startProjects () {
		animatingScroll = true;
		hideTop();
		hideProjects();
		stopEasing();
		stopEasingX();
		moved = -WIN_H/12.5;
		throwScroll();
	}
// TOP BUTTON
	function showTop () {
		if(!topOn && !smallScreen){
			topOn = true;
			$('#top-small').css({
				opacity:1,
				'top':'0px'});
		}
		hideArticles();
	}
	function hideTop(){
		if(topOn){
			topOn = false;
			$('#top-small').css({
				opacity:0,
				'top':'50px'});		}
			showArticles();
	}
	function nextProject (argument) {
		if($('.project').eq(currentProject.index()+1).attr('id')){
			expandProject($('.project').eq(currentProject.index()+1),"next");
		}else{
			expandProject($('.project').eq(0),"next");
		}
	}
	function prevProject (argument) {
		var myNum;
		if(currentProject.index() == $('.project').index()){
			myNum = $('.project').index()-2;
		}else{
			myNum = currentProject.index()-1;
		}
		expandProject($('.project').eq(myNum),"prev");
	}
	function pageScroll(deltaY){
		if((!storyOpen || listExpanded) && (Math.abs(deltaY) >= 1 || Math.abs(deltaY) != 0)){
			oldScrollTop = getWinTop();
			if(deltaY > 0){
				scrollAmt = Math.max(deltaY,1);
			}else if(deltaY < 0){
				scrollAmt = Math.min(Number(deltaY),-1);
			}
	// move the container
			newScroll = -getWinTop()+scrollAmt;			
			if(newScroll > 0){
				newScroll = newScroll+(.2*(0-newScroll));
			}else if (newScroll < -(projectsBottom+LIST_H+(-WIN_H+450))){
				newScroll = newScroll+(.2*((-(projectsBottom+LIST_H+(-WIN_H+450)))-newScroll));
			}	
			indicatorScroll = Math.min((WIN_H-110)*(newScroll/-(projectsBottom+LIST_H+(-WIN_H+450))),WIN_H-110);
			
			content.css('top',newScroll);
			$('.indicator').css({
				'top':indicatorScroll
			});
	// Design Build Shadow
			var winTop = getWinTop();
			var projectsTop = getProjectsTop();
			if(winTop < $('.design-build').height()+$('.design-build').position().top + 250){
				$('.design-build').css('display','block');
				if((!smallScreen && !touchEnabled) || !shadowSet){
					$('#design').css({
					'text-shadow':' \
					  1px '+(((winTop/50)/4)*0+0)+'px 2px '+lightRed+', \
					  1px '+(((winTop/50)/4)*1+1)+'px 2px '+darkRed+', \
					  2px '+(((winTop/50)/4)*1+1)+'px 2px '+lightRed+', \
					  2px '+(((winTop/50)/4)*2+2)+'px 2px '+darkRed+', \
					  '+(((winTop/50)/5)*0+4)+'px '+(((winTop/50)/4)*0+0)+'px 3px rgba(33, 36, 39, .11), \
					  '+(((winTop/50)/5)*1+3)+'px '+(((winTop/50)/4)*1+1)+'px 3px rgba(33, 36, 39, .1), \
					  '+(((winTop/50)/5)*2+2)+'px '+(((winTop/50)/4)*2+2)+'px 3px rgba(33, 36, 39, .095), \
					  '+(((winTop/50)/5)*3+1)+'px '+(((winTop/50)/4)*3+3)+'px 3px rgba(33, 36, 39, .085), \
					  '+(((winTop/50)/5)*4-0)+'px '+(((winTop/50)/4)*4+4)+'px 3px rgba(33, 36, 39, .08), \
					  '+(((winTop/50)/5)*5-1)+'px '+(((winTop/50)/4)*5+5)+'px 3px rgba(33, 36, 39, .075), \
					  '+(((winTop/50)/5)*6-2)+'px '+(((winTop/50)/4)*6+6)+'px 3px rgba(33, 36, 39, .07), \
					  '+(((winTop/50)/5)*7-3)+'px '+(((winTop/50)/4)*7+7)+'px 3px rgba(33, 36, 39, .065), \
					  '+(((winTop/50)/5)*8-4)+'px '+(((winTop/50)/4)*8+8)+'px 3px rgba(33, 36, 39, .06), \
					  '+(((winTop/50)/5)*9-5)+'px '+(((winTop/50)/4)*9+9)+'px 3px rgba(33, 36, 39, .055), \
					  '+(((winTop/50)/5)*10-6)+'px '+(((winTop/50)/4)*10+10)+'px 3px rgba(33, 36, 39, .05), \
					  '+(((winTop/50)/5)*11-7)+'px '+(((winTop/50)/4)*11+11)+'px 3px rgba(33, 36, 39, .045), \
					  '+(((winTop/50)/5)*12-8)+'px '+(((winTop/50)/4)*12+12)+'px 3px rgba(33, 36, 39, .04), \
					  '+(((winTop/50)/5)*13-9)+'px '+(((winTop/50)/4)*13+13)+'px 3px rgba(33, 36, 39, .035), \
					  '+(((winTop/50)/5)*14-10)+'px '+(((winTop/50)/4)*14+14)+'px 3px rgba(33, 36, 39, .03), \
					  '+(((winTop/50)/5)*15-11)+'px '+(((winTop/50)/4)*15+15)+'px 3px rgba(33, 36, 39, .025)'
					 });
					$('#codee').css({
						'text-shadow':' \
					  1px '+(((winTop/50)/4)*0+0)+'px 2px '+lightGray+', \
					  1px '+(((winTop/50)/4)*1+1)+'px 2px '+darkGray+', \
					  2px '+(((winTop/50)/4)*1+1)+'px 2px '+lightGray+', \
					  2px '+(((winTop/50)/4)*2+2)+'px 2px '+darkGray+', \
					  '+(((winTop/50)/5)*0+4)+'px '+(((winTop/50)/4)*0+0)+'px 3px rgba(33, 36, 39, .11), \
					  '+(((winTop/50)/5)*1+3)+'px '+(((winTop/50)/4)*1+1)+'px 3px rgba(33, 36, 39, .1), \
					  '+(((winTop/50)/5)*2+2)+'px '+(((winTop/50)/4)*2+2)+'px 3px rgba(33, 36, 39, .095), \
					  '+(((winTop/50)/5)*3+1)+'px '+(((winTop/50)/4)*3+3)+'px 3px rgba(33, 36, 39, .085), \
					  '+(((winTop/50)/5)*4-0)+'px '+(((winTop/50)/4)*4+4)+'px 3px rgba(33, 36, 39, .08), \
					  '+(((winTop/50)/5)*5-1)+'px '+(((winTop/50)/4)*5+5)+'px 3px rgba(33, 36, 39, .075), \
					  '+(((winTop/50)/5)*6-2)+'px '+(((winTop/50)/4)*6+6)+'px 3px rgba(33, 36, 39, .07), \
					  '+(((winTop/50)/5)*7-3)+'px '+(((winTop/50)/4)*7+7)+'px 3px rgba(33, 36, 39, .065), \
					  '+(((winTop/50)/5)*8-4)+'px '+(((winTop/50)/4)*8+8)+'px 3px rgba(33, 36, 39, .06), \
					  '+(((winTop/50)/5)*9-5)+'px '+(((winTop/50)/4)*9+9)+'px 3px rgba(33, 36, 39, .055), \
					  '+(((winTop/50)/5)*10-6)+'px '+(((winTop/50)/4)*10+10)+'px 3px rgba(33, 36, 39, .05), \
					  '+(((winTop/50)/5)*11-7)+'px '+(((winTop/50)/4)*11+11)+'px 3px rgba(33, 36, 39, .045), \
					  '+(((winTop/50)/5)*12-8)+'px '+(((winTop/50)/4)*12+12)+'px 3px rgba(33, 36, 39, .04), \
					  '+(((winTop/50)/5)*13-9)+'px '+(((winTop/50)/4)*13+13)+'px 3px rgba(33, 36, 39, .035), \
					  '+(((winTop/50)/5)*14-10)+'px '+(((winTop/50)/4)*14+14)+'px 3px rgba(33, 36, 39, .03), \
					  '+(((winTop/50)/5)*15-11)+'px '+(((winTop/50)/4)*15+15)+'px 3px rgba(33, 36, 39, .025)'
					 });
				}else{
					$('#design,#codee').css({
						'text-shadow':'none'
					});
				}
			}else{
				$('.design-build').css('display','none');
			}
			shadowSet = true;
	// reset transitions
			if(!expandingList){
				setTransitionDuration($('#project-list,#projects'),'0s')
			}
			if(!smallScreen){
				if($('#contact').css('top').substr(0,$('#contact').css('top').length-2)<10){	
					showTop();
				}else{
					hideTop();	
				}
			}
				
	// border
			setBGW();
	// logo
			if(!smallScreen){
				var newLogoTop = getLogoTop();
				var newContactTop = getContactTop();
				if(newLogoTop <= 32){
					$('#ick-jones,#n').css('top','32px');
					$('#ick-jones').css({
						opacity:0
					});
				}else{
					$('#ick-jones,#n').css('top',newLogoTop+'px');
					$('#ick-jones').css({
						opacity:(newLogoTop-57)/((WIN_H*.12)-57),
						'-webkit-filter':'blur('+Math.max(0,(logoTop-newLogoTop)/4)+'px)'
					});
				}
				if(newContactTop <= 0){
					$('#contact').css('top',0+'px');
					collapseContact();
				}else{
					$('#contact').css('top',newContactTop+'px');
					if($('#contact').height() == 53){
						expandContact();
					}
				}			
			}else{
				// $('#ick-jones').css({
				// 	opacity:Math.abs(1/(getWinTop()/5))
				// });
			}
	// contact

	// stick to the top and don't keep growing the list
			if(projectsTop < TOP_MARGIN){
				if(smallScreen){
					$('#top-x').css('display','block')
				}
				$('#projects').css('top',TOP_MARGIN+'px');
	// reveal the project menu			
				if(currentProject){
					$('#projects').css({
						height:SINGLE_PROJECT_H
					})
					setTransitionDuration($('#project-sub-menu'),'.4s');
					showSubMenu();
				}
			}else{
	// hide the project menu
				$('#top-x').css('display','none')
				$('#projects').css('top',projectsTop+'px');
				setTransitionDuration($('#project-sub-menu'),'.4s');
				$('#project-sub-menu').css({
					width:'200px',
					'margin-left':'-100px',
					opacity:0
				});
			}
	// grow/shrink list on scroll
			if(!currentProject){
				projectsH = MIN_PROJECT_H+winTop;
				if(winTop < 2){
					$('#instructions').css({
						height:WIN_W/6,
						width:WIN_W/6,
						'margin-left':-WIN_W/10.9,
						'margin-bottom':50,
						opacity:1
					});
					$('#work').css({
						'font-size':'1em',
					});
					$('#down-arrow').css({
						top:'47%'
					});
					setTransitionDuration($('#projects'),'.3s');
					hideProjects();
				}else if(projectsH < PROJECT_MAX_H){
					$('#instructions').css({
						height:50,
						width:50,
						'margin-left':-25,
						'margin-bottom':108,
						opacity:0
					});
					$('#work').css({
						'font-size':'.4em',
					});
					$('#down-arrow').css({
						top:'20%'
					});
					$('#projects').height(projectsH);
					$('#project-list').css('margin-top','0px');
				}else{
					$('#instructions').css({
						height:0
					});
					$('#projects').height(PROJECT_MAX_H);
					projectListTop = (PROJECT_MAX_H-projectsH)/1.5;
					if(projectListTop > -LIST_H+PROJECT_MAX_H){		
						$('#project-list').css('margin-top',projectListTop+'px');
					}else{
						$('#project-list').css('margin-top',LIST_H+PROJECT_MAX_H+'px');
					}
				};
			}
			if(winTop < 700){
				$('#project-image-small, #project-image-mid, #project-image-big').css({
					opacity:0
				});
				hideStory();
			}else if(currentProject || oldProject){
				$('#project-image-small, #project-image-mid, #project-image-big').css({
					opacity:1
				});
			}
			newScrollTop = winTop;
		}else{
			$('#other-way,#other-way-2').html(bottomMessage());
		}
	}
	function setBGW (argument) {
		if(!smallScreen && !touchEnabled){
			if(getWinTop() < 240){
				$('#bg').css({
					'background':'#222 url("img/bg.jpg") 100% 100%',
					width:WIN_W-50+(getWinTop()/4),
					height:WIN_H-50+(getWinTop()/4),
					left:25-(getWinTop()/8),
					top:25-(getWinTop()/8)
				});
			}else{
				$('#bg').css({
					'background':'#222 url("img/bg.jpg") 100% 100%',
					width:WIN_W-50+(240/4),
					height:WIN_H-50+(240/4),
					left:25-(240/8),
					top:25-(240/8)
				});
			}
			resizeContact();
		}else{
			$('#other-way').css('top',-50)
			$('#bg').css({
				'background':'#d0d8c9',
				width:"100%",
				height:'100%',
				left:0,
				top:0
			});
		}
	}
	function throwScroll () {
		if(Math.abs(moved) > 1){
			easeInterval = setInterval(function(){
				moved = moved*inertia;
				if(Math.abs(moved) < 1){
					stopEasing();
				}
				pageScroll(moved);
			},10);
		}
	}
	function throwImage () {
		if(Math.abs(movedX) > 1){
			easeIntervalX = setInterval(function(){
				movedX = movedX*inertia;
				if(Math.abs(movedX) < 1){
					stopEasingX();
				}
				imagesScroll(movedX);
			},10);
		}
	}
	function showSubMenu(){
		$('#project-sub-menu').css({
			display:'block',
			width:'420px',
			'margin-left':'-210px',
			opacity:1
		});
	}
	function bottomMessage(){
		return bottomMessages[Math.floor(Math.random()*bottomMessages.length)];
	}
	function stopEasing(){
		moved = 0;
		clearInterval(easeInterval);
	}
	function stopEasingX(){
		setTransitionDuration($('#project-image-small, #project-image-mid, #project-image-big'),'0s');
		moved = 0;
		clearInterval(easeIntervalX);
	}	
	function getWinTop () {
		return -newScroll;
	}
	function getLogoTop(){
		return logoTop-(getWinTop()/10);
	}
	function getContactTop(){
		return WIN_H-175-(getWinTop());
	}
	function getCenterTop(){
		return (WIN_H*.14)-(getWinTop());
	}
	function getProjectsTop(){
		return (projectsBottom)-(getWinTop());
	}
	function hideProjects (argument) {
		hideStory();
		setTransitionDuration($('#projects'),'1s');
		$('#projects').height(0);
		currentProject = 0;
		oldProject = "";
	}		
	function expandProject (project,type) {
		if(smallScreen){
			$('#top-small').css({
				opacity:0,
				top:'-200px'
			});
		}
		expandingList = false;
		listExpanded = false;
		win.unbind('click');
		$('#project-list-close').css({
			'display':'none'
		})
		stopEasing();
		stopEasingX();
// animate scroll to selected project (fix this)		
		if(currentProject){
			oldProject = currentProject;
		}else{
			oldProject = "";
		}
		currentProject = project;
		if(getWinTop() < projectsBottom){
			moved = -90;
			if(smallScreen){
				moved = moved*3
			}
			throwScroll();
		}
		animatingScroll = true;
		showSubMenu();
		$('#project-list-icon').css({
			'display':'block'
		})
		setTransitionDuration($('#projects'),'.5s');
		$('#projects').css({
			'height':SINGLE_PROJECT_H+'px'
		});
		setTransitionDuration($('#project-list'),'.6s');		
		$('#project-list').css({
			'margin-top':(-currentProject.index()*102)-33
		});
		if(type != "rollout"){
			$('#project-image-big').css({
				opacity:0,
				'background':'#222 url("img/'+currentProject.attr('id')+'_big.jpg") left top',
				'background-size':'cover'
			});
			$('#project-image-mid').css({
				opacity:0,
				'background':'#222 url("img/'+currentProject.attr('id')+'_mid.jpg") left top',
				'background-size':'cover'			
			});
			$('#project-image-small').css({
				opacity:0,
				'background':'#222 url("img/'+currentProject.attr('id')+'_small.jpg") left top',
				'background-size':'cover'
			});
			$('#story-btn').css({
				color: 'rgba(243,248,247,.2)'
			});
			$('#launch-btn').css({
				color: 'rgba(243,248,247,.2)'
			});
			if(!smallScreen){
				setTimeout(function(){setTransitionDuration($('#project-image-big'),'.2s');$('#project-image-big').css({
					opacity:1});
				},200);
				setTimeout(function(){setTransitionDuration($('#project-image-mid'),'.2s');$('#project-image-mid').css({
					opacity:1});
				},440);
				setTimeout(function(){setTransitionDuration($('#project-image-small'),'.2s');$('#project-image-small').css({
					opacity:1
				});},600);
				setTimeout(function(){
					setTransitionDuration($('#launch-btn'),'.2s');
					if(!currentProject.attr('url')=="blank"){
						$('#launch-btn').css({
							opacity: .3,
							color: '#222'
						});
					}else{
						$('#launch-btn').css({
							opacity: 1,
							color: '#222'
						});
					}
				},800);				
				setTimeout(function(){setTransitionDuration($('#story-btn'),'.2s');$('#story-btn').css({
					color:'#222'
				});},900);
			}else{
				$('#project-image-small,#project-image-mid,#project-image-big').css({
					opacity:1
				})
			}
		}
		setTimeout(function(){
			animatingScroll = false;
			pageScroll(0)
		},600);
		$('#project-description p').html(currentProject.find($('h4')).html());
		$('#project-credits p').html(currentProject.find($('.project-credits')).html());
		$('#project-description,#project-credits').scrollTop(0);
		if(currentProject.attr('id') == "nickjones"){
			showStory();
			$('#project-list').css({
				'margin-top':(-currentProject.index()*102)-$('#list-message').height()+7
			});
		}
    if(type != "pop"){
      window.history.pushState(currentProject.attr('id'), null, '#'+currentProject.attr('id'));
    }
		_gaq.push(['_trackEvent', 'Projects', 'Expand', currentProject.attr('id')]);
	}
	function imagesScroll(movedX){
		var movedX = Number($('#project-image-big').css('background-position').substr(0,$('#project-image-big').css('background-position').indexOf('px')))+movedX;
		setTransitionDuration($('.project-image'),'0s');
		$('#project-image-big').css({
			'background':'#222 url("img/'+currentProject.attr('id')+'_big.jpg") '+movedX+'px',
			'background-size':'cover'
		});
		$('#project-image-mid').css({				
			'background':'#222 url("img/'+currentProject.attr('id')+'_mid.jpg") '+movedX*.8+'px',
			'background-size':'cover'
		});
		$('#project-image-small').css({				
			'background':'#222 url("img/'+currentProject.attr('id')+'_small.jpg") '+movedX*.5+'px',
			'background-size':'cover'
		});
	}
	function showStory(){
		var h = "100%"
		if(smallScreen){
			h = WIN_H;
		}
		if(!smallScreen){
			$('#project-description, #project-credits').css({
				height:WIN_H + -140
			});
		}else{
			$('#project-description, #project-credits').css({
				height:"118%"
			});
		}
		$('#top-x').css('display','block');
		storyOpen = true;
		_gaq.push(['_trackEvent', 'Projects', 'Read Story', currentProject.attr('id')]);
	}
	function hideStory (argument) {
		if(!smallScreen){
			$('#top-x').css('display','none');
		}
		$('#project-description, #project-credits').css({
			height:'0'
		});
		storyOpen = false;
	}
	function expandList (argument) {
		expandingList = true;
		listExpanded = true;
		if(currentProject){
			projectsH = MIN_PROJECT_H+getWinTop();
			projectListTop = (PROJECT_MAX_H-projectsH)/1.5;

			oldProject = currentProject;
			setTransitionDuration($('#projects'),'.3s');
			$('#projects').css({
				'height':PROJECT_MAX_H+'px'
			});
			setTransitionDuration($('#project-list'),'.6s');			
			$('#project-list').css({
				'margin-top':projectListTop
			});
			$('#project-list-icon').css({
				'display':'none'
			})
			$('#project-list-close').css({
				'display':'block'
			})
			$('#project-sub-menu').css({
				width:'0px',
				'margin-left':'-100px',
				opacity:0
			});
			setTimeout(function(){
				expandingList = false;
				setTransitionDuration($('#project-list,#projects'),'0s');
			},700);
		}else{
			pageScroll();
		}
		if(smallScreen){
			$('#top-small').css({
				opacity:1,
				top:'0px'
			});
		}
		currentProject = 0;
	}
	function hideArticles(){
		articlesOpen = false
		$('#articles,#articles-temp').css({
			height:70,
			width:'320',
			'padding':'13px 20px 10px 30px',
		})
		$('#article-x').html('+');
	}
	function showArticles(){
		articlesOpen = true
		$('#articles').css({
			height:340,
			width:'22%',
			'padding':'30px 20px 10px 30px',
		})
		$('#articles-temp').css({
			height:190,
			width:'22%',
			'padding':'30px 20px 10px 30px',
		})
		$('#article-x').html('×');
	}
	function setTransitionDuration(target,duration){
			target.css({
				'-webkit-transition-duration':duration,
				'-moz-transition-duration':duration,
				'-o-transition-duration':duration,
				'-ms-transition-duration':duration,
				'transition-duration':duration,
			});
	}
	events.init();
});














