// waiting for the window
$(window).ready(function() {
	// creating my vue app
	window.myApp = new Vue({
		el: '#app',
		data: {
			connected:null, // defines the connected user facebook ID
			checking:true, // defines if we're checking if the user is connected
			showBack:false, // defines if the back button should be displayed 
			showIntro:true, // defines if the header intro should be displayed
		    friends: [], // list of all friends
		    friend: {}, // current friend
		    photos: [], // photos to show
		    cache: {} // 'cache' for photos (so a photo tagged with multiple people will only be loaded once)
		},
    	created: function() {
    		// as soon as the app is created, we check the storage to set the friend lsit
        	var ls = localStorage.getItem('tagged-friends');
        	if (ls) this.friends = JSON.parse(ls);
    	},
		methods: {
			/* *************************************
			* Method called after the facebook login
			************************************* */
			onLogin: function() { 	
				// storing the #friend-page element for future use
				$friendpage = $('#friend-page'); 
				// requesting all photos
        		this.getPhotos();     
				// checking the hash for a user ID
        		var hash = location.href.split('#');
        		if (hash.length && hash[1]) {
        			// if there is something there, check if it's a friend
        			var friend = this.getFriend(hash[1]);
        			// if it is, show him/her!
        			if (friend) return this.showFriend(hash[1]);
        		}
        		// if no hash/friend is found, simply show the home
        		this.showHome();
        	},
        	/* *************************************
			* Method to request facebook photos from the user
			************************************* */
			getPhotos: function(url) {
				// if no url is passed, let's use the basic one
			    if (!url) url = '/me/photos?fields=id';
			    // doing a FB request
			    FB.api(url,function(feed) {
			    	// if there is data, let's iterate it
			        for (var i = 0; feed.data && i < feed.data.length; i++) {
			        	// photo data
			            var photo = feed.data[i];
			            // getting its tags
			            this.getTags({'id':photo.id,'url':'/'+photo.id+'/tags','urlface':'http://facebook.com/'+photo.id});            
			        }
			        // if there is paging and there is a next page, let's fetch it (calling this same method but now passing the page url)
			        if (feed.paging && feed.paging.next) this.getPhotos(feed.paging.next);
			    }.bind(this));
			},
        	/* *************************************
			* Method to request facebook tags from the picture
			************************************* */
			getTags: function(photo,callback) {	
				// doing a FB request
			    FB.api(photo.url,function(feed) {
			    	// if there is data, let's iterate it
			        for (var i = 0; feed.data && i < feed.data.length; i++) {
			        	// tag data
			            var tag = feed.data[i];
			            // if there is callback defined, let's call it
			            if (callback) callback(tag,photo);  
			            // if there isn't, lets simply save this tag
			            else this.saveTag(tag,photo);
			        }
			        // if there is paging and there is a next page, let's fetch it (calling this same method but now passing the page url)
			        if (feed.paging && feed.paging.next) {
			        	photo.url = feed.paging.next;
			        	this.getTags(photo,callback);
			        }
			    }.bind(this));
			},
        	/* *************************************
			* Method to (try to) get a friend based on its ID
			************************************* */
			getFriend: function(id) {	
				// iterating all friend
				for (var i = 0; i < this.friends.length; i++) {
					// getting its id
					var f = this.friends[i];
					// checking if the ids match
					if (f.id == id) return f;
				}
			},
        	/* *************************************
			* Method to show the home page
			************************************* */
			showHome: function(event) {
				// if we were showing a friend, we'll remove the hash/tag from the location
				if (this.friend.id) history.pushState("",document.title,window.location.pathname+window.location.search);
				// resetting the friend data
				this.friend = {};
				// preventing any DOM event that triggered this
				if (event) event.preventDefault();
				// removing the fakescroll so the body can scroll properly
				$('body').removeClass('fakescroll');
				// scrolling back to the saved scroll position
				$(window).scrollTop(this.savedScroll);
				// hidden the back button
				this.showBack = false;
				// resetting the search field
				$('#search').val('');
				$('#search').blur();
				// simulating a keyup so the results get updated
				this.onKeyUp();
				// hiding the fiends page
				$friendpage.stop().fadeOut(200,function() {
					// resetting the current photo list
					this.photos = [];
				}.bind(this));
			},
        	/* *************************************
			* Method to save a tag to the app base
			************************************* */
			saveTag: function(tag,photo) {
				// if for some reason this tag doesn't have an id (tag.id is the user tagged id), we ignore this call
				if (!tag.id) return;
				// if this is the first time this photo is being processed, we create the tags attribute on it
				if (!photo.tags) photo.tags = [];
				// adding the tag to the photo tags list
				photo.tags.push(tag);

				// getting the friend tagged
				var friend = this.getFriend(tag.id);
				// if the tag id doesn't match any friends currently stored
				if (!friend) {
					// we create a new friend					
					friend = {
						'id':tag.id,
						'name':tag.name,
						'img':'http://graph.facebook.com/'+tag.id+'/picture?type=square',
						'pics':[],
						'ready':false,
						'visible':true,
						'cover':'images/cover.jpg'
					};
					// and do a FB request to get its cover image
					FB.api('/'+tag.id+'?fields=cover',function(feed) {  
						if (feed.cover) {
							friend.cover = feed.cover.source;
							friend.coverXo = feed.cover.offset_x*-1 || 0;
							friend.coverYo = feed.cover.offset_y*-1 || 0;
							friend.coverX = Math.round(friend.coverXo/2.7);
							friend.coverY = Math.round(friend.coverYo/2.7);
						}
						// then this friend is ready
						friend.ready = true;
						// so we store the friend list
						this.storeFriends();
						// and force a DOM refresh
						this.$forceUpdate();
					}.bind(this));
					// then we add the new friend to our friends list
					this.friends.push(friend);
					// store the friend list
					this.storeFriends();
					// and simulate a keyup event (so if anything is currently being searched, this new friend needs to be checked agaisnt that search string)
					this.onKeyUp();
				}

				// if the 'friend' is actually the currently logged user
				if (friend.id == this.connected) {
					// it should not be visible at all
					friend.visible = false;
					// so we store the friend list
					this.storeFriends();
					// and force a DOM refresh
					this.$forceUpdate();
				}

				// if the photo being processed right now is already on the friend pic list
				for (var i = 0; i < friend.pics.length; i++) {
					var p = friend.pics[i];
					// we stop right here
					if (p.id == photo.id) return;
				}

				// if there is a friend currently open and it's the same as the one of this tag
				if (this.friend && this.friend.id == friend.id) {
					// we add this photo to the currently displayed pic list
					this.addPic(photo);
				}

				// anyway, we add this photo to the friend pic list
				friend.pics.push(photo);

				// and then we sort the friend list based on the amount of pics (descendind)
				// (if there is a tie, we simply order them by the name, ascending)
				this.friends.sort(function(a,b) {
					if (a.pics.length > b.pics.length) return -1;
					if (a.pics.length < b.pics.length) return +1;
					return (a.name < b.name) ? -1 : +1;
				});
			},
        	/* *************************************
			* Method to show a friend based on its ID
			************************************* */
			showFriend: function(id) {
				// getting the friend			
				this.friend = this.getFriend(id);
				// if no friend is found, ignore this call
				if (!this.friend) return;
				// saving the current scroll position
				this.savedScroll = $(window).scrollTop();
				// resetting the current photo list
				this.photos = [];
				// updateing the location href with the friend (so refreshs will keep this displayed)
				location.href = '#'+id;	
				// getting the pic list from this friend
				var pics = this.friend.pics;
				// showing the friend div
				$friendpage.stop().fadeIn(500);
				// enabling the back button
				this.showBack = true;
				// changing the body scroll so it won't scroll at all
				$('body').addClass('fakescroll');
				// adding the friend pics to the dom
				for (var i = 0; i < pics.length; i++) this.addPic(pics[i]);	
			},
        	/* *************************************
			* Method triggered when you click on a friend card
			************************************* */
			clickFriend: function(event) {
				// getting the clicked element
				var $target = $(event.target);
				// getting its id (the user id)				
				var id = $target.attr('id') || $target.parents('.friend-card').attr('id');
				// if the id is found, try to show the friend 
				if (id) this.showFriend(id);
			},
        	/* *************************************
			* Method to store the current friend list
			************************************* */
			storeFriends: function() {
				// striginfy the object and then store it on the localstorage
				localStorage.setItem('tagged-friends',JSON.stringify(this.friends));
			},
        	/* *************************************
			* Method to get the currently searched value
			************************************* */
			getSearch: function() {
				// getting the value
				var v = $('#search').val();
				// trimming it if necessary
				return (v) ? v.trim() : '';
			},
        	/* *************************************
			* Method to get the cancel the search
			************************************* */
			cancelSearch: function() {
				// emptying the input
				$('#search').val('');
				// removing its focus
				$('#search').blur();
				// showing the intro again
				this.showIntro = true;
			},
        	/* *************************************
			* Method triggered when after a keyup on the search input
			************************************* */
			onKeyUp: function() {
				// getting the searched value
				var search = this.getSearch();
				// showing or not the intro based on it (if we're searching, the intro should be hidden)
				this.showIntro = (!search);
				// iterating our fiends
				for (var i = 0; i < this.friends.length; i++) {
					// friend data
					var f = this.friends[i];
					// friend will be visible if there is not search OR if the friend.name match the search
					f.visible = (!search || f.name.toLowerCase().indexOf(search.toLowerCase()) >= 0) ? true : false;
					// if the friend is the currently logged user, it's always hidden
					if (f.id == this.connected) f.visible = false;
				}

				this.$forceUpdate();
			},
        	/* *************************************
			* Method triggered when you click the refresh icon on the friend page
			************************************* */
			refreshFriend: function(event) {
				// preventing the default click
				event.preventDefault();			
				// getting a 'clone' of this friend pic list	
				var list = this.friend.pics.splice(0);
				// resetting the currently displayed photos
				this.photos = [];
				// iterating all the pics
				list.forEach(function(pic) {
					// checking it
					this.checkPicture(pic);
				}.bind(this));
			},			
        	/* *************************************
			* Checkin all the tags on a picture to see if they're still there
			************************************* */
			checkPicture: function(pic) {
				// for each tag on this picture
				pic.tags.forEach(function(tag) {
					// we'll get the friend tagged
					var friend = this.getFriend(tag.id);
					// and remove this pic from this friend
					if (friend && friend.pics) {
						var index = friend.pics.indexOf(pic);
						if (index >= 0) friend.pics.splice(index,1);
					}
				}.bind(this));

				// now the pic doesn't have any tagging
				pic.tags = [];
				// and we store te friend lsit
				this.storeFriends();

				// we start a list of waiting 'tags'
				var waiting = [];
				// and assume the current user is not on the picture anymore
				var foundme = false;

				// and then we request the tags from this picture
				this.getTags({'id':pic.id},function(tag,photo) {
					// if we already found the user, we'll simply save the tag and stop right here (for this tag)
					if (foundme) return this.saveTag(tag,photo);
					// if not, then we'll put this tag/photo on our waiting list
					waiting.push([tag,photo]);									
					// if the user tagged it the connect user	
					if (tag.id == this.connected) {
						// then we found it
						foundme = true;
						// and we'll process all the tag/photo on the waiting list
						waiting.forEach(function(pair) { this.saveTag(pair[0],pair[1]); });
					}
					// if the user is not on the picture anymore, the 'foundme' flag will never be true
					// and since we removed all the data from this picture beforing requesting it again
					// it will be completly gone from the app
				}.bind(this));
			},
        	/* *************************************
			* Method to request the data from some picture
			************************************* */
			addPic: function(pic) {
				// checking if the pic is cached
				var data = this.cache[pic.id];
				// if it is
				if (data) {
					// we add it to the list of displayed photos
					this.photos.push(data);
					// force a DOM update
					this.$forceUpdate();
					// and stop right nere
					return;
				}

				// if it's not, we facebook request the actual images from this picture ID				
				FB.api('/'+pic.id+'?fields=images',function(feed) {
					// if no image is returned for some reason, we ignore this call
					if (!feed.images) return;
					// keeping only images greater than width:200
		            var images = feed.images.filter(function(a) { return (a.width > 200); });
		            // then sorting them by width, ascending
		            images.sort(function(a,b) { return (a.width < b.width) ? -1 : +1; });
		            // getting the biggest one
		            var full = images.pop().source;
		            // getting the smallest one
		            var thumb = images[0].source || full;
		            // preparing its data
		            var data = {
		            	'id':feed.id,
		            	'thumb':thumb,
		            	'full':full,
		            	'urlface':pic.urlface
		            };
		            // storing it on your cache
					this.cache[pic.id] = data;
					// adding it to the list of displaying photos
					this.photos.push(data);
					// and finally forcing a DOM update
					this.$forceUpdate();
				}.bind(this));
			}
		}
	});
});


/* *************************************
* Function to be called after a facebook login attempt
************************************* */
function callbackLogin(response) {
	// we're not checking anymore
	window.myApp.checking = false;
	// if the user is connected
    if (response.authResponse) {
    	// we set it on the app
    	window.myApp.connected = response.authResponse.userID;
    	// and start the flow
        window.myApp.onLogin();
    }
}

/* *************************************
* Event listener for key-ups on the document
************************************* */
$(document).on('keyup',function(e) {
	// if we're on the friend page and you click esc or backspace
	if (window.myApp.showBack && (e.keyCode == 27 || e.keyCode == 8)) {
		// we'll go back to the home
		window.myApp.showHome(e);
	}
	// but if we're on the home and you click esc
	if (!window.myApp.showBack && (e.keyCode == 27)) {
		// we'll cancel the search
		window.myApp.cancelSearch();
		// and force DOM update
		window.myApp.$forceUpdate();
	}
});

/* *************************************
* Event listener for clicks on the #btn-login
************************************* */
$(document).on('click','#btn-login',function() {   
	// Opening the facebook login page with our defined scope
	FB.login(callbackLogin,{scope:'email,user_photos'});
});

/* *************************************
* Facebook async loaded event
************************************* */
window.fbAsyncInit = function() {
	// initiating it with our app ID
    FB.init({
        appId: '259817854185940',
        xfbml: true,
        version: 'v2.8'
    });
    FB.AppEvents.logPageView();
    // trying to get the currently login status
    // if the user is already logged, then we show everything already
    FB.getLoginStatus(callbackLogin);
};

/* *************************************
* Including facebook SDK
************************************* */
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js?version=v2.8";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
