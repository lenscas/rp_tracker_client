routes = {
	"index/test"   : ["basic/index2","basicIndex2"],
	"index"        : ["basic/index","basicIndex"],
	"login"        : ["users/login","usersLogin"],
	"login/(:any)" : ["users/login","usersLogin"],
	"(:any)"       : ["basic/index3","basicIndex3"],
}
