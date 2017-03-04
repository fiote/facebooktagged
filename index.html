<!DOCTYPE html>
<html>
<head>
	<title>Facebook Tagged</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="Discover who you are tagged with on Facebook pictures.">
	<link rel="icon" type="image/png" href="http://facebooktagged.codware.com/images/favicon.ico">

  	<!-- facebook meta -->  	
  	<meta property="fb:app_id" content="259817854185940"/>
    <meta property="og:title" content="Facebook Tagged"/>
    <meta property="og:url" content="http://facebooktagged.codware.com"/>
    <meta property="og:image" content="http://facebooktagged.codware.com/images/tagged.png"/>
    <meta property="og:description" content="Discover who you are tagged with on Facebook pictures."/>

    <!-- twitter meta -->
    <meta name="twitter:card" content="summary"/>
    <meta name="twitter:creator" content="Fiote"/>
    <meta name="twitter:title" content="Facebook Tagged"/>
    <meta name="twitter:url" content="http://facebooktagged.codware.com"/>
    <meta name="twitter:description" content="Discover who you are tagged with on Facebook pictures."/>
    <meta name="twitter:image" content="http://facebooktagged.codware.com/images/tagged.png"/>

    <!-- jquery -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

    <!-- vue -->
    <script type="text/javascript" src="https://unpkg.com/vue/dist/vue.js"></script>

	<!-- material design -->
  	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css">
  	<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js"></script>
	<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

	<!-- my css -->
	<link rel="stylesheet" type="text/css" href="css/page.css">
	<link rel="stylesheet" type="text/css" href="css/all-friends.css">
	<link rel="stylesheet" type="text/css" href="css/friend-page.css">

	<!-- my js -->
	<script type="text/javascript" src="scripts/app.js"></script>
</head>

<body class='grey lighten-5 customscroll'>
	<section id="app">
		<div v-show='connected'>
			<!-- navbar -->
			<div class="navbar-fixed">
				<nav>
					<div class="nav-wrapper blue-grey">
						<!-- when friend is selected -->
						<div v-show='friend.id'>
							<ul class="left">
								<li>
									<a href="#" v-on:click='showHome'><i class="material-icons">arrow_back</i></a>
								</li>
								{{friend.name}}
							</ul>
							<ul class="right">
								<li>
									<a href="#" v-on:click='refreshFriend'><i class="material-icons">refresh</i></a>
								</li>
							</ul>
						</div>
						<!-- when we're at home -->
						<form v-show='!friend.id'>
							<div class="input-field">
								<input id="search" type="search" required v-on:keyup="onKeyUp" placeholder="Click here to search for someone">
								<label class="label-icon" for="search"><i class="material-icons">search</i></label>
								<i class="material-icons">close</i>
							</div>
						</form>	
					</div>
				</nav>
			</div>

			<!-- containter -->
			<div class='container'>

				<!-- all friends -->
				<div id='all-friends'>

					<div v-show='showIntro'>
						<h1 class="flow-text"><b>Discover who you are tagged with.</b></h1>
						<h5 class="flow-text">Click on the cards to show the tagged pictures.</h5>
						<br/>
					</div>

					<div v-for="f in friends" class='card friend-card' v-show='f.ready && f.visible && f.pics.length' v-on:click='clickFriend' :id="f.id" >
						<div class='card-image'>
							<div class='friend-cover' v-bind:style="{backgroundImage:'url('+f.cover+')'}"></div>
						</div>
						<div class='card-action'>
							<div class='friend-name truncate'><b>{{f.pics.length}}</b>: {{f.name}}</div>
						</div>
						<img class='friend-picture' :src="f.img" >
					</div>
				</div>

				<div id='overlay' class='blue-grey darken-2' v-show='friend.id' v-on:click='showHome' >
				</div>

				<!-- friend page -->
				<div id='friend-page' class='customscroll'>
					<h5>{{friend.name}}</h5>

					<div v-show='photos.length'>
		  				<a class="card grid-item" :href="p.urlface" target="_blank" v-for="p in photos" v-bind:style="{backgroundImage:'url('+p.thumb+')'}">				  			
			  			</a>
			  		</div>
			  		<div v-show='!photos.length'>
			  			No pictures together.
			  		</div>
				</div>
			</div>
		</div>

		<div id='logging' v-show='!connected' class='container'>
			<!-- checking app -->
			<div class="preloader-wrapper big active" v-show='checking'>
				<div class="spinner-layer spinner-blue-only">
					<div class="circle-clipper left">
						<div class="circle"></div>
					</div>
					<div class="gap-patch">
						<div class="circle"></div>
					</div>
					<div class="circle-clipper right">
						<div class="circle"></div>
					</div>
				</div>
			</div>
			<div v-show='!checking'>
				<!-- not logged -->
				<h1>Discover who you are tagged with.</h1>
				<button id='btn-login' class="waves-effect waves-light btn-large"><i class="material-icons left">account_box</i>Login with Facebook</a>
			</div>
		</div>
	</section>
</body>
</html>