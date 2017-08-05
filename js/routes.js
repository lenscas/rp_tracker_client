//a list of url's and what html they need to load.
//the first refers to the html file they need to load
//the second to the id that needs to be used to put the html in
//the third is optional and refers to where the rpcode is in an url (if at all)
//this is used to update the menu on the left side
routes = {
	//some test routes. Will eventually be deleted
	"index/test"     : ["basic/index2","basicIndex2"],
	//index will be the default route
	"index"          : ["basic/login","basicIndex"],
	//user routes
	"login"          : ["users/login","usersLogin"],
	"profile/(:any)" : ["users/profile","usersProfile"],
	//roleplay routes
	"rp"             : ["rp/list","rpList"],
	"create/rp"      : ["rp/create","createRP"],
	"rp/(:any)"      : ["rp/overView","rpOverView",0],
	//characters
	"rp/(:any)/characters"        : ["characters/list","charList",0],
	"rp/(:any)/characters/(:any)" : ["characters/overview","charOverView",0],
	"create/character/(:any)"     : ["characters/create","createCharacter",0],
	//battles
	"rp/(:any)/battles"           : ["battles/list","battlesList",0],
	
	
}
