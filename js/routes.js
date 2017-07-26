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
	"rp/(:any)"      : ["rp/overView","rpOverView",1],
}
