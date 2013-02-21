Template.hello.rendered = function(){
	
	var test = new Vis1({test: "test"});
	test.render();
}

Template.share.rendered = function(){

	Socialite.load('#share');
}